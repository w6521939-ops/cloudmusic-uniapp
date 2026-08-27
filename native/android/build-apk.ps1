$ErrorActionPreference = "Continue"

# Paths
$PROJECT = "D:\CloudMusic-uniapp\native\android"
$SDK = "$env:LOCALAPPDATA\Android\Sdk"
$BT = "$SDK\build-tools\37.0.0"
$PLATFORM_JAR = "$SDK\platforms\android-36\android.jar"
$JBR = "D:\harmonyos\DevEco Studio\devecostudio-windows-6.1.1.280\DevEco Studio\jbr\bin"

$AAPT2 = "$BT\aapt2.exe"
$D8 = "$BT\d8.bat"
$APKSIGNER = "$BT\apksigner.bat"
$ZIPALIGN = "$BT\zipalign.exe"
$JAVAC = "$JBR\javac.exe"
$KEYTOOL = "$JBR\keytool.exe"

$SRC = "$PROJECT\src"
$RES = "$PROJECT\res"
$ASSETS = "$PROJECT\assets"
$OBJ = "$PROJECT\obj"
$BIN = "$PROJECT\bin"
$GEN = "$PROJECT\gen"
$H5_SOURCE = "D:\CloudMusic-uniapp\dist\build\h5"
$ASSETS_WWW = "$PROJECT\assets\www"

# Step 0: Build H5 resources (native mode with relative base path)
Write-Output "=== Step 0: Build H5 resources (native) ==="
Set-Location "D:\CloudMusic-uniapp"
npm run build:native 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "H5 build failed"; exit 1 }

# Copy H5 to assets/www
Write-Output "=== Copy H5 to assets ==="
if (Test-Path $ASSETS_WWW) {
    Remove-Item $ASSETS_WWW -Recurse -Force
}
New-Item -Path $ASSETS_WWW -ItemType Directory -Force | Out-Null
Copy-Item "$H5_SOURCE\*" $ASSETS_WWW -Recurse -Force
Write-Output "H5 resources copied to assets"

# Clean build dirs
Remove-Item -Path $OBJ, $BIN, $GEN -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path $OBJ, $BIN, $GEN -ItemType Directory -Force | Out-Null

Write-Output "=== Step 1: Compile resources ==="
$compiledRes = "$OBJ\compiled-res"
New-Item -Path $compiledRes -ItemType Directory -Force | Out-Null
& $AAPT2 compile --dir $RES -o $compiledRes 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "aapt2 compile failed"; exit 1 }
$flatFiles = Get-ChildItem -Path $compiledRes -Recurse -Filter "*.flat"
Write-Output "Compiled $($flatFiles.Count) resource files"

Write-Output "=== Step 2: Link resources and generate R.java ==="
$baseApk = "$OBJ\base.apk"
$flatArgs = $flatFiles.FullName
& $AAPT2 link -o $baseApk --manifest "$PROJECT\AndroidManifest.xml" -I $PLATFORM_JAR --java $GEN --auto-add-overlay $flatArgs 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "aapt2 link failed"; exit 1 }
Write-Output "R.java generated, base APK created"

Write-Output "=== Step 3: Compile Java source ==="
$rFiles = Get-ChildItem -Path $GEN -Recurse -Filter "*.java" | ForEach-Object { $_.FullName }
$srcFiles = Get-ChildItem -Path $SRC -Recurse -Filter "*.java" | ForEach-Object { $_.FullName }
$allJavaFiles = @($srcFiles) + @($rFiles)
Write-Output "Java files: $($allJavaFiles.Count)"
& $JAVAC -classpath $PLATFORM_JAR -d $OBJ $allJavaFiles 2>&1 | Write-Output
Write-Output "javac exit code: $LASTEXITCODE"
$classCount = (Get-ChildItem -Path $OBJ -Recurse -Filter "*.class").Count
Write-Output "Compiled $classCount class files"

Write-Output "=== Step 4: Convert to DEX ==="
$dexOutput = "$OBJ\dex"
New-Item -Path $dexOutput -ItemType Directory -Force | Out-Null
$classFiles = Get-ChildItem -Path $OBJ -Recurse -Filter "*.class" | ForEach-Object { $_.FullName }
& cmd /c "$D8 --min-api 24 --output $dexOutput $classFiles" 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "d8 failed"; exit 1 }
Write-Output "DEX created: $(Test-Path "$dexOutput\classes.dex")"

Write-Output "=== Step 5: Package APK ==="
$unsignedApk = "$BIN\cloudmusic-unsigned.apk"
node "$PROJECT\add-to-apk.cjs" $baseApk "$dexOutput\classes.dex" $ASSETS 2>&1 | Write-Output
$fullApk = $baseApk.Replace('.apk', '-full.apk')
if (Test-Path $fullApk) {
    Copy-Item $fullApk $unsignedApk -Force
    Write-Output "APK packaged: $unsignedApk ($([math]::Round((Get-Item $unsignedApk).Length / 1MB, 2)) MB)"
} else {
    Write-Error "Failed to package APK"
    exit 1
}

Write-Output "=== Step 6: Generate debug keystore ==="
$keystore = "$PROJECT\debug.keystore"
if (-not (Test-Path $keystore)) {
    & $KEYTOOL -genkeypair -v -keystore $keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US" 2>&1 | Write-Output
    Write-Output "Keystore created"
}

Write-Output "=== Step 7: Sign APK ==="
$signedApk = "$BIN\cloudmusic-signed.apk"
& cmd /c "$APKSIGNER sign --ks $keystore --ks-key-alias androiddebugkey --ks-pass pass:android --key-pass pass:android --out $signedApk $unsignedApk" 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "apksigner failed"; exit 1 }

Write-Output "=== Step 8: Align APK ==="
$finalApk = "$BIN\cloudmusic-1.0.0.apk"
& $ZIPALIGN -f -v 4 $signedApk $finalApk 2>&1 | Select-Object -Last 3
if ($LASTEXITCODE -ne 0) { Write-Error "zipalign failed"; exit 1 }

$apkSize = [math]::Round((Get-Item $finalApk).Length / 1MB, 2)
Write-Output ""
Write-Output "=== BUILD SUCCESS ==="
Write-Output "APK: $finalApk"
Write-Output "Size: $apkSize MB"

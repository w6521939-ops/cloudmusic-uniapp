$ErrorActionPreference = "Continue"

# HarmonyOS HAP Build Script
$PROJECT = "D:\CloudMusic-uniapp\native\harmony"
$DEVECO_HOME = "D:\harmonyos\DevEco Studio\devecostudio-windows-6.1.1.280\DevEco Studio"
$HVIGOR_ENGINE = "$PROJECT\hvigor\node_modules\@ohos\hvigor\bin\hvigor.js"
$H5_SOURCE = "D:\CloudMusic-uniapp\dist\build\h5"
$RAWFILE_DIR = "$PROJECT\entry\src\main\resources\rawfile\www"

Write-Output "=== HarmonyOS HAP Build Script ==="
Write-Output "Project: $PROJECT"

# Step 1: Build H5 resources
Write-Output "`n=== Step 1: Build H5 resources ==="
Set-Location "D:\CloudMusic-uniapp"
npm run build:h5 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "H5 build failed"; exit 1 }

# Step 2: Copy H5 to rawfile
Write-Output "`n=== Step 2: Copy H5 to rawfile ==="
if (Test-Path $RAWFILE_DIR) {
    Remove-Item $RAWFILE_DIR -Recurse -Force
}
New-Item -Path $RAWFILE_DIR -ItemType Directory -Force | Out-Null
Copy-Item "$H5_SOURCE\*" $RAWFILE_DIR -Recurse -Force
Write-Output "H5 resources copied to rawfile"

# Step 3: Build HAP
Write-Output "`n=== Step 3: Build HAP ==="
Set-Location $PROJECT
$env:NODE_PATH = "$PROJECT\hvigor\node_modules;$PROJECT\node_modules"
$env:DEVECO_SDK_HOME = "$DEVECO_HOME\sdk"
node --max-old-space-size=8192 $HVIGOR_ENGINE assembleHap --mode module -p product=default --no-daemon 2>&1 | Write-Output
if ($LASTEXITCODE -ne 0) { Write-Error "HAP build failed"; exit 1 }

# Step 4: Verify output
Write-Output "`n=== Step 4: Verify output ==="
$hapFile = "$PROJECT\entry\build\default\outputs\default\entry-default-unsigned.hap"
if (Test-Path $hapFile) {
    $size = [math]::Round((Get-Item $hapFile).Length / 1MB, 2)
    Write-Output "HAP built successfully: $hapFile ($size MB)"
} else {
    Write-Error "HAP file not found"
    exit 1
}

# Generate app icons for Android and HarmonyOS from a source image
param(
    [string]$SourceImage = "$PSScriptRoot\app_icon.jpg"
)

Add-Type -AssemblyName System.Drawing

# Android icon sizes
$androidIcons = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

# HarmonyOS icon sizes
$harmonyIcons = @{
    "harmony\entry\src\main\resources\base\media\app_icon.png"    = 1024
    "harmony\entry\src\main\resources\base\media\foreground.png"  = 216
}

Write-Host "Loading source image: $SourceImage"
$srcImage = [System.Drawing.Image]::FromFile($SourceImage)
Write-Host "Source image size: $($srcImage.Width)x$($srcImage.Height)"

# Generate Android icons
foreach ($dir in $androidIcons.Keys) {
    $size = $androidIcons[$dir]
    $outDir = "$PSScriptRoot\android\res\$dir"
    $outPath = "$outDir\ic_launcher.png"

    if (-not (Test-Path $outDir)) {
        New-Item -Path $outDir -ItemType Directory -Force | Out-Null
    }

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.DrawImage($srcImage, 0, 0, $size, $size)

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $gfx.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outPath ($size x $size)"
}

# Generate HarmonyOS icons
foreach ($path in $harmonyIcons.Keys) {
    $size = $harmonyIcons[$path]
    $outPath = "$PSScriptRoot\$path"
    $outDir = Split-Path $outPath -Parent

    if (-not (Test-Path $outDir)) {
        New-Item -Path $outDir -ItemType Directory -Force | Out-Null
    }

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.DrawImage($srcImage, 0, 0, $size, $size)

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $gfx.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outPath ($size x $size)"
}

$srcImage.Dispose()
Write-Host "All icons generated successfully."

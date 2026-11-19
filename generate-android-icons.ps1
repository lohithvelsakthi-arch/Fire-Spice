Add-Type -AssemblyName System.Drawing

$srcTransparentPath = "c:\A Restaurant\logo_transparent.png"
$srcSolidPath = "c:\A Restaurant\logo.png"

if (-not (Test-Path $srcTransparentPath) -or -not (Test-Path $srcSolidPath)) {
    Write-Error "Source logos missing!"
    exit 1
}

$bmpTransparent = [System.Drawing.Bitmap]::FromFile($srcTransparentPath)
$bmpSolid = [System.Drawing.Bitmap]::FromFile($srcSolidPath)

# 1. Adaptive Icon Foreground (Transparent background, logo in safe zone ~60%)
function Generate-AdaptiveForeground {
    param([int]$Size, [string]$OutPath)

    $target = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # In 108dp canvas, safe zone is 72dp (66.6%). We use ~62% for elegant margin
    $avail = $Size * 0.62
    $scale = [Math]::Min($avail / $bmpTransparent.Width, $avail / $bmpTransparent.Height)
    $drawW = [int]($bmpTransparent.Width * $scale)
    $drawH = [int]($bmpTransparent.Height * $scale)
    $drawX = [int](($Size - $drawW) / 2)
    $drawY = [int](($Size - $drawH) / 2)

    $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
    $g.DrawImage($bmpTransparent, $destRect, 0, 0, $bmpTransparent.Width, $bmpTransparent.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $dir = [System.IO.Path]::GetDirectoryName($OutPath)
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $target.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Host "Foreground: $OutPath (${Size}x${Size})"
}

# 2. Legacy Square Icon (Obsidian Noir background, logo centered)
function Generate-LegacySquare {
    param([int]$Size, [string]$OutPath)

    $target = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 6, 8))
    $g.FillRectangle($brush, 0, 0, $Size, $Size)
    $brush.Dispose()

    $avail = $Size * 0.84
    $scale = [Math]::Min($avail / $bmpSolid.Width, $avail / $bmpSolid.Height)
    $drawW = [int]($bmpSolid.Width * $scale)
    $drawH = [int]($bmpSolid.Height * $scale)
    $drawX = [int](($Size - $drawW) / 2)
    $drawY = [int](($Size - $drawH) / 2)

    $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
    $g.DrawImage($bmpSolid, $destRect, 0, 0, $bmpSolid.Width, $bmpSolid.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $target.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Host "Legacy Square: $OutPath (${Size}x${Size})"
}

# 3. Legacy Round Icon (Circular Obsidian Noir background, gold border, logo centered)
function Generate-LegacyRound {
    param([int]$Size, [string]$OutPath)

    $target = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 6, 8))
    $g.FillEllipse($brush, 1, 1, $Size - 2, $Size - 2)
    $brush.Dispose()

    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 212, 175, 55), [Math]::Max(1.5, $Size * 0.025))
    $g.DrawEllipse($pen, 1, 1, $Size - 3, $Size - 3)
    $pen.Dispose()

    $avail = $Size * 0.72
    $scale = [Math]::Min($avail / $bmpSolid.Width, $avail / $bmpSolid.Height)
    $drawW = [int]($bmpSolid.Width * $scale)
    $drawH = [int]($bmpSolid.Height * $scale)
    $drawX = [int](($Size - $drawW) / 2)
    $drawY = [int](($Size - $drawH) / 2)

    $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
    $g.DrawImage($bmpSolid, $destRect, 0, 0, $bmpSolid.Width, $bmpSolid.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $target.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Host "Legacy Round: $OutPath (${Size}x${Size})"
}

# Densities for Android
$densities = @(
    @{ name = "mdpi";    legacySize = 48;  fgSize = 108 },
    @{ name = "hdpi";    legacySize = 72;  fgSize = 162 },
    @{ name = "xhdpi";   legacySize = 96;  fgSize = 216 },
    @{ name = "xxhdpi";  legacySize = 144; fgSize = 324 },
    @{ name = "xxxhdpi"; legacySize = 192; fgSize = 432 }
)

foreach ($d in $densities) {
    $dir = "c:\A Restaurant\android\app\src\main\res\mipmap-$($d.name)"
    Generate-AdaptiveForeground -Size $d.fgSize -OutPath "$dir\ic_launcher_foreground.png"
    Generate-LegacySquare -Size $d.legacySize -OutPath "$dir\ic_launcher.png"
    Generate-LegacyRound -Size $d.legacySize -OutPath "$dir\ic_launcher_round.png"
}

# Drawable icons
Generate-LegacySquare -Size 512 -OutPath "c:\A Restaurant\android\app\src\main\res\drawable\app_icon.png"
Generate-AdaptiveForeground -Size 432 -OutPath "c:\A Restaurant\android\app\src\main\res\drawable\ic_launcher_foreground.png"

$bmpTransparent.Dispose()
$bmpSolid.Dispose()

# Remove the broken XML layer-list if present
if (Test-Path "c:\A Restaurant\android\app\src\main\res\drawable\ic_launcher_foreground.xml") {
    Remove-Item "c:\A Restaurant\android\app\src\main\res\drawable\ic_launcher_foreground.xml" -Force
    Write-Host "Removed broken ic_launcher_foreground.xml"
}

Write-Host "Android icons generated with precision!"

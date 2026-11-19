Add-Type -AssemblyName System.Drawing

$srcPath = "c:\A Restaurant\logo.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Clean logo not found at $srcPath"
    exit 1
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$srcW = $srcBmp.Width
$srcH = $srcBmp.Height

Write-Host "Source logo: ${srcW}x${srcH}"

function Generate-SquareIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [double]$PaddingRatio = 0.08
    )

    $targetBmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Fill pure black background matching Obsidian Noir
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 6, 8))
    $g.FillRectangle($brush, 0, 0, $Size, $Size)
    $brush.Dispose()

    $availW = $Size * (1.0 - 2.0 * $PaddingRatio)
    $availH = $Size * (1.0 - 2.0 * $PaddingRatio)

    $scale = [Math]::Min($availW / $srcW, $availH / $srcH)
    $drawW = [int]($srcW * $scale)
    $drawH = [int]($srcH * $scale)
    $drawX = [int](($Size - $drawW) / 2)
    $drawY = [int](($Size - $drawH) / 2)

    $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
    $g.DrawImage($srcBmp, $destRect, 0, 0, $srcW, $srcH, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()

    # Ensure target directory exists
    $dir = [System.IO.Path]::GetDirectoryName($OutPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $targetBmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
    Write-Host "Generated: $OutPath (${Size}x${Size})"
}

function Generate-RoundIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [double]$PaddingRatio = 0.14
    )

    $targetBmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Transparent background, circular black fill
    $g.Clear([System.Drawing.Color]::Transparent)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 6, 8))
    $g.FillEllipse($brush, 1, 1, $Size - 2, $Size - 2)
    $brush.Dispose()

    # Draw gold border around circle
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 212, 175, 55), [Math]::Max(1.5, $Size * 0.025))
    $g.DrawEllipse($goldPen, 1, 1, $Size - 3, $Size - 3)
    $goldPen.Dispose()

    $availW = $Size * (1.0 - 2.0 * $PaddingRatio)
    $availH = $Size * (1.0 - 2.0 * $PaddingRatio)

    $scale = [Math]::Min($availW / $srcW, $availH / $srcH)
    $drawW = [int]($srcW * $scale)
    $drawH = [int]($srcH * $scale)
    $drawX = [int](($Size - $drawW) / 2)
    $drawY = [int](($Size - $drawH) / 2)

    $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
    $g.DrawImage($srcBmp, $destRect, 0, 0, $srcW, $srcH, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()

    $dir = [System.IO.Path]::GetDirectoryName($OutPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $targetBmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
    Write-Host "Generated Round: $OutPath (${Size}x${Size})"
}

# 1. PWA & Web Icons (Root icons/)
Generate-SquareIcon -Size 512 -OutPath "c:\A Restaurant\icons\icon-512.png" -PaddingRatio 0.08
Generate-SquareIcon -Size 512 -OutPath "c:\A Restaurant\icons\icon-maskable.png" -PaddingRatio 0.18
Generate-SquareIcon -Size 192 -OutPath "c:\A Restaurant\icons\icon-192.png" -PaddingRatio 0.08
Generate-SquareIcon -Size 180 -OutPath "c:\A Restaurant\icons\apple-touch-icon.png" -PaddingRatio 0.08
Generate-SquareIcon -Size 64  -OutPath "c:\A Restaurant\icons\favicon.png" -PaddingRatio 0.05

# 2. Android App Icon (drawable)
Generate-SquareIcon -Size 512 -OutPath "c:\A Restaurant\android\app\src\main\res\drawable\app_icon.png" -PaddingRatio 0.08

# 3. Android Mipmaps (Square & Round)
$densities = @(
    @{ name = "mdpi"; size = 48 },
    @{ name = "hdpi"; size = 72 },
    @{ name = "xhdpi"; size = 96 },
    @{ name = "xxhdpi"; size = 144 },
    @{ name = "xxxhdpi"; size = 192 }
)

foreach ($d in $densities) {
    $dir = "c:\A Restaurant\android\app\src\main\res\mipmap-$($d.name)"
    Generate-SquareIcon -Size $d.size -OutPath "$dir\ic_launcher.png" -PaddingRatio 0.08
    Generate-RoundIcon  -Size $d.size -OutPath "$dir\ic_launcher_round.png" -PaddingRatio 0.14
}

# 4. Copy to www/ and Android assets
Copy-Item "c:\A Restaurant\logo.png" "c:\A Restaurant\www\logo.png" -Force
Copy-Item "c:\A Restaurant\logo.png" "c:\A Restaurant\android\app\src\main\assets\public\logo.png" -Force

Get-ChildItem "c:\A Restaurant\icons\*.png" | ForEach-Object {
    Copy-Item $_.FullName "c:\A Restaurant\www\icons\$($_.Name)" -Force
    Copy-Item $_.FullName "c:\A Restaurant\android\app\src\main\assets\public\icons\$($_.Name)" -Force
}

$srcBmp.Dispose()
Write-Host "All icons generated successfully!"

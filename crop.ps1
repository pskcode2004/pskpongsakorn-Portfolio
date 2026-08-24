Add-Type -AssemblyName System.Drawing
$path = 'C:\Users\Windows10 Pro\Downloads\portfolio\pskportfolio\public\favicon_raw.png'
$bmp = New-Object System.Drawing.Bitmap($path)
$minX = $bmp.Width; $minY = $bmp.Height; $maxX = 0; $maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

if ($maxX -ge $minX -and $maxY -ge $minY) {
    $cropWidth = $maxX - $minX + 1
    $cropHeight = $maxY - $minY + 1
    
    $size = [math]::Max($cropWidth, $cropHeight)
    $paddedSize = [int][math]::Floor($size * 1.1)
    
    $padX = [int][math]::Floor(($paddedSize - $cropWidth) / 2)
    $padY = [int][math]::Floor(($paddedSize - $cropHeight) / 2)
    
    $squareBmp = New-Object System.Drawing.Bitmap($paddedSize, $paddedSize)
    $g = [System.Drawing.Graphics]::FromImage($squareBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $g.Clear([System.Drawing.Color]::Transparent)
    
    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
    $destRect = New-Object System.Drawing.Rectangle($padX, $padY, $cropWidth, $cropHeight)
    
    $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Dispose()
    
    $outPath = 'C:\Users\Windows10 Pro\Downloads\portfolio\pskportfolio\public\favicon.png'
    $squareBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $squareBmp.Dispose()
    Write-Output "Cropped and squared successfully."
} else {
    $bmp.Dispose()
    Write-Output "Image is empty."
}

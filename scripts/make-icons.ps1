Add-Type -AssemblyName System.Drawing

function New-Icon {
  param([int]$Size, [string]$Path)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Rectangle 0, 0, $Size, $Size),
    [System.Drawing.Color]::FromArgb(255, 15, 20, 28),
    [System.Drawing.Color]::FromArgb(255, 30, 48, 64),
    45
  )

  $pad = [Math]::Max(1, [int]($Size * 0.08))
  $rect = New-Object System.Drawing.Rectangle $pad, $pad, ($Size - 2 * $pad), ($Size - 2 * $pad)
  $pathObj = New-Object System.Drawing.Drawing2D.GraphicsPath
  $r = [Math]::Max(2, [int]($Size * 0.22))
  $d = $r * 2
  $pathObj.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
  $pathObj.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
  $pathObj.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
  $pathObj.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
  $pathObj.CloseFigure()
  $g.FillPath($bg, $pathObj)

  $moonBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 110, 182, 255))
  $cx = $Size * 0.52
  $cy = $Size * 0.46
  $rad = $Size * 0.22
  $g.FillEllipse($moonBrush, ($cx - $rad), ($cy - $rad), ($rad * 2), ($rad * 2))

  $cutBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 22, 34, 48))
  $ox = $cx + $rad * 0.35
  $oy = $cy - $rad * 0.1
  $orad = $rad * 0.85
  $g.FillEllipse($cutBrush, ($ox - $orad), ($oy - $orad), ($orad * 2), ($orad * 2))

  $linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 126, 184, 218), [Math]::Max(1.0, $Size / 16.0))
  $y1 = $Size * 0.72
  $y2 = $Size * 0.82
  $g.DrawLine($linePen, ($Size * 0.22), $y1, ($Size * 0.78), $y1)
  $g.DrawLine($linePen, ($Size * 0.22), $y2, ($Size * 0.58), $y2)

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $bg.Dispose()
  $moonBrush.Dispose()
  $cutBrush.Dispose()
  $linePen.Dispose()
  $pathObj.Dispose()
}

$dir = Join-Path $PSScriptRoot "..\icons"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
foreach ($s in 16, 32, 48, 128) {
  New-Icon -Size $s -Path (Join-Path $dir "icon-$s.png")
}
Write-Output "icons ok"
Get-ChildItem $dir

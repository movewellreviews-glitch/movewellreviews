# Đóng gói thư mục dist/ thành movewell-site.zip với đường dẫn forward-slash
# để Hostinger (Linux) giải nén đúng thành thư mục.
# Chạy tự động sau `astro build` qua lệnh: npm run deploy
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
if (-not (Test-Path "dist")) { throw "Chua co thu muc dist/. Chay 'npm run build' truoc." }
$zipPath = Join-Path (Get-Location) "movewell-site.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$dist = (Resolve-Path "dist").Path
$fs = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
$files = Get-ChildItem -Path $dist -Recurse -File
$sep = [char]92
$fwd = [char]47
foreach ($f in $files) {
  $rel = $f.FullName.Substring($dist.Length + 1).Replace($sep, $fwd)
  $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
  $es = $entry.Open()
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $es.Write($bytes, 0, $bytes.Length)
  $es.Close()
}
$zip.Dispose(); $fs.Close()
$z = Get-Item $zipPath
Write-Output ("OK -> " + $z.FullName + "  (" + [math]::Round($z.Length/1MB,2) + " MB, " + $files.Count + " files)")

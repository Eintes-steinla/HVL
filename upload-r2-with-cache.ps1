# Script upload nhạc + ảnh lên R2 kèm Cache-Control header (bản PowerShell cho Windows)
#
# Cách dùng:
#   1. Cài wrangler nếu chưa có:  npm install -g wrangler
#   2. Đăng nhập:                  npx wrangler login
#   3. Sửa $BucketName bên dưới đúng tên bucket của bạn
#   4. Mở PowerShell tại thư mục gốc dự án, chạy:
#        Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#        .\upload-r2-with-cache.ps1

$BucketName = "hvl"   # <-- doi thanh ten bucket that cua ban

function Upload-File {
    param(
        [string]$LocalPath,
        [string]$R2Key,
        [string]$ContentType
    )
    Write-Host "Uploading: $R2Key"
    npx wrangler r2 object put "$BucketName/$R2Key" `
        --file="$LocalPath" `
        --content-type="$ContentType" `
        --cache-control="public, max-age=31536000, immutable"
}

Write-Host "=== Upload nhac (mp3) - public/songs/hvl -> R2 key hvl/ ==="
Get-ChildItem -Path "public/songs/hvl" -Filter "*.mp3" | ForEach-Object {
    $r2Key = "hvl/$($_.Name)"
    Upload-File -LocalPath $_.FullName -R2Key $r2Key -ContentType "audio/mpeg"
}

Write-Host "=== Upload anh bia bai hat - public/assets/tracks/hvl_art ==="
Get-ChildItem -Path "public/assets/tracks/hvl_art" -Filter "*.png" | ForEach-Object {
    $r2Key = "assets/tracks/hvl_art/$($_.Name)"
    Upload-File -LocalPath $_.FullName -R2Key $r2Key -ContentType "image/png"
}

Write-Host "=== Upload anh nghe si - public/assets/artists/MCK ==="
Get-ChildItem -Path "public/assets/artists/MCK" -Include "*.jpg","*.png" -File | ForEach-Object {
    $ext = $_.Extension.ToLower()
    $contentType = if ($ext -eq ".png") { "image/png" } else { "image/jpeg" }
    $r2Key = "assets/artists/MCK/$($_.Name)"
    Upload-File -LocalPath $_.FullName -R2Key $r2Key -ContentType $contentType
}

Write-Host "=== Upload anh album - public/assets/albs/MCK ==="
Get-ChildItem -Path "public/assets/albs/MCK" -Include "*.jpg","*.png" -File | ForEach-Object {
    $ext = $_.Extension.ToLower()
    $contentType = if ($ext -eq ".png") { "image/png" } else { "image/jpeg" }
    $r2Key = "assets/albs/MCK/$($_.Name)"
    Upload-File -LocalPath $_.FullName -R2Key $r2Key -ContentType $contentType
}

Write-Host "=== XONG ==="
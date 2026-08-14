# Script upload MV len R2 (BAN THAT - remote) kem Cache-Control header
#
# Cach dung:
#   1. Sua $BucketName cho dung ten bucket that
#   2. Mo PowerShell tai thu muc goc du an, chay:
#        Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#        .\upload-mv-with-cache.ps1

$BucketName = "hvl"   # <-- doi thanh ten bucket that cua ban

Write-Host "=== Upload MV (REMOTE) - public/mv/hvl_mv -> R2 key mv/hvl_mv/ ==="
Get-ChildItem -Path "public/mv/hvl_mv" -Filter "*.mp4" | ForEach-Object {
    $r2Key = "mv/hvl_mv/$($_.Name)"
    Write-Host "Uploading: $r2Key"
    npx wrangler r2 object put "$BucketName/$r2Key" `
        --file="$($_.FullName)" `
        --content-type="video/mp4" `
        --cache-control="public, max-age=31536000, immutable" `
        --remote

}

Write-Host "=== XONG ==="
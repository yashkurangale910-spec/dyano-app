Write-Output "Starting Vite build diagnostic..."
Write-Output "Timestamp: $(Get-Date)"
Write-Output "-----------------------------------"

try {
    npx vite build --logLevel info 2>&1 | Tee-Object -FilePath "build-error.log"
    Write-Output "`nBuild completed successfully!"
} catch {
    Write-Output "`nBuild failed with error:"
    Write-Output $_.Exception.Message
}

Write-Output "`n-----------------------------------"
Write-Output "Check build-error.log for full output"

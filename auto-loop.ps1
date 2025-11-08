#!/usr/bin/env pwsh

$workDir = "\\legrandnas\projets\STREAM_CDC\CDC2025\DEV\cdc2025-live-stats"
Set-Location $workDir

Write-Host ""
Write-Host "===== BOUCLE AUTO-SYNC CAGNOTTE CDC2025 =====" -ForegroundColor Cyan
Write-Host ""

$iteration = 0

while ($true) {
    $iteration++
    $time = (Get-Date).ToString("HH:mm:ss")
    
    Write-Host "[$time] Iteration $iteration" -ForegroundColor Yellow
    
    Write-Host "  - Sync Streamlabel..." -ForegroundColor Blue
    try {
        & node simple-sync.js 2>&1 | Out-Null
    } catch {
        Write-Host "  Erreur sync" -ForegroundColor Red
    }
    
    Write-Host "  - Push GitHub..." -ForegroundColor Blue
    try {
        & node auto-push-simple.js 2>&1 | Out-Null
    } catch {
        Write-Host "  Erreur push" -ForegroundColor Red
    }
    
    Write-Host "  Prochaine exec dans 30 secondes..."
    Write-Host ""
    Start-Sleep -Seconds 30
}

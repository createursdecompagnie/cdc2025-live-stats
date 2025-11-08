@echo off
REM Boucle automatique CDC2025
REM Lance simple-sync et auto-push continuellement

setlocal enabledelayedexpansion

cd /d "\\legrandnas\projets\STREAM_CDC\CDC2025\DEV\cdc2025-live-stats"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     🔄 BOUCLE AUTO-SYNC CAGNOTTE CDC2025             ║
echo ╚════════════════════════════════════════════════════════╝
echo.

:loop
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)

echo [!mydate! !mytime!] Execution...
echo   - Simple-Sync...
call node simple-sync.js >nul 2>&1
echo   - Auto-Push...
call node auto-push-simple.js >nul 2>&1

echo   ✅ Done. Prochaine exec dans 30 secondes...
timeout /t 30 /nobreak

goto loop

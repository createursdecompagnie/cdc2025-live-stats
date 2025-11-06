@echo off
REM =============================================================================
REM CDC2025 - QUICK START SCRIPT (Windows)
REM =============================================================================
REM 
REM Ce script démarre automatiquement le serveur local
REM 
REM USAGE:
REM Double-cliquer sur start.bat
REM 
REM =============================================================================

echo CDC2025 - Demarrage du serveur local
echo ====================================

REM Vérifier que Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Node.js n'est pas installe!
    echo Telecharge Node.js: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo OK - Node.js trouve: %NODE_VERSION%

REM Vérifier les dépendances
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
)

echo.
echo Demarrage du serveur...
echo Lien: http://localhost:3000
echo.
echo Appuyer sur Ctrl+C pour arreter
echo.

REM Lancer le serveur
node local-server.js

pause

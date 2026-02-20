@echo off
echo ========================================
echo Franciscan Catholic School
echo System Requirements Check
echo ========================================
echo.

set "allGood=1"

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is NOT installed
    echo     Download from: https://nodejs.org/
    set "allGood=0"
) else (
    for /f "tokens=*" %%i in ('node --version') do set nodeVersion=%%i
    echo [OK] Node.js is installed: %nodeVersion%
)
echo.

echo [2/3] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm is NOT installed
    set "allGood=0"
) else (
    for /f "tokens=*" %%i in ('npm --version') do set npmVersion=%%i
    echo [OK] npm is installed: %npmVersion%
)
echo.

echo [3/3] Checking dependencies...
if exist "node_modules\" (
    echo [OK] Dependencies are installed
) else (
    echo [!] Dependencies NOT installed
    echo     Run: npm install
    set "allGood=0"
)
echo.

echo ========================================
if "%allGood%"=="1" (
    echo Result: ALL CHECKS PASSED!
    echo.
    echo You can now start the server:
    echo   - Double-click: start-server.bat
    echo   - Or run: npm start
) else (
    echo Result: SOME CHECKS FAILED
    echo.
    echo Please install missing requirements
)
echo ========================================
echo.
pause

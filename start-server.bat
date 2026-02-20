@echo off
echo ========================================
echo Franciscan Catholic School Server
echo ========================================
echo.
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Checking for dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
echo.
echo Default Login:
echo Username: bursar
echo Password: bursar123
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node server.js

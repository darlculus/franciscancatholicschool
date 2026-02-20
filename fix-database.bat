@echo off
echo ========================================
echo Fixing Database - Resetting User Role
echo ========================================
echo.

if exist "users.db" (
    echo Deleting old database...
    del users.db
    echo Old database deleted.
) else (
    echo No database found. Will create new one.
)

echo.
echo Starting server to create new database...
echo.
echo Default Login:
echo Username: bursar
echo Password: bursar123
echo.
echo The role is now fixed!
echo.
node server.js

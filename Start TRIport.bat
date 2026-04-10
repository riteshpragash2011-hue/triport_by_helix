@echo off
echo Stopping any existing TRIport server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Starting TRIport...
echo.
echo When you see "Ready", open your browser and go to:
echo.
echo     localhost:3000
echo.
"C:\Users\rites\node\node.exe" "C:\Users\rites\Triport By Helix\node_modules\next\dist\bin\next" dev
pause

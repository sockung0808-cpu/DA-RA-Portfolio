@echo off
setlocal
cd /d "%~dp0"
echo.
echo ================================================
echo        DA RA PORTFOLIO V3 - RUN NOW
echo ================================================
echo.
if not exist node_modules\react\package.json (
  echo [1/2] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Please check your internet connection.
    pause
    exit /b 1
  )
) else (
  echo [1/2] Dependencies already installed.
)
echo.
echo [2/2] Starting Vite...
call npm run dev
pause

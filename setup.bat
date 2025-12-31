@echo off
REM Enterprise Certificate Generator - Quick Setup Script (Windows)
REM This script automates the initial setup process

echo.
echo ========================================
echo Enterprise Certificate Generator Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v14+ first.
    pause
    exit /b 1
)
echo [OK] Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)
echo [OK] npm found
npm --version

REM Backend Setup
echo.
echo Setting up Backend...
cd backend

echo Installing backend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.enterprise.example .env
    echo [OK] .env file created
    echo [WARNING] Please edit backend\.env with your SMTP credentials
) else (
    echo [WARNING] .env file already exists, skipping...
)

REM Create upload directories
echo Creating upload directories...
if not exist uploads\designs mkdir uploads\designs
if not exist uploads\csv mkdir uploads\csv
echo [OK] Upload directories created

cd ..

REM Frontend Setup
echo.
echo Setting up Frontend...
cd frontend

echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

cd ..

REM Final Instructions
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Configure Email (CRITICAL):
echo    - Open backend\.env in a text editor
echo    - Add your SMTP credentials
echo.
echo 2. Start Backend:
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 4. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo Documentation:
echo    - IMPLEMENTATION_GUIDE.md
echo    - ENTERPRISE_COMPLETE.md
echo    - README.md
echo.
echo Happy Certificate Generating!
echo.
pause

@echo off
TITLE Twincord Certificate Generator - Local Dev Server
CLS

ECHO =======================================================
ECHO   Twincord Certificate Generator - Development Server
ECHO =======================================================
ECHO.

:: Check for Node.js
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Node.js is not installed. Please install it from nodejs.org
    PAUSE
    EXIT /B
)

:: Check for MongoDB (Optional check, warns if connection fails)
ECHO [INFO] Be sure your MongoDB is running (if using local DB).
ECHO.

:: Install Dependencies (Check if node_modules exists, purely strictly for root)
IF NOT EXIST "node_modules" (
    ECHO [INFO] Installing Root Dependencies...
    call npm install
)

IF NOT EXIST "frontend\node_modules" (
    ECHO [INFO] Installing Frontend Dependencies...
    cd frontend
    call npm install
    cd ..
)

IF NOT EXIST "backend\node_modules" (
    ECHO [INFO] Installing Backend Dependencies...
    cd backend
    call npm install
    cd ..
)

IF NOT EXIST "pdf-service\node_modules" (
    ECHO [INFO] Installing PDF Service Dependencies...
    cd pdf-service
    call npm install
    cd ..
)

ECHO.
ECHO [START] Starting All Services (Frontend + Backend + PDF Service)...
ECHO.
ECHO Controls:
ECHO   - Frontend: http://localhost:3000
ECHO   - Backend: http://localhost:5000
ECHO   - PDF Service: http://localhost:10000
ECHO.

:: Start concurrently (Assuming concurrently is installed in root)
call npm run dev

PAUSE

@echo off
REM GreenOps AI - Quick Start Script (Windows)

echo.
echo 🚀 GreenOps AI - Quick Start
echo ==============================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.11+
    exit /b 1
)

echo ✓ Python found
python --version

REM Create virtual environment
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
python -m pip install -q --upgrade pip
pip install -q -r requirements.txt

REM Check .env file
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env and add your Azure OpenAI credentials!
    echo    - AZURE_OPENAI_API_KEY
    echo    - AZURE_OPENAI_ENDPOINT
    echo.
    pause
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo   1. Make sure .env has your Azure OpenAI credentials
echo   2. Run: python orchestrator/main.py
echo   3. Test: python test_api.py
echo.
echo 📚 Documentation:
echo   - Setup: SETUP.md
echo   - API: docs/API.md
echo   - Demo: DEMO_SCRIPT.md
echo.
pause

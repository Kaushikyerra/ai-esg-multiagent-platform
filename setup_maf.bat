@echo off
echo ========================================
echo Microsoft Agent Framework Setup
echo AI Dev Days Hackathon 2026
echo ========================================

REM Activate virtual environment
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    echo Virtual environment activated
) else (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
)

echo.
echo Installing Microsoft Agent Framework...
pip install --upgrade pip
pip install agent-framework --pre
pip install azure-ai-openai
pip install azure-identity

echo.
echo Installing other dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env with Azure OpenAI credentials
echo 2. Run: python orchestrator/main_maf.py
echo 3. Test: python test_api.py
echo.
echo For hackathon: git add . ^&^& git commit -m "Day 3: Microsoft Agent Framework" ^&^& git push
echo.
pause

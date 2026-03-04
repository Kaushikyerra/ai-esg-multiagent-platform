@echo off
echo ========================================
echo Daily Git Commit - AI Dev Days Hackathon
echo ========================================

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
    git branch -M main
)

echo.
echo Current status:
git status

echo.
set /p MESSAGE="Enter commit message (or press Enter for default): "

if "%MESSAGE%"=="" (
    REM Get current date
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
    set MESSAGE=Daily update %mydate%
)

echo.
echo Adding all changes...
git add .

echo.
echo Committing with message: %MESSAGE%
git commit -m "%MESSAGE%"

echo.
echo Pushing to remote...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Push failed. You may need to set up remote:
    echo    git remote add origin YOUR_REPO_URL
    echo    git push -u origin main
) else (
    echo.
    echo ========================================
    echo ✅ Successfully pushed to GitHub!
    echo ========================================
)

echo.
pause

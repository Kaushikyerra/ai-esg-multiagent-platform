# GreenOps AI - Windows Setup Guide

## Prerequisites

### 1. Install Python 3.11+
Download from: https://www.python.org/downloads/

**Important**: Check "Add Python to PATH" during installation

Verify installation:
```cmd
python --version
```

### 2. Install Git
Download from: https://git-scm.com/download/win

Verify installation:
```cmd
git --version
```

### 3. Install Visual Studio Code (Optional)
Download from: https://code.visualstudio.com/

---

## Quick Setup

### Option 1: Automated (Recommended)
```cmd
# Double-click quickstart.bat
# Or run from command prompt:
quickstart.bat
```

### Option 2: Manual Setup

#### Step 1: Clone Repository
```cmd
git clone <repository-url>
cd greenops-ai
```

#### Step 2: Create Virtual Environment
```cmd
python -m venv venv
```

#### Step 3: Activate Virtual Environment
```cmd
venv\Scripts\activate
```

You should see `(venv)` in your command prompt.

#### Step 4: Install Dependencies
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 5: Configure Environment
```cmd
copy .env.example .env
notepad .env
```

Add your Azure OpenAI credentials:
```
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

#### Step 6: Run the Server
```cmd
python orchestrator/main.py
```

Server will start at: http://localhost:8000

#### Step 7: Test (in new command prompt)
```cmd
cd greenops-ai
venv\Scripts\activate
python test_api.py
```

---

## Common Issues & Solutions

### Issue: "python is not recognized"
**Solution**: Add Python to PATH
1. Search "Environment Variables" in Windows
2. Edit "Path" in System Variables
3. Add: `C:\Users\YourName\AppData\Local\Programs\Python\Python311`
4. Restart command prompt

### Issue: "pip is not recognized"
**Solution**: Use python -m pip
```cmd
python -m pip install -r requirements.txt
```

### Issue: Virtual environment not activating
**Solution**: Use full path
```cmd
venv\Scripts\activate.bat
```

### Issue: Permission denied
**Solution**: Run as Administrator
1. Right-click Command Prompt
2. Select "Run as administrator"

### Issue: SSL Certificate Error
**Solution**: Update pip and certificates
```cmd
python -m pip install --upgrade pip certifi
```

### Issue: Module not found
**Solution**: Ensure virtual environment is activated
```cmd
# You should see (venv) in prompt
venv\Scripts\activate

# Then install again
pip install -r requirements.txt
```

---

## PowerShell Setup (Alternative)

If using PowerShell instead of Command Prompt:

### Enable Script Execution
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Activate Virtual Environment
```powershell
venv\Scripts\Activate.ps1
```

### Run Server
```powershell
python orchestrator/main.py
```

---

## Docker Setup (Windows)

### Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop

### Build Image
```cmd
docker build -t greenops-ai .
```

### Run Container
```cmd
docker run -p 8000:8000 --env-file .env greenops-ai
```

### Test
```cmd
curl http://localhost:8000/health
```

---

## Azure CLI Setup (For Deployment)

### Install Azure CLI
Download from: https://aka.ms/installazurecliwindows

### Login
```cmd
az login
```

### Deploy
```cmd
cd deploy
deploy.sh
```

---

## IDE Setup (VS Code)

### Recommended Extensions
1. Python (Microsoft)
2. Pylance (Microsoft)
3. Docker (Microsoft)
4. Azure Tools (Microsoft)

### Open Project
```cmd
code .
```

### Configure Python Interpreter
1. Press `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose `.\venv\Scripts\python.exe`

### Run from VS Code
1. Open `orchestrator/main.py`
2. Press `F5` to debug
3. Or use integrated terminal

---

## Testing

### Run Tests
```cmd
pytest tests/ -v
```

### With Coverage
```cmd
pytest tests/ --cov=orchestrator --cov-report=html
```

### View Coverage Report
```cmd
start htmlcov/index.html
```

---

## Port Already in Use

If port 8000 is already in use:

### Find Process
```cmd
netstat -ano | findstr :8000
```

### Kill Process
```cmd
taskkill /PID <process_id> /F
```

### Or Change Port
Edit `.env`:
```
PORT=8001
```

---

## Firewall Issues

If Windows Firewall blocks the server:

1. Search "Windows Defender Firewall"
2. Click "Allow an app through firewall"
3. Click "Change settings"
4. Click "Allow another app"
5. Browse to `python.exe` in your venv
6. Add and allow

---

## Performance Tips

### Use Windows Terminal
Download from Microsoft Store for better experience

### Enable Long Paths
```cmd
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f
```

### Exclude from Windows Defender
Add project folder to exclusions for faster builds:
1. Windows Security → Virus & threat protection
2. Manage settings → Exclusions
3. Add folder: `C:\path\to\greenops-ai`

---

## Troubleshooting Checklist

- [ ] Python 3.11+ installed
- [ ] Python in PATH
- [ ] Virtual environment created
- [ ] Virtual environment activated (see `(venv)` in prompt)
- [ ] Dependencies installed
- [ ] `.env` file created
- [ ] Azure OpenAI credentials added
- [ ] Port 8000 available
- [ ] Firewall allows Python

---

## Getting Help

### Check Logs
```cmd
# Server logs in terminal
# Or check Windows Event Viewer
```

### Team Support
- Check TEAM_TASKS.md for responsibilities
- Ask in team chat
- Review SETUP.md for general instructions

### External Resources
- Python docs: https://docs.python.org/3/
- FastAPI docs: https://fastapi.tiangolo.com/
- Azure docs: https://docs.microsoft.com/azure/

---

## Next Steps

After setup is complete:

1. ✅ Verify server runs: `python orchestrator/main.py`
2. ✅ Test API: `python test_api.py`
3. ✅ Run tests: `pytest tests/ -v`
4. ✅ Check documentation: Read SETUP.md
5. ✅ Review tasks: Check TEAM_TASKS.md

**You're ready to build! 🚀**

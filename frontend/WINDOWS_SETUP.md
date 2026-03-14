# 🪟 Windows Setup Guide

## Prerequisites

### 1. Install Node.js
1. Download from: https://nodejs.org/
2. Choose LTS version (18.x or 20.x)
3. Run installer
4. Check installation:
```bash
node --version
npm --version
```

### 2. Install Git (if not installed)
1. Download from: https://git-scm.com/
2. Run installer
3. Use default settings

### 3. Install VS Code (recommended)
1. Download from: https://code.visualstudio.com/
2. Install extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

## 🚀 Quick Start (Windows)

### Option 1: PowerShell
```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Option 2: Command Prompt
```cmd
cd frontend
npm install
npm run dev
```

### Option 3: Git Bash
```bash
cd frontend
npm install
npm run dev
```

## 🐛 Common Windows Issues

### Issue 1: npm install fails with permission error
**Solution:**
```powershell
# Run PowerShell as Administrator
# Then:
npm cache clean --force
npm install
```

### Issue 2: Port 3000 already in use
**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

### Issue 3: Scripts disabled in PowerShell
**Error:** "cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
npm run dev
```

### Issue 4: Long path names
**Error:** "ENAMETOOLONG"

**Solution:**
```powershell
# Enable long paths
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Or move project to shorter path like C:\projects\greenops
```

### Issue 5: Line ending issues
**Solution:**
```bash
# Configure git
git config --global core.autocrlf true
```

### Issue 6: Node modules not found
**Solution:**
```powershell
# Delete and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 📁 Windows File Paths

Use forward slashes in code:
```typescript
// Good
import Component from './components/Dashboard'

// Also works
import Component from '.\\components\\Dashboard'
```

## 🔧 VS Code Setup

### Recommended Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.eol": "\n",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Recommended Extensions
1. ESLint
2. Prettier
3. Tailwind CSS IntelliSense
4. Error Lens
5. Auto Rename Tag
6. Path Intellisense

## 🌐 Browser Setup

### Recommended Browsers
1. Chrome (best for development)
2. Edge (good alternative)
3. Firefox (for testing)

### Install React DevTools
1. Chrome: https://chrome.google.com/webstore
2. Search "React Developer Tools"
3. Install extension

## 🧪 Testing on Windows

### Start Backend (separate terminal)
```powershell
# In project root
python orchestrator/main.py
```

### Start Frontend
```powershell
# In frontend folder
npm run dev
```

### Open Browser
```powershell
# Automatically opens or go to:
start http://localhost:3000
```

## 📦 Build for Production

```powershell
# Build
npm run build

# Preview
npm run preview

# Output in dist/ folder
```

## 🔍 Debugging

### Check if backend is running
```powershell
# Test backend health
curl http://localhost:8000/health

# Or in browser
start http://localhost:8000/health
```

### Check frontend logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors

### Check network requests
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Analyze Pipeline"
4. Check API call

## 🚀 Performance Tips

### 1. Use SSD
Move project to SSD for faster builds

### 2. Exclude from Windows Defender
Add project folder to exclusions:
1. Windows Security
2. Virus & threat protection
3. Manage settings
4. Exclusions
5. Add folder

### 3. Close unnecessary apps
Free up RAM for faster development

### 4. Use Windows Terminal
Better than Command Prompt:
- Download from Microsoft Store
- Supports tabs
- Better colors
- Faster

## 📝 Git on Windows

### Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.autocrlf true
```

### Clone Repository
```bash
git clone <repository-url>
cd greenops-ai
cd frontend
npm install
```

## 🔐 Environment Variables

### Create .env file
```powershell
# In frontend folder
New-Item .env

# Or use notepad
notepad .env
```

### Add variables
```
VITE_API_URL=http://localhost:8000
```

## 🌐 Network Issues

### Firewall blocking?
1. Windows Defender Firewall
2. Allow an app
3. Add Node.js
4. Allow private and public networks

### Proxy settings
If behind corporate proxy:
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## 📊 Task Manager

Monitor performance:
1. Press Ctrl+Shift+Esc
2. Check Node.js processes
3. Monitor CPU/RAM usage

## 🎯 Quick Commands Reference

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Clear cache
npm cache clean --force

# Update packages
npm update

# Check outdated packages
npm outdated
```

## 🆘 Emergency Fixes

### Nuclear option (if nothing works)
```powershell
# Delete everything and start fresh
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Still not working?
1. Restart VS Code
2. Restart terminal
3. Restart computer
4. Check Node.js version (should be 18+)
5. Reinstall Node.js

## 📞 Getting Help

### Check logs
```powershell
# Frontend logs
npm run dev

# Backend logs
python orchestrator/main.py
```

### Common error messages

**"ENOENT: no such file or directory"**
- File path is wrong
- Run from correct directory

**"EADDRINUSE: address already in use"**
- Port is busy
- Kill process or change port

**"MODULE_NOT_FOUND"**
- Run `npm install`
- Check import paths

**"Cannot find module 'typescript'"**
- Run `npm install typescript --save-dev`

## ✅ Verification Checklist

Before starting work:
- [ ] Node.js 18+ installed
- [ ] npm working
- [ ] Git installed
- [ ] VS Code installed
- [ ] Extensions installed
- [ ] Can run `npm install`
- [ ] Can run `npm run dev`
- [ ] Browser opens to localhost:3000
- [ ] No console errors
- [ ] Backend is running

## 🎉 You're Ready!

If you can run these commands without errors, you're all set:

```powershell
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 in your browser!

**Good luck! 🚀**

---

## 📚 Additional Resources

- Node.js Docs: https://nodejs.org/docs/
- npm Docs: https://docs.npmjs.com/
- Vite Docs: https://vitejs.dev/
- React Docs: https://react.dev/
- Tailwind Docs: https://tailwindcss.com/
- Windows Terminal: https://aka.ms/terminal

# Node.js Setup Fix

## Quick Fix Steps:

### 1. Close all terminals/command prompts

### 2. Restart your computer

### 3. Open new terminal and try:
```bash
node --version
npm --version
```

### 4. If still not working, reinstall Node.js:
- Go to https://nodejs.org
- Download LTS version (recommended)
- Run installer as Administrator
- Check "Add to PATH" option
- Restart computer

### 5. Alternative - Use PowerShell instead of Git Bash:
```powershell
# Open PowerShell as Administrator
cd C:\Users\Hp\Documents\franciscancatholicschool\backend
npm install
npm start
```

### 6. If PATH issue persists:
Add these to your system PATH:
- `C:\Program Files\nodejs\`
- `C:\Users\Hp\AppData\Roaming\npm`

## Meanwhile, your portal works perfectly with the current setup!
- Open `portal.html` in browser
- Login: `bursar` / `bursar123`
- All features work without Node.js
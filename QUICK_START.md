# 🚀 QUICK REFERENCE - Enterprise Certificate Generator

## 📌 IMPORTANT COMMANDS

### Windows PowerShell (Your System)
```powershell
# Run setup script
.\setup.bat

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm start
```

### Common Issues & Solutions

#### Issue: "setup.bat not recognized"
**Solution:** Use `.\setup.bat` (with dot-slash prefix)

#### Issue: "chmod not recognized" 
**Solution:** `chmod` is a Linux command, not needed on Windows

---

## ⚡ QUICK START (3 Steps)

### Step 1: Run Setup
```powershell
cd d:\project\wt\Certificate_Generator
.\setup.bat
```

### Step 2: Configure Email
```powershell
cd backend
notepad .env
```

Add your SMTP credentials:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

### Step 3: Start Servers
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 📧 GMAIL SMTP SETUP

1. **Enable 2FA**
   - Google Account → Security → 2-Step Verification

2. **Generate App Password**
   - Security → App Passwords
   - Select "Mail" and "Other"
   - Copy 16-character password

3. **Add to .env**
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   ```

---

## 🧪 TEST COMMANDS

### Test Email Configuration
```powershell
curl -X GET http://localhost:5000/api/email/verify-config `
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test CSV Validation
```powershell
curl -X POST http://localhost:5000/api/bulk/validate-csv `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -F "csvFile=@sample_bulk_upload.csv"
```

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `backend/.env` | **CRITICAL** - Email & database config |
| `sample_bulk_upload.csv` | CSV template for testing |
| `sample_certificate_template.html` | Certificate template |
| `IMPLEMENTATION_GUIDE.md` | Complete setup guide |
| `README.md` | Project documentation |

---

## 🔗 URLS

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## 📝 CSV FORMAT

```csv
InternName,Email,Role,StartDate,EndDate
John Doe,john@example.com,Web Development,2024-01-01,2024-03-31
```

---

## 🎨 PLACEHOLDERS

Use in certificate templates:
- `{{INTERN_NAME}}` - Name
- `{{EMAIL}}` - Email
- `{{ROLE}}` - Role/Department
- `{{START_DATE}}` - Start date
- `{{END_DATE}}` - End date
- `{{DURATION}}` - Auto-calculated
- `{{CERTIFICATE_ID}}` - Unique ID
- `{{QR_CODE}}` - QR code image
- `{{VERIFICATION_URL}}` - Verification link

---

## 🆘 TROUBLESHOOTING

### Backend won't start
```powershell
cd backend
npm install
# Check .env file exists
# Check MongoDB is running
```

### Frontend won't start
```powershell
cd frontend
npm install
npm start
```

### Email not sending
1. Check SMTP credentials in `.env`
2. Use App Password (not regular password)
3. Test: `GET /api/email/verify-config`

---

## 📚 DOCUMENTATION

1. **README.md** - Start here
2. **IMPLEMENTATION_GUIDE.md** - Detailed setup
3. **FEATURE_SUMMARY.md** - All features
4. **ARCHITECTURE.md** - System design
5. **CHECKLIST.md** - Deployment checklist

---

## 🎯 NEXT STEPS

1. ✅ Run `.\setup.bat`
2. ⏳ Configure SMTP in `backend/.env`
3. ⏳ Start backend: `npm run dev`
4. ⏳ Start frontend: `npm start`
5. ⏳ Test the system

---

**Version:** 2.0.0 Enterprise  
**Status:** Ready for Use  
**Support:** Check IMPLEMENTATION_GUIDE.md

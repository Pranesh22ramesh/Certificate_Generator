# 🚀 Vercel Deployment Guide - Step by Step

## ✅ Prerequisites Checklist

- [ ] GitHub account created
- [ ] Vercel account created (sign up at [vercel.com](https://vercel.com))
- [ ] MongoDB Atlas database ready (get connection string)
- [ ] Cloudinary account set up (get API credentials)
- [ ] Code pushed to GitHub repository

---

## 📝 Step 1: Prepare Environment Variables

Before deploying, gather these values. You'll add them in Vercel dashboard.

### Required Environment Variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certificate_db

# Authentication
JWT_SECRET=your-super-secret-random-string-here-min-32-chars

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudname
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Credentials
ADMIN_EMAIL=admin@twincord.in
ADMIN_PASSWORD=Admin@123

# Environment
NODE_ENV=production
PORT=5000

# Frontend API URL (Important!)
REACT_APP_API_URL=/api
```

### Optional Variables:

```env
# If using separate PDF service
PDF_SERVICE_URL=https://your-pdf-service.onrender.com
PDF_SERVICE_API_KEY=your-pdf-api-key

# Email Service (if configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app
```

---

## 📤 Step 2: Push Code to GitHub

If not already done:

```powershell
# Initialize git (if new repo)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create main branch
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/your-repo.git

# Push to GitHub
git push -u origin main
```

---

## 🎯 Step 3: Deploy on Vercel Dashboard

### A. Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Click **"Import"**

### B. Configure Build Settings

**Framework Preset:** Other  
**Root Directory:** `./` (leave empty/default)  
**Build Command:** Leave empty (Vercel will use vercel.json)  
**Output Directory:** Leave empty  
**Install Command:** `npm install`

### C. Add Environment Variables

Click **"Environment Variables"** tab and add ALL variables from Step 1:

1. Click "Add" for each variable
2. Enter Key (e.g., `MONGODB_URI`)
3. Enter Value
4. Select all environments (Production, Preview, Development)
5. Click "Add"

**Critical Variables** (Don't forget these!):
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ REACT_APP_API_URL = `/api`
- ✅ CLOUDINARY credentials (all 3)
- ✅ NODE_ENV = `production`

### D. Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes
3. Your app will be live! 🎉

---

## 🔧 Step 4: Post-Deployment Setup

### A. Get Your Deployment URL

After deployment completes, you'll get a URL like:
```
https://certificate-generator-xyz.vercel.app
```

### B. Configure MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Or add Vercel's IP ranges for better security

### C. Seed Admin Account

**Option 1: Using MongoDB Compass/Shell**
```javascript
use certificate_db

db.admins.insertOne({
  email: "admin@twincord.in",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash "Admin@123"
  name: "Super Admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option 2: Create Seed Endpoint**
Access: `https://your-app.vercel.app/api/auth/seed-admin` (if implemented)

### D. Test Your Deployment

1. **Admin Login:**  
   `https://your-app.vercel.app/admin/login`  
   Email: `admin@twincord.in`  
   Password: `Admin@123`

2. **User Login:**  
   `https://your-app.vercel.app/user/login`

3. **API Health Check:**  
   `https://your-app.vercel.app/api/health`

---

## 🔄 Step 5: Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```powershell
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys! ✨
```

### Preview Deployments

Every pull request gets its own preview URL:
- Create a branch → Push changes → Open PR
- Vercel comments with preview link

---

## 🐛 Troubleshooting

### Issue: API calls failing (404)

**Fix:** Ensure `REACT_APP_API_URL=/api` is set in environment variables

### Issue: CORS errors

**Fix:** Add your Vercel URL to backend CORS:
- Update `FRONTEND_URL` environment variable
- Or check backend/server.js CORS settings

### Issue: Database connection failed

**Fix:** 
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Ensure database user has read/write permissions

### Issue: Cloudinary uploads failing

**Fix:**
- Verify all 3 Cloudinary env variables are set
- Check credentials are correct (no extra spaces)

### Issue: Build fails

**Check:**
- All dependencies in package.json
- No syntax errors in code
- Environment variables are set
- Check Vercel build logs

---

## 📊 Monitoring

### View Logs

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **"Deployments"**
4. Click on a deployment → **"Function Logs"**

### Check Performance

- **Analytics** tab shows traffic
- **Speed Insights** shows performance metrics

---

## 🔐 Security Best Practices

### Production Checklist:

- [ ] Change default admin password after first login
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Restrict MongoDB network access to Vercel IPs only
- [ ] Enable MongoDB authentication
- [ ] Set up HTTPS (automatic with Vercel)
- [ ] Add rate limiting to API routes
- [ ] Enable Vercel Pro for password protection (optional)

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to project **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `certificates.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

## 📞 Support

### Vercel Support
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

### Quick Commands

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from terminal
vercel

# Deploy to production
vercel --prod

# View environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME
```

---

## ✨ Success!

Your Certificate Generator is now live on Vercel! 🎉

**Next Steps:**
1. Test all features thoroughly
2. Share your live URL with users
3. Monitor logs for any issues
4. Set up custom domain (optional)
5. Configure email notifications (optional)

---

**Need Help?** Check deployment logs in Vercel dashboard or MongoDB Atlas logs for detailed error messages.

# 🏗️ Microservice Architecture Setup Guide

This project now uses a **Microservice Architecture** separating the Main Backend (Business Logic) from the PDF Generation (Performance Intensive).

---

## 🟢 1. Architecture Overview

### **Main Backend (Caller)**
- **Role:** Business logic, Database, Email, Auth.
- **Location:** `/backend`
- **Hosting:** Vercel (recommended) or any Node.js host.

### **PDF Service (Worker)**
- **Role:** Generates PDFs using Puppeteer, Uploads to Cloudinary.
- **Location:** `/pdf-service`
- **Hosting:** Render (recommended) because it supports Puppeteer well.

---

## 🚀 2. Deployment Instructions

### **A. Deploying PDF Service to Render**

1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Web Service**.
4. Connect your repository.
5. **Root Directory:** `pdf-service` (Important!)
6. **Build Command:** `npm install`
7. **Start Command:** `node server.js`
8. **Environment Variables:**
   - `PDF_SERVICE_SECRET`: `super_secret_key_123` (Change this!)
   - `CLOUDINARY_CLOUD_NAME`: (Your Cloudinary Name)
   - `CLOUDINARY_API_KEY`: (Your Cloudinary Key)
   - `CLOUDINARY_API_SECRET`: (Your Cloudinary Secret)
   - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: `true` (Render has native Chrome)
9. **Click Deploy.**

### **B. Configure Main Backend**

In your Main Backend (e.g., local .env or Vercel Environment Variables):

1. Set `PDF_SERVICE_URL` to your Render URL (e.g., `https://my-pdf-service.onrender.com`).
2. Set `PDF_SERVICE_SECRET` to match the one you set in Render.

---

## 🧪 3. Local Development

You can run both services locally to test.

**Terminal 1 (PDF Service):**
```bash
cd pdf-service
npm install
npm run dev
# Runs on Port 10000
```

**Terminal 2 (Main Backend):**
```bash
cd backend
npm run dev
# Runs on Port 5000
```

**Terminal 3 (Frontend):**
```bash
cd frontend
npm start
# Runs on Port 3000
```

---

## 🔒 4. Security

The communication between Vercel and Render is secured by the `x-api-key` header.
- If the key is missing or incorrect, Render returns `403 Forbidden`.
- **Never share your `PDF_SERVICE_SECRET` publicly.**

---

## 🔄 5. Bulk Generation Flow

1. **Admin** uploads CSV to Main Backend.
2. **Main Backend** validates CSV.
3. **Main Backend** loops through rows.
4. For each row:
   - Orchestrates data.
   - Calls **PDF Service** (`POST /api/generate-pdf`).
   - Receives **PDF URL** (Cloudinary).
   - Saves record to DB.
   - Sends Email.
5. If one fails, it logs errors and continues to the next row (Fault Isolation).

---

**Ready to Scale!** 🚀

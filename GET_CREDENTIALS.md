# 🔑 How to Get Your Environment Credentials

This guide explains where to find or generate the values for your environment variables (`.env` or Vercel Environment Variables).

## 1. MONGODB_URI (Database)
You need a MongoDB database to store user and intern data.

### Option A: MongoDB Atlas (Cloud) - Recommended for Vercel
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up/log in.
2.  Create a **New Project** and then a **Database Cluster** (The free "Shared" tier is sufficient).
3.  **Database Access**: Go to "Database Access" on the left, create a new database user (e.g., `admin`), and generate a password. **Save this password!**
4.  **Network Access**: Go to "Network Access" on the left and click "Add IP Address". Select **"Allow Access from Anywhere"** (`0.0.0.0/0`) since Vercel's IP changes.
5.  **Get Connection String**:
    *   Click "Connect" on your cluster dashboard.
    *   Select "Drivers" (Node.js).
    *   Copy the string. It looks like: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
6.  **Replace**: Replace `<username>` and `<password>` with the credentials you created in step 3.

### Option B: Local MongoDB (For local testing only)
*   Value: `mongodb://localhost:27017/intern_certificate_generator`
*   (Requires MongoDB Community Server installed locally)

---

## 2. JWT_SECRET (Security)
This key is used to sign and verify authentication tokens. It should be a long, random string.

*   **How to generate**:
    *   **Mac/Linux Terminal**: Run `openssl rand -base64 32`
    *   **Windows PowerShell**: Run `[Convert]::ToBase64String((1..32 | %{ [byte](Get-Random -Max 256) }))`
    *   **Manual**: Just type a very long, random sentence (e.g., `my_very_secure_and_random_secret_key_2024_!@#`)

---

## 3. CLOUDINARY_* (Image Hosting - Optional)
If you are using Cloudinary for storing profile pictures or assets.

1.  Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account.
2.  Log in to the **Console/Dashboard**.
3.  You will see your "Account Details" right at the top.
    *   **Cloud Name**: Copy `Cloud Name` → `CLOUDINARY_CLOUD_NAME`
    *   **API Key**: Copy `API Key` → `CLOUDINARY_API_KEY`
    *   **API Secret**: Click "Reveal" and copy `API Secret` → `CLOUDINARY_API_SECRET`

---

## Summary of Values

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | Database Connection | `mongodb+srv://admin:pass123@cluster.mongo.net/mydb` |
| `JWT_SECRET` | Auth Token Encryption | `z8pX9+2q...` (random string) |
| `CLOUDINARY_CLOUD_NAME` | Image Host Account | `dxy8...` |
| `CLOUDINARY_API_KEY` | Image Host Access | `984213...` |
| `CLOUDINARY_API_SECRET` | Image Host Secret | `a1b2c3...` |

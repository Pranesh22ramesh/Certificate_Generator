# 🚀 Step-by-Step Vercel Deployment Guide

Follow these steps exactly to deploy your **Application (Frontend + Backend)** to Vercel.

---

## Phase 1: Preparation (GitHub)

1.  **Commit & Push**: Ensure all your latest changes (including `vercel.json`) are committed and pushed to your GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for Vercel deployment"
    git push origin main
    ```

---

## Phase 2: Vercel Setup

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Find your `Certificate_Generator` repo and click **Import**.

---

## Phase 3: Project Configuration (Crucial!)

You will see a "Configure Project" screen.

1.  **Project Name**: Leave as is or rename (e.g., `intern-certificate-generator`).
2.  **Framework Preset**: Select **Create React App** (or leave as "Other", Vercel usually auto-detects. If unsure, "Create React App" is safe for the frontend).
3.  **Root Directory**: ⚠️ leave this as `./` (the root). **DO NOT** select `frontend` or `backend`. Our `vercel.json` handles the routing.

---

## Phase 4: Environment Variables

Expand the **"Environment Variables"** section. Add the following key-value pairs one by one.

### 1. Backend Secrets
| Key | Value |
| :--- | :--- |
| `MONGODB_URI` | Your **MongoDB Atlas Connection String** (See `GET_CREDENTIALS.md` if you need this). |
| `JWT_SECRET` | `Tr7b9X2k5v8M1n4Q6w9Z3x7C0v2B5n8M1k4L7j9H2g5F8d1S4a6P9o3I` (Or your own) |
| `NODE_ENV` | `production` |

### 2. Frontend Configuration
This is the magic link that connects your React Frontend to your Express Backend.

| Key | Value |
| :--- | :--- |
| `REACT_APP_API_URL` | `/api` |

*(Note: Setting it to `/api` ensures the frontend automatically requests the backend function on the same domain, avoiding CORS issues).*

---

## Phase 5: Deploy

1.  Click **"Deploy"**.
2.  Wait for the build to complete (approx 1-2 minutes).
    - Vercel will build your React app.
    - Vercel will prepare your Serverless Functions.
3.  When you see confetti, click **"Continue to Dashboard"**.
4.  Visit your new URL (e.g., `https://intern-certificate-generator.vercel.app`).

---

## Phase 6: Post-Deployment Verification

1.  **Check API**: Go to `https://<your-app>.vercel.app/api/health`. You should see `{"message":"Server is running!","status":"OK"}`.
2.  **Check Frontend**: Go to the home page.
3.  **Test Login**: Try logging in (ensure your MongoDB has data or register a new admin if you haven't yet).

### Troubleshooting "404 Not Found" on API
If `/api/health` returns 404:
- Check if `vercel.json` is in the root of your GitHub repo.
- Check Vercel logs in the "Functions" tab.

### Troubleshooting Database Errors
If login fails:
- Check "Runtime Logs" in Vercel to see if MongoDB execution failed (IP Whitelist issues are common—ensure Atlas allows `0.0.0.0/0`).

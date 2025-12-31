# Deployment Guide

## 1. Vercel (Frontend + Backend)
**Repository Scope**: Monorepo (Root)

### Configuration
The `vercel.json` file in the root directory manages this deployment.
- **Frontend**: Serves the React app.
- **Backend**: Serves API routes at `/api/*`.

### Steps
1.  Connect your GitHub repository to Vercel.
2.  Vercel will detect `vercel.json`.
3.  **Environment Variables** (Add these in Vercel settings):
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: Random secret key.
    - `REACT_APP_API_URL`: Set to `/api`.

## 2. Render (PDF Service)
**Repository Scope**: Monorepo (Root Directory, but Root Directory setting on Render will be `pdf-service` or use Docker)

### Configuration
We have added a `Dockerfile` to `pdf-service/` for reliable Puppeteer execution.

### Steps
1.  Create a **New Web Service** on Render.
2.  Connect the same GitHub repository.
3.  **Essential Settings**:
    - **Root Directory**: `pdf-service` (Important!)
    - **Runtime**: **Docker** (Recommended for Puppeteer) or Node key.
    - **Build Command**: `npm install` (if using Node runtime)
    - **Start Command**: `node server.js` (if using Node runtime)
4.  **Environment Variables**:
    - `PORT`: `10000` (Default)
    - `API_KEY`: A secret key to secure your PDF service.

## 3. Connecting Them
If your Backend needs to call the PDF Service (e.g., for advanced HTML certificates):
1.  Get the **Render URL** (e.g., `https://my-pdf-service.onrender.com`).
2.  Go back to **Vercel**.
3.  Add an Environment Variable:
    - `PDF_SERVICE_URL`: `https://my-pdf-service.onrender.com`
4.  Update your backend code to use this URL if functionality requires it (currently backend uses local `pdfkit`).

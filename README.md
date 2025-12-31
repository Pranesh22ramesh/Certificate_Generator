# 🎓 Twincord Certificate Generator & Intern Management System

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)](https://github.com)
[![Stack](https://img.shields.io/badge/Stack-MERN-sky)](https://github.com)

A premium, enterprise-grade full-stack application designed for managing intern records and automating the generation of secure, verifiable certificates. Featuring a unified identity system and a multi-certificate vault for interns.

---

## 🧠 The Core Identity Rule (Super Important)

The system is built on a strict **Intern Identity Rule** to ensure data integrity and security:

> **Name + Email + Password = Primary Identity**

*   **Permanent ID:** Once an intern is registered, these three fields form their permanent identity.
*   **One Intern, One Account:** Every intern has exactly one account linked to this unique triplet.
*   **Multiple Certificates:** A single intern can have multiple internship records (e.g., Web Dev, then UI/UX) under the **same login**.
*   **Strict Lockdown:** Identity fields (Name, Email, Password) are immutable once created. Any attempt to modify them via Admin or API is blocked to prevent identity drift.

---

## ✨ Key Features

### 🔐 Multi-Role Authentication
- **Admin Portal:** Comprehensive dashboard for managing all interns, verifying feedbacks, and monitoring statistics.
- **Intern Portal:** A personal space for interns to view their progress and access all their certificates.
- **Unified Login:** A single, sleek login interface for both Admins and Interns using intelligent role detection.

### 📜 Certificate Management & Vault
- **Certificate Vault:** Interns can view and download all their earned certificates from a single list.
- **Real-time Preview:** Premium certificate preview with glassmorphism effects.
- **Instant Download:** Secure PDF generation with unique IDs and (optional) QR verification.
- **Access Control:** Admins can manually enable/disable certificate access for any intern.

### 👥 Administrative Excellence
- **Strict Validation:** Prevention of duplicate records and identity conflicts.
- **Bulk Operations:** CSV-based bulk import for rapid data entry.
- **Status Tracking:** Manage lifecycle from "Active" to "Completed" or "Terminated".
- **Real-time Analytics:** Visual breakdown of department stats and intern activity.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Repository Setup
```bash
git clone <repository-url>
cd Certificate_Generator
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create your .env file (see Configuration section)
node scripts/seedAdmin.js   # Setup initial admin
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

---

## 📁 Project Structure

```text
Certificate_Generator/
├── backend/
│   ├── models/
│   │   ├── InternUser.js     # Central identity (Name, Email, Password)
│   │   ├── Intern.js         # Certificate/Internship records
│   │   └── Admin.js          # Administrative accounts
│   ├── routes/
│   │   ├── authRoutes.js     # Unified login logic
│   │   ├── internRoutes.js   # Admin-side intern management
│   │   └── userRoutes.js     # Intern-side profile & vault logic
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UserLogin.js        # The Unified Portal
│   │   │   ├── UserCertificate.js  # The Certificate Vault
│   │   │   └── AdminDashboard.js   # Enterprise Control
│   │   └── styles/
│   │       └── premium.css         # Modern design tokens
└── ...
```

---

## 📡 Essential API Endpoints

### 🔑 Authentication
- `POST /api/auth/login` - Unified login for both roles.

### 👨‍💼 Admin Operations
- `GET /api/interns` - List all records (paginated).
- `POST /api/interns` - Create new record (enforces Identity Rule).
- `PUT /api/interns/:id` - Update status/dates (Identity fields locked).

### 🎓 Intern Operations
- `GET /api/user/profile` - Fetches profile + **all certificates** in the vault.

---

## 🎨 Design Aesthetics (The Twincord Look)

The application uses a **"Cyber-Executive"** theme:
- **Color Palette:** Deep Teals (#05161A) paired with Vivid Cyans (#00C2FF).
- **Glassmorphism:** Frosted glass panels with subtle borders.
- **Animations:** Smooth entry transitions using `framer-motion`.
- **Typography:** Modern, legible sans-serif hierarchy for professional clarity.

---

## 👤 Admin Setup
**Default Credentials:**
- **Email:** `admin@twincord.in`
- **Password:** `Admin@123`

To create or reset the admin, run:
```bash
node backend/scripts/seedAdmin.js
```

---

<div align="center">
  <strong>Built for Twincord Technologies</strong><br>
  Ensuring trust and transparency in professional recognition.
</div>

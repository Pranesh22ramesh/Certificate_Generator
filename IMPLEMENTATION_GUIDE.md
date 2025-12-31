# 🚀 Enterprise Certificate Generator - Complete Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [What's New](#whats-new)
3. [Backend Setup](#backend-setup)
4. [Frontend Integration](#frontend-integration)
5. [Email Configuration](#email-configuration)
6. [Testing Guide](#testing-guide)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This enterprise enhancement transforms your certificate generator into a production-ready, scalable system with:

- ✅ **Design Management System** - Upload and manage multiple certificate templates
- ✅ **Bulk Certificate Generation** - Process hundreds of certificates via CSV
- ✅ **Strict CSV Validation** - Comprehensive validation with error reporting
- ✅ **Email Automation** - Professional HTML emails with PDF attachments
- ✅ **Placeholder Engine** - Dynamic data injection with 13 placeholders
- ✅ **Audit Logging** - Complete activity tracking for security
- ✅ **Analytics Dashboard** - Real-time statistics and insights

---

## 🆕 What's New

### New MongoDB Schemas
1. **Design** - Certificate template management
2. **BulkUpload** - CSV upload tracking
3. **AuditLog** - Activity monitoring

### New Backend Routes
- `/api/designs` - Design CRUD operations
- `/api/bulk` - CSV upload and processing
- `/api/email` - Email sending and testing

### New Utilities
- `csvValidator.js` - Strict CSV validation
- `placeholderEngine.js` - Template processing
- `emailService.js` - Email automation

---

## 🔧 Backend Setup

### Step 1: Install Dependencies

All required packages are already in package.json. Just run:

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Copy the example file:

```bash
cp .env.enterprise.example .env
```

Edit `.env` and configure:

```env
# Email Configuration (CRITICAL)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Gmail Setup Instructions:
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App-Specific Password:
   - Go to Security → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
   - Use it as `SMTP_PASS`

### Step 3: Create Upload Directories

```bash
mkdir -p uploads/designs
mkdir -p uploads/csv
```

### Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
Server is running on port 5000
Connected to MongoDB
```

---

## 🎨 Frontend Integration

### Step 1: Import New API Services

In any component:

```javascript
import { designAPI, bulkAPI, emailAPI } from '../services/enterpriseAPI';
```

### Step 2: Example Usage

#### Create a Design
```javascript
const handleCreateDesign = async () => {
  const formData = new FormData();
  formData.append('designName', 'Modern Internship Certificate');
  formData.append('certificateType', 'Internship');
  formData.append('templateType', 'HTML');
  formData.append('templateContent', htmlTemplate);
  
  const response = await designAPI.create(formData);
  if (response.success) {
    console.log('Design created:', response.data);
  }
};
```

#### Upload CSV for Bulk Generation
```javascript
const handleBulkUpload = async (file, designId) => {
  // First validate
  const validation = await bulkAPI.validateCSV(file);
  
  if (validation.success) {
    // Then upload
    const result = await bulkAPI.upload(
      file,
      designId,
      'Internship',
      true // Send emails
    );
    
    console.log('Processing:', result.data);
  }
};
```

---

## 📧 Email Configuration

### Testing Email Setup

Use the API to test:

```bash
curl -X POST http://localhost:5000/api/email/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'
```

### Email Template Customization

Edit `backend/services/emailService.js` → `getEmailTemplate()` function to customize the HTML email design.

---

## 🧪 Testing Guide

### 1. Test Design Creation

**Endpoint:** `POST /api/designs`

**Sample Template Content:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; text-align: center; padding: 50px; }
    .cert-title { font-size: 48px; color: #1e3a8a; }
    .name { font-size: 36px; margin: 30px 0; }
  </style>
</head>
<body>
  <h1 class="cert-title">Certificate of Completion</h1>
  <p>This is to certify that</p>
  <h2 class="name">{{INTERN_NAME}}</h2>
  <p>has successfully completed the {{ROLE}} internship</p>
  <p>from {{START_DATE}} to {{END_DATE}}</p>
  <p>Duration: {{DURATION}}</p>
  <p>Certificate ID: {{CERTIFICATE_ID}}</p>
  <p>{{COMPANY_NAME}}</p>
  <p>{{SIGNATORY_NAME}}, {{DESIGNATION}}</p>
  <img src="{{QR_CODE}}" alt="QR Code" />
</body>
</html>
```

### 2. Test CSV Upload

**Sample CSV File (test.csv):**
```csv
InternName,Email,Role,StartDate,EndDate
John Doe,john@example.com,Web Development,2024-01-01,2024-03-31
Jane Smith,jane@example.com,Data Science,2024-02-01,2024-04-30
```

**Upload via API:**
```bash
curl -X POST http://localhost:5000/api/bulk/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "csvFile=@test.csv" \
  -F "designId=YOUR_DESIGN_ID" \
  -F "certificateType=Internship" \
  -F "sendEmails=true"
```

### 3. CSV Validation Rules

The system validates:
- ✅ File must be .csv
- ✅ File size ≤ 5MB
- ✅ Headers must match exactly: `InternName,Email,Role,StartDate,EndDate`
- ✅ InternName: min 3 characters
- ✅ Email: valid format
- ✅ Role: not empty
- ✅ StartDate: valid date
- ✅ EndDate: valid date, ≥ StartDate
- ✅ No duplicate emails

---

## 📚 API Documentation

### Design Management

#### Create Design
```
POST /api/designs
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  - designName: string
  - certificateType: enum (Internship, Offer, Completion, Training)
  - templateType: enum (HTML, PDF, Image)
  - templateContent: string
  - template: file (optional)
```

#### Get All Designs
```
GET /api/designs?status=Active&page=1&limit=20
Headers: Authorization: Bearer {token}
```

#### Update Design
```
PUT /api/designs/:id
Headers: Authorization: Bearer {token}
Body: { designName, status, templateContent }
```

#### Delete Design
```
DELETE /api/designs/:id
Headers: Authorization: Bearer {token}
```

### Bulk Operations

#### Validate CSV
```
POST /api/bulk/validate-csv
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  - csvFile: file
```

#### Upload CSV
```
POST /api/bulk/upload
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  - csvFile: file
  - designId: string
  - certificateType: string
  - sendEmails: boolean
```

#### Get Upload History
```
GET /api/bulk/history?page=1&limit=20
Headers: Authorization: Bearer {token}
```

### Email Operations

#### Send Email
```
POST /api/email/send
Headers: Authorization: Bearer {token}
Body: {
  to: string,
  internName: string,
  certificateType: string,
  role: string,
  duration: string,
  verificationUrl: string,
  pdfBuffer: base64 (optional)
}
```

#### Test Email
```
POST /api/email/test
Headers: Authorization: Bearer {token}
Body: { to: string }
```

---

## 🔍 Troubleshooting

### Issue: Email not sending

**Solution:**
1. Check SMTP credentials in `.env`
2. Test configuration: `GET /api/email/verify-config`
3. For Gmail, ensure App Password is used (not regular password)
4. Check firewall/antivirus blocking port 587

### Issue: CSV validation failing

**Solution:**
1. Ensure headers match exactly: `InternName,Email,Role,StartDate,EndDate`
2. Check for empty rows
3. Verify date format (YYYY-MM-DD recommended)
4. Remove special characters from names

### Issue: Design upload failing

**Solution:**
1. Check file size (max 10MB)
2. Verify file type (.html, .pdf, .png, .jpg)
3. Ensure template contains valid placeholders
4. Check for syntax errors in HTML

### Issue: Bulk processing stuck

**Solution:**
1. Check server logs for errors
2. Verify MongoDB connection
3. Check bulk upload status: `GET /api/bulk/:id`
4. Ensure sufficient server resources

---

## 🎯 Allowed Placeholders

Use these in your certificate templates:

1. `{{INTERN_NAME}}` - Intern's full name
2. `{{EMAIL}}` - Intern's email
3. `{{ROLE}}` - Role/Department
4. `{{START_DATE}}` - Formatted start date
5. `{{END_DATE}}` - Formatted end date
6. `{{DURATION}}` - Calculated duration
7. `{{ISSUE_DATE}}` - Certificate issue date
8. `{{CERTIFICATE_ID}}` - Unique certificate ID
9. `{{COMPANY_NAME}}` - Company name
10. `{{SIGNATORY_NAME}}` - Signatory name
11. `{{DESIGNATION}}` - Signatory designation
12. `{{QR_CODE}}` - QR code image (data URL)
13. `{{VERIFICATION_URL}}` - Verification link

---

## 📊 Database Schema Reference

### Design Collection
```javascript
{
  adminId: ObjectId,
  designName: String,
  certificateType: String,
  templateType: String,
  orientation: String,
  templatePath: String,
  templateContent: String,
  placeholders: [String],
  status: String,
  usageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### BulkUpload Collection
```javascript
{
  adminId: ObjectId,
  designId: ObjectId,
  certificateType: String,
  fileName: String,
  totalRecords: Number,
  validRecords: Number,
  invalidRecords: Number,
  successCount: Number,
  failureCount: Number,
  status: String,
  validationErrors: [Object],
  processingErrors: [Object],
  emailsSent: Number,
  emailsFailed: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Collection
```javascript
{
  adminId: ObjectId,
  action: String,
  targetType: String,
  targetId: ObjectId,
  details: Mixed,
  ip: String,
  userAgent: String,
  status: String,
  errorMessage: String,
  createdAt: Date
}
```

---

## 🚀 Next Steps

1. **Create Frontend UI Components** (see FRONTEND_GUIDE.md)
2. **Customize Email Templates**
3. **Add More Certificate Designs**
4. **Set Up Production Environment**
5. **Configure Backup Strategy**

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review server logs
3. Test with sample data
4. Verify environment variables

---

**Version:** 2.0.0 Enterprise Edition
**Last Updated:** December 2024

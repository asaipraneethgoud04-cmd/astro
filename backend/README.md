# TalkAstrologer Backend Services

This directory contains the standalone Node.js backend suite for **TalkAstrologer**.

---

## 📁 Directory Structure

```
backend/
├── server.js    # Pure Node.js HTTP REST API Server
├── mailer.js    # Centralized Hostinger Nodemailer Service
└── README.md    # Documentation & Quick Start Guide
```

---

## 🚀 Quick Start

### 1. Test Email Delivery Directly:
You can verify your Hostinger SMTP setup anytime from the terminal:
```bash
node backend/mailer.js test
```
This tests both `myappointment@talkastrologer.com` and `support@talkastrologer.com` and reports delivery IDs.

### 2. Run the Standalone API Server:
```bash
node backend/server.js
```
The server will start on `http://localhost:5000` (or `PORT` defined in environment).

---

## 📡 API Endpoints (`server.js`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & service status |
| `POST` | `/api/appointments` | Creates appointment and sends alert to `myappointment@talkastrologer.com` |
| `GET` | `/api/appointments` | Lists all appointment requests (Admin) |
| `PATCH` | `/api/appointments/:id` | Updates appointment status (`contacted`, `scheduled`, `completed`, `cancelled`) |
| `POST` | `/api/messages` | Creates enquiry and sends alert to `support@talkastrologer.com` |
| `GET` | `/api/messages` | Lists all support messages (Admin) |
| `PATCH` | `/api/messages/:id` | Updates support message status |
| `GET` | `/api/reviews` | Retrieves client reviews |
| `PATCH` | `/api/reviews/:id` | Moderates review status (`accepted`, `rejected`, `pinned`) |

---

## ✉️ Using `mailer.js` in Other Scripts

```javascript
const mailer = require("./backend/mailer");

// Send custom email
await mailer.sendEmail({
  to: "client@example.com",
  subject: "Consultation Update",
  html: "<p>Your appointment is confirmed.</p>",
  channel: "appointment" // or "support"
});
```

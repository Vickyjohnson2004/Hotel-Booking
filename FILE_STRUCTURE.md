# 📁 File Structure - Environment Files

## Your Current Setup

```
hotel_booking/
├── Server/
│   ├── .env (PRODUCTION - NODE_ENV=production)
│   ├── .env.local (LOCAL - NODE_ENV=development) ← Node prioritizes this
│   ├── server.js (✅ UPDATED)
│   ├── package.json
│   ├── vercel.json
│   └── ... (other files)
│
├── Client/
│   ├── .env (PRODUCTION - VITE_BACKEND_URL=https://...)
│   ├── .env.local (LOCAL - VITE_BACKEND_URL=http://localhost:5000) ← Vite prioritizes this
│   ├── .env.production (VERCEL PROD - same as .env)
│   ├── src/
│   │   └── services/
│   │       └── api.js (✅ UPDATED)
│   ├── package.json
│   ├── vercel.json
│   └── ... (other files)
│
└── Documentation/
    ├── PRODUCTION_READY_SETUP.md (Complete guide)
    ├── DEBUGGING_GUIDE.md (Troubleshooting)
    └── SETUP_COMPLETE.md (This summary)
```

---

## 🔑 Environment File Priorities

### **Node.js (Server)**

When you run the server, Node.js loads env files in this order:

1. `.env.local` ← ⭐ **Used first (LOCAL DEVELOPMENT)**
2. `.env` ← Used if `.env.local` doesn't exist (PRODUCTION)

### **Vite (Client)**

When you run `npm run dev`, Vite loads env files in this order:

1. `.env.local` ← ⭐ **Used first (LOCAL DEVELOPMENT)**
2. `.env` ← Used during build
3. `.env.production` ← Used during production build

### **Vercel**

Vercel uses:

- Environment Variables set in **Project Settings → Environment Variables**
- These override any `.env` files
- Equivalent to having the values in `.env`

---

## 📝 Content of Each Environment File

### **Server/.env** (Production)

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
MONGODB_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
MAIL_FROM=your_email@example.com
CLOUDINARY_URL=your_cloudinary_url
GOOGLE_CLIENT_ID=your_google_client_id
```

### **Server/.env.local** (Local Development)

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
MAIL_FROM=your_email@example.com
CLOUDINARY_URL=your_cloudinary_url
GOOGLE_CLIENT_ID=your_google_client_id
```

### **Client/.env** (Production)

```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_CURRENCY=$
```

### **Client/.env.local** (Local Development)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

### **Client/.env.production** (Vercel Build)

```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_CURRENCY=$
```

---

## 🎯 Usage Examples

### **Running Locally**

**Backend:**

```bash
cd Server
npm run server
# Uses: .env.local (NODE_ENV=development, FRONTEND_URL=http://localhost:5173)
# Runs on: http://localhost:5000
```

**Frontend:**

```bash
cd Client
npm run dev
# Uses: .env.local (VITE_BACKEND_URL=http://localhost:5000)
# Runs on: http://localhost:5173
# API calls go to: http://localhost:5000
```

### **Running Production Locally**

**Backend:**

```bash
cd Server
NODE_ENV=production node server.js
# Uses: .env (NODE_ENV=production, FRONTEND_URL=https://quickstay-...)
# Connects to: MongoDB Atlas
```

**Frontend:**

```bash
cd Client
npm run build
npm run preview
# Uses: .env.production (VITE_BACKEND_URL=https://hotel-booking-backend-...)
# API calls go to: https://hotel-booking-backend-...
```

### **On Vercel**

Backend:

- Reads Environment Variables from Project Settings
- Uses values you set in Vercel Dashboard

Frontend:

- Reads Environment Variables from Project Settings
- Builds with `.env.production` values
- Uses VITE_BACKEND_URL from Vercel env vars

---

## ✅ Verification Checklist

### **Local Development**

```bash
# Terminal 1: Backend
cd Server && npm run server
# Verify in terminal: "✅ MongoDB connected"
# Verify in terminal: "Server running on port 5000"

# Terminal 2: Frontend
cd Client && npm run dev
# Verify in terminal: "http://localhost:5173/"

# Browser
# Open http://localhost:5173
# Open DevTools Console
# Look for: [API] GET http://localhost:5000/api/health
```

### **Production URLs (Test)**

```bash
# Test Backend
curl https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/health
# Should return: {"status":"ok",...}

# Test Frontend
curl https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app
# Should return: HTML page

# Check Frontend Logs
# Frontend Console should show:
# [API] GET https://hotel-booking-backend-.../api/...
```

---

## 🚀 Deployment Flow

```
Git Push
   ↓
GitHub Webhook
   ↓
Vercel Detects Change
   ↓
Backend Deployment:
  - Read .env from Vercel Project Settings
  - Values: FRONTEND_URL=https://quickstay-...
  - Build & Deploy
   ↓
Frontend Deployment:
  - Read .env from Vercel Project Settings
  - Values: VITE_BACKEND_URL=https://hotel-booking-backend-...
  - Build with Vite (uses VITE_BACKEND_URL)
  - Deploy
   ↓
Live at:
  - Frontend: https://quickstay-8r5avvt5o.vercel.app
  - Backend: https://hotel-booking-backend-a6xdu2e0e.vercel.app
```

---

## 📚 All Documentation Files

1. **PRODUCTION_READY_SETUP.md** - Complete setup guide with all URLs
2. **DEBUGGING_GUIDE.md** - Troubleshooting common issues
3. **SETUP_COMPLETE.md** - Summary of what's been done
4. **FILE_STRUCTURE.md** - This file (env file organization)

---

## 💡 Pro Tips

### **Quick Switch Between Local & Production**

**To test production build locally:**

```bash
# Build frontend with production URLs
cd Client
npm run build
npm run preview

# This uses .env.production (backend URL = https://...)
```

**To test local development:**

```bash
# Use .env.local (backend URL = http://localhost:5000)
cd Server && npm run server
cd Client && npm run dev
```

### **Common Mistakes to Avoid**

❌ **Don't:** Commit `.env` or `.env.local` files
✅ **Do:** Add them to `.gitignore`

❌ **Don't:** Copy production URLs to `.env.local`
✅ **Do:** Use `http://localhost:5000` for local development

❌ **Don't:** Hardcode URLs in component code
✅ **Do:** Use environment variables

❌ **Don't:** Change `.env` file in Vercel (not possible)
✅ **Do:** Change values in Vercel Project Settings → Environment Variables

---

All set! Your environment is properly configured for development and production. 🎉

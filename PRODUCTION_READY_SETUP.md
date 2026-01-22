# 🚀 Hotel Booking - Complete Deployment Guide

## 📋 Your Configuration Summary

### **Production URLs**

- **Frontend:** https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app
- **Backend:** https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app
- **Database:** MongoDB Atlas (Already connected)
- **Media Storage:** Cloudinary (Already configured)

### **Local Development URLs**

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 🛠️ What I Fixed

### ✅ 1. **Environment Configuration**

- Created `.env.local` for local development
- Created `.env.production` for production frontend
- Updated `.env` files with correct URLs

### ✅ 2. **CORS Configuration**

- Fixed CORS to work with credentials
- Now properly checks `FRONTEND_URL` environment variable
- Logs blocked origins for debugging

### ✅ 3. **API Client (Axios)**

- Added request/response interceptors for logging
- Better error messages for debugging
- Logs backend URL in console

### ✅ 4. **Server Logging**

- Enhanced health check endpoints
- Detailed error logging with stack traces
- Environment detection logging

---

## 📁 Environment Files Setup

### **Server (`/Server/.env` - Production)**

```dotenv
MONGODB_URL=mongodb+srv://VJohnson:dynoNXFhXdmr4Pui@cluster0.nnem2hl.mongodb.net/test?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=992cf7001@smtp-brevo.com
SMTP_PASS=xsmtpsib-ebe27785ec3db1a67b15c884a7affca840ba5f0faae9c1aaf824f13a551e6795-bwvuGmGqakoNuh3Q
MAIL_FROM="Hotel Booking" <okikevictorodinaka@gmail.com>
CLOUDINARY_URL=cloudinary://293915947575549:wvfSWYs-vzMB3l2TYA4EJHFrG_A@duylj6m9o
GOOGLE_CLIENT_ID=819365736096-7mt6qh3o5osup5et2o5up0t52hgsffae.apps.googleusercontent.com
```

### **Server (`.env.local` - Local Development)**

```dotenv
MONGODB_URL=mongodb+srv://VJohnson:dynoNXFhXdmr4Pui@cluster0.nnem2hl.mongodb.net/test?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=992cf7001@smtp-brevo.com
SMTP_PASS=xsmtpsib-ebe27785ec3db1a67b15c884a7affca840ba5f0faae9c1aaf824f13a551e6795-bwvuGmGqakoNuh3Q
MAIL_FROM="Hotel Booking" <okikevictorodinaka@gmail.com>
CLOUDINARY_URL=cloudinary://293915947575549:wvfSWYs-vzMB3l2TYA4EJHFrG_A@duylj6m9o
GOOGLE_CLIENT_ID=819365736096-7mt6qh3o5osup5et2o5up0t52hgsffae.apps.googleusercontent.com
```

### **Client (`.env` - Production)**

```dotenv
VITE_BACKEND_URL=https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app
VITE_CURRENCY=$
```

### **Client (`.env.local` - Local Development)**

```dotenv
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

### **Client (`.env.production` - Vercel Auto-detection)**

```dotenv
VITE_BACKEND_URL=https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app
VITE_CURRENCY=$
```

---

## 🚀 How to Run Locally

### **Terminal 1 - Start Backend**

```bash
cd Server
npm install
npm start
# OR for development with auto-reload:
npm run server
```

Expected output:

```
✅ MongoDB connected
Server running on port 5000 🚀
```

### **Terminal 2 - Start Frontend**

```bash
cd Client
npm install
npm run dev
```

Expected output:

```
VITE v7.2.2 running at: http://localhost:5173/
```

---

## ✅ Testing Your Setup

### **1. Test Backend Connection**

```bash
curl http://localhost:5000/api/health
# Should return:
# {"status":"ok","message":"Backend is running","environment":"development","timestamp":"..."}
```

### **2. Test CORS**

- Open DevTools (F12)
- Network tab
- Click any API request
- Check that response has CORS headers

### **3. Check Frontend Logs**

- Open DevTools Console
- Look for API logs like: `[API] GET http://localhost:5000/api/health`

### **4. Verify Environment Variables**

Frontend Console (Vite exposes env vars):

```javascript
console.log(import.meta.env.VITE_BACKEND_URL);
```

---

## 📤 Deploying to Production

### **Step 1: Set Vercel Environment Variables**

#### **Backend (Server) - Vercel**

1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Add these variables:

```
MONGODB_URL=mongodb+srv://VJohnson:dynoNXFhXdmr4Pui@cluster0.nnem2hl.mongodb.net/test?retryWrites=true&w=majority
FRONTEND_URL=https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=992cf7001@smtp-brevo.com
SMTP_PASS=xsmtpsib-ebe27785ec3db1a67b15c884a7affca840ba5f0faae9c1aaf824f13a551e6795-bwvuGmGqakoNuh3Q
MAIL_FROM="Hotel Booking" <okikevictorodinaka@gmail.com>
CLOUDINARY_URL=cloudinary://293915947575549:wvfSWYs-vzMB3l2TYA4EJHFrG_A@duylj6m9o
GOOGLE_CLIENT_ID=819365736096-7mt6qh3o5osup5et2o5up0t52hgsffae.apps.googleusercontent.com
```

#### **Frontend (Client) - Vercel**

1. Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables
2. Add this variable:

```
VITE_BACKEND_URL=https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app
VITE_CURRENCY=$
```

### **Step 2: Deploy**

```bash
# Frontend
cd Client
npm run build
vercel --prod

# Backend
cd Server
vercel --prod
```

### **Step 3: Verify Deployment**

```bash
# Test backend health
curl https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/health

# Test frontend loads
curl https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app
```

---

## 🐛 Troubleshooting

| Issue                         | Solution                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| **CORS Error**                | Check that frontend URL matches `FRONTEND_URL` in backend env vars                    |
| **API Returns 404**           | Verify backend URL in client console: `console.log(import.meta.env.VITE_BACKEND_URL)` |
| **Database Connection Fails** | Check `MONGODB_URL` is correct in Vercel env vars                                     |
| **Images Not Loading**        | Verify `CLOUDINARY_URL` is set and Cloudinary account is active                       |
| **Email Not Sending**         | Check BREVO credentials in backend env vars                                           |
| **Cold Start Delay**          | First request takes 10-30 seconds on Vercel - normal behavior                         |

---

## 📝 Key Files Modified

1. **[Server/server.js](../Server/server.js)** - Enhanced CORS, logging, error handling
2. **[Server/.env](../Server/.env)** - Production configuration
3. **[Server/.env.local](../Server/.env.local)** - Local development configuration
4. **[Client/.env](../Client/.env)** - Production configuration
5. **[Client/.env.local](../Client/.env.local)** - Local development configuration
6. **[Client/.env.production](../Client/.env.production)** - Vercel production configuration
7. **[Client/src/services/api.js](../Client/src/services/api.js)** - Improved error handling

---

## ✨ Next Steps

1. ✅ Ensure all `.env` files are in `.gitignore` (never commit secrets!)
2. ✅ Test locally with `npm start` in Server and `npm run dev` in Client
3. ✅ Verify API calls in browser DevTools console
4. ✅ Set Vercel environment variables for production
5. ✅ Deploy both projects
6. ✅ Monitor Vercel logs for any errors

All configurations are now ready for both local development and production! 🎉

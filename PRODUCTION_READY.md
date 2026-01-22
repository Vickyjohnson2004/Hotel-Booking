# 🚀 Production Deployment & Local Testing Guide

## Pre-Deployment Checklist

### ✅ Code Quality

- [x] Console logs removed (kept console.errors for debugging)
- [x] Environment variables configured
- [x] Authentication fixed (localStorage + Authorization header)
- [x] All API endpoints working
- [x] No hardcoded URLs

### ✅ Environment Setup

**Backend `.env` (Server/)**

```env
MONGODB_URL=mongodb+srv://VJohnson:dynoNXFhXdmr4Pui@cluster0.nnem2hl.mongodb.net/test?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
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

**Frontend `.env.production` (Client/)**

```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_CURRENCY=$
```

---

## 1. Test Locally First

### Step 1: Start Backend

```bash
cd Server
npm install  # if needed
npm run server
```

Expected output:

```
✅ MongoDB connected
Server running on port 5000 🚀
```

### Step 2: Start Frontend

```bash
cd Client
npm install  # if needed
npm run dev
```

Expected output:

```
Local: http://localhost:5173
```

### Step 3: Test All Features

**Test Authentication:**

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Create account
4. Verify token saved in localStorage (DevTools → Application → Local Storage)
5. Refresh page - should stay logged in ✅
6. Try to navigate to protected routes
7. Logout

**Test API Calls:**

1. Open browser console
2. Go to different pages (Hotels, Rooms, etc.)
3. Should see no errors
4. All data should load

**Test with Testimonials:**

```
http://localhost:5173
```

Should show testimonials from database

---

## 2. Build for Production

### Build Frontend

```bash
cd Client
npm run build
```

This creates a `dist` folder with optimized production build.

Check build output:

```bash
ls -la dist/
```

### Build Backend (Already Optimized)

Backend is already ready. Just ensure:

- No `console.log` statements that expose sensitive data
- Error handling is comprehensive
- All env vars are set

---

## 3. Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "Production ready: Optimized auth and removed debug logs"
git push origin main
```

### Step 2: Deploy Backend

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `Hotel-Booking` repo
4. Root Directory: `./Server`
5. Environment Variables: Add all from `.env`
6. Deploy

**Get Backend URL:** `https://your-backend.vercel.app`

### Step 3: Update Frontend Env

1. Create/update `Client/.env.production`:

```env
VITE_BACKEND_URL=https://your-backend.vercel.app
VITE_CURRENCY=$
```

2. Push changes:

```bash
git add Client/.env.production
git commit -m "Update backend URL for production"
git push origin main
```

### Step 4: Deploy Frontend

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import same repo
4. Root Directory: `./Client`
5. Environment Variables:
   ```
   VITE_BACKEND_URL=https://your-backend.vercel.app
   ```
6. Deploy

**Get Frontend URL:** `https://your-app.vercel.app`

---

## 4. Verification Checklist

After deployment, verify everything works:

### Test Backend

```bash
curl https://your-backend.vercel.app/api/health
```

Should return:

```json
{
  "status": "ok",
  "message": "Backend is running",
  "environment": "production"
}
```

### Test MongoDB Connection

```
https://your-backend.vercel.app/api/health/db
```

Should show:

```json
{
  "database": "MongoDB",
  "status": "✅ Connected",
  "readyState": 1
}
```

### Test Frontend

1. Open https://your-app.vercel.app
2. Page should load without errors
3. All images should display
4. Sign up and login should work
5. Data should load from API
6. Refresh page - should stay logged in ✅

### Test All Endpoints

**Public Routes:**

- `/` - Home page
- `/all-rooms` - All rooms
- `/room/:id` - Room details
- `/about` - About page

**Authenticated Routes:**

- `/my-bookings` - User bookings
- `/user-dashboard` - User profile
- `/admin` - Admin dashboard
- `/admin/add-room` - Add room (hotel owner)
- `/admin/list-room` - List rooms (hotel owner)
- `/admin/offers` - Manage offers
- `/admin/testimonials` - Manage testimonials

---

## 5. Data Flow (Local & Production)

### Authentication Flow

```
Frontend localStorage (authToken)
         ↓
API request header (Authorization: Bearer token)
         ↓
Backend middleware (verify JWT)
         ↓
Database query
         ↓
Response with user data
```

### API Calls Flow

```
Frontend component
         ↓
API service (with auth header)
         ↓
Backend route
         ↓
Database query
         ↓
Response to frontend
         ↓
Update component state
```

---

## 6. Troubleshooting Production

### Issue: "Not logged in" after refresh

**Solution:**

- Check localStorage has `authToken`
- Check `VITE_BACKEND_URL` is correct
- Check backend `/api/auth/me` endpoint
- Verify JWT_SECRET is same on backend

### Issue: API calls failing with 503

**Solution:**

- MongoDB might be connecting
- Wait 30 seconds (cold start)
- Check `/api/health/db` endpoint
- Verify MongoDB IP whitelist in Atlas

### Issue: CORS errors

**Solution:**

- Check `FRONTEND_URL` in backend env
- Ensure `withCredentials: true` in axios
- Verify backend CORS middleware

### Issue: Images not loading

**Solution:**

- Check Cloudinary URL in env
- Verify images uploaded to Cloudinary
- Check bucket settings

---

## 7. Monitoring Production

### View Logs

```bash
# Install Vercel CLI
npm install -g vercel
vercel login

# Backend logs
vercel logs your-backend-project --follow

# Frontend logs (build)
vercel logs your-frontend-project --follow
```

### Check Errors

1. Vercel Dashboard → Deployments
2. Click latest deployment
3. View logs at bottom

### Monitor Performance

- Vercel Dashboard → Analytics
- Check response times
- Monitor error rates

---

## 8. Post-Deployment

### Configure Custom Domain (Optional)

1. Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Update DNS records

### Enable Analytics

1. Project Settings → Analytics
2. Monitor traffic and errors

### Set Up Alerts

1. Project Settings → Integrations
2. Add Slack for deployment notifications

---

## Production URLs

After successful deployment:

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.vercel.app
- **API Health:** https://your-backend.vercel.app/api/health
- **DB Status:** https://your-backend.vercel.app/api/health/db

---

**🎉 Your application is now production-ready!**

All data is fetched from the MongoDB database (locally and on Vercel). Authentication persists across page refreshes. The app is optimized for production with all debug logs removed.

# 🚀 Complete Vercel Deployment Guide

## Step 1: Prepare Your Local Repository ✅

```bash
# Verify your code is ready
git status
git log --oneline -5

# Ensure all changes are committed
git add -A
git commit -m "Production-ready setup"
git push origin main
```

---

## Step 2: Deploy Backend to Vercel

### 2.1 Create Backend Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository `Hotel-Booking`
4. Select **Root Directory**: Choose `./Server`
5. Click **"Deploy"**

**Note:** Vercel will automatically detect it's a Node.js project and set the build command to `npm run build` (or skip if there's no build script).

### 2.2 Configure Backend Environment Variables

After deployment, go to: **Settings** → **Environment Variables**

Add these variables:

```env
MONGODB_URL=your_mongodb_connection_string
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
MAIL_FROM=your_email@example.com
CLOUDINARY_URL=your_cloudinary_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2.3 Get Your Backend URL

After successful deployment:

- Your backend URL will be: `https://your-backend-name.vercel.app`
- Test it: `https://your-backend-name.vercel.app/api/health`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Frontend Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository `Hotel-Booking` again (or create a new one)
4. Select **Root Directory**: Choose `./Client`
5. Framework Preset: **Vite** (should auto-detect)
6. Click **"Deploy"**

### 3.2 Configure Frontend Environment Variables

After deployment, go to: **Settings** → **Environment Variables**

Add this variable:

```env
VITE_BACKEND_URL=https://your-backend-name.vercel.app
VITE_CURRENCY=$
```

### 3.3 Get Your Frontend URL

After successful deployment:

- Your frontend URL will be: `https://your-frontend-name.vercel.app`

---

## Step 4: Update Frontend with Backend URL

### 4.1 Update Your Client Environment Files

**`.env.production`** in Client folder:

```env
VITE_BACKEND_URL=https://your-backend-name.vercel.app
VITE_CURRENCY=$
```

Push this update:

```bash
git add Client/.env.production
git commit -m "Update backend URL for production"
git push origin main
```

---

## Step 5: Verify Configuration

### 5.1 Test Backend Health

```bash
# Test backend is running
curl https://your-backend-name.vercel.app/api/health

# Expected response:
# {"status": "OK", "message": "Backend is running"}
```

### 5.2 Test CORS Configuration

In your browser console, test:

```javascript
fetch("https://your-backend-name.vercel.app/api/health", {
  method: "GET",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
})
  .then((r) => r.json())
  .then((d) => console.log("✅ CORS OK:", d))
  .catch((e) => console.error("❌ CORS Error:", e));
```

### 5.3 Check Backend Logs

```bash
# View real-time backend logs
vercel logs your-backend-name --follow

# Filter for errors
vercel logs your-backend-name --follow | grep -i error
```

---

## Step 6: Production Verification Checklist

- [ ] Backend deployed and health check works
- [ ] Frontend deployed and loads without errors
- [ ] Backend URL is set correctly in frontend env vars
- [ ] CORS is configured (no CORS errors in browser console)
- [ ] Images load from Cloudinary
- [ ] Authentication works (Google OAuth, JWT)
- [ ] API calls from frontend reach backend
- [ ] Database queries execute successfully
- [ ] Email notifications send
- [ ] Payment integration works (if enabled)

---

## Common Issues & Solutions

### Issue: 503 Service Unavailable

**Cause:** Cold start (first request takes time)

**Solution:**

- Wait 30 seconds for backend to initialize
- Vercel warms up serverless functions on first request

### Issue: CORS Error in Browser

**Cause:** `FRONTEND_URL` not set correctly in backend env vars

**Solution:**

1. Go to Backend Project → Settings → Environment Variables
2. Verify `FRONTEND_URL` matches your frontend domain exactly
3. Redeploy backend after updating

### Issue: 401 Unauthorized on API Calls

**Cause:** JWT_SECRET mismatch between local and Vercel

**Solution:**

1. Ensure same `JWT_SECRET` value in Vercel and local `.env`
2. Verify tokens are being stored correctly in cookies
3. Check browser DevTools → Application → Cookies

### Issue: Images Not Loading

**Cause:** Cloudinary credentials not set or invalid

**Solution:**

1. Verify `CLOUDINARY_URL` is correct in backend env vars
2. Check Cloudinary dashboard for active account
3. Redeploy backend after verifying

### Issue: Database Connection Failed

**Cause:** MongoDB connection string invalid or IP whitelist issue

**Solution:**

1. Verify `MONGODB_URL` is correct
2. In MongoDB Atlas: Go to Network Access → Add Vercel IP
   - Add `0.0.0.0/0` for development (less secure)
   - Or add specific Vercel IP ranges
3. Test connection locally first

---

## Performance Optimization Tips

### 1. Enable Response Compression

Add to `Server/server.js`:

```javascript
import compression from "compression";
app.use(compression());
```

### 2. Set up Vercel Analytics

Go to Frontend Project → Settings → Analytics → Enable

### 3. Monitor Backend Performance

Go to Backend Project → Analytics → View metrics

### 4. Optimize Database Queries

- Add indexes to frequently queried fields in MongoDB
- Use `.lean()` in Mongoose queries for read-only operations
- Implement query caching where applicable

---

## Rollback Strategy

If something breaks in production:

### Quick Rollback

1. Go to Vercel Dashboard → Deployment tab
2. Find the last working deployment
3. Click "..." → **"Redeploy"**

### Manual Rollback

```bash
# Go to previous git commit
git revert HEAD
git push origin main

# Vercel will auto-redeploy the previous version
```

---

## Monitoring & Logging

### View Backend Logs

```bash
# Install Vercel CLI if not already
npm install -g vercel

# Login to Vercel
vercel login

# View live logs
vercel logs your-backend-project-name --follow
```

### Monitor Frontend

1. Go to Frontend Project → Analytics
2. Monitor page performance
3. Check error rates

### Set Up Alerts

1. Go to Project Settings → Integrations
2. Add Slack integration for deployment notifications
3. Configure alerts for failed deployments

---

## API Endpoints for Testing

```bash
# Health Check
curl https://your-backend.vercel.app/api/health

# Get All Hotels
curl https://your-backend.vercel.app/api/hotels

# Search Hotels
curl "https://your-backend.vercel.app/api/search?location=Lagos&checkIn=2024-01-25"

# Get Hotels by Owner (Authenticated)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-backend.vercel.app/api/hotels/owner
```

---

## Next Steps After Deployment

1. **Set up CI/CD pipeline** for automatic deployments
2. **Configure domain name** (add custom domain in Vercel settings)
3. **Set up SSL/HTTPS** (automatic with Vercel)
4. **Enable preview deployments** for pull requests
5. **Set up error tracking** (Sentry, Rollbar, etc.)
6. **Configure rate limiting** for API endpoints
7. **Implement caching strategy** for frequently accessed data

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Express.js Guide:** https://expressjs.com/
- **Vite Guide:** https://vitejs.dev/guide/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/

---

**🎉 Congratulations! Your Hotel Booking app is now production-ready on Vercel!**

For questions or issues, check the logs first: `vercel logs <project-name> --follow`

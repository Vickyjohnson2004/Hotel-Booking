# Vercel Deployment Fix Checklist

## ✅ Issues Found & Fixed:

### 1. **CORS Configuration** (FIXED)

- ❌ Problem: `allowedOrigins = ["*"]` doesn't work with `credentials: true`
- ✅ Solution: Updated to use specific origins with `FRONTEND_URL` env variable

### 2. **Environment Variables to Add**

#### On Vercel Dashboard - Server Project:

```
FRONTEND_URL=https://your-frontend-domain.vercel.app
CLOUDINARY_URL=your_cloudinary_url
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### On Vercel Dashboard - Client Project:

```
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

#### Local `.env` (Server Root):

```
FRONTEND_URL=http://localhost:5173
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_URL=your_cloudinary_url
JWT_SECRET=your_jwt_secret
```

### 3. **Testing Steps:**

1. Deploy both frontend and backend to Vercel
2. Check Vercel logs for errors:
   - Server: `vercel logs --follow`
   - Client: Check Vercel Dashboard > Deployment

3. Test API endpoints:

   ```bash
   curl https://your-backend.vercel.app/api/health
   ```

4. Check browser console for CORS errors in DevTools
5. Verify Network tab shows correct backend URL

### 4. **Common Issues & Solutions:**

| Issue                     | Solution                                        |
| ------------------------- | ----------------------------------------------- |
| 401 Unauthorized          | Check JWT_SECRET matches between local & Vercel |
| CORS Error                | Verify FRONTEND_URL in Vercel env vars          |
| Image not loading         | Ensure Cloudinary credentials are set           |
| Database connection fails | Verify DATABASE_URL connection string           |
| 503 Service Unavailable   | Check cold start - give it 10-30 seconds        |

### 5. **Code Changes Made:**

- ✅ Updated CORS origin validation in `server.js`
- ✅ Now checks for `process.env.FRONTEND_URL` instead of wildcard

### 6. **Next Steps:**

1. Set all environment variables on Vercel
2. Redeploy both frontend and backend
3. Monitor Vercel logs for any errors
4. Test API calls from browser console

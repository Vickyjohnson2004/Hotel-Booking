# 🎯 5-Minute Vercel Setup Guide

## Your Deployment Journey

```
┌─────────────────────────────────────────────┐
│  START: GitHub Code Ready ✅               │
│  - Code pushed to GitHub                    │
│  - .env files configured locally            │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 1: Deploy Backend                     │
│  https://vercel.com                         │
│  ├─ Click "Add New" → "Project"             │
│  ├─ Import Hotel-Booking repo               │
│  ├─ Set Root Dir: ./Server                  │
│  └─ Click "Deploy" ✅                       │
│                                             │
│  RESULT: https://your-backend.vercel.app   │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Configure Backend Env Vars         │
│  Go to: Settings → Environment Variables    │
│  Add all variables from guide               │
│  (MONGODB_URL, JWT_SECRET, etc.)            │
│  Redeploy after saving ✅                   │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 3: Deploy Frontend                    │
│  https://vercel.com                         │
│  ├─ Click "Add New" → "Project"             │
│  ├─ Import Hotel-Booking repo               │
│  ├─ Set Root Dir: ./Client                  │
│  └─ Click "Deploy" ✅                       │
│                                             │
│  RESULT: https://your-frontend.vercel.app  │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 4: Configure Frontend Env Vars        │
│  Go to: Settings → Environment Variables    │
│  Add: VITE_BACKEND_URL                      │
│  (Use backend URL from Step 2)              │
│  Redeploy after saving ✅                   │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 5: Test Connection                    │
│  Open browser console                       │
│  Run test from VERCEL_DEPLOYMENT_GUIDE      │
│  Check for ✅ CORS OK message              │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  SUCCESS: App Live in Production! 🎉        │
│  Frontend: https://your-app.vercel.app      │
│  Backend: https://api.your-app.vercel.app   │
└─────────────────────────────────────────────┘
```

---

## Environment Variables Quick Setup

### Copy & Paste for Backend

```env
MONGODB_URL=your_mongodb_connection_string
FRONTEND_URL=https://your-frontend-name.vercel.app
NODE_ENV=production
JWT_SECRET=your_jwt_secret
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

### Copy & Paste for Frontend

```env
VITE_BACKEND_URL=https://your-backend-name.vercel.app
VITE_CURRENCY=$
```

---

## Quick Reference

| Step | Task                  | Time  | Status   |
| ---- | --------------------- | ----- | -------- |
| 1    | Push code to GitHub   | 1 min | ✅ Done  |
| 2    | Deploy backend        | 2 min | ⏳ To Do |
| 3    | Set backend env vars  | 2 min | ⏳ To Do |
| 4    | Deploy frontend       | 2 min | ⏳ To Do |
| 5    | Set frontend env vars | 2 min | ⏳ To Do |
| 6    | Test connection       | 1 min | ⏳ To Do |

**Total Time: ~10 minutes** ⏱️

---

## Common Questions

**Q: Do I need to deploy both frontend and backend separately?**
A: Yes, they are separate projects on Vercel. Frontend is Vite (React), Backend is Node.js (Express).

**Q: Where do I get the environment variables?**
A:

- MONGODB_URL: MongoDB Atlas connection string
- JWT_SECRET: Create a random secure string (min 32 chars)
- SMTP credentials: From your email provider (Brevo, Gmail, etc.)
- CLOUDINARY_URL: From Cloudinary dashboard
- GOOGLE_CLIENT_ID: From Google Cloud Console

**Q: How long does deployment take?**
A: Usually 1-2 minutes per project. First load might be slow (cold start).

**Q: Can I use a custom domain?**
A: Yes! Go to Project Settings → Domains → Add custom domain

**Q: How do I update my code after deploying?**
A: Just `git push origin main`. Vercel auto-deploys on every push!

**Q: How much does Vercel cost?**
A: Hobby tier is free. Scales automatically, pay only for usage (usually $0-10/month for hobby projects).

---

## Verification Checklist

After deployment, verify each item:

- [ ] Backend URL is accessible: `https://your-backend.vercel.app/api/health`
- [ ] Frontend URL is loading without 500 errors
- [ ] No CORS errors in browser console
- [ ] Can login/signup successfully
- [ ] Images are loading from Cloudinary
- [ ] API calls are working
- [ ] Database queries returning data
- [ ] Email notifications sending (if applicable)

---

## If Something Goes Wrong

**Check these in order:**

1. **Are env vars set?**

   ```
   Settings → Environment Variables → Verify all listed
   ```

2. **Do logs show errors?**

   ```
   Deployments → Click latest → View logs
   ```

3. **Is it a cold start?**

   ```
   Wait 30 seconds and try again
   ```

4. **Check CORS**

   ```
   Browser Console → Look for CORS errors → Check FRONTEND_URL in backend env
   ```

5. **Is database connected?**
   ```
   Check MONGODB_URL is correct and IP is whitelisted in MongoDB Atlas
   ```

---

## Next Steps After Successful Deployment

1. **Add custom domain** (optional)
   - Project Settings → Domains
   - Add your domain: `www.yourhotelbooking.com`

2. **Enable analytics**
   - Project Settings → Analytics
   - Monitor performance and errors

3. **Set up GitHub auto-deploy**
   - Already enabled! Just commit and push

4. **Create staging environment**
   - Deploy to different Vercel project for testing

5. **Monitor production**
   - Set up Slack notifications
   - Configure error alerts
   - Monitor uptime

---

## Useful Commands

```bash
# View backend logs
vercel logs your-backend-project --follow

# View frontend logs
vercel logs your-frontend-project --follow

# List all projects
vercel projects ls

# Redeploy a specific commit
git log --oneline    # Find commit
git checkout <hash>  # Go to that commit
git push origin main # Vercel auto-redeploys
```

---

## Production URLs Template

After deployment, save these:

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.vercel.app
GitHub:   https://github.com/Vickyjohnson2004/Hotel-Booking
```

---

**You're all set! 🚀**

Your Hotel Booking app is now production-ready and deployed to Vercel!

For detailed information, see:

- 📘 VERCEL_DEPLOYMENT_GUIDE.md (comprehensive guide)
- ✅ PRODUCTION_CHECKLIST.md (verification checklist)

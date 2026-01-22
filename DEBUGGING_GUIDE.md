# 🔍 Quick Debugging Checklist

## 🚨 Common Issues & Fixes

### **Issue: API calls return 404 or fail to connect**

**Check 1: Verify Backend URL**

```javascript
// Open browser console and run:
console.log(import.meta.env.VITE_BACKEND_URL);
// Should show: https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app
```

**Check 2: Test Backend Health**

```bash
# Local:
curl http://localhost:5000/api/health

# Production:
curl https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/health
```

**Check 3: Look at Network Tab**

- DevTools → Network tab
- Click any API request
- Response tab → Check for CORS headers
- Headers tab → Check `origin` matches `FRONTEND_URL`

---

### **Issue: CORS Error (blocked by browser)**

**Error looks like:**

```
Access to XMLHttpRequest at 'https://hotel-booking-backend...'
from origin 'https://quickstay-8r5avvt5o...'
has been blocked by CORS policy
```

**Fix:**

1. Verify in `/Server/.env`:

   ```
   FRONTEND_URL=https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app
   ```

2. Make sure on Vercel this exact URL is set in Environment Variables

3. Check browser console for log:
   ```
   [API] GET https://hotel-booking-backend.../api/...
   ```

---

### **Issue: API responds 200 but data is empty**

**Check 1: Database Connection**

```bash
# Check MongoDB connection in Vercel logs
vercel logs --follow
```

**Check 2: API Response**

- DevTools → Network → Click request → Response tab
- Check if data is actually there

**Check 3: Check for middleware errors**

```bash
# In backend, look at console logs
npm run server
```

---

### **Issue: Local development works, production doesn't**

**Most Common Cause:** Different environment variables

**Fix Checklist:**

- [ ] Vercel backend has `FRONTEND_URL` set to production frontend URL
- [ ] Vercel frontend has `VITE_BACKEND_URL` set to production backend URL
- [ ] Database connection string matches between local and Vercel
- [ ] All secrets (JWT, email, Cloudinary) are the same on Vercel

**Compare:**

```bash
# Local
echo $FRONTEND_URL
echo $MONGODB_URL

# Vercel (check dashboard)
# Settings → Environment Variables
```

---

### **Issue: Stuck on loading screen**

**Step 1:** Check Network tab (DevTools)

- Are API requests being made?
- What's the response status?

**Step 2:** Check Console tab

- Any red errors?
- Look for: `[API]` logs to see URLs being called

**Step 3:** Verify VITE_BACKEND_URL

```javascript
console.log(import.meta.env.VITE_BACKEND_URL);
```

**Step 4:** Test endpoint directly

```bash
curl https://your-backend-url/api/health
```

---

## 🧪 Test Commands

### **Backend Health**

```bash
# Production
curl -X GET https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/health

# Local
curl -X GET http://localhost:5000/api/health
```

### **Search Hotels**

```bash
# Production
curl -X GET "https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/search?destination=New%20York&checkIn=2025-02-01&checkOut=2025-02-05"

# Local
curl -X GET "http://localhost:5000/api/search?destination=New%20York&checkIn=2025-02-01&checkOut=2025-02-05"
```

### **Get All Hotels**

```bash
# Production
curl -X GET https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app/api/hotels

# Local
curl -X GET http://localhost:5000/api/hotels
```

---

## 📊 Environment Variables Reference

| Variable                    | Local Value             | Production Value                                                              |
| --------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `VITE_BACKEND_URL` (Client) | `http://localhost:5000` | `https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app` |
| `FRONTEND_URL` (Server)     | `http://localhost:5173` | `https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app`             |
| `NODE_ENV`                  | `development`           | `production`                                                                  |
| `MONGODB_URL`               | Same                    | Same                                                                          |
| `CLOUDINARY_URL`            | Same                    | Same                                                                          |

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files (check `.gitignore`)
- [ ] Rotate secrets monthly
- [ ] Don't expose API keys in client code
- [ ] Use HTTPS only in production
- [ ] Enable CORS only for your domain
- [ ] Monitor Vercel logs for errors

---

## 📞 If Still Having Issues

1. **Check Vercel Logs:**

   ```bash
   vercel logs --follow
   ```

2. **Restart Vercel Deployment:**
   - Vercel Dashboard → Project → Redeploy

3. **Clear Browser Cache:**
   - DevTools → Settings → "Disable cache (while DevTools is open)"
   - Or use Ctrl+Shift+Delete

4. **Verify All URLs:**
   ```bash
   # These must match your Vercel project URLs
   echo "Backend: https://hotel-booking-backend-a6xdu2e0e-victor-johnsons-projects.vercel.app"
   echo "Frontend: https://quickstay-8r5avvt5o-victor-johnsons-projects.vercel.app"
   ```

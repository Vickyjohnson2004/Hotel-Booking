# 🔧 Fix MongoDB Connection Timeout on Vercel

## Problem

```
Operation `testimonials.find()` buffering timed out after 10000ms
```

This means **Vercel cannot reach MongoDB Atlas**.

---

## Root Cause: IP Whitelist ❌

Vercel's IP addresses are **not whitelisted** in MongoDB Atlas. MongoDB is blocking all connection attempts from Vercel.

---

## Solution: Whitelist Vercel IPs

### Quick Fix (Recommended for Testing)

1. **Open [MongoDB Atlas](https://account.mongodb.com/account/login)**
2. **Go to your cluster dashboard**
3. **Click "Network Access"** in the left sidebar
4. **Click "ADD IP ADDRESS"**
5. **Select "Allow Access from Anywhere"**
   - Enter: `0.0.0.0/0`
   - Click "Confirm"

⚠️ **This allows ANY IP to connect. For production, use specific Vercel IPs below.**

---

## Production Fix (Secure)

### Get Vercel IP Ranges

Vercel uses multiple IP ranges. Add these in MongoDB Atlas Network Access:

```
76.223.48.0/20
199.127.228.0/22
```

Or check current Vercel IPs at: https://vercel.com/docs/concepts/edge-network/regions-and-providers

### Steps

1. MongoDB Atlas → Network Access
2. Click "ADD IP ADDRESS" (repeat for each IP range)
3. Add each IP/range:
   - `76.223.48.0/20`
   - `199.127.228.0/22`
4. Click "Confirm"

---

## Verify the Fix

1. **Wait 5 minutes** for MongoDB to update the whitelist
2. **Redeploy on Vercel** (manual redeploy or wait for auto-deploy)
3. **Test the endpoint:**
   ```
   https://your-backend.vercel.app/api/testimonials
   ```

Expected response:

```json
{
  "status": "success",
  "results": 0,
  "data": []
}
```

---

## Check MongoDB Atlas Whitelist

**To verify your whitelist is set:**

1. MongoDB Atlas → Cluster → Network Access
2. You should see an entry like:
   - `0.0.0.0/0` (Allow All)
   - OR specific Vercel IPs

3. If you see your previous IP, that's your local machine - that's OK too

---

## If Still Not Working

### Check Connection String

1. Go to MongoDB Atlas → Clusters
2. Click "Connect"
3. Click "Drivers"
4. Copy the connection string
5. Verify it in Vercel: Settings → Environment Variables → Check `MONGODB_URL`

**Format should be:**

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Check Vercel Deployment

1. Go to Vercel Dashboard → Backend Project → Deployments
2. Look for deployment with message: "Increase MongoDB connection timeout..."
3. If it shows "❌ Failed", click to see error logs
4. If it shows "✅ Success", wait 2 minutes then test

### Force Redeploy

```bash
cd c:/Users/hp/Desktop/hotel_booking
git commit --allow-empty -m "Force redeploy"
git push origin main
```

Then wait 2 minutes for Vercel to redeploy.

---

## Troubleshooting Commands

### Test MongoDB Connection Locally

```bash
cd c:/Users/hp/Desktop/hotel_booking/Server
npm run server
```

Test this URL in your browser:

```
http://localhost:5000/api/testimonials
```

If it works locally, the issue is **100% the MongoDB IP whitelist on Vercel**.

### Check Vercel Logs

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View backend logs
vercel logs your-backend-project-name --follow

# Look for:
# ✅ "MongoDB connected successfully"
# OR
# ❌ "MongoDB connection failed"
```

---

## Summary

| Check                      | Status | Next Step    |
| -------------------------- | ------ | ------------ |
| Code deployed to GitHub    | ✅     | Check        |
| Backend deployed to Vercel | ✅     | Verify       |
| MongoDB IP whitelisted     | ❓     | **FIX THIS** |
| MONGODB_URL in Vercel env  | ✅     | Check        |

**The issue is #3: MongoDB IP Whitelist**

---

## Do This Right Now

1. Go to MongoDB Atlas
2. Click "Network Access"
3. Add `0.0.0.0/0`
4. Wait 5 minutes
5. Redeploy on Vercel
6. Test endpoint again

It should work! 🎉

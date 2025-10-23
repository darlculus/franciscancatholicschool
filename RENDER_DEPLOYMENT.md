# Deploy to Render - Quick Guide

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

## Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `franciscancatholicschool`
5. Use these settings:
   - **Name:** `franciscan-school`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
   - **Environment Variables:**
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = (generate a random string like `franciscan_jwt_secret_2025_xyz123`)

## Step 3: Test Your Deployment
1. Wait for deployment to complete
2. Visit your Render URL (e.g., `https://franciscan-school.onrender.com`)
3. Go to `/portal.html`
4. Login with:
   - **Username:** `bursar`
   - **Password:** `bursar123`

## Step 4: Update Your Domain (Optional)
1. In Render dashboard, go to Settings → Custom Domains
2. Add `franciscancnps.org`
3. Update your DNS records as instructed

## Credentials
- **Bursar:** username: `bursar`, password: `bursar123`
- **Admin:** username: `admin`, password: `admin123`

## Important Notes
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Upgrade to paid plan for production use
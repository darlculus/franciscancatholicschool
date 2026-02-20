# 🚀 Deploy to Render.com (FREE - No Credit Card Needed)

## Why Render.com?
- ✅ FREE forever plan
- ✅ No credit card required
- ✅ Runs 24/7 (even when your laptop is off)
- ✅ Easy setup (5 minutes)
- ✅ Automatic HTTPS

## Step-by-Step Deployment

### Step 1: Push Code to GitHub
1. Go to https://github.com
2. Click "New Repository"
3. Name it: `franciscan-school`
4. Click "Create Repository"
5. In your Command Prompt, run:
```bash
cd C:\Users\darlw\Documents\CODE\franciscancatholicschool
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/franciscan-school.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Connect your `franciscan-school` repository
6. Fill in:
   - **Name**: franciscan-school
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
7. Click "Create Web Service"

### Step 3: Update Your Website URLs
After deployment, Render will give you a URL like:
`https://franciscan-school.onrender.com`

Update this in your `api.js` file:
```javascript
const API_BASE_URL = 'https://franciscan-school.onrender.com/api';
```

## Done! 🎉
Your server now runs 24/7 in the cloud, even when your laptop is off!

## Important Notes
- Free plan sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- For $7/month, you can upgrade to keep it always awake

## Alternative: Use Your Current Hosting
If your website is already hosted somewhere (like Hostinger, Namecheap, etc.), 
you can deploy the Node.js server there instead. Contact your hosting provider 
to ask if they support Node.js applications.

# 🚀 Deploy to Vercel (Your Current Host)

## Quick Deploy (3 Steps)

### Step 1: Install Vercel CLI
In Command Prompt:
```
npm install -g vercel
```

### Step 2: Login to Vercel
```
vercel login
```
Follow the prompts to login with your Vercel account.

### Step 3: Deploy
```
cd C:\Users\darlw\Documents\CODE\franciscancatholicschool
vercel --prod
```

That's it! Your backend is now live 24/7!

---

## OR: Deploy via GitHub (Easier)

### Step 1: Push to GitHub
1. Go to https://github.com/new
2. Create a new repository
3. In Command Prompt:
```
cd C:\Users\darlw\Documents\CODE\franciscancatholicschool
git init
git add .
git commit -m "Add backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"

Done! Vercel will automatically deploy your site with the backend.

---

## Test After Deployment

1. Go to your live website
2. Try logging in with: bursar / bursar123
3. Change password in Settings
4. Logout and login with new password

Everything should work now!

---

## Important Notes

- The database resets on each deployment (Vercel limitation)
- For permanent database, use a service like:
  - **Supabase** (free PostgreSQL)
  - **PlanetScale** (free MySQL)
  - **MongoDB Atlas** (free MongoDB)

For now, the current setup works for testing and light use.

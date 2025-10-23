# Franciscan Catholic School - Deployment Guide

## Current Credentials

### Bursar Login
- **Username:** `bursar`
- **Password:** `bursar123`

### Admin Login  
- **Username:** `admin`
- **Password:** `admin123`

## Local Testing

1. Open terminal in the project root directory
2. Run: `npm start`
3. Visit: `http://localhost:3000`
4. Go to Portal and login with the credentials above

## Production Deployment

### For Web Hosting (like cPanel, Hostinger, etc.)

1. **Upload all files** to your web hosting public folder
2. **Install Node.js** on your hosting (if supported)
3. **Run the server** using: `npm start`
4. **Update DNS/Domain** to point to your server

### For Vercel/Netlify Deployment

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel/Netlify**
3. **Set build command:** `npm install`
4. **Set start command:** `npm start`
5. **Deploy**

### For Traditional Web Hosting (without Node.js support)

If your hosting doesn't support Node.js, you'll need to:

1. **Use a different hosting service** that supports Node.js (like Heroku, Railway, Render)
2. **Or modify the authentication** to use PHP/MySQL instead

## Important Notes

- The server must be running for the bursar login to work
- Change the default passwords before going live
- Consider using environment variables for sensitive data
- Set up proper database storage for production use

## Troubleshooting

If login doesn't work:
1. Check if the server is running
2. Check browser console for errors
3. Verify the API_BASE_URL in `assets/js/api.js`
4. Ensure CORS is properly configured
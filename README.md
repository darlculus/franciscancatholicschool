# Franciscan Catholic School Management System

## Backend Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   Open Command Prompt in the project folder and run:
   ```
   npm install
   ```

2. **Start the Server**
   ```
   npm start
   ```
   
   The server will start on `http://localhost:3000`

3. **Default Login Credentials**
   - **Username**: `bursar`
   - **Password**: `bursar123`

### Features

- **Secure Authentication**: Passwords are hashed using bcrypt
- **SQLite Database**: Lightweight database stored in `users.db` file
- **API Endpoints**:
  - `POST /api/login` - User authentication
  - `POST /api/change-password` - Change user password
  - `POST /api/update-profile` - Update user profile

### Database

The system automatically creates a SQLite database (`users.db`) with a default bursar account on first run.

### Security

- All passwords are hashed using bcrypt (10 salt rounds)
- CORS enabled for frontend communication
- Password validation (minimum 6 characters)

### Changing Password

1. Log in to the bursar dashboard
2. Go to Settings → Security
3. Enter current password and new password
4. Password is securely updated in the database

### Production Deployment

For production, consider:
- Using environment variables for sensitive data
- Implementing JWT tokens for session management
- Using PostgreSQL or MySQL instead of SQLite
- Adding HTTPS/SSL certificates
- Implementing rate limiting
- Adding logging and monitoring

### Troubleshooting

**Server won't start:**
- Make sure port 3000 is not in use
- Check that all dependencies are installed (`npm install`)

**Can't log in:**
- Verify the server is running
- Check browser console for errors
- Ensure `api.js` is loaded before other scripts

**Password change doesn't work:**
- Verify current password is correct
- Check server console for error messages
- Ensure new password is at least 6 characters

# Franciscan Catholic School Portal Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

### 3. Default Login Credentials

**Bursar Account:**
- Username: `bursar`
- Password: `bursar123`

**Admin Account:**
- Username: `admin`
- Password: `admin123`

### 4. API Endpoints

#### Authentication
- `POST /api/login` - User login
  - Body: `{ username, password, role }`
  - Returns: `{ success, token, user }`

#### Payments (Bursar only)
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Add new payment
  - Body: `{ studentName, studentClass, amount, purpose, paymentMode, paymentDate, notes }`

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### 5. Data Storage

The backend uses JSON files for data storage (located in `backend/data/`):
- `users.json` - User accounts
- `payments.json` - Payment records
- `receipts.json` - Generated receipts

**Note:** In production, replace with a proper database like MongoDB or PostgreSQL.

### 6. Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- CORS enabled for frontend integration

### 7. Deployment

For production deployment:
1. Set environment variables:
   - `PORT` - Server port (default: 3000)
   - `JWT_SECRET` - JWT signing secret
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx)
4. Use HTTPS in production
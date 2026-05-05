# RationTrack Server

Node.js + Express backend with MongoDB for the RationTrack application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Seed database
node seed.js
```

## 📦 Dependencies

### Core
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Authentication
- **JWT** - Token-based auth
- **Bcrypt.js** - Password hashing

### Middleware
- **CORS** - Cross-origin requests
- **Helmet** - Security headers
- **Morgan** - HTTP logging

## 🗂 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Route handlers
│   ├── auth.controller.js
│   ├── beneficiary.controller.js
│   ├── conflict.controller.js
│   ├── shop.controller.js
│   ├── sync.controller.js
│   ├── transaction.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.js           # JWT verification
│   ├── errorHandler.js   # Error handling
│   ├── roleCheck.js      # Role-based access
│   └── validate.js       # Request validation
├── models/               # Mongoose schemas
│   ├── Beneficiary.js
│   ├── Conflict.js
│   ├── Shop.js
│   ├── Transaction.js
│   └── User.js
├── routes/               # API routes
│   ├── auth.routes.js
│   ├── beneficiary.routes.js
│   ├── conflict.routes.js
│   ├── shop.routes.js
│   ├── sync.routes.js
│   ├── transaction.routes.js
│   └── user.routes.js
├── services/             # Business logic
│   ├── conflictDetection.js
│   └── syncProcessor.js
├── .env                  # Environment variables
├── seed.js               # Database seeding
└── server.js             # Entry point
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/rationtrack

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

## 🗄 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'officer' | 'supervisor' | 'admin',
  shopId: ObjectId (ref: Shop),
  isActive: Boolean,
  lastLoginAt: Date
}
```

### Shop
```javascript
{
  shopId: String (unique),
  name: String,
  location: {
    address: String,
    district: String,
    state: String,
    pincode: String
  },
  assignedOfficer: ObjectId (ref: User)
}
```

### Beneficiary
```javascript
{
  cardId: String (unique),
  name: String,
  category: 'APL' | 'BPL' | 'AAY',
  monthlyQuota: {
    rice: Number,
    wheat: Number,
    sugar: Number,
    kerosene: Number
  },
  assignedShopId: String,
  isActive: Boolean
}
```

### Transaction
```javascript
{
  txnId: String (unique),
  cardId: String,
  beneficiaryName: String,
  shopId: String,
  month: String (YYYY-MM),
  itemsDistributed: Object,
  status: 'pending_sync' | 'synced' | 'conflict' | 'rejected',
  isOfflineRecord: Boolean,
  conflictId: String,
  recordedAt: Date,
  syncedAt: Date
}
```

### Conflict
```javascript
{
  conflictId: String (unique),
  cardId: String,
  beneficiaryName: String,
  month: String,
  transactions: [ObjectId] (ref: Transaction),
  shops: [String],
  status: 'pending' | 'resolved' | 'flagged',
  validTransactionId: ObjectId,
  fraudTransactionId: ObjectId,
  resolvedBy: ObjectId (ref: User),
  resolvedAt: Date,
  resolutionNote: String
}
```

## 🔐 Authentication

### JWT Token Flow

1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token (7-day expiry)
4. Client stores token in localStorage
5. Client sends token in Authorization header
6. Server verifies token on protected routes

### Password Security

- Passwords hashed using bcrypt (10 salt rounds)
- Pre-save hook automatically hashes passwords
- Passwords never returned in API responses

## 🛡 Authorization

### Role-Based Access Control

| Route | Officer | Supervisor | Admin |
|-------|---------|------------|-------|
| GET /beneficiaries | ✅ | ✅ | ✅ |
| POST /beneficiaries | ❌ | ❌ | ✅ |
| GET /conflicts | ❌ | ✅ | ✅ |
| PUT /conflicts/resolve | ❌ | ✅ | ✅ |
| POST /users | ❌ | ❌ | ✅ |
| POST /transactions | ✅ | ✅ | ✅ |

## 🔄 Sync Process

### Push Sync (Officer → Server)

```javascript
POST /api/sync/push
{
  shopId: "SHOP-MH-001",
  transactions: [
    {
      txnId: "RC-MH-001-SHOP-MH-001-2026-05",
      cardId: "RC-MH-001",
      // ... transaction data
    }
  ]
}

Response:
{
  success: true,
  results: [
    {
      txnId: "...",
      result: "success" | "duplicate" | "conflict" | "error",
      conflictId: "..." // if conflict
    }
  ]
}
```

### Pull Sync (Server → Officer)

```javascript
GET /api/sync/pull/:shopId

Response:
{
  success: true,
  data: {
    beneficiaries: [
      // Array of beneficiaries for this shop
    ]
  }
}
```

## 🚨 Conflict Detection

### Algorithm

```javascript
// Conflict occurs when:
1. Same cardId
2. Different shopId
3. Same month
4. Both transactions exist

// Example:
Transaction A: RC-MH-001 at SHOP-MH-001 in 2026-05
Transaction B: RC-MH-001 at SHOP-MH-002 in 2026-05
→ CONFLICT DETECTED
```

### Resolution

```javascript
PUT /api/conflicts/:conflictId/resolve
{
  validTransactionId: "...",
  fraudTransactionId: "...",
  resolutionNote: "Verified with beneficiary"
}

// Updates:
- Valid transaction: status = 'synced'
- Fraud transaction: status = 'rejected'
- Conflict: status = 'resolved'
```

## 🗃 Database Seeding

```bash
node seed.js
```

Creates:
- 4 users (1 admin, 1 supervisor, 2 officers)
- 2 shops
- 30 beneficiaries (10 APL, 10 BPL, 10 AAY)
- 10 sample transactions
- 1 test conflict

## 🧪 Testing

### Manual API Testing

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"1@gmail.com","password":"123"}'

# Get beneficiaries (with token)
curl http://localhost:5000/api/beneficiaries \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman/Insomnia

Import the API collection (if available) or manually test endpoints.

## 🚀 Deployment

### Environment Setup

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rationtrack
JWT_SECRET=production_secret_key_very_secure
CLIENT_URL=https://your-frontend-domain.com
```

### Deployment Platforms

**Heroku:**
```bash
heroku create rationtrack-api
git push heroku main
```

**Railway:**
```bash
railway up
```

**AWS EC2:**
```bash
# Install Node.js, MongoDB
# Clone repo
# Set environment variables
# Start with PM2
pm2 start server.js --name rationtrack
```

## 📊 Monitoring

### Logs

```bash
# View logs
tail -f logs/app.log

# Or with PM2
pm2 logs rationtrack
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

## 🔒 Security Best Practices

1. ✅ Use HTTPS in production
2. ✅ Set strong JWT_SECRET
3. ✅ Enable CORS only for trusted origins
4. ✅ Use Helmet for security headers
5. ✅ Validate all inputs
6. ✅ Rate limit API endpoints
7. ✅ Keep dependencies updated
8. ✅ Use environment variables for secrets

## 📄 License

MIT

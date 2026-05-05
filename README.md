# 🌾 RationTrack - Public Distribution System Management

A comprehensive **offline-first** web application for managing government ration distribution across fair price shops. Built to prevent fraud, detect duplicate collections, and enable seamless offline operations in remote areas.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 🔐 **Role-Based Access Control** - Admin, Supervisor, and Officer roles
- 📱 **Offline-First Architecture** - Works without internet using IndexedDB
- 🔄 **Automatic Sync** - Background synchronization every 5 minutes
- 🚨 **Fraud Detection** - Identifies duplicate collections across shops
- ⚖️ **Conflict Resolution** - Supervisor workflow for resolving duplicates
- 📊 **Real-Time Analytics** - Dashboard with distribution statistics
- 🎯 **Quota Management** - Track monthly quotas per beneficiary category

### User Features
- **Officers**: Record distributions offline, view beneficiary roster, transaction history
- **Supervisors**: Monitor multiple shops, resolve conflicts, view analytics
- **Admins**: Full CRUD operations for users, shops, and beneficiaries

### Technical Features
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ PWA-ready with offline capabilities
- ✅ Deterministic transaction IDs
- ✅ Retry logic with exponential backoff
- ✅ Batch processing for sync operations
- ✅ Real-time conflict detection

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **TanStack React Query** - Server state management
- **Dexie.js** - IndexedDB wrapper for offline storage
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

---

## 🏗 Architecture

### Offline-First Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     OFFICER WORKFLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Login (Online) → Sync beneficiaries to IndexedDB        │
│  2. Go Offline → Record distributions locally                │
│  3. Transactions saved to pendingSync queue                  │
│  4. Come Online → Auto-sync pushes pending transactions      │
│  5. Server detects conflicts → Updates transaction status    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CONFLICT DETECTION                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Same Card ID + Different Shops + Same Month = CONFLICT     │
│                                                               │
│  Shop A: RC-MH-021 collected 10kg rice                      │
│  Shop B: RC-MH-021 collected 10kg rice  ⚠️ DUPLICATE!       │
│                                                               │
│  → Supervisor reviews both transactions                      │
│  → Marks one as valid, other as fraudulent                   │
│  → System updates statuses accordingly                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Database Models

```
User
├── name, email, password (hashed)
├── role: officer | supervisor | admin
└── shopId (reference to Shop)

Shop
├── shopId (unique identifier)
├── name, location
└── assignedOfficer (reference to User)

Beneficiary
├── cardId (unique ration card ID)
├── name, category (APL/BPL/AAY)
├── monthlyQuota: { rice, wheat, sugar, kerosene }
└── assignedShopId

Transaction
├── txnId (deterministic: cardId-shopId-month)
├── cardId, shopId, month
├── itemsDistributed
├── status: pending_sync | synced | conflict | rejected
└── conflictId (if conflict detected)

Conflict
├── conflictId
├── cardId, month
├── transactions[] (array of conflicting transactions)
├── status: pending | resolved | flagged
└── resolution details
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 16.0.0
- **MongoDB** >= 5.0
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rationtrack.git
cd rationtrack
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Create `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/rationtrack

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS (optional)
CLIENT_URL=http://localhost:5173
```

4. **Start MongoDB**

```bash
# Using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Seed the database**

```bash
cd server
node seed.js
```

This creates:
- 4 users (1 admin, 1 supervisor, 2 officers)
- 2 shops
- 30 beneficiaries
- Sample transactions
- 1 test conflict

6. **Start the application**

```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
cd client
npm run dev
```

7. **Access the application**

Open your browser and navigate to: `http://localhost:5173`

---

## 🔑 Default Login Credentials

| Role | Email | Password | Shop |
|------|-------|----------|------|
| **Admin** | 1@gmail.com | 123 | - |
| **Supervisor** | 2@gmail.com | 123 | - |
| **Officer** | 3@gmail.com | 123 | SHOP-MH-001 |
| **Officer** | 4@gmail.com | 123 | SHOP-MH-002 |

---

## 📁 Project Structure

```
rationtrack/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── common/         # Shared components
│   │   │   ├── officer/        # Officer-specific components
│   │   │   └── supervisor/     # Supervisor-specific components
│   │   ├── context/            # React Context providers
│   │   ├── db/                 # IndexedDB configuration (Dexie)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   │   ├── admin/
│   │   │   ├── officer/
│   │   │   └── supervisor/
│   │   ├── services/           # API and sync services
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   ├── Layout.jsx          # Layout wrapper
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js application
│   ├── config/                 # Configuration files
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── auth.controller.js
│   │   ├── beneficiary.controller.js
│   │   ├── conflict.controller.js
│   │   ├── shop.controller.js
│   │   ├── sync.controller.js
│   │   ├── transaction.controller.js
│   │   └── user.controller.js
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   ├── roleCheck.js       # Role-based access
│   │   └── validate.js        # Request validation
│   ├── models/                 # Mongoose models
│   │   ├── Beneficiary.js
│   │   ├── Conflict.js
│   │   ├── Shop.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── beneficiary.routes.js
│   │   ├── conflict.routes.js
│   │   ├── shop.routes.js
│   │   ├── sync.routes.js
│   │   ├── transaction.routes.js
│   │   └── user.routes.js
│   ├── services/               # Business logic
│   │   ├── conflictDetection.js
│   │   └── syncProcessor.js
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── seed.js                 # Database seeding script
│   └── server.js               # Entry point
│
├── .gitignore
└── README.md
```

---

## 👥 User Roles

### 🔧 Officer (Field Worker)
**Access:** `/officer/*`

**Capabilities:**
- ✅ Record ration distributions (online/offline)
- ✅ View assigned beneficiary roster
- ✅ View transaction history
- ✅ Sync pending transactions
- ❌ Cannot modify beneficiaries
- ❌ Cannot resolve conflicts

**Typical Workflow:**
1. Login → Auto-sync beneficiaries
2. Go to shop (may be offline)
3. Record distributions for beneficiaries
4. Transactions saved locally
5. When online, auto-sync pushes to server

---

### 👁️ Supervisor (Regional Manager)
**Access:** `/supervisor/*`

**Capabilities:**
- ✅ Monitor multiple shops in jurisdiction
- ✅ View all transactions across shops
- ✅ Resolve duplicate collection conflicts
- ✅ View analytics and reports
- ✅ Flag suspicious activities
- ❌ Cannot modify beneficiaries or shops

**Typical Workflow:**
1. Login → View dashboard
2. Check conflict alerts
3. Review conflicting transactions
4. Select valid transaction
5. Mark fraudulent transaction
6. Add resolution notes

---

### 👑 Admin (System Administrator)
**Access:** `/admin/*`

**Capabilities:**
- ✅ Full CRUD for users, shops, beneficiaries
- ✅ Bulk import beneficiaries
- ✅ Assign officers to shops
- ✅ View system-wide reports
- ✅ Manage user roles
- ✅ Access all supervisor features

**Typical Workflow:**
1. Login → View admin dashboard
2. Manage users (create officers, supervisors)
3. Manage shops (create, assign officers)
4. Manage beneficiaries (add, edit, bulk import)
5. Generate reports

---

## 🔌 API Documentation

### Authentication

#### POST `/api/auth/login`
Login user and receive JWT token

**Request:**
```json
{
  "email": "1@gmail.com",
  "password": "123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "System Admin",
      "email": "1@gmail.com",
      "role": "admin"
    }
  }
}
```

#### GET `/api/auth/me`
Get current user (requires authentication)

---

### Beneficiaries

#### GET `/api/beneficiaries`
Get all beneficiaries

#### GET `/api/beneficiaries/:cardId`
Get single beneficiary

#### POST `/api/beneficiaries` (Admin only)
Create new beneficiary

**Request:**
```json
{
  "cardId": "RC-MH-031",
  "name": "John Doe",
  "category": "BPL",
  "assignedShopId": "SHOP-MH-001",
  "monthlyQuota": {
    "rice": 10,
    "wheat": 15,
    "sugar": 0.5,
    "kerosene": 0.5
  },
  "isActive": true
}
```

#### PUT `/api/beneficiaries/:cardId` (Admin only)
Update beneficiary

#### DELETE `/api/beneficiaries/:cardId` (Admin only)
Delete beneficiary

---

### Transactions

#### GET `/api/transactions`
Get all transactions (with filters)

**Query Parameters:**
- `shopId` - Filter by shop
- `month` - Filter by month (YYYY-MM)
- `status` - Filter by status

#### POST `/api/transactions`
Create new transaction

**Request:**
```json
{
  "txnId": "RC-MH-001-SHOP-MH-001-2026-05",
  "cardId": "RC-MH-001",
  "beneficiaryName": "John Doe",
  "shopId": "SHOP-MH-001",
  "month": "2026-05",
  "itemsDistributed": {
    "rice": 10,
    "wheat": 15,
    "sugar": 0.5,
    "kerosene": 0.5
  },
  "isOfflineRecord": false
}
```

#### GET `/api/transactions/stats`
Get transaction statistics

---

### Sync

#### POST `/api/sync/push`
Push pending transactions from officer device

**Request:**
```json
{
  "shopId": "SHOP-MH-001",
  "transactions": [
    {
      "txnId": "...",
      "cardId": "...",
      // ... transaction data
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "txnId": "...",
      "result": "success" | "duplicate" | "conflict" | "error",
      "conflictId": "..." // if conflict detected
    }
  ]
}
```

#### GET `/api/sync/pull/:shopId`
Pull beneficiary updates for shop

**Response:**
```json
{
  "success": true,
  "data": {
    "beneficiaries": [
      // ... array of beneficiaries
    ]
  }
}
```

---

### Conflicts

#### GET `/api/conflicts`
Get all conflicts

**Query Parameters:**
- `status` - Filter by status (pending/resolved/flagged)

#### GET `/api/conflicts/stats`
Get conflict statistics

#### PUT `/api/conflicts/:conflictId/resolve` (Supervisor/Admin only)
Resolve conflict

**Request:**
```json
{
  "validTransactionId": "...",
  "fraudTransactionId": "...",
  "resolutionNote": "Verified with beneficiary, Shop A is valid"
}
```

---

## 🧪 Testing

### Testing Conflict Detection

#### Scenario 1: Same Officer, Same Card (Offline Detection)
```
1. Login as Officer (3@gmail.com)
2. Sync beneficiaries
3. Go offline
4. Record distribution for RC-MH-001
5. Try recording again for RC-MH-001
6. ❌ Should be blocked by local duplicate check
```

#### Scenario 2: Different Shops, Same Card (Server Detection)
```
Browser 1 (Officer at Shop 1):
1. Login as 3@gmail.com
2. Record distribution for RC-MH-021
3. Sync

Browser 2 (Officer at Shop 2):
1. Login as 4@gmail.com
2. Record distribution for RC-MH-021 (same card!)
3. Sync
4. ⚠️ Server detects conflict

Supervisor:
1. Login as 2@gmail.com
2. Go to /supervisor/conflicts
3. See conflict with both transactions
4. Resolve by selecting valid transaction
```

### Testing Offline Mode

```
1. Login as Officer (online)
2. Wait for sync to complete
3. Open DevTools → Network tab
4. Set to "Offline" mode
5. Record distributions
6. Check IndexedDB (Application tab)
7. Go back online
8. Transactions auto-sync
```

---

## 🚢 Deployment

### Backend Deployment (Node.js)

**Recommended Platforms:**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

**Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rationtrack
JWT_SECRET=your_production_secret_key
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend Deployment (React)

**Recommended Platforms:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Build Command:**
```bash
cd client
npm run build
```

**Environment Variables:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Database (MongoDB)

**Recommended:**
- MongoDB Atlas (Free tier available)
- AWS DocumentDB
- Self-hosted MongoDB

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built for the Public Distribution System (PDS) in India
- Designed to work in low-connectivity rural areas
- Inspired by the need for transparent and fraud-free ration distribution

---

## 📞 Support

For issues, questions, or contributions:
- 📧 Email: support@rationtrack.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/rationtrack/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/rationtrack/wiki)

---

**Made with ❤️ for transparent governance**

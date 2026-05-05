# RationTrack Client

React-based frontend application with offline-first capabilities using IndexedDB.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

### Core
- **React 18** - UI library
- **React Router v6** - Routing
- **Vite** - Build tool

### State Management
- **TanStack React Query** - Server state
- **React Context** - Global state

### Offline Storage
- **Dexie.js** - IndexedDB wrapper

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### HTTP Client
- **Axios** - API requests

## 🗂 Project Structure

```
src/
├── components/          # Reusable components
│   ├── admin/          # Admin components (forms, modals)
│   ├── common/         # Shared components (Navbar, Sidebar)
│   ├── officer/        # Officer components
│   └── supervisor/     # Supervisor components
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── SyncContext.jsx
├── db/                 # IndexedDB configuration
│   └── localDB.js
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useSync.js
│   ├── useOnlineStatus.js
│   └── useDistributionCheck.js
├── pages/              # Page components
│   ├── admin/
│   ├── officer/
│   ├── supervisor/
│   └── Login.jsx
├── services/           # API services
│   ├── api.js
│   ├── syncService.js
│   └── distributionService.js
├── utils/              # Utility functions
│   ├── constants.js
│   ├── formatters.js
│   └── generateTxnId.js
├── App.jsx             # Main app
├── Layout.jsx          # Layout wrapper
└── main.jsx            # Entry point
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Tailwind Configuration

See `tailwind.config.js` for custom theme configuration.

## 📱 Offline Features

### IndexedDB Tables

- **beneficiaries** - Synced beneficiary roster
- **transactions** - All distribution records
- **pendingSync** - Queue of unsynced transactions
- **syncLog** - Sync operation history
- **appConfig** - Device configuration (shopId, officerId, lastSyncAt)

### Sync Strategy

1. **Auto-sync** every 5 minutes when online
2. **Manual sync** via "Sync Now" button
3. **Retry logic** with max 5 attempts
4. **Batch processing** (50 transactions per sync)

## 🎨 Responsive Design

Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Test offline mode
# 1. Open DevTools → Network tab
# 2. Set to "Offline"
# 3. Test functionality
```

## 📦 Build

```bash
# Production build
npm run build

# Output: dist/
```

## 🚀 Deployment

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Manual
```bash
npm run build
# Upload dist/ folder to your hosting
```

## 📄 License

MIT

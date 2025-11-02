# Struktur Proyek Aplikasi Toko

## 📁 Struktur Direktori

```
store-app/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   └── Layout.tsx   # Main layout dengan sidebar & header
│   │
│   ├── pages/           # Page components
│   │   ├── Login.tsx    # Halaman login dengan keamanan berlapis
│   │   ├── Dashboard.tsx # Dashboard utama dengan statistik
│   │   ├── Inventory.tsx # Manajemen stok barang (3 tabs)
│   │   ├── Sales.tsx    # Manajemen penjualan & laporan
│   │   └── Settings.tsx # Pengaturan toko, app, dan user
│   │
│   ├── store/           # State management
│   │   └── useStore.ts  # Zustand store dengan persistence
│   │
│   ├── types/           # TypeScript types
│   │   └── index.ts     # Semua interface & types
│   │
│   ├── utils/           # Utility functions
│   │   └── pdfExport.ts # PDF generation & print functions
│   │
│   ├── i18n/            # Internationalization
│   │   └── index.ts     # i18next config (ID & EN)
│   │
│   ├── App.tsx          # Main app dengan routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
│
├── .env.example         # Environment variables template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind CSS config
├── vite.config.ts       # Vite config
├── README.md            # Dokumentasi utama
├── USAGE.md             # Panduan penggunaan
└── PROJECT_STRUCTURE.md # Dokumentasi struktur (file ini)
```

## 🗂️ Detail Komponen

### Components

#### Layout.tsx
- **Fungsi**: Wrapper untuk semua halaman setelah login
- **Fitur**:
  - Header dengan logo toko & info user
  - Sidebar dengan menu navigasi
  - Toggle dark/light mode
  - Logout button
  - Footer dengan copyright
- **Props**: `{ children: ReactNode }`

### Pages

#### Login.tsx
- **Route**: `/login`
- **Fitur**:
  - Form login dengan validasi
  - Show/hide password
  - Login attempts tracking
  - Account lockout (5 menit setelah 3x gagal)
  - Email verification (setelah 10x gagal)
  - Kustomisasi tampilan (logo, pesan, gambar)
- **State Management**:
  - username, password (local)
  - showPassword (local)
  - showEmailVerification (local)
  - login, settings (store)

#### Dashboard.tsx
- **Route**: `/dashboard`
- **Fitur**:
  - Card statistik (Total produk, stok, penjualan, profit)
  - Ringkasan bulanan
  - Alert stok menipis
  - Real-time calculation
- **Data Source**:
  - products, sales, settings (store)
  - Calculations: date-fns untuk filtering

#### Inventory.tsx
- **Route**: `/inventory`
- **Tabs**:
  1. **Barang Tersedia**: List produk dengan CRUD
  2. **Barang Masuk**: Form & list transaksi stok masuk
  3. **Barang Keluar**: Form & list transaksi stok keluar
- **Fitur**:
  - Add/Edit/Delete produk (Owner only untuk edit/delete)
  - Input transaksi stok in/out
  - Auto calculate profit percentage
  - Export PDF & Print
  - Support decimal values
- **Permissions**:
  - Admin: Add produk & transaksi
  - Owner: All + Edit/Delete produk

#### Sales.tsx
- **Route**: `/sales`
- **View Options**:
  - Semua
  - Per tanggal (dengan date picker)
  - 1 Minggu
  - 1 Bulan
  - 1 Tahun
  - Sepanjang masa
- **Fitur**:
  - Add penjualan (auto update stok)
  - Summary cards (transaksi, revenue, profit)
  - Detail table dengan sorting by date
  - Export PDF & Print
  - Real-time calculation
- **Validations**:
  - Stok checking
  - Produk availability

#### Settings.tsx
- **Route**: `/settings`
- **Tabs**:
  1. **Pengaturan Toko** (Owner only):
     - Upload logo & gambar login
     - Info toko (nama, alamat, admin, CS, email)
  2. **Pengaturan Aplikasi** (All users):
     - Bahasa (ID/EN)
     - Mata uang (IDR, USD, EUR, MYR, SGD)
     - Zona waktu
     - Pesan & gambar login (Owner only)
  3. **Manajemen User** (Owner only):
     - Add/Edit/Delete admin
- **Permissions Enforced**:
  - Tab disabled untuk non-owner
  - Form validation by role

## 🗄️ State Management (Zustand)

### Store Structure
```typescript
interface StoreState {
  // Auth
  currentUser: User | null
  users: User[]
  loginAttempts: Record<string, LoginAttempt>

  // Products & Stock
  products: Product[]
  stockTransactions: StockTransaction[]

  // Sales
  sales: Sale[]

  // Settings
  settings: AppSettings

  // Actions...
}
```

### Persistence
- **Library**: zustand/middleware (persist)
- **Storage**: localStorage
- **Key**: `store-app-storage`
- **Persists**:
  - All state data
  - Settings
  - Users & credentials
  - Products & transactions

## 📊 Data Models

### User
```typescript
{
  id: string
  username: string
  password: string  // ⚠️ Plain text for demo only
  role: 'owner' | 'admin'
  email?: string
  createdAt: string
  createdBy?: string
}
```

### Product
```typescript
{
  id: string
  name: string
  sku: string
  unit: string  // pcs, kg, liter, box, unit
  buyPrice: number  // decimal support
  sellPrice: number  // decimal support
  profitPercentage: number  // auto calculated
  stock: number  // decimal support
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}
```

### StockTransaction
```typescript
{
  id: string
  productId: string
  productName: string
  type: 'in' | 'out'
  quantity: number  // decimal support
  buyPrice?: number
  sellPrice?: number
  date: string
  createdBy: string
  notes?: string
}
```

### Sale
```typescript
{
  id: string
  productId: string
  productName: string
  quantity: number
  buyPrice: number
  sellPrice: number
  profit: number  // auto calculated
  profitPercentage: number
  date: string
  createdBy: string
}
```

### AppSettings
```typescript
{
  storeName: string
  storeAddress: string
  storeLogo?: string  // base64 image
  storeAdmin: string
  storeCS: string
  theme: 'light' | 'dark'
  language: 'id' | 'en'
  currency: string
  timezone: string
  loginMessage: string
  loginImage?: string  // base64 image
  ownerEmail?: string
}
```

## 🔐 Authentication Flow

```
User Input Credentials
       ↓
Check User Exists
       ↓
Check Login Attempts
       ↓
   [If locked] → Show remaining time
       ↓
Check Password
       ↓
   [If wrong]
       ↓
Increment Attempts
       ↓
   [3-9 times] → Lock 5 minutes
   [10+ times] → Require email verification
       ↓
   [If correct]
       ↓
Reset Attempts
       ↓
Set Current User
       ↓
Navigate to Dashboard
```

## 📱 Routing

```
/ → redirect to /dashboard
/login → Login page (public)
/dashboard → Dashboard (protected)
/inventory → Inventory management (protected)
/sales → Sales management (protected)
/settings → Settings (protected)
```

### Route Protection
- `ProtectedRoute` component wraps protected routes
- Checks `currentUser` in store
- Redirects to `/login` if not authenticated
- Wraps children with `Layout` component

## 🎨 Theming

### Tailwind CSS Classes
```javascript
// Light mode
bg-white
text-gray-900
border-gray-300

// Dark mode
bg-gray-800
text-white
border-gray-600
```

### Theme Toggle
- State: `settings.theme`
- Toggle button in header
- Applies `dark` class to root
- Persisted in store

## 🌍 Internationalization

### Supported Languages
- **Bahasa Indonesia** (id) - default
- **English** (en)

### Translation Keys
- Located in `src/i18n/index.ts`
- Covers: auth, menu, product fields, actions, settings
- Usage: `const { t } = useTranslation()`

## 📦 Dependencies

### Core
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `typescript` ^5.6.2
- `vite` ^7.1.12

### State & Routing
- `zustand` ^5.0.2 - State management
- `react-router-dom` ^7.1.1 - Routing

### UI & Styling
- `tailwindcss` ^4.0.1 - CSS framework
- `lucide-react` ^0.468.0 - Icons
- `react-hot-toast` ^2.4.1 - Notifications

### Utilities
- `i18next` ^24.2.0 - i18n
- `react-i18next` ^16.0.3 - React bindings for i18n
- `date-fns` ^4.1.0 - Date manipulation
- `jspdf` ^2.5.2 - PDF generation
- `jspdf-autotable` ^3.8.4 - Tables for PDF

## 🔧 Build Configuration

### Vite Config
- React plugin enabled
- TypeScript support
- Fast HMR (Hot Module Replacement)
- Production build optimization

### TypeScript Config
- Strict mode enabled
- Target: ES2020
- Module: ESNext
- JSX: react-jsx

### Tailwind Config
- Dark mode: class-based
- Content: all files in src/
- Custom font: Inter

## 🚀 Scripts

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📈 Performance Optimization

### Code Splitting
- Route-based splitting via React Router
- Lazy loading untuk pages (future enhancement)

### Bundle Size
- Production build: ~195 KB (gzipped: ~61 KB)
- Tree-shaking enabled
- Minification in production

### State Management
- Zustand: Lightweight (3KB)
- No unnecessary re-renders
- Selective subscriptions

## 🔮 Future Enhancements

### Planned Features
1. **Backend Integration**
   - REST API atau GraphQL
   - Real database (PostgreSQL/MongoDB)
   - JWT authentication

2. **Email Service**
   - Real email verification
   - Password reset via email
   - Sales reports via email

3. **Google OAuth**
   - Login dengan Google (Owner only)
   - Google Cloud Platform setup

4. **Advanced Features**
   - Barcode scanner
   - Receipt printer integration
   - Multi-store support
   - Employee attendance
   - Customer management
   - Loyalty program

5. **Analytics**
   - Charts & graphs (Chart.js/Recharts)
   - Sales trends
   - Product performance
   - Forecasting

6. **Mobile App**
   - React Native version
   - Progressive Web App (PWA)

### Security Improvements
1. Password hashing (bcrypt/argon2)
2. HTTPS only
3. CSRF protection
4. Rate limiting
5. Input sanitization
6. SQL injection prevention
7. XSS protection

---

**© 2025 gilar206@hotmail.co.uk**

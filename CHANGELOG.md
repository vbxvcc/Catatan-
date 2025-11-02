# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-02

### 🎉 Initial Release

#### ✨ Features

##### Authentication & Authorization
- [x] Login system with username and password
- [x] Role-based access control (Owner and Admin)
- [x] Login attempts tracking
- [x] Account lockout after 3 failed attempts (5 minutes)
- [x] Email verification requirement after 10 failed attempts
- [x] Default credentials: xgie206/xgie206

##### Inventory Management
- [x] Product management (CRUD operations)
- [x] Stock In tracking
- [x] Stock Available view
- [x] Stock Out tracking
- [x] Automatic profit calculation
- [x] Support for multiple units (pcs, kg, liter, box, unit)
- [x] Decimal values support for prices and quantities
- [x] Owner-only edit/delete for products
- [x] Admin can add products and transactions

##### Sales Management
- [x] Sales input with automatic stock deduction
- [x] Multiple report views:
  - [x] All sales
  - [x] Sales by specific date
  - [x] Weekly sales (last 7 days)
  - [x] Monthly sales (current month)
  - [x] Yearly sales (current year)
  - [x] All-time sales
- [x] Real-time profit calculation
- [x] Transaction summary cards
- [x] Detailed sales table with sorting

##### Settings & Customization
- [x] Store settings (Owner only):
  - [x] Store logo upload
  - [x] Store name, address, admin, CS info
  - [x] Owner email for verification
  - [x] Login page customization (message and image)
- [x] App settings (All users):
  - [x] Language selection (Indonesian/English)
  - [x] Currency selection (IDR, USD, EUR, MYR, SGD)
  - [x] Timezone selection (WIB, WITA, WIT, etc.)
  - [x] Dark/Light theme toggle
- [x] User management (Owner only):
  - [x] Add admin users
  - [x] Edit admin credentials
  - [x] Delete admin users

##### Export & Reporting
- [x] PDF export for inventory reports
- [x] PDF export for sales reports
- [x] Print functionality
- [x] Professional PDF formatting with store branding
- [x] Copyright footer: © 2025 gilar206@hotmail.co.uk

##### Dashboard
- [x] Statistics cards (products, stock, daily sales, daily profit)
- [x] Monthly summary
- [x] Low stock alerts (< 10 items)
- [x] Real-time calculations

##### UI/UX
- [x] Responsive design (desktop, tablet, mobile)
- [x] Dark mode support
- [x] Toast notifications for user feedback
- [x] Modal dialogs for forms
- [x] Loading states
- [x] Form validation
- [x] Print-friendly layouts
- [x] Icon library (Lucide React)

##### Technical Features
- [x] React 18 with TypeScript
- [x] Vite build tool
- [x] Zustand state management
- [x] React Router for routing
- [x] Tailwind CSS for styling
- [x] i18next for internationalization
- [x] jsPDF for PDF generation
- [x] date-fns for date manipulation
- [x] LocalStorage persistence
- [x] ESLint for code quality

#### 📚 Documentation
- [x] README.md with comprehensive features overview
- [x] USAGE.md with detailed user guide
- [x] PROJECT_STRUCTURE.md with technical documentation
- [x] CHANGELOG.md (this file)
- [x] .env.example for environment variables template
- [x] Code comments and type definitions

#### 🔒 Security
- [x] Login attempts tracking
- [x] Account lockout mechanism
- [x] Email verification (demo implementation)
- [x] Role-based access control
- [x] Protected routes
- [x] Conditional UI elements based on permissions

### ⚠️ Known Limitations

- Password storage is plain text (demo only - needs hashing in production)
- Email verification uses dummy code (needs real email service)
- Google OAuth for owner access not implemented yet
- Data stored in localStorage (needs backend database for production)
- No backup/restore feature
- No multi-store support
- No barcode scanner integration
- No receipt printer integration

### 🔮 Future Plans

#### Version 1.1.0 (Planned)
- [ ] Password hashing (bcrypt)
- [ ] Real email service integration
- [ ] Google OAuth for owner login
- [ ] Backup/restore functionality
- [ ] Data export to Excel

#### Version 2.0.0 (Planned)
- [ ] Backend API (Node.js + Express or NestJS)
- [ ] Database integration (PostgreSQL)
- [ ] JWT authentication
- [ ] Multi-user sessions
- [ ] Real-time updates (WebSocket)
- [ ] Advanced analytics with charts
- [ ] Customer management
- [ ] Barcode scanner support
- [ ] Receipt printer integration
- [ ] Mobile app (React Native)
- [ ] PWA support

### 🐛 Bug Fixes

None yet - this is the initial release!

### 📝 Notes

This is a demonstration/prototype application. For production use:
1. Implement proper password hashing
2. Use a real database instead of localStorage
3. Add backend API with proper authentication
4. Implement real email service
5. Add comprehensive error handling
6. Implement data backup mechanisms
7. Add comprehensive testing (unit, integration, e2e)
8. Implement security best practices (HTTPS, CSRF protection, etc.)

### 👨‍💻 Developer

**Email**: gilar206@hotmail.co.uk
**Copyright**: © 2025 gilar206@hotmail.co.uk
**License**: MIT

---

## Version History

- **1.0.0** (2025-11-02) - Initial release with full features

---

**Last Updated**: November 2, 2025

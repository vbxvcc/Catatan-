# Aplikasi Toko - Store Management System

Aplikasi manajemen toko lengkap dengan fitur inventori, penjualan, dan pelaporan yang dibangun dengan React, TypeScript, dan Tailwind CSS.

## 🎯 Fitur Utama

### Autentikasi & Otorisasi
- **Login dengan keamanan berlapis**:
  - Kunci akun 5 menit setelah 3x kesalahan password
  - Verifikasi email setelah 10x kesalahan password
  - Role-based access (Owner & Admin)
- **Default credentials**:
  - Username: `xgie206`
  - Password: `xgie206`

### Manajemen Stok Barang
- **Barang Masuk**: Input stok baru dengan harga beli
- **Barang Tersedia**: Lihat semua produk dan stok tersedia
- **Barang Keluar**: Tracking barang keluar dari stok
- Perhitungan otomatis profit dan persentase keuntungan
- Support berbagai satuan (pcs, kg, liter, box, unit)
- Nilai desimal untuk quantity dan harga

### Manajemen Penjualan
- Input penjualan dengan otomatis update stok
- Laporan penjualan dengan berbagai filter:
  - Per tanggal
  - 1 Minggu terakhir
  - 1 Bulan terakhir
  - 1 Tahun terakhir
  - Sepanjang masa
- Export ke PDF dan Print
- Perhitungan profit otomatis

### Pengaturan Aplikasi
**Pengaturan Toko (Owner Only)**:
- Upload logo toko
- Set nama toko, alamat, admin, dan CS
- Email owner untuk verifikasi
- Kustomisasi tampilan login (pesan & gambar)

**Pengaturan Aplikasi**:
- Mode gelap/terang (Dark/Light theme)
- Multi-bahasa (Indonesia/English)
- Pilihan mata uang (IDR, USD, EUR, MYR, SGD)
- Zona waktu (WIB, WITA, WIT, dll)

**Manajemen User (Owner Only)**:
- Tambah/Edit/Hapus admin
- Owner dapat mengubah username & password admin

### Export & Print
- Export laporan ke PDF dengan header toko
- Direct print dari browser
- Format profesional dengan branding toko

## 🚀 Teknologi

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Zustand** - State management dengan persistence
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **i18next** - Internationalization
- **jsPDF** - PDF generation
- **date-fns** - Date manipulation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Role & Permissions

### Owner
- ✅ Semua akses Admin
- ✅ Edit username & password Admin
- ✅ Edit stok barang yang sudah diinput
- ✅ Ubah pengaturan toko (logo, nama, alamat, dll)
- ✅ Ubah tampilan login
- ✅ Manajemen user (tambah/edit/hapus admin)

### Admin
- ✅ Input stok barang baru
- ✅ Input penjualan
- ✅ Lihat laporan stok & penjualan
- ✅ Export & print laporan
- ✅ Ubah pengaturan aplikasi (bahasa, tema, mata uang)
- ❌ Tidak bisa edit stok barang
- ❌ Tidak bisa edit pengaturan toko
- ❌ Tidak bisa manajemen user

## 📱 Tampilan

### Login
- Tampilan yang dapat dikustomisasi
- Support logo/gambar custom
- Pesan login yang dapat diubah
- Keamanan berlapis dengan lockout & verifikasi email

### Dashboard
- Ringkasan statistik toko
- Total produk & stok
- Penjualan & profit hari ini
- Ringkasan bulanan
- Alert untuk stok menipis

### Inventory
- Tab untuk Barang Masuk, Tersedia, dan Keluar
- Form input dengan validasi
- Tabel interaktif dengan sorting
- Export PDF & Print

### Sales
- Multiple view (tanggal, minggu, bulan, tahun, sepanjang masa)
- Summary cards (transaksi, revenue, profit)
- Detail setiap transaksi
- Export PDF & Print

### Settings
- 3 Tab: Pengaturan Toko, Aplikasi, dan User
- Upload logo & gambar
- Multi-language support
- Theme switcher

## 🎨 Fitur UI/UX

- **Responsive Design**: Bekerja di desktop, tablet, dan mobile
- **Dark Mode**: Toggle tema gelap/terang
- **Toast Notifications**: Feedback untuk setiap aksi
- **Modal Dialogs**: Form input yang user-friendly
- **Loading States**: Feedback visual saat proses
- **Form Validation**: Validasi input real-time
- **Print Friendly**: Optimized untuk printing

## 🌍 Internationalization

Aplikasi mendukung dua bahasa:
- 🇮🇩 Bahasa Indonesia (default)
- 🇬🇧 English

## 💾 Data Persistence

Semua data disimpan di localStorage browser menggunakan Zustand persistence middleware:
- Data user & credentials
- Produk & stok
- Transaksi penjualan
- Pengaturan aplikasi

**Note**: Data bersifat lokal dan tidak di-sync ke server.

## 📄 PDF Export

Fitur export PDF meliputi:
- Header dengan logo & informasi toko
- Tabel data yang rapi dan terformat
- Total & summary
- Footer dengan copyright: © 2025 gilar206@hotmail.co.uk
- Tanggal export

## 🔒 Security Features

1. **Login Attempts Tracking**:
   - Lock account setelah 3x gagal (5 menit)
   - Email verification setelah 10x gagal

2. **Role-Based Access Control**:
   - Pembatasan fitur berdasarkan role
   - UI elements conditional berdasarkan permission

3. **Password Storage**:
   - ⚠️ Demo purposes only - gunakan hashing di production

## 🎯 Zona Waktu & Mata Uang

**Supported Timezones**:
- WIB (Asia/Jakarta)
- WITA (Asia/Makassar)
- WIT (Asia/Jayapura)
- Singapore, Kuala Lumpur

**Supported Currencies**:
- IDR (Rupiah)
- USD (Dollar)
- EUR (Euro)
- MYR (Ringgit)
- SGD (Singapore Dollar)

## 👨‍💻 Developer

© 2025 gilar206@hotmail.co.uk

## 📝 License

MIT License - bebas digunakan untuk keperluan apapun.

## 🚀 Deployment

Build production:
```bash
npm run build
```

Deploy folder `dist` ke hosting pilihan Anda:
- Vercel
- Netlify
- GitHub Pages
- atau hosting static lainnya

---

**Happy Coding! 🎉**

# Panduan Penggunaan Aplikasi Toko

## 🚀 Memulai

### Login Pertama Kali
1. Buka aplikasi di browser
2. Gunakan kredensial default:
   - **Username**: `xgie206`
   - **Password**: `xgie206`
3. Anda akan login sebagai **Owner** dengan akses penuh

### Setelah Login
Anda akan diarahkan ke **Dashboard** yang menampilkan:
- Total produk dan stok
- Penjualan hari ini
- Profit hari ini
- Ringkasan bulan ini
- Alert stok menipis

## 📦 Mengelola Stok Barang

### Menambah Produk Baru
1. Klik menu **Stok Barang** di sidebar
2. Pastikan tab **Barang Tersedia** aktif
3. Klik tombol **"+ Tambah Produk"**
4. Isi form:
   - **Nama Produk**: Nama barang
   - **SKU**: Kode unik produk
   - **Satuan**: Pilih (pcs, kg, liter, box, unit)
   - **Harga Beli**: Harga pembelian (support desimal)
   - **Harga Jual**: Harga jual (support desimal)
   - **Stok Awal**: Jumlah stok awal
5. Klik **"Tambah"**
6. Sistem otomatis menghitung persentase profit

### Edit Produk (Owner Only)
1. Di tab **Barang Tersedia**, klik icon **Edit** (pensil)
2. Ubah data yang diperlukan
3. Klik **"Simpan"**

**Note**: Admin tidak bisa edit produk, hanya Owner yang bisa!

### Menambah Stok Masuk
1. Klik tab **Barang Masuk**
2. Pilih produk dari dropdown
3. Masukkan jumlah (support desimal)
4. Opsional: Ubah harga beli jika berbeda
5. Tambahkan catatan jika perlu
6. Klik **"Tambah Transaksi"**
7. Stok produk akan otomatis bertambah

### Mengurangi Stok (Barang Keluar)
1. Klik tab **Barang Keluar**
2. Pilih produk
3. Masukkan jumlah yang keluar
4. Tambahkan catatan (misal: rusak, retur, dll)
5. Klik **"Tambah Transaksi"**
6. Stok akan berkurang otomatis

## 💰 Mengelola Penjualan

### Input Penjualan
1. Klik menu **Penjualan** di sidebar
2. Klik tombol **"+ Tambah Penjualan"**
3. Pilih produk (hanya produk dengan stok tersedia)
4. Sistem menampilkan:
   - Stok tersedia
   - Harga jual
   - Profit per unit
5. Masukkan jumlah yang dijual
6. Sistem menampilkan:
   - Total penjualan
   - Total profit
7. Klik **"Tambah Penjualan"**
8. Stok otomatis berkurang dan tercatat di Barang Keluar

### Melihat Laporan Penjualan
Tersedia 6 pilihan tampilan:
1. **Semua**: Menampilkan semua penjualan
2. **Per Tanggal**: Pilih tanggal tertentu
3. **1 Minggu**: Penjualan 7 hari terakhir
4. **1 Bulan**: Penjualan bulan ini
5. **1 Tahun**: Penjualan tahun ini
6. **Sepanjang Masa**: Semua data penjualan

Setiap tampilan menunjukkan:
- Total transaksi
- Total penjualan (revenue)
- Total profit
- Detail per transaksi dalam tabel

### Export & Print
- **Export PDF**: Klik tombol "Export PDF" untuk download laporan
- **Print**: Klik tombol "Print" untuk mencetak langsung

## ⚙️ Pengaturan

### Pengaturan Toko (Owner Only)

#### Upload Logo Toko
1. Klik menu **Pengaturan** > tab **Pengaturan Toko**
2. Di bagian "Logo Toko", klik **"Upload Logo"**
3. Pilih gambar (PNG, JPG, dll)
4. Logo akan muncul di header dan PDF export

#### Informasi Toko
Isi data berikut:
- **Nama Toko**: Nama bisnis Anda
- **Alamat Toko**: Alamat lengkap
- **Admin Toko**: Nama admin
- **CS Toko**: Contact person CS
- **Email Owner**: Untuk verifikasi (jika salah login 10x)

#### Kustomisasi Halaman Login
1. **Pesan Login**: Ubah teks sambutan di halaman login
   - Default: "Silahkan Masukkan Username dan Password"
2. **Gambar Login**: Upload gambar custom untuk halaman login
   - Klik "Upload Gambar"
   - Pilih gambar yang diinginkan

### Pengaturan Aplikasi (Semua User)

#### Ubah Bahasa
- Pilih **Bahasa Indonesia** atau **English**
- Aplikasi langsung berubah bahasa

#### Ubah Tema
- Klik icon **Bulan/Matahari** di header
- Toggle antara mode terang dan gelap

#### Pilih Mata Uang
Pilih dari:
- IDR (Rupiah) - default
- USD (Dollar)
- EUR (Euro)
- MYR (Ringgit)
- SGD (Singapore Dollar)

#### Zona Waktu
Pilih zona waktu Anda:
- WIB (Jakarta)
- WITA (Makassar)
- WIT (Jayapura)
- Singapore
- Kuala Lumpur

### Manajemen User (Owner Only)

#### Tambah Admin Baru
1. Klik tab **Manajemen User**
2. Klik **"+ Tambah User"**
3. Isi:
   - Username (unik)
   - Password
   - Email (opsional)
4. Admin baru dibuat dengan role "Admin"
5. Admin tidak bisa mengubah pengaturan toko atau mengelola user

#### Edit Admin
1. Klik icon **Edit** pada user admin
2. Ubah username, password, atau email
3. Klik **"Simpan Perubahan"**

**Note**: Owner tidak bisa diedit atau dihapus!

#### Hapus Admin
1. Klik icon **Trash** pada user admin
2. Konfirmasi penghapusan
3. Admin dihapus dari sistem

## 🔒 Keamanan

### Lupa Password Owner
Jika Owner lupa password dan terkunci:
1. Setelah 10x salah login, muncul form verifikasi email
2. Masukkan kode verifikasi (demo: `123456`)
3. Login attempts direset
4. Bisa login kembali

**Note**: Untuk production, integrasikan dengan email service real!

### Ganti Password
1. Login sebagai Owner
2. Pergi ke **Pengaturan** > **Manajemen User**
3. Edit user yang ingin diganti passwordnya
4. Masukkan password baru
5. Simpan

### Backup Data
Data tersimpan di localStorage browser. Untuk backup:
1. Buka DevTools browser (F12)
2. Tab **Application** > **Local Storage**
3. Cari key `store-app-storage`
4. Copy valuenya dan simpan di tempat aman

Untuk restore:
1. Paste value yang disimpan kembali ke localStorage
2. Refresh halaman

## 📊 Export & Laporan

### Format PDF
Setiap export PDF berisi:
- **Header**: Logo toko (jika ada) + Nama toko + Alamat
- **Judul Laporan**: Sesuai jenis laporan
- **Tanggal Export**: Tanggal pembuatan laporan
- **Tabel Data**: Data lengkap dengan format rapi
- **Total/Summary**: Di footer tabel
- **Footer**: © 2025 gilar206@hotmail.co.uk

### Print
Fitur print menggunakan window.print() browser:
- Otomatis format untuk kertas A4
- Header dan footer included
- Tabel responsive untuk print
- Copyright di bawah halaman

## 💡 Tips & Tricks

### Stok Menipis
- Dashboard menampilkan alert jika ada produk dengan stok < 10
- Segera restock untuk menghindari kehabisan

### Profit Tracking
- Sistem otomatis hitung profit dan persentase
- Monitor profit harian/bulanan di Dashboard
- Gunakan laporan penjualan untuk analisis

### Multi User
- Buat admin untuk kasir/staff
- Owner tetap punya kontrol penuh
- Admin fokus input transaksi

### Kustomisasi
- Upload logo untuk branding
- Sesuaikan tema dengan preferensi
- Ubah pesan login untuk personalisasi

## 🐛 Troubleshooting

### Data Hilang
- Data tersimpan di localStorage browser
- Jika clear cache/data browser, data hilang
- Lakukan backup secara berkala

### Login Terkunci
- Tunggu 5 menit jika salah 3x
- Gunakan verifikasi email jika salah 10x
- Kode demo verifikasi: `123456`

### PDF Tidak Muncul
- Pastikan browser support PDF generation
- Cek popup blocker
- Coba browser lain (Chrome/Firefox recommended)

### Print Tidak Rapi
- Pastikan set margin di print dialog
- Pilih orientasi Portrait
- Ukuran kertas A4

## 📞 Support

Untuk pertanyaan atau masalah:
- Email: gilar206@hotmail.co.uk

---

**Selamat menggunakan Aplikasi Toko! 🎉**

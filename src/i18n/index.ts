import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  id: {
    translation: {
      // Auth
      login: 'Masuk',
      logout: 'Keluar',
      username: 'Username',
      password: 'Password',

      // Roles
      owner: 'Pemilik',
      admin: 'Admin',

      // Menu
      dashboard: 'Dashboard',
      inventory: 'Stok Barang',
      sales: 'Penjualan',
      settings: 'Pengaturan',
      stockIn: 'Barang Masuk',
      stockAvailable: 'Barang Tersedia',
      stockOut: 'Barang Keluar',

      // Sales Views
      viewSales: 'Lihat Penjualan',
      salesByDate: 'Penjualan per Tanggal',
      salesWeekly: 'Penjualan 1 Minggu',
      salesMonthly: 'Penjualan 1 Bulan',
      salesYearly: 'Penjualan 1 Tahun',
      salesAllTime: 'Penjualan Sepanjang Masa',

      // Product
      productName: 'Nama Barang',
      sku: 'SKU',
      unit: 'Satuan',
      buyPrice: 'Harga Beli',
      sellPrice: 'Harga Jual',
      profit: 'Keuntungan',
      profitPercentage: 'Persentase Keuntungan',
      stock: 'Stok',
      quantity: 'Jumlah',

      // Actions
      add: 'Tambah',
      edit: 'Edit',
      delete: 'Hapus',
      save: 'Simpan',
      cancel: 'Batal',
      export: 'Export PDF',
      print: 'Print',

      // Settings
      storeName: 'Nama Toko',
      storeAddress: 'Alamat Toko',
      storeLogo: 'Logo Toko',
      storeAdmin: 'Admin Toko',
      storeCS: 'CS Toko',
      theme: 'Tema',
      language: 'Bahasa',
      currency: 'Mata Uang',
      timezone: 'Zona Waktu',
      light: 'Terang',
      dark: 'Gelap',

      // User Management
      userManagement: 'Manajemen User',
      addUser: 'Tambah User',
      editUser: 'Edit User',

      // Common
      date: 'Tanggal',
      total: 'Total',
      notes: 'Catatan',
      createdBy: 'Dibuat Oleh',
      createdAt: 'Dibuat Tanggal',
    },
  },
  en: {
    translation: {
      // Auth
      login: 'Login',
      logout: 'Logout',
      username: 'Username',
      password: 'Password',

      // Roles
      owner: 'Owner',
      admin: 'Admin',

      // Menu
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      sales: 'Sales',
      settings: 'Settings',
      stockIn: 'Stock In',
      stockAvailable: 'Available Stock',
      stockOut: 'Stock Out',

      // Sales Views
      viewSales: 'View Sales',
      salesByDate: 'Sales by Date',
      salesWeekly: 'Weekly Sales',
      salesMonthly: 'Monthly Sales',
      salesYearly: 'Yearly Sales',
      salesAllTime: 'All Time Sales',

      // Product
      productName: 'Product Name',
      sku: 'SKU',
      unit: 'Unit',
      buyPrice: 'Buy Price',
      sellPrice: 'Sell Price',
      profit: 'Profit',
      profitPercentage: 'Profit Percentage',
      stock: 'Stock',
      quantity: 'Quantity',

      // Actions
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      export: 'Export PDF',
      print: 'Print',

      // Settings
      storeName: 'Store Name',
      storeAddress: 'Store Address',
      storeLogo: 'Store Logo',
      storeAdmin: 'Store Admin',
      storeCS: 'Store CS',
      theme: 'Theme',
      language: 'Language',
      currency: 'Currency',
      timezone: 'Timezone',
      light: 'Light',
      dark: 'Dark',

      // User Management
      userManagement: 'User Management',
      addUser: 'Add User',
      editUser: 'Edit User',

      // Common
      date: 'Date',
      total: 'Total',
      notes: 'Notes',
      createdBy: 'Created By',
      createdAt: 'Created At',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id',
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

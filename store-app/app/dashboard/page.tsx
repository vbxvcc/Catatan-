'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import DashboardLayout from '@/components/DashboardLayout';
import { getProducts, getSales } from '@/lib/storage';
import { getTranslation } from '@/lib/i18n';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
  });

  const t = (key: string) => getTranslation(settings.language, key);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const products = getProducts();
    const sales = getSales();
    
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.sellingPrice * sale.quantity), 0);
    const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit * sale.quantity), 0);

    setStats({
      totalProducts: products.length,
      totalSales: sales.length,
      totalRevenue,
      totalProfit,
    });
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.welcome')}, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {settings.storeName} - {settings.address}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Produk
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Penjualan
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalSales}
                </p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Pendapatan
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {settings.currency} {stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Keuntungan
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {settings.currency} {stats.totalProfit.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Akses Cepat
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/inventory')}
                className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
              >
                <span className="text-lg font-medium text-blue-900 dark:text-blue-300">
                  📦 Kelola Stok Barang
                </span>
              </button>
              <button
                onClick={() => router.push('/dashboard/sales')}
                className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
              >
                <span className="text-lg font-medium text-green-900 dark:text-green-300">
                  💰 Kelola Penjualan
                </span>
              </button>
              {user?.role === 'owner' && (
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition"
                >
                  <span className="text-lg font-medium text-purple-900 dark:text-purple-300">
                    ⚙️ Pengaturan Toko
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Informasi Toko
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nama Toko</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {settings.storeName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alamat</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {settings.address}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {settings.adminName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Service</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {settings.customerService}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { format, subDays, startOfMonth } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function Dashboard() {
  const { products, sales, settings } = useStore();
  const { t } = useTranslation();

  // Calculate stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  // Sales stats
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySales = sales.filter((s) => format(new Date(s.date), 'yyyy-MM-dd') === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.sellPrice * s.quantity, 0);
  const todayProfit = todaySales.reduce((sum, s) => sum + s.profit * s.quantity, 0);

  // Month stats
  const monthStart = startOfMonth(new Date());
  const monthSales = sales.filter((s) => new Date(s.date) >= monthStart);
  const monthRevenue = monthSales.reduce((sum, s) => sum + s.sellPrice * s.quantity, 0);
  const monthProfit = monthSales.reduce((sum, s) => sum + s.profit * s.quantity, 0);

  // Low stock products
  const lowStockProducts = products.filter((p) => p.stock < 10);

  const stats = [
    {
      title: 'Total Produk',
      value: totalProducts.toString(),
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Total Stok',
      value: totalStock.toString(),
      icon: Package,
      color: 'green',
    },
    {
      title: 'Penjualan Hari Ini',
      value: `${settings.currency} ${todayRevenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      icon: ShoppingCart,
      color: 'purple',
    },
    {
      title: 'Profit Hari Ini',
      value: `${settings.currency} ${todayProfit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string, isDark: boolean) => {
    const colors: Record<string, { light: string; dark: string; text: string }> = {
      blue: {
        light: 'bg-blue-100 text-blue-600',
        dark: 'bg-blue-900/30 text-blue-400',
        text: 'text-blue-600',
      },
      green: {
        light: 'bg-green-100 text-green-600',
        dark: 'bg-green-900/30 text-green-400',
        text: 'text-green-600',
      },
      purple: {
        light: 'bg-purple-100 text-purple-600',
        dark: 'bg-purple-900/30 text-purple-400',
        text: 'text-purple-600',
      },
      orange: {
        light: 'bg-orange-100 text-orange-600',
        dark: 'bg-orange-900/30 text-orange-400',
        text: 'text-orange-600',
      },
    };

    return isDark ? colors[color].dark : colors[color].light;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('dashboard')}</h1>
        <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Selamat datang di dashboard {settings.storeName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl p-6 ${
                settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${getColorClasses(
                    stat.color,
                    settings.theme === 'dark'
                  )}`}
                >
                  <Icon size={24} />
                </div>
              </div>
              <h3
                className={`text-sm font-medium mb-1 ${
                  settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {stat.title}
              </h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Summary */}
      <div
        className={`rounded-xl p-6 ${
          settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}
      >
        <h2 className="text-xl font-bold mb-4">Ringkasan Bulan Ini</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Total Transaksi
            </p>
            <p className="text-2xl font-bold">{monthSales.length}</p>
          </div>
          <div>
            <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Total Penjualan
            </p>
            <p className="text-2xl font-bold">
              {settings.currency} {monthRevenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Total Profit
            </p>
            <p className="text-2xl font-bold text-green-600">
              {settings.currency} {monthProfit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div
          className={`rounded-xl p-6 ${
            settings.theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
          } border-2 ${settings.theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}
        >
          <h2 className="text-xl font-bold mb-4 text-red-600">Stok Menipis</h2>
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-3 rounded-lg bg-white/50"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">{product.stock} {product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

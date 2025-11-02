import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Download, Printer, Plus } from 'lucide-react';
import { exportSalesToPDF } from '../utils/pdfExport';
import { format, startOfWeek, startOfMonth, startOfYear, subDays, isWithinInterval } from 'date-fns';
import toast from 'react-hot-toast';

type ViewType = 'all' | 'date' | 'week' | 'month' | 'year' | 'alltime';

export default function Sales() {
  const { currentUser, products, sales, settings, addSale } = useStore();
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<ViewType>('all');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-DD'));
  const [showAddModal, setShowAddModal] = useState(false);

  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: '',
  });

  const filterSalesByView = () => {
    const now = new Date();

    switch (viewType) {
      case 'date':
        return sales.filter(
          (s) => format(new Date(s.date), 'yyyy-MM-dd') === selectedDate
        );
      case 'week':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        return sales.filter((s) => new Date(s.date) >= weekStart);
      case 'month':
        const monthStart = startOfMonth(now);
        return sales.filter((s) => new Date(s.date) >= monthStart);
      case 'year':
        const yearStart = startOfYear(now);
        return sales.filter((s) => new Date(s.date) >= yearStart);
      case 'alltime':
        return sales;
      default:
        return sales;
    }
  };

  const filteredSales = filterSalesByView();

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.sellPrice * s.quantity, 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + s.profit * s.quantity, 0);
  const totalTransactions = filteredSales.length;

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find((p) => p.id === saleForm.productId);
    if (!product) {
      toast.error('Produk tidak ditemukan');
      return;
    }

    const quantity = parseFloat(saleForm.quantity);
    if (quantity > product.stock) {
      toast.error('Stok tidak mencukupi');
      return;
    }

    const profit = product.sellPrice - product.buyPrice;

    addSale({
      productId: product.id,
      productName: product.name,
      quantity,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      profit,
      profitPercentage: product.profitPercentage,
      date: new Date().toISOString(),
      createdBy: currentUser?.username || '',
    });

    toast.success('Penjualan berhasil ditambahkan');
    setShowAddModal(false);
    setSaleForm({
      productId: '',
      quantity: '',
    });
  };

  const handleExport = () => {
    const title = viewType === 'date'
      ? `Penjualan ${format(new Date(selectedDate), 'dd MMMM yyyy')}`
      : viewType === 'week'
      ? 'Penjualan 1 Minggu'
      : viewType === 'month'
      ? 'Penjualan 1 Bulan'
      : viewType === 'year'
      ? 'Penjualan 1 Tahun'
      : 'Penjualan Sepanjang Masa';

    exportSalesToPDF(sales, settings, title, filteredSales);
    toast.success('PDF berhasil diexport');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Mencetak...');
  };

  const viewOptions = [
    { id: 'all' as ViewType, label: 'Semua' },
    { id: 'date' as ViewType, label: t('salesByDate') },
    { id: 'week' as ViewType, label: t('salesWeekly') },
    { id: 'month' as ViewType, label: t('salesMonthly') },
    { id: 'year' as ViewType, label: t('salesYearly') },
    { id: 'alltime' as ViewType, label: t('salesAllTime') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('sales')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Tambah Penjualan
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={20} />
            {t('export')}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer size={20} />
            {t('print')}
          </button>
        </div>
      </div>

      {/* View Selector */}
      <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
        <div className="flex flex-wrap gap-4 items-center">
          <label className="font-semibold">Tampilan:</label>
          {viewOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setViewType(option.id)}
              className={`px-4 py-2 rounded-lg transition ${
                viewType === option.id
                  ? 'bg-blue-600 text-white'
                  : settings.theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}

          {viewType === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
          <h3 className={`text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Transaksi
          </h3>
          <p className="text-3xl font-bold">{totalTransactions}</p>
        </div>

        <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
          <h3 className={`text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Penjualan
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {settings.currency} {totalRevenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
          <h3 className={`text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Profit
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {settings.currency} {totalProfit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('productName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('quantity')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('buyPrice')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('sellPrice')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('profit')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('profitPercentage')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t('createdBy')}
                </th>
              </tr>
            </thead>
            <tbody className={settings.theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}>
              {filteredSales
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sale.date).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {settings.currency} {sale.buyPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {settings.currency} {sale.sellPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {settings.currency}{' '}
                      {(sale.sellPrice * sale.quantity).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                      {settings.currency}{' '}
                      {(sale.profit * sale.quantity).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                      {sale.profitPercentage.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.createdBy}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="text-center py-8">
              <p className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Tidak ada data penjualan
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
            <h2 className="text-2xl font-bold mb-4">Tambah Penjualan</h2>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pilih Produk</label>
                <select
                  value={saleForm.productId}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value);
                    setSaleForm({ ...saleForm, productId: e.target.value });
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                >
                  <option value="">Pilih produk...</option>
                  {products
                    .filter((p) => p.stock > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - Stok: {p.stock} - {settings.currency}{' '}
                        {p.sellPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                </select>
              </div>

              {saleForm.productId && (
                <>
                  <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    {(() => {
                      const product = products.find((p) => p.id === saleForm.productId);
                      return product ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                              Stok Tersedia:
                            </span>
                            <span className="font-semibold">{product.stock} {product.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                              Harga Jual:
                            </span>
                            <span className="font-semibold">
                              {settings.currency} {product.sellPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                              Profit per unit:
                            </span>
                            <span className="font-semibold text-green-600">
                              {settings.currency}{' '}
                              {(product.sellPrice - product.buyPrice).toLocaleString('id-ID', {
                                minimumFractionDigits: 2,
                              })}{' '}
                              ({product.profitPercentage.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Jumlah</label>
                    <input
                      type="number"
                      step="0.01"
                      value={saleForm.quantity}
                      onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      required
                      max={products.find((p) => p.id === saleForm.productId)?.stock || 0}
                    />
                  </div>

                  {saleForm.quantity && parseFloat(saleForm.quantity) > 0 && (
                    <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                      {(() => {
                        const product = products.find((p) => p.id === saleForm.productId);
                        const qty = parseFloat(saleForm.quantity);
                        return product ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-semibold">Total Penjualan:</span>
                              <span className="font-bold text-lg">
                                {settings.currency}{' '}
                                {(product.sellPrice * qty).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold">Total Profit:</span>
                              <span className="font-bold text-lg text-green-600">
                                {settings.currency}{' '}
                                {((product.sellPrice - product.buyPrice) * qty).toLocaleString('id-ID', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!saleForm.productId || !saleForm.quantity}
                >
                  Tambah Penjualan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSaleForm({ productId: '', quantity: '' });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    settings.theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

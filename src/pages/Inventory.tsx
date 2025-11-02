import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Download, Printer } from 'lucide-react';
import { exportStockToPDF } from '../utils/pdfExport';
import toast from 'react-hot-toast';

type TabType = 'available' | 'in' | 'out';

export default function Inventory() {
  const { currentUser, products, stockTransactions, settings, addProduct, updateProduct, deleteProduct, addStockTransaction } = useStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit: 'pcs',
    buyPrice: '',
    sellPrice: '',
    stock: '',
  });

  // Stock transaction form
  const [stockForm, setStockForm] = useState({
    productId: '',
    type: 'in' as 'in' | 'out',
    quantity: '',
    buyPrice: '',
    notes: '',
  });

  const isOwner = currentUser?.role === 'owner';

  const calculateProfit = (buyPrice: number, sellPrice: number) => {
    if (buyPrice === 0) return 0;
    return ((sellPrice - buyPrice) / buyPrice) * 100;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const buyPrice = parseFloat(formData.buyPrice);
    const sellPrice = parseFloat(formData.sellPrice);
    const stock = parseFloat(formData.stock);

    addProduct({
      name: formData.name,
      sku: formData.sku,
      unit: formData.unit,
      buyPrice,
      sellPrice,
      profitPercentage: calculateProfit(buyPrice, sellPrice),
      stock,
      createdBy: currentUser?.username || '',
    });

    // Add stock in transaction
    addStockTransaction({
      productId: Date.now().toString(),
      productName: formData.name,
      type: 'in',
      quantity: stock,
      buyPrice,
      date: new Date().toISOString(),
      createdBy: currentUser?.username || '',
      notes: 'Stok awal',
    });

    toast.success('Produk berhasil ditambahkan');
    setShowAddModal(false);
    setFormData({
      name: '',
      sku: '',
      unit: 'pcs',
      buyPrice: '',
      sellPrice: '',
      stock: '',
    });
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const buyPrice = parseFloat(formData.buyPrice);
    const sellPrice = parseFloat(formData.sellPrice);

    updateProduct(editingProduct.id, {
      name: formData.name,
      sku: formData.sku,
      unit: formData.unit,
      buyPrice,
      sellPrice,
      profitPercentage: calculateProfit(buyPrice, sellPrice),
      updatedBy: currentUser?.username,
    });

    toast.success('Produk berhasil diperbarui');
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
      toast.success('Produk berhasil dihapus');
    }
  };

  const handleStockTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find((p) => p.id === stockForm.productId);
    if (!product) return;

    const quantity = parseFloat(stockForm.quantity);
    const buyPrice = stockForm.buyPrice ? parseFloat(stockForm.buyPrice) : product.buyPrice;

    addStockTransaction({
      productId: product.id,
      productName: product.name,
      type: stockForm.type,
      quantity,
      buyPrice: stockForm.type === 'in' ? buyPrice : undefined,
      sellPrice: stockForm.type === 'out' ? product.sellPrice : undefined,
      date: new Date().toISOString(),
      createdBy: currentUser?.username || '',
      notes: stockForm.notes,
    });

    toast.success(`Transaksi stok ${stockForm.type === 'in' ? 'masuk' : 'keluar'} berhasil`);
    setStockForm({
      productId: '',
      type: 'in',
      quantity: '',
      buyPrice: '',
      notes: '',
    });
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      unit: product.unit,
      buyPrice: product.buyPrice.toString(),
      sellPrice: product.sellPrice.toString(),
      stock: product.stock.toString(),
    });
    setShowEditModal(true);
  };

  const handleExport = () => {
    if (activeTab === 'available') {
      exportStockToPDF(products, settings, 'all');
    } else {
      exportStockToPDF(products, settings, activeTab, stockTransactions);
    }
    toast.success('PDF berhasil diexport');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Mencetak...');
  };

  const tabs = [
    { id: 'available' as TabType, label: t('stockAvailable') },
    { id: 'in' as TabType, label: t('stockIn') },
    { id: 'out' as TabType, label: t('stockOut') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('inventory')}</h1>
        <div className="flex gap-2">
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

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : settings.theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Available Stock Tab */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar Barang</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              {t('add')} Produk
            </button>
          </div>

          <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('productName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('sku')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('stock')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('unit')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('buyPrice')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('sellPrice')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {t('profitPercentage')}
                    </th>
                    {isOwner && (
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className={settings.theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={product.stock < 10 ? 'text-red-600 font-bold' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {settings.currency} {product.buyPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {settings.currency} {product.sellPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                        {product.profitPercentage.toFixed(2)}%
                      </td>
                      {isOwner && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock In/Out Tab */}
      {(activeTab === 'in' || activeTab === 'out') && (
        <div className="space-y-4">
          {/* Transaction Form */}
          <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
            <h2 className="text-xl font-semibold mb-4">
              Tambah Transaksi {activeTab === 'in' ? 'Barang Masuk' : 'Barang Keluar'}
            </h2>
            <form onSubmit={handleStockTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pilih Produk</label>
                <select
                  value={stockForm.productId}
                  onChange={(e) => setStockForm({ ...stockForm, productId: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                >
                  <option value="">Pilih produk...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stok: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jumlah</label>
                <input
                  type="number"
                  step="0.01"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              {activeTab === 'in' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Harga Beli (Opsional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={stockForm.buyPrice}
                    onChange={(e) => setStockForm({ ...stockForm, buyPrice: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    placeholder="Kosongkan untuk menggunakan harga default"
                  />
                </div>
              )}

              <div className={activeTab === 'in' ? '' : 'md:col-span-2'}>
                <label className="block text-sm font-medium mb-2">Catatan</label>
                <input
                  type="text"
                  value={stockForm.notes}
                  onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Catatan tambahan..."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tambah Transaksi
                </button>
              </div>
            </form>
          </div>

          {/* Transaction List */}
          <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {activeTab === 'in' ? 'Harga Beli' : 'Harga Jual'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Oleh</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Catatan</th>
                  </tr>
                </thead>
                <tbody className={settings.theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}>
                  {stockTransactions
                    .filter((t) => t.type === activeTab)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(transaction.date).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {settings.currency}{' '}
                          {(activeTab === 'in' ? transaction.buyPrice : transaction.sellPrice)?.toLocaleString(
                            'id-ID',
                            { minimumFractionDigits: 2 }
                          ) || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.createdBy}</td>
                        <td className="px-6 py-4">{transaction.notes || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
            <h2 className="text-2xl font-bold mb-4">Tambah Produk Baru</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Satuan</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="pcs">Pcs</option>
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                  <option value="box">Box</option>
                  <option value="unit">Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Harga Beli</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Harga Jual</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stok Awal</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
            <h2 className="text-2xl font-bold mb-4">Edit Produk</h2>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Satuan</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="pcs">Pcs</option>
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                  <option value="box">Box</option>
                  <option value="unit">Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Harga Beli</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Harga Jual</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
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

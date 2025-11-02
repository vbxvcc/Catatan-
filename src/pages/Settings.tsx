import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Upload, Save, Plus, Edit, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { currentUser, users, settings, updateSettings, addUser, updateUser, deleteUser } = useStore();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'store' | 'app' | 'users'>('store');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const isOwner = currentUser?.role === 'owner';

  // Store settings form
  const [storeForm, setStoreForm] = useState({
    storeName: settings.storeName,
    storeAddress: settings.storeAddress,
    storeAdmin: settings.storeAdmin,
    storeCS: settings.storeCS,
    ownerEmail: settings.ownerEmail || '',
  });

  // App settings form
  const [appForm, setAppForm] = useState({
    language: settings.language,
    currency: settings.currency,
    timezone: settings.timezone,
    loginMessage: settings.loginMessage,
  });

  // User form
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'admin' as 'admin',
  });

  const handleStoreSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      toast.error('Hanya owner yang dapat mengubah pengaturan toko');
      return;
    }

    updateSettings(storeForm);
    toast.success('Pengaturan toko berhasil diperbarui');
  };

  const handleAppSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(appForm);
    i18n.changeLanguage(appForm.language);
    toast.success('Pengaturan aplikasi berhasil diperbarui');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) {
      toast.error('Hanya owner yang dapat mengubah logo');
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ storeLogo: reader.result as string });
        toast.success('Logo berhasil diperbarui');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) {
      toast.error('Hanya owner yang dapat mengubah gambar login');
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ loginImage: reader.result as string });
        toast.success('Gambar login berhasil diperbarui');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      toast.error('Hanya owner yang dapat menambah user');
      return;
    }

    addUser({
      ...userForm,
      createdBy: currentUser?.username,
    });

    toast.success('User berhasil ditambahkan');
    setShowAddUserModal(false);
    setUserForm({
      username: '',
      password: '',
      email: '',
      role: 'admin',
    });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      toast.error('Hanya owner yang dapat mengedit user');
      return;
    }

    updateUser(editingUser.id, {
      username: userForm.username,
      password: userForm.password,
      email: userForm.email,
    });

    toast.success('User berhasil diperbarui');
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (!isOwner) {
      toast.error('Hanya owner yang dapat menghapus user');
      return;
    }

    if (id === currentUser?.id) {
      toast.error('Tidak dapat menghapus akun sendiri');
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      deleteUser(id);
      toast.success('User berhasil dihapus');
    }
  };

  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      password: user.password,
      email: user.email || '',
      role: user.role,
    });
    setShowEditUserModal(true);
  };

  const tabs = [
    { id: 'store' as const, label: 'Pengaturan Toko', disabled: !isOwner },
    { id: 'app' as const, label: 'Pengaturan Aplikasi', disabled: false },
    { id: 'users' as const, label: 'Manajemen User', disabled: !isOwner },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('settings')}</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : tab.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : settings.theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.disabled && ' (Owner Only)'}
          </button>
        ))}
      </div>

      {/* Store Settings Tab */}
      {activeTab === 'store' && isOwner && (
        <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
          <h2 className="text-xl font-bold mb-6">Pengaturan Toko</h2>

          <form onSubmit={handleStoreSettingsSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo Toko</label>
              {settings.storeLogo && (
                <div className="mb-4">
                  <img src={settings.storeLogo} alt="Store Logo" className="h-20 object-contain" />
                </div>
              )}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  <Upload size={20} />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {settings.storeLogo && (
                  <button
                    type="button"
                    onClick={() => updateSettings({ storeLogo: undefined })}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Hapus Logo
                  </button>
                )}
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('storeName')}</label>
              <input
                type="text"
                value={storeForm.storeName}
                onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            {/* Store Address */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('storeAddress')}</label>
              <textarea
                value={storeForm.storeAddress}
                onChange={(e) => setStoreForm({ ...storeForm, storeAddress: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                rows={3}
              />
            </div>

            {/* Store Admin */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('storeAdmin')}</label>
              <input
                type="text"
                value={storeForm.storeAdmin}
                onChange={(e) => setStoreForm({ ...storeForm, storeAdmin: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Store CS */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('storeCS')}</label>
              <input
                type="text"
                value={storeForm.storeCS}
                onChange={(e) => setStoreForm({ ...storeForm, storeCS: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Owner Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Owner (untuk verifikasi)</label>
              <input
                type="email"
                value={storeForm.ownerEmail}
                onChange={(e) => setStoreForm({ ...storeForm, ownerEmail: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save size={20} />
              {t('save')} Pengaturan Toko
            </button>
          </form>
        </div>
      )}

      {/* App Settings Tab */}
      {activeTab === 'app' && (
        <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
          <h2 className="text-xl font-bold mb-6">Pengaturan Aplikasi</h2>

          <form onSubmit={handleAppSettingsSubmit} className="space-y-6">
            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('language')}</label>
              <select
                value={appForm.language}
                onChange={(e) => setAppForm({ ...appForm, language: e.target.value as 'id' | 'en' })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('currency')}</label>
              <select
                value={appForm.currency}
                onChange={(e) => setAppForm({ ...appForm, currency: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD (Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="MYR">MYR (Ringgit)</option>
                <option value="SGD">SGD (Singapore Dollar)</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('timezone')}</label>
              <select
                value={appForm.timezone}
                onChange={(e) => setAppForm({ ...appForm, timezone: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="Asia/Jakarta">WIB (Jakarta)</option>
                <option value="Asia/Makassar">WITA (Makassar)</option>
                <option value="Asia/Jayapura">WIT (Jayapura)</option>
                <option value="Asia/Singapore">Singapore</option>
                <option value="Asia/Kuala_Lumpur">Kuala Lumpur</option>
              </select>
            </div>

            {/* Login Message */}
            {isOwner && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Pesan Login</label>
                  <input
                    type="text"
                    value={appForm.loginMessage}
                    onChange={(e) => setAppForm({ ...appForm, loginMessage: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                {/* Login Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Gambar Login</label>
                  {settings.loginImage && (
                    <div className="mb-4">
                      <img src={settings.loginImage} alt="Login" className="h-32 w-32 object-cover rounded-lg" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      <Upload size={20} />
                      Upload Gambar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLoginImageUpload}
                        className="hidden"
                      />
                    </label>
                    {settings.loginImage && (
                      <button
                        type="button"
                        onClick={() => updateSettings({ loginImage: undefined })}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Hapus Gambar
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save size={20} />
              {t('save')} Pengaturan Aplikasi
            </button>
          </form>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && isOwner && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar User</h2>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Tambah User
            </button>
          </div>

          <div className={`rounded-xl ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dibuat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className={settings.theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.username}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Anda</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === 'owner'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {user.role === 'owner' ? 'Owner' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== 'owner' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditUserModal(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
            <h2 className="text-2xl font-bold mb-4">Tambah Admin Baru</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (Opsional)</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tambah Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
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

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
            <h2 className="text-2xl font-bold mb-4">Edit Admin</h2>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password Baru</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    settings.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
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

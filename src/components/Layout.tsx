import { ReactNode } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  Package,
  ShoppingCart,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout, settings, updateSettings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const menuItems = [
    { path: '/dashboard', label: t('dashboard'), icon: Package },
    { path: '/inventory', label: t('inventory'), icon: Package },
    { path: '/sales', label: t('sales'), icon: ShoppingCart },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-20 ${
          settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${
                settings.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {settings.storeLogo && (
              <img src={settings.storeLogo} alt={settings.storeName} className="h-10 object-contain" />
            )}

            <div>
              <h1 className="text-xl font-bold">{settings.storeName || 'Toko Saya'}</h1>
              {settings.storeAddress && (
                <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {settings.storeAddress}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                settings.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title={settings.theme === 'light' ? t('dark') : t('light')}
            >
              {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-semibold text-sm">{currentUser?.username}</p>
                <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentUser?.role === 'owner' ? t('owner') : t('admin')}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${
                  settings.theme === 'dark'
                    ? 'hover:bg-red-900/20 text-red-400'
                    : 'hover:bg-red-50 text-red-600'
                }`}
                title={t('logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 z-10 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? settings.theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : settings.theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <div className="p-6">{children}</div>

        {/* Footer */}
        <footer
          className={`mt-8 py-4 text-center text-sm ${
            settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          © 2025 gilar206@hotmail.co.uk
        </footer>
      </main>
    </div>
  );
}

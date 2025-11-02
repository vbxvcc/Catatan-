'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { getTranslation } from '@/lib/i18n';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();

  const t = (key: string) => getTranslation(settings.language, key);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const menuItems = [
    { label: t('dashboard.title'), path: '/dashboard', icon: '📊' },
    { label: t('dashboard.inventory'), path: '/dashboard/inventory', icon: '📦' },
    { label: t('dashboard.sales'), path: '/dashboard/sales', icon: '💰' },
    ...(user?.role === 'owner' ? [{ label: t('dashboard.settings'), path: '/dashboard/settings', icon: '⚙️' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30 top-0">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <span className="text-2xl">☰</span>
              </button>
              <div className="flex items-center ml-4">
                {settings.logo && (
                  <img 
                    src={settings.logo} 
                    alt="Logo" 
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                )}
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {settings.storeName}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title={settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                <span className="text-xl">{settings.theme === 'light' ? '🌙' : '☀️'}</span>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
                >
                  {t('dashboard.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-20 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className="flex items-center w-full p-3 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className={`pt-20 transition-all ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <main className="p-4 lg:p-6">
          {children}
        </main>
        
        <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          2025 gilar206@hotmail.co.uk
        </footer>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

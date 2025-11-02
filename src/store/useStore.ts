import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, StockTransaction, Sale, AppSettings, LoginAttempt } from '../types';

interface StoreState {
  // Auth
  currentUser: User | null;
  users: User[];
  loginAttempts: Record<string, LoginAttempt>;

  // Products & Stock
  products: Product[];
  stockTransactions: StockTransaction[];

  // Sales
  sales: Sale[];

  // Settings
  settings: AppSettings;

  // Auth Actions
  login: (username: string, password: string) => { success: boolean; message?: string; needsEmail?: boolean };
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  recordLoginAttempt: (username: string) => void;
  resetLoginAttempts: (username: string) => void;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Stock Actions
  addStockTransaction: (transaction: Omit<StockTransaction, 'id'>) => void;

  // Sales Actions
  addSale: (sale: Omit<Sale, 'id'>) => void;

  // Settings Actions
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  storeName: 'Toko Saya',
  storeAddress: '',
  storeAdmin: '',
  storeCS: '',
  theme: 'light',
  language: 'id',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
  loginMessage: 'Silahkan Masukkan Username dan Password',
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      users: [
        {
          id: '1',
          username: 'xgie206',
          password: 'xgie206',
          role: 'owner',
          email: 'gilar206@hotmail.co.uk',
          createdAt: new Date().toISOString(),
        },
      ],
      loginAttempts: {},
      products: [],
      stockTransactions: [],
      sales: [],
      settings: defaultSettings,

      // Auth Actions
      login: (username: string, password: string) => {
        const { users, loginAttempts } = get();
        const user = users.find((u) => u.username === username);

        if (!user) {
          get().recordLoginAttempt(username);
          return { success: false, message: 'Username tidak ditemukan' };
        }

        const attempt = loginAttempts[username];
        if (attempt?.lockedUntil) {
          const lockTime = new Date(attempt.lockedUntil);
          if (lockTime > new Date()) {
            const remainingMinutes = Math.ceil((lockTime.getTime() - Date.now()) / 60000);
            return {
              success: false,
              message: `Akun terkunci. Tunggu ${remainingMinutes} menit.`
            };
          }
        }

        if (attempt && attempt.count >= 10) {
          return {
            success: false,
            message: 'Terlalu banyak percobaan gagal. Verifikasi email diperlukan.',
            needsEmail: true,
          };
        }

        if (user.password !== password) {
          get().recordLoginAttempt(username);
          const newAttempt = get().loginAttempts[username];

          if (newAttempt.count >= 10) {
            return {
              success: false,
              message: 'Terlalu banyak percobaan gagal. Verifikasi email diperlukan.',
              needsEmail: true,
            };
          } else if (newAttempt.count >= 3) {
            return {
              success: false,
              message: `Password salah. ${newAttempt.count >= 3 ? 'Akun terkunci 5 menit.' : ''}`
            };
          }

          return { success: false, message: 'Password salah' };
        }

        get().resetLoginAttempts(username);
        set({ currentUser: user });
        return { success: true };
      },

      logout: () => set({ currentUser: null }),

      recordLoginAttempt: (username: string) => {
        const { loginAttempts } = get();
        const attempt = loginAttempts[username] || { count: 0, lastAttempt: '' };
        const newCount = attempt.count + 1;

        let lockedUntil: string | undefined;
        if (newCount >= 3 && newCount < 10) {
          lockedUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        }

        set({
          loginAttempts: {
            ...loginAttempts,
            [username]: {
              count: newCount,
              lastAttempt: new Date().toISOString(),
              lockedUntil,
            },
          },
        });
      },

      resetLoginAttempts: (username: string) => {
        const { loginAttempts } = get();
        const newAttempts = { ...loginAttempts };
        delete newAttempts[username];
        set({ loginAttempts: newAttempts });
      },

      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
      },

      // Product Actions
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Stock Actions
      addStockTransaction: (transaction) => {
        const { products } = get();
        const newTransaction: StockTransaction = {
          ...transaction,
          id: Date.now().toString(),
        };

        // Update product stock
        const product = products.find((p) => p.id === transaction.productId);
        if (product) {
          const stockChange = transaction.type === 'in' ? transaction.quantity : -transaction.quantity;
          get().updateProduct(product.id, { stock: product.stock + stockChange });
        }

        set((state) => ({
          stockTransactions: [...state.stockTransactions, newTransaction],
        }));
      },

      // Sales Actions
      addSale: (sale) => {
        const newSale: Sale = {
          ...sale,
          id: Date.now().toString(),
        };

        // Create stock out transaction
        get().addStockTransaction({
          productId: sale.productId,
          productName: sale.productName,
          type: 'out',
          quantity: sale.quantity,
          sellPrice: sale.sellPrice,
          date: sale.date,
          createdBy: sale.createdBy,
          notes: 'Penjualan',
        });

        set((state) => ({
          sales: [...state.sales, newSale],
        }));
      },

      // Settings Actions
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: 'store-app-storage',
    }
  )
);

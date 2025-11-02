import { AppData, User, StoreSettings, Product, StockTransaction, Sale, LoginAttempt } from '@/types';

const STORAGE_KEY = 'store_app_data';

const defaultSettings: StoreSettings = {
  storeName: 'Toko Saya',
  address: 'Alamat Toko',
  adminName: 'Admin',
  customerService: 'CS',
  theme: 'light',
  language: 'id',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
  loginMessage: 'Silahkan Masukkan Username dan Password',
};

const defaultOwner: User = {
  id: '1',
  username: 'xgie206',
  password: 'xgie206',
  role: 'owner',
  email: 'gilar206@hotmail.co.uk',
  createdAt: new Date().toISOString(),
};

export const getInitialData = (): AppData => {
  return {
    users: [defaultOwner],
    settings: defaultSettings,
    products: [],
    stockTransactions: [],
    sales: [],
    loginAttempts: {},
  };
};

export const loadData = (): AppData => {
  if (typeof window === 'undefined') return getInitialData();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  const initialData = getInitialData();
  saveData(initialData);
  return initialData;
};

export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getUsers = (): User[] => {
  return loadData().users;
};

export const addUser = (user: User): void => {
  const data = loadData();
  data.users.push(user);
  saveData(data);
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const data = loadData();
  const index = data.users.findIndex(u => u.id === userId);
  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...updates };
    saveData(data);
  }
};

export const deleteUser = (userId: string): void => {
  const data = loadData();
  data.users = data.users.filter(u => u.id !== userId);
  saveData(data);
};

export const getSettings = (): StoreSettings => {
  return loadData().settings;
};

export const updateSettings = (settings: Partial<StoreSettings>): void => {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
};

export const getProducts = (): Product[] => {
  return loadData().products;
};

export const addProduct = (product: Product): void => {
  const data = loadData();
  data.products.push(product);
  saveData(data);
};

export const updateProduct = (productId: string, updates: Partial<Product>): void => {
  const data = loadData();
  const index = data.products.findIndex(p => p.id === productId);
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...updates };
    saveData(data);
  }
};

export const deleteProduct = (productId: string): void => {
  const data = loadData();
  data.products = data.products.filter(p => p.id !== productId);
  saveData(data);
};

export const getStockTransactions = (): StockTransaction[] => {
  return loadData().stockTransactions;
};

export const addStockTransaction = (transaction: StockTransaction): void => {
  const data = loadData();
  data.stockTransactions.push(transaction);
  saveData(data);
};

export const getSales = (): Sale[] => {
  return loadData().sales;
};

export const addSale = (sale: Sale): void => {
  const data = loadData();
  data.sales.push(sale);
  
  const productIndex = data.products.findIndex(p => p.id === sale.productId);
  if (productIndex !== -1) {
    data.products[productIndex].quantity -= sale.quantity;
  }
  
  saveData(data);
};

export const getLoginAttempts = (username: string): LoginAttempt | undefined => {
  const data = loadData();
  return data.loginAttempts[username];
};

export const updateLoginAttempts = (username: string, attempt: LoginAttempt): void => {
  const data = loadData();
  data.loginAttempts[username] = attempt;
  saveData(data);
};

export const clearLoginAttempts = (username: string): void => {
  const data = loadData();
  delete data.loginAttempts[username];
  saveData(data);
};

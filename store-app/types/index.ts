export type UserRole = 'owner' | 'admin';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  email?: string;
  createdAt: string;
  createdBy?: string;
}

export interface LoginAttempt {
  username: string;
  attempts: number;
  lockedUntil?: number;
  requiresEmailVerification?: boolean;
}

export interface StoreSettings {
  logo?: string;
  storeName: string;
  address: string;
  adminName: string;
  customerService: string;
  theme: 'light' | 'dark';
  language: 'id' | 'en';
  currency: string;
  timezone: string;
  loginMessage: string;
  loginImage?: string;
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  profitPercentage: number;
  quantity: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  purchasePrice?: number;
  sellingPrice?: number;
  date: string;
  createdBy: string;
  notes?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  purchasePrice: number;
  profit: number;
  profitPercentage: number;
  date: string;
  createdBy: string;
}

export interface AppData {
  users: User[];
  settings: StoreSettings;
  products: Product[];
  stockTransactions: StockTransaction[];
  sales: Sale[];
  loginAttempts: Record<string, LoginAttempt>;
}

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

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  profitPercentage: number;
  stock: number;
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
  buyPrice?: number;
  sellPrice?: number;
  date: string;
  createdBy: string;
  notes?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitPercentage: number;
  date: string;
  createdBy: string;
}

export interface AppSettings {
  storeName: string;
  storeAddress: string;
  storeLogo?: string;
  storeAdmin: string;
  storeCS: string;
  theme: 'light' | 'dark';
  language: 'id' | 'en';
  currency: string;
  timezone: string;
  loginMessage: string;
  loginImage?: string;
  ownerEmail?: string;
}

export interface LoginAttempt {
  count: number;
  lastAttempt: string;
  lockedUntil?: string;
}

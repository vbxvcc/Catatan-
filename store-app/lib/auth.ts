import { User } from '@/types';
import { getUsers, getLoginAttempts, updateLoginAttempts, clearLoginAttempts } from './storage';

export const authenticateUser = (username: string, password: string): { success: boolean; user?: User; error?: string } => {
  const loginAttempt = getLoginAttempts(username);
  
  if (loginAttempt) {
    if (loginAttempt.lockedUntil && Date.now() < loginAttempt.lockedUntil) {
      const remainingTime = Math.ceil((loginAttempt.lockedUntil - Date.now()) / 1000 / 60);
      return { success: false, error: `Akun terkunci. Tunggu ${remainingTime} menit lagi.` };
    }
    
    if (loginAttempt.requiresEmailVerification) {
      return { success: false, error: 'Verifikasi email diperlukan. Silakan periksa email Anda.' };
    }
  }
  
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    clearLoginAttempts(username);
    return { success: true, user };
  }
  
  const attempts = (loginAttempt?.attempts || 0) + 1;
  
  if (attempts >= 10) {
    updateLoginAttempts(username, {
      username,
      attempts,
      requiresEmailVerification: true,
    });
    return { success: false, error: 'Terlalu banyak percobaan gagal. Verifikasi email diperlukan.' };
  } else if (attempts >= 3) {
    const lockDuration = 5 * 60 * 1000;
    updateLoginAttempts(username, {
      username,
      attempts,
      lockedUntil: Date.now() + lockDuration,
    });
    return { success: false, error: 'Terlalu banyak percobaan gagal. Tunggu 5 menit.' };
  } else {
    updateLoginAttempts(username, {
      username,
      attempts,
    });
    return { success: false, error: `Username atau password salah. Percobaan ${attempts}/3` };
  }
};

export const calculateProfit = (purchasePrice: number, sellingPrice: number): number => {
  if (purchasePrice === 0) return 0;
  return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

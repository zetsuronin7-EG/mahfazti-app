import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CurrencyCode,
  CURRENCIES,
  Transaction,
  TransactionType,
  Wallet,
  CategoryKey,
} from '../types';

interface TransferPayload {
  sourceWalletId: string;
  targetWalletId: string;
  amount: number;
  targetAmount?: number;
  note?: string;
  date?: string;
}

interface NewTransactionPayload {
  type: TransactionType;
  walletId: string;
  amount: number;
  currency: CurrencyCode;
  category: CategoryKey;
  note?: string;
  date?: string;
}

interface WalletContextType {
  wallets: Wallet[];
  transactions: Transaction[];
  baseCurrency: CurrencyCode;
  setBaseCurrency: (c: CurrencyCode) => void;
  ratesToEgp: Record<CurrencyCode, number>;
  setExchangeRate: (code: CurrencyCode, rate: number) => void;
  
  // Wallet operations
  addWallet: (wallet: Omit<Wallet, 'id' | 'createdAt' | 'balance'> & { initialBalance: number }) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  adjustBalance: (walletId: string, newBalance: number) => void;

  // Transaction operations
  addTransaction: (payload: NewTransactionPayload) => void;
  transferMoney: (payload: TransferPayload) => boolean;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, payload: Partial<Transaction>) => void;

  // Aggregated totals
  getTotalBalanceInBaseCurrency: () => number;
  getMonthlyStats: () => { income: number; expense: number; net: number; savingsRate: number };

  // Local storage management
  resetToSampleData: () => void;
  clearAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const STORAGE_KEY_WALLETS = 'mahfazti_wallets_v3';
const STORAGE_KEY_TXS = 'mahfazti_transactions_v3';
const STORAGE_KEY_SETTINGS = 'mahfazti_settings_v3';

// Clean up legacy mock data keys if they exist in localStorage
try {
  localStorage.removeItem('mahfazti_wallets_v2');
  localStorage.removeItem('mahfazti_transactions_v2');
} catch {}

const INITIAL_WALLETS: Wallet[] = [];
const INITIAL_TRANSACTIONS: Transaction[] = [];

const DEFAULT_RATES: Record<CurrencyCode, number> = {
  EGP: 1,
  USD: 49.5,
  EUR: 53.8,
  SAR: 13.2,
  AED: 13.5,
  KWD: 161.5,
};

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WALLETS);
      return stored ? JSON.parse(stored) : INITIAL_WALLETS;
    } catch {
      return INITIAL_WALLETS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TXS);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.baseCurrency) return parsed.baseCurrency;
      }
      return 'EGP';
    } catch {
      return 'EGP';
    }
  });

  const [ratesToEgp, setRatesToEgp] = useState<Record<CurrencyCode, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.ratesToEgp) return { ...DEFAULT_RATES, ...parsed.ratesToEgp };
      }
      return DEFAULT_RATES;
    } catch {
      return DEFAULT_RATES;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WALLETS, JSON.stringify(wallets));
    } catch (err) {
      console.error('Failed saving wallets to localStorage', err);
    }
  }, [wallets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(transactions));
    } catch (err) {
      console.error('Failed saving transactions to localStorage', err);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ baseCurrency, ratesToEgp })
      );
    } catch (err) {
      console.error('Failed saving settings to localStorage', err);
    }
  }, [baseCurrency, ratesToEgp]);

  const setExchangeRate = (code: CurrencyCode, rate: number) => {
    if (rate <= 0) return;
    setRatesToEgp((prev) => ({ ...prev, [code]: rate }));
  };

  // Add Wallet
  const addWallet = (
    data: Omit<Wallet, 'id' | 'createdAt' | 'balance'> & { initialBalance: number }
  ) => {
    const newId = 'w-' + Date.now();
    const newWallet: Wallet = {
      ...data,
      id: newId,
      balance: Number(data.initialBalance) || 0,
      createdAt: new Date().toISOString(),
    };
    setWallets((prev) => [newWallet, ...prev]);
  };

  // Update Wallet
  const updateWallet = (id: string, updates: Partial<Wallet>) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  // Adjust Wallet Balance
  const adjustBalance = (walletId: string, newBalance: number) => {
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id !== walletId) return w;
        return { ...w, balance: Number(newBalance) };
      })
    );
  };

  // Delete Wallet
  const deleteWallet = (id: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
    // Also remove associated transactions
    setTransactions((prev) =>
      prev.filter((t) => t.walletId !== id && t.targetWalletId !== id)
    );
  };

  // Add Transaction (Expense or Income)
  const addTransaction = (payload: NewTransactionPayload) => {
    const wallet = wallets.find((w) => w.id === payload.walletId);
    if (!wallet) return;

    const amount = Number(payload.amount);
    if (amount <= 0 || isNaN(amount)) return;

    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: payload.type,
      walletId: payload.walletId,
      amount,
      currency: payload.currency,
      category: payload.category,
      note: payload.note?.trim() || undefined,
      date: payload.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Update wallet balance
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id !== payload.walletId) return w;
        const delta = payload.type === 'income' ? amount : -amount;
        return { ...w, balance: w.balance + delta };
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Transfer Money between any two wallets
  const transferMoney = (payload: TransferPayload): boolean => {
    const sourceWallet = wallets.find((w) => w.id === payload.sourceWalletId);
    const targetWallet = wallets.find((w) => w.id === payload.targetWalletId);

    if (!sourceWallet || !targetWallet || sourceWallet.id === targetWallet.id) {
      return false;
    }

    const amount = Number(payload.amount);
    if (amount <= 0 || isNaN(amount)) return false;

    // Calculate target amount (handles cross currency transfer!)
    let targetAmount = Number(payload.targetAmount);
    if (!targetAmount || isNaN(targetAmount) || targetAmount <= 0) {
      if (sourceWallet.currency === targetWallet.currency) {
        targetAmount = amount;
      } else {
        // Convert via EGP rate
        const srcRate = ratesToEgp[sourceWallet.currency] || 1;
        const tgtRate = ratesToEgp[targetWallet.currency] || 1;
        const inEgp = amount * srcRate;
        targetAmount = inEgp / tgtRate;
      }
    }

    const txDate = payload.date || new Date().toISOString();

    const transferTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: 'transfer',
      walletId: sourceWallet.id,
      targetWalletId: targetWallet.id,
      amount,
      currency: sourceWallet.currency,
      targetAmount,
      targetCurrency: targetWallet.currency,
      category: 'transfer',
      note: payload.note?.trim() || `تحويل من ${sourceWallet.name} إلى ${targetWallet.name}`,
      date: txDate,
      createdAt: new Date().toISOString(),
    };

    // Apply balances
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === sourceWallet.id) {
          return { ...w, balance: w.balance - amount };
        }
        if (w.id === targetWallet.id) {
          return { ...w, balance: w.balance + targetAmount };
        }
        return w;
      })
    );

    setTransactions((prev) => [transferTx, ...prev]);
    return true;
  };

  // Delete transaction with clean balance rollback
  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setWallets((prev) =>
      prev.map((w) => {
        if (tx.type === 'expense' && w.id === tx.walletId) {
          return { ...w, balance: w.balance + tx.amount };
        }
        if (tx.type === 'income' && w.id === tx.walletId) {
          return { ...w, balance: w.balance - tx.amount };
        }
        if (tx.type === 'transfer') {
          if (w.id === tx.walletId) {
            return { ...w, balance: w.balance + tx.amount };
          }
          if (w.id === tx.targetWalletId) {
            const added = tx.targetAmount || tx.amount;
            return { ...w, balance: w.balance - added };
          }
        }
        return w;
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Update transaction (revert old impact, apply new impact)
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const oldTx = transactions.find((t) => t.id === id);
    if (!oldTx) return;

    const newTx = { ...oldTx, ...updates };

    // Update balances by calculating net diff
    setWallets((prev) =>
      prev.map((w) => {
        let currentBalance = w.balance;

        // Revert old tx
        if (oldTx.type === 'expense' && w.id === oldTx.walletId) {
          currentBalance += oldTx.amount;
        } else if (oldTx.type === 'income' && w.id === oldTx.walletId) {
          currentBalance -= oldTx.amount;
        } else if (oldTx.type === 'transfer') {
          if (w.id === oldTx.walletId) currentBalance += oldTx.amount;
          if (w.id === oldTx.targetWalletId) currentBalance -= (oldTx.targetAmount || oldTx.amount);
        }

        // Apply new tx
        if (newTx.type === 'expense' && w.id === newTx.walletId) {
          currentBalance -= newTx.amount;
        } else if (newTx.type === 'income' && w.id === newTx.walletId) {
          currentBalance += newTx.amount;
        } else if (newTx.type === 'transfer') {
          if (w.id === newTx.walletId) currentBalance -= newTx.amount;
          if (w.id === newTx.targetWalletId) currentBalance += (newTx.targetAmount || newTx.amount);
        }

        return { ...w, balance: currentBalance };
      })
    );

    setTransactions((prev) => prev.map((t) => (t.id === id ? newTx : t)));
  };

  // Aggregated total in base currency
  const getTotalBalanceInBaseCurrency = () => {
    const targetRate = ratesToEgp[baseCurrency] || 1;
    return wallets.reduce((total, w) => {
      const srcRate = ratesToEgp[w.currency] || 1;
      const inEgp = w.balance * srcRate;
      const inBase = inEgp / targetRate;
      return total + inBase;
    }, 0);
  };

  // Monthly stats (current calendar month)
  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalIncome = 0;
    let totalExpense = 0;

    const baseRate = ratesToEgp[baseCurrency] || 1;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      if (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      ) {
        const txRate = ratesToEgp[tx.currency] || 1;
        const inBase = (tx.amount * txRate) / baseRate;

        if (tx.type === 'income') {
          totalIncome += inBase;
        } else if (tx.type === 'expense') {
          totalExpense += inBase;
        }
      }
    });

    const net = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, (net / totalIncome) * 100) : 0;

    return {
      income: totalIncome,
      expense: totalExpense,
      net,
      savingsRate,
    };
  };

  const resetToSampleData = () => {
    setWallets(INITIAL_WALLETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBaseCurrency('EGP');
    setRatesToEgp(DEFAULT_RATES);
  };

  const clearAllData = () => {
    setWallets([]);
    setTransactions([]);
  };

  const exportDataJson = () => {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      wallets,
      transactions,
      settings: { baseCurrency, ratesToEgp },
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.wallets) && Array.isArray(data.transactions)) {
        setWallets(data.wallets);
        setTransactions(data.transactions);
        if (data.settings?.baseCurrency) {
          setBaseCurrency(data.settings.baseCurrency);
        }
        if (data.settings?.ratesToEgp) {
          setRatesToEgp({ ...DEFAULT_RATES, ...data.settings.ratesToEgp });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to import JSON', err);
      return false;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        transactions,
        baseCurrency,
        setBaseCurrency,
        ratesToEgp,
        setExchangeRate,
        addWallet,
        updateWallet,
        deleteWallet,
        adjustBalance,
        addTransaction,
        transferMoney,
        deleteTransaction,
        updateTransaction,
        getTotalBalanceInBaseCurrency,
        getMonthlyStats,
        resetToSampleData,
        clearAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

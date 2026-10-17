export type CurrencyCode = 'EGP' | 'USD' | 'EUR' | 'SAR' | 'AED' | 'KWD';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  symbolAr: string;
  defaultRateToEgp: number; // Approximate exchange rate for aggregated view
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EGP: { code: 'EGP', name: 'جنيه مصري', symbol: 'EGP', symbolAr: 'ج.م', defaultRateToEgp: 1 },
  USD: { code: 'USD', name: 'دولار أمريكي', symbol: '$', symbolAr: '$', defaultRateToEgp: 49.5 },
  EUR: { code: 'EUR', name: 'يورو', symbol: '€', symbolAr: '€', defaultRateToEgp: 53.8 },
  SAR: { code: 'SAR', name: 'ريال سعودي', symbol: 'SAR', symbolAr: 'ر.س', defaultRateToEgp: 13.2 },
  AED: { code: 'AED', name: 'درهم إماراتي', symbol: 'AED', symbolAr: 'د.إ', defaultRateToEgp: 13.5 },
  KWD: { code: 'KWD', name: 'دينار كويتي', symbol: 'KWD', symbolAr: 'د.ك', defaultRateToEgp: 161.5 },
};

export type WalletColor = 'emerald' | 'sky' | 'purple' | 'amber' | 'rose' | 'indigo' | 'slate' | 'teal';

export type WalletIcon = 
  | 'wallet'
  | 'smartphone'
  | 'bank'
  | 'creditCard'
  | 'piggyBank'
  | 'coins'
  | 'briefcase'
  | 'shieldCheck';

export interface Wallet {
  id: string;
  name: string;
  currency: CurrencyCode;
  balance: number;
  initialBalance: number;
  color: WalletColor;
  icon: WalletIcon;
  createdAt: string;
  description?: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer';

export type ExpenseCategoryKey =
  | 'food'
  | 'transport'
  | 'bills'
  | 'shopping'
  | 'health'
  | 'housing'
  | 'entertainment'
  | 'education'
  | 'debt'
  | 'other_expense';

export type IncomeCategoryKey =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'bonus'
  | 'sales'
  | 'other_income';

export type CategoryKey = ExpenseCategoryKey | IncomeCategoryKey | 'transfer';

export interface CategoryItem {
  id: CategoryKey;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  walletId: string; // Source wallet (or primary wallet)
  targetWalletId?: string; // For transfers: destination wallet
  targetAmount?: number; // For transfers across currencies
  targetCurrency?: CurrencyCode;
  category: CategoryKey;
  note?: string;
  date: string; // ISO string YYYY-MM-DDTHH:mm:ss
  createdAt: string;
}

export type ActiveTab = 'dashboard' | 'wallets' | 'transactions' | 'analytics' | 'settings';

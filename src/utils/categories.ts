import {
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Home,
  Film,
  GraduationCap,
  ArrowRightLeft,
  CircleDollarSign,
  Briefcase,
  TrendingUp,
  Gift,
  Tag,
  HelpCircle,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react';
import { CategoryItem, CategoryKey, ExpenseCategoryKey, IncomeCategoryKey } from '../types';

export interface CategoryMeta {
  id: CategoryKey;
  name: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategoryKey, CategoryMeta> = {
  food: {
    id: 'food',
    name: 'طعام ومشروبات',
    icon: Utensils,
    bgColor: 'bg-orange-500/15',
    textColor: 'text-orange-400',
  },
  transport: {
    id: 'transport',
    name: 'مواصلات ونقل',
    icon: Car,
    bgColor: 'bg-blue-500/15',
    textColor: 'text-blue-400',
  },
  bills: {
    id: 'bills',
    name: 'فواتير ومرافق',
    icon: Receipt,
    bgColor: 'bg-amber-500/15',
    textColor: 'text-amber-400',
  },
  shopping: {
    id: 'shopping',
    name: 'تسوق ومشتريات',
    icon: ShoppingBag,
    bgColor: 'bg-pink-500/15',
    textColor: 'text-pink-400',
  },
  health: {
    id: 'health',
    name: 'صحة وصيدلية',
    icon: HeartPulse,
    bgColor: 'bg-rose-500/15',
    textColor: 'text-rose-400',
  },
  housing: {
    id: 'housing',
    name: 'سكن وإيجار',
    icon: Home,
    bgColor: 'bg-teal-500/15',
    textColor: 'text-teal-400',
  },
  entertainment: {
    id: 'entertainment',
    name: 'ترفيه وخروجات',
    icon: Film,
    bgColor: 'bg-purple-500/15',
    textColor: 'text-purple-400',
  },
  education: {
    id: 'education',
    name: 'تعليم ودورات',
    icon: GraduationCap,
    bgColor: 'bg-indigo-500/15',
    textColor: 'text-indigo-400',
  },
  debt: {
    id: 'debt',
    name: 'سداد ديون والتزامات',
    icon: CircleDollarSign,
    bgColor: 'bg-red-500/15',
    textColor: 'text-red-400',
  },
  other_expense: {
    id: 'other_expense',
    name: 'مصاريف أخرى',
    icon: HelpCircle,
    bgColor: 'bg-slate-500/15',
    textColor: 'text-slate-400',
  },
};

export const INCOME_CATEGORIES: Record<IncomeCategoryKey, CategoryMeta> = {
  salary: {
    id: 'salary',
    name: 'راتب شهري',
    icon: Briefcase,
    bgColor: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
  },
  freelance: {
    id: 'freelance',
    name: 'عمل حر / فريلانس',
    icon: TrendingUp,
    bgColor: 'bg-cyan-500/15',
    textColor: 'text-cyan-400',
  },
  investment: {
    id: 'investment',
    name: 'أرباح واستثمارات',
    icon: PiggyBank,
    bgColor: 'bg-lime-500/15',
    textColor: 'text-lime-400',
  },
  bonus: {
    id: 'bonus',
    name: 'مكافأة أو هدية',
    icon: Gift,
    bgColor: 'bg-amber-500/15',
    textColor: 'text-amber-400',
  },
  sales: {
    id: 'sales',
    name: 'بيع أو مستردات',
    icon: Tag,
    bgColor: 'bg-sky-500/15',
    textColor: 'text-sky-400',
  },
  other_income: {
    id: 'other_income',
    name: 'إيرادات أخرى',
    icon: HelpCircle,
    bgColor: 'bg-teal-500/15',
    textColor: 'text-teal-400',
  },
};

export const TRANSFER_CATEGORY: CategoryMeta = {
  id: 'transfer',
  name: 'تحويل بين المحافظ',
  icon: ArrowRightLeft,
  bgColor: 'bg-violet-500/15',
  textColor: 'text-violet-400',
};

export function getCategoryMeta(key: CategoryKey): CategoryMeta {
  if (key === 'transfer') return TRANSFER_CATEGORY;
  if (key in EXPENSE_CATEGORIES) return EXPENSE_CATEGORIES[key as ExpenseCategoryKey];
  if (key in INCOME_CATEGORIES) return INCOME_CATEGORIES[key as IncomeCategoryKey];
  return {
    id: key,
    name: 'أخرى',
    icon: HelpCircle,
    bgColor: 'bg-slate-500/15',
    textColor: 'text-slate-400',
  };
}

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRightLeft,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  Receipt,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ActiveTab, CURRENCIES, Transaction } from '../types';
import { WalletIconBadge, getWalletGradient } from './WalletIconBadge';
import { formatCurrency, formatTransactionDate } from '../utils/formatters';
import { getCategoryMeta } from '../utils/categories';
import { WalletBrandLogo } from './WalletBrandLogo';

interface Props {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onOpenTransfer: () => void;
  onOpenAddWallet: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<Props> = ({
  setActiveTab,
  onOpenAddExpense,
  onOpenAddIncome,
  onOpenTransfer,
  onOpenAddWallet,
  onSelectTransaction,
}) => {
  const {
    wallets,
    transactions,
    baseCurrency,
    getTotalBalanceInBaseCurrency,
    getMonthlyStats,
  } = useWallet();

  const totalBalance = getTotalBalanceInBaseCurrency();
  const monthly = getMonthlyStats();

  // Currency breakdown
  const currencyTotals: Record<string, number> = {};
  wallets.forEach((w) => {
    currencyTotals[w.currency] = (currencyTotals[w.currency] || 0) + w.balance;
  });

  // Category breakdown for current month expenses
  const categoryExpenses: Record<string, number> = {};
  let totalExpensesThisMonth = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      const d = new Date(tx.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        // Approximate to base currency for clean visual aggregation
        categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount;
        totalExpensesThisMonth += tx.amount;
      }
    }
  });

  const sortedCategories = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Onboarding Welcome Banner if no wallets yet */}
      {wallets.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 shadow-xl text-center space-y-4 max-w-xl mx-auto">
          <div className="flex justify-center">
            <WalletBrandLogo size="lg" variant="emblem" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              لا توجد محافظ مضافة حتى الآن
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              أضف محفظتك الأولى (مثل كاش أو حساب بنكي) لبدء تسجيل رصيدك ومتابعة مصاريفك وتحويلاتك.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenAddWallet}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة محفظة جديدة</span>
            </button>
          </div>
        </div>
      ) : (
        /* Consolidated Net Worth Card */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-7 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  إجمالي الرصيد
                </span>
                <div className="text-xs text-slate-400">
                  عملة العرض: <strong className="text-slate-200">{CURRENCIES[baseCurrency]?.name}</strong>
                </div>
              </div>

              {/* Big Balance Number */}
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                  {formatCurrency(totalBalance, baseCurrency)}
                </h1>
              </div>

              {/* Currency Sub-totals Bar */}
              {Object.keys(currencyTotals).length > 1 && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">حسب العملة:</span>
                  {Object.entries(currencyTotals).map(([curr, val]) => (
                    <span
                      key={curr}
                      className="text-xs font-mono font-semibold text-slate-300 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5"
                    >
                      {formatCurrency(val, curr as any)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center justify-center p-2 rounded-2xl bg-slate-950/60 border border-slate-800 self-center">
              <WalletBrandLogo size="md" variant="emblem" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Buttons Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenAddExpense}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 transition active:scale-95 cursor-pointer shadow-sm group"
        >
          <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
            <ArrowDownRight className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">تسجيل مصروف</span>
        </button>

        <button
          onClick={onOpenAddIncome}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 transition active:scale-95 cursor-pointer shadow-sm group"
        >
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">تسجيل إيراد</span>
        </button>

        <button
          onClick={onOpenTransfer}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-violet-950/20 hover:bg-violet-950/40 border border-violet-500/30 text-violet-300 transition active:scale-95 cursor-pointer shadow-sm group"
        >
          <div className="p-1.5 rounded-xl bg-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">تحويل أموال</span>
        </button>

        <button
          onClick={onOpenAddWallet}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition active:scale-95 cursor-pointer shadow-sm group"
        >
          <div className="p-1.5 rounded-xl bg-slate-800 text-emerald-400 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">محفظة جديدة</span>
        </button>
      </div>

      {/* Monthly KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              دخل هذا الشهر
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              +{formatCurrency(monthly.income, baseCurrency)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              مصاريف هذا الشهر
            </span>
            <span className="text-xl font-bold font-mono text-rose-400">
              -{formatCurrency(monthly.expense, baseCurrency)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              صافي الفائض / التوفير
            </span>
            <span
              className={`text-xl font-bold font-mono ${
                monthly.net >= 0 ? 'text-teal-400' : 'text-amber-400'
              }`}
            >
              {formatCurrency(monthly.net, baseCurrency)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Wallets Showcase Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <WalletIcon className="w-4 h-4 text-emerald-400" />
            المحافظ المالية ({wallets.length})
          </h2>
          <button
            onClick={() => setActiveTab('wallets')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
          >
            <span>إدارة المحافظ</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-3">لم تقم بإضافة أي محفظة حتى الآن.</p>
            <button
              onClick={onOpenAddWallet}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              إنشاء أول محفظة الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {wallets.map((w) => {
              const bgGradient = getWalletGradient(w.color);
              return (
                <div
                  key={w.id}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${bgGradient} border border-slate-800/80 shadow-md relative overflow-hidden transition hover:border-slate-700`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <WalletIconBadge icon={w.icon} color={w.color} size="md" />
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-950/60 rounded-md px-2 py-0.5 border border-slate-800">
                      {w.currency}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white truncate">{w.name}</h3>
                    <div className="text-lg font-extrabold font-mono text-emerald-300 tracking-tight">
                      {formatCurrency(w.balance, w.currency)}
                    </div>
                  </div>

                  {w.description && (
                    <p className="text-[10px] text-slate-400 mt-2 truncate">
                      {w.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Section: Category Distribution & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">أبرز مصاريف هذا الشهر</h3>
            <span className="text-xs font-mono text-slate-400">
              {formatCurrency(totalExpensesThisMonth, baseCurrency)}
            </span>
          </div>

          {sortedCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              لا توجد مصاريف مسجلة هذا الشهر حتى الآن.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([catKey, catAmount]) => {
                const meta = getCategoryMeta(catKey as any);
                const Icon = meta.icon;
                const percentage = totalExpensesThisMonth > 0
                  ? Math.round((catAmount / totalExpensesThisMonth) * 100)
                  : 0;

                return (
                  <div key={catKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${meta.bgColor}`}>
                          <Icon className={`w-3.5 h-3.5 ${meta.textColor}`} />
                        </div>
                        <span className="font-semibold text-slate-200">{meta.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300 font-bold">
                          {formatCurrency(catAmount, baseCurrency)}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              آخر المعاملات
            </h3>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>عرض سجل المعاملات</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              لم تقم بتسجيل أي معاملة بعد.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {recentTransactions.map((tx) => {
                const meta = getCategoryMeta(tx.category);
                const Icon = meta.icon;
                const wallet = wallets.find((w) => w.id === tx.walletId);
                const targetWallet = tx.targetWalletId
                  ? wallets.find((w) => w.id === tx.targetWalletId)
                  : null;

                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${meta.bgColor}`}>
                        <Icon className={`w-4 h-4 ${meta.textColor}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">
                          {tx.type === 'transfer' ? 'تحويل بين المحافظ' : meta.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <span>
                            {tx.type === 'transfer'
                              ? `${wallet?.name || 'محفظة'} ➔ ${targetWallet?.name || 'محفظة'}`
                              : wallet?.name || 'محفظة'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{formatTransactionDate(tx.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div
                        className={`text-xs font-extrabold font-mono ${
                          tx.type === 'expense'
                            ? 'text-rose-400'
                            : tx.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-violet-400'
                        }`}
                      >
                        {tx.type === 'expense' && '-'}
                        {tx.type === 'income' && '+'}
                        {formatCurrency(tx.amount, tx.currency)}
                      </div>
                      {tx.note && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {tx.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { getCategoryMeta } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';
import { WalletIconBadge } from './WalletIconBadge';

export const AnalyticsView: React.FC = () => {
  const { transactions, wallets, baseCurrency, ratesToEgp, getMonthlyStats } = useWallet();

  const [timeRange, setTimeRange] = useState<'thisMonth' | 'allTime'>('thisMonth');

  const monthly = getMonthlyStats();
  const baseRate = ratesToEgp[baseCurrency] || 1;

  // Filter transactions based on time range
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const targetTransactions = transactions.filter((tx) => {
    if (timeRange === 'thisMonth') {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }
    return true;
  });

  // Category breakdown for expenses
  const categoryMap: Record<string, number> = {};
  let totalExpenses = 0;
  let totalIncome = 0;

  targetTransactions.forEach((tx) => {
    const txRate = ratesToEgp[tx.currency] || 1;
    const inBase = (tx.amount * txRate) / baseRate;

    if (tx.type === 'expense') {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + inBase;
      totalExpenses += inBase;
    } else if (tx.type === 'income') {
      totalIncome += inBase;
    }
  });

  const sortedCategories = Object.entries(categoryMap).sort(([, a], [, b]) => b - a);

  // Wallets distribution
  const totalWealth = wallets.reduce((sum, w) => {
    const rate = ratesToEgp[w.currency] || 1;
    return sum + (w.balance * rate) / baseRate;
  }, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, (netSavings / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            التقارير والإحصائيات المالية
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            تحليل دقيق لسلوك الصرف، مصادر الدخل، ومعدل الادخار الشهري
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeRange('thisMonth')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              timeRange === 'thisMonth'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            هذا الشهر
          </button>
          <button
            onClick={() => setTimeRange('allTime')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              timeRange === 'allTime'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            كامل الفترة
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>إجمالي الإيرادات</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            +{formatCurrency(totalIncome, baseCurrency)}
          </div>
          <span className="text-[11px] text-slate-500">
            {timeRange === 'thisMonth' ? 'خلال الشهر الحالي' : 'مجموع كل الدخول المسجلة'}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>إجمالي المصروفات</span>
            <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            -{formatCurrency(totalExpenses, baseCurrency)}
          </div>
          <span className="text-[11px] text-slate-500">
            {timeRange === 'thisMonth' ? 'خلال الشهر الحالي' : 'مجموع كل المصاريف المسجلة'}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>معدل الادخار / الفائض</span>
            <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-black font-mono ${
                netSavings >= 0 ? 'text-teal-400' : 'text-amber-400'
              }`}
            >
              {formatCurrency(netSavings, baseCurrency)}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              ({savingsRate.toFixed(0)}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {netSavings >= 0 ? 'فائض مالي إيجابي محفوظ' : 'مصاريف زائدة عن الإيرادات'}
          </span>
        </div>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">توزيع المصروفات حسب التصنيف</h3>
            <span className="text-xs font-mono text-slate-400">
              {formatCurrency(totalExpenses, baseCurrency)}
            </span>
          </div>

          {sortedCategories.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              لا توجد مصاريف مسجلة في هذه الفترة لعرض التحليل.
            </div>
          ) : (
            <div className="space-y-3.5">
              {sortedCategories.map(([catKey, amount]) => {
                const meta = getCategoryMeta(catKey as any);
                const Icon = meta.icon;
                const percentage =
                  totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;

                return (
                  <div key={catKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-xl ${meta.bgColor}`}>
                          <Icon className={`w-3.5 h-3.5 ${meta.textColor}`} />
                        </div>
                        <span className="font-semibold text-slate-200">{meta.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          {formatCurrency(amount, baseCurrency)}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 w-10 text-left">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Wealth Distribution across Wallets */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <WalletIcon className="w-4 h-4 text-emerald-400" />
              توزيع الأرصدة عبر المحافظ
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {formatCurrency(totalWealth, baseCurrency)}
            </span>
          </div>

          {wallets.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              لا توجد محافظ مضافة حالياً لعرض توزيع الأرصدة.
            </div>
          ) : (
            <div className="space-y-3.5">
              {wallets.map((w) => {
              const rate = ratesToEgp[w.currency] || 1;
              const inBase = (w.balance * rate) / baseRate;
              const percentage =
                totalWealth > 0 ? Math.max(0, Math.round((inBase / totalWealth) * 100)) : 0;

              return (
                <div key={w.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <WalletIconBadge icon={w.icon} color={w.color} size="sm" />
                      <div>
                        <span className="font-bold text-white block">{w.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatCurrency(w.balance, w.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-300">
                        ≈ {formatCurrency(inBase, baseCurrency)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 w-10 text-left">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
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

import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Check, Calendar, StickyNote } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../utils/categories';
import { CategoryKey, TransactionType } from '../../types';
import { WalletIconBadge } from '../WalletIconBadge';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  defaultWalletId?: string;
  onOpenAddWallet?: () => void;
}

export const AddTransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  defaultWalletId,
  onOpenAddWallet,
}) => {
  const { wallets, addTransaction } = useWallet();

  const [type, setType] = useState<TransactionType>(defaultType === 'transfer' ? 'expense' : defaultType);
  const [walletId, setWalletId] = useState<string>(
    defaultWalletId || wallets[0]?.id || ''
  );
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryKey>('food');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    // format YYYY-MM-DDTHH:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${mins}`;
  });

  if (!isOpen) return null;

  if (wallets.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">لا توجد محافظ مضافة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              أضف محفظتك الأولى (مثل كاش أو حساب بنكي) لتتمكن من تسجيل المصاريف والإيرادات.
            </p>
          </div>
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenAddWallet?.();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              إضافة محفظة الآن
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWallet = wallets.find((w) => w.id === walletId) || wallets[0];
  const categoriesMap = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const categoriesList = Object.values(categoriesMap);

  const quickAmounts = currentWallet?.currency === 'USD' || currentWallet?.currency === 'EUR'
    ? [5, 10, 20, 50, 100]
    : [20, 50, 100, 200, 500];

  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !currentWallet) return;

    addTransaction({
      type,
      walletId: currentWallet.id,
      amount: numAmount,
      currency: currentWallet.currency,
      category,
      note,
      date: new Date(date).toISOString(),
    });

    onClose();
    setAmount('');
    setNote('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('food');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              <span>تسجيل مصروف</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('salary');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>تسجيل إيراد</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {/* Amount Input */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center focus-within:border-emerald-500/60 transition-colors">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              المبلغ ({currentWallet?.currency || 'EGP'})
            </label>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                step="any"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-center text-3xl font-extrabold font-mono bg-transparent text-white focus:outline-none placeholder:text-slate-700"
                required
              />
              <span className="text-sm font-semibold text-emerald-400 font-mono">
                {currentWallet?.currency}
              </span>
            </div>

            {/* Quick add pill buttons */}
            <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAddQuickAmount(q)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 active:scale-95 transition"
                >
                  +{q}
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Wallet Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              من محفظة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {wallets.map((w) => {
                const isSelected = (currentWallet?.id === w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWalletId(w.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-right transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <WalletIconBadge icon={w.icon} color={w.color} size="sm" />
                      <div className="text-right">
                        <div className="text-xs font-bold text-white truncate max-w-[130px]">
                          {w.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {formatCurrency(w.balance, w.currency)}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              التصنيف:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {categoriesList.map((cat) => {
                const isSelected = category === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition cursor-pointer min-h-[58px] ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/30 text-white ring-1 ring-emerald-500/40'
                        : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mb-1 ${cat.bgColor}`}>
                      <Icon className={`w-4 h-4 ${cat.textColor}`} />
                    </div>
                    <span className="text-[11px] font-medium tracking-tight truncate w-full">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                <span>ملاحظة (اختياري):</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثال: قهوة، تسوق كارفور..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>التاريخ والوقت:</span>
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{type === 'expense' ? 'حفظ المصروف' : 'حفظ الإيراد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

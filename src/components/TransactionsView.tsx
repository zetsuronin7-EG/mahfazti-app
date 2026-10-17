import React, { useState, useMemo } from 'react';
import {
  Search,
  ReceiptText,
  Filter,
  Plus,
  ArrowRightLeft,
  ArrowDownRight,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { Transaction, TransactionType } from '../types';
import { getCategoryMeta } from '../utils/categories';
import { formatCurrency, formatTransactionDate } from '../utils/formatters';

interface Props {
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onOpenTransfer: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<Props> = ({
  onOpenAddExpense,
  onOpenAddIncome,
  onOpenTransfer,
  onSelectTransaction,
}) => {
  const { transactions, wallets } = useWallet();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [selectedWalletId, setSelectedWalletId] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }
      // Wallet filter
      if (selectedWalletId !== 'all') {
        if (tx.walletId !== selectedWalletId && tx.targetWalletId !== selectedWalletId) {
          return false;
        }
      }
      // Search term (in note or category or amount)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const catMeta = getCategoryMeta(tx.category);
        const matchNote = tx.note?.toLowerCase().includes(query);
        const matchCategory = catMeta.name.toLowerCase().includes(query);
        const matchAmount = tx.amount.toString().includes(query);
        if (!matchNote && !matchCategory && !matchAmount) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedType, selectedWalletId, searchTerm]);

  // Aggregate stats for currently filtered view
  const { totalFilteredExpense, totalFilteredIncome } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === 'expense') exp += t.amount;
      if (t.type === 'income') inc += t.amount;
    });
    return { totalFilteredExpense: exp, totalFilteredIncome: inc };
  }, [filteredTransactions]);

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-emerald-400" />
            سجل المعاملات اليومية
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            تتبع جميع المصاريف، الإيرادات، والتحويلات مع إمكانية البحث والفلترة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition active:scale-95 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-violet-400" />
            <span>تحويل</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مصروف</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في الملاحظات، التصنيف، أو المبلغ..."
            className="w-full pr-10 pl-9 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Type Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedType === 'all'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل ({transactions.length})
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedType === 'expense'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المصاريف
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedType === 'income'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الإيرادات
            </button>
            <button
              onClick={() => setSelectedType('transfer')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedType === 'transfer'
                  ? 'bg-violet-950/60 text-violet-300 border border-violet-800/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              التحويلات
            </button>
          </div>

          {/* Wallet Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">جميع المحافظ</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
          <span className="text-xs font-semibold text-slate-400">
            عدد النتائج: <strong className="text-white font-mono">{filteredTransactions.length}</strong>
          </span>
          <div className="flex items-center gap-3 text-xs font-mono">
            {totalFilteredExpense > 0 && (
              <span className="text-rose-400 font-semibold">
                المصروفات: -{totalFilteredExpense.toLocaleString('en-US')}
              </span>
            )}
            {totalFilteredIncome > 0 && (
              <span className="text-emerald-400 font-semibold">
                الإيرادات: +{totalFilteredIncome.toLocaleString('en-US')}
              </span>
            )}
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <ReceiptText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-bold text-white">سجل المعاملات فارغ حالياً</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              لم تسجل أي مصروف أو إيراد بعد. يمكنك البدء بالضغط على «إضافة مصروف» لتسجيل أول حركة مالية.
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <ReceiptText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">لا توجد معاملات مطابقة للفلتر</p>
            <p className="text-xs text-slate-500">
              جرب تغيير كلمات البحث أو مسح الفلاتر المحددة.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredTransactions.map((tx) => {
              const meta = getCategoryMeta(tx.category);
              const Icon = meta.icon;
              const sourceW = wallets.find((w) => w.id === tx.walletId);
              const targetW = tx.targetWalletId
                ? wallets.find((w) => w.id === tx.targetWalletId)
                : null;

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-2xl transition cursor-pointer active:scale-99"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${meta.bgColor}`}>
                      <Icon className={`w-4 h-4 ${meta.textColor}`} />
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {tx.type === 'transfer' ? 'تحويل بين المحافظ' : meta.name}
                        </span>
                        {tx.type === 'transfer' && (
                          <span className="text-[10px] bg-violet-950/80 text-violet-300 border border-violet-800/50 rounded-md px-1.5 py-0.2">
                            تحويل
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span>
                          {tx.type === 'transfer'
                            ? `${sourceW?.name || 'محفظة'} ➔ ${targetW?.name || 'محفظة'}`
                            : sourceW?.name || 'محفظة'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">
                          {formatTransactionDate(tx.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <div
                      className={`text-sm font-extrabold font-mono tracking-tight ${
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
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
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
  );
};

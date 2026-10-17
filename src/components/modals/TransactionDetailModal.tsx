import React, { useState } from 'react';
import {
  X,
  Trash2,
  Calendar,
  Wallet as WalletIcon,
  Tag,
  StickyNote,
  ArrowRightLeft,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { Transaction } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { getCategoryMeta } from '../../utils/categories';
import { formatCurrency, formatTransactionDate } from '../../utils/formatters';
import { WalletIconBadge } from '../WalletIconBadge';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<Props> = ({
  transaction,
  onClose,
}) => {
  const { wallets, deleteTransaction } = useWallet();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!transaction) return null;

  const sourceWallet = wallets.find((w) => w.id === transaction.walletId);
  const targetWallet = transaction.targetWalletId
    ? wallets.find((w) => w.id === transaction.targetWalletId)
    : null;

  const catMeta = getCategoryMeta(transaction.category);
  const CatIcon = catMeta.icon;

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${catMeta.bgColor}`}>
              <CatIcon className={`w-5 h-5 ${catMeta.textColor}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">تفاصيل المعاملة</h3>
              <p className="text-[11px] text-slate-400">
                {formatTransactionDate(transaction.date)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Amount Showcase */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              {transaction.type === 'expense' && (
                <span className="flex items-center gap-1 text-rose-400">
                  <ArrowDownRight className="w-4 h-4" />
                  مصروف مخصوم
                </span>
              )}
              {transaction.type === 'income' && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  إيراد مضاف
                </span>
              )}
              {transaction.type === 'transfer' && (
                <span className="flex items-center gap-1 text-violet-400">
                  <ArrowRightLeft className="w-4 h-4" />
                  تحويل رصيد
                </span>
              )}
            </div>

            <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {transaction.type === 'expense' && '-'}
              {transaction.type === 'income' && '+'}
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>

            {transaction.type === 'transfer' && transaction.targetAmount && (
              <div className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                تم استلام {formatCurrency(transaction.targetAmount, transaction.targetCurrency || transaction.currency)}
              </div>
            )}
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs">
            {/* Wallet info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <WalletIcon className="w-3.5 h-3.5" />
                {transaction.type === 'transfer' ? 'المحفظة المصدر:' : 'المحفظة:'}
              </span>
              {sourceWallet ? (
                <span className="font-bold text-white flex items-center gap-1.5">
                  <WalletIconBadge icon={sourceWallet.icon} color={sourceWallet.color} size="sm" />
                  {sourceWallet.name}
                </span>
              ) : (
                <span className="text-slate-500">محفظة محذوفة</span>
              )}
            </div>

            {/* Target wallet if transfer */}
            {transaction.type === 'transfer' && targetWallet && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-violet-400" />
                  المحفظة المستلمة:
                </span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <WalletIconBadge icon={targetWallet.icon} color={targetWallet.color} size="sm" />
                  {targetWallet.name}
                </span>
              </div>
            )}

            {/* Category */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                التصنيف:
              </span>
              <span className="font-bold text-white">{catMeta.name}</span>
            </div>

            {/* Note */}
            {transaction.note && (
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                  <StickyNote className="w-3.5 h-3.5" />
                  الملاحظات:
                </span>
                <span className="text-slate-200 text-left font-medium max-w-[200px] break-words">
                  {transaction.note}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                تاريخ التسجيل:
              </span>
              <span className="font-mono text-slate-300">
                {new Date(transaction.date).toLocaleString('ar-EG')}
              </span>
            </div>
          </div>

          {/* Delete actions */}
          {!showConfirmDelete ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف المعاملة وإلغاء أثرها من الرصيد</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>تأكيد حذف المعاملة؟</span>
              </div>
              <p className="text-[11px] text-slate-300">
                سيتم استرجاع الرصيد تلقائياً إلى المحفظة كأن المعاملة لم تكن.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                >
                  نعم، احذف المعاملة
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

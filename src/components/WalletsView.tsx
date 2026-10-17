import React, { useState } from 'react';
import {
  Plus,
  ArrowRightLeft,
  Edit2,
  Trash2,
  Sliders,
  AlertTriangle,
  Receipt,
  Layers,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { Wallet, Transaction } from '../types';
import { WalletIconBadge, getWalletGradient } from './WalletIconBadge';
import { formatCurrency, formatTransactionDate } from '../utils/formatters';
import { getCategoryMeta } from '../utils/categories';

interface Props {
  onOpenAddWallet: () => void;
  onEditWallet: (w: Wallet) => void;
  onTransferFromWallet: (walletId: string) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const WalletsView: React.FC<Props> = ({
  onOpenAddWallet,
  onEditWallet,
  onTransferFromWallet,
  onSelectTransaction,
}) => {
  const { wallets, deleteWallet, adjustBalance, transactions } = useWallet();

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);
  const [adjustingWallet, setAdjustingWallet] = useState<Wallet | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState<string>('');

  const activeWallet = wallets.find((w) => w.id === selectedWalletId) || null;

  // Transactions related to activeWallet if selected
  const filteredTransactions = activeWallet
    ? transactions.filter(
        (t) => t.walletId === activeWallet.id || t.targetWalletId === activeWallet.id
      )
    : [];

  const handleOpenAdjust = (w: Wallet) => {
    setAdjustingWallet(w);
    setNewBalanceInput(w.balance.toString());
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingWallet) return;
    const num = parseFloat(newBalanceInput);
    if (!isNaN(num)) {
      adjustBalance(adjustingWallet.id, num);
      setAdjustingWallet(null);
    }
  };

  const confirmDelete = () => {
    if (walletToDelete) {
      deleteWallet(walletToDelete.id);
      if (selectedWalletId === walletToDelete.id) {
        setSelectedWalletId(null);
      }
      setWalletToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            إدارة المحافظ المالية
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة أرصدة حساباتك ومحافظك في مكان واحد
          </p>
        </div>

        <button
          onClick={onOpenAddWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة محفظة</span>
        </button>
      </div>

      {/* Wallets Grid or Empty State */}
      {wallets.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">لا توجد محافظ مضافة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              أضف محفظتك الأولى (كاش أو حساب بنكي) لتسجيل رصيدك ومتابعة حركاتك.
            </p>
          </div>
          <button
            onClick={onOpenAddWallet}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أول محفظة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w) => {
            const bgGradient = getWalletGradient(w.color);
            const isSelected = selectedWalletId === w.id;

            return (
              <div
                key={w.id}
                className={`p-5 rounded-3xl bg-gradient-to-br ${bgGradient} border transition relative overflow-hidden shadow-xl ${
                  isSelected
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/30'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <WalletIconBadge icon={w.icon} color={w.color} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{w.name}</h3>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      {w.currency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => onEditWallet(w)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="تعديل بيانات المحفظة"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenAdjust(w)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="تسوية الرصيد يدوياً"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setWalletToDelete(w)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    title="حذف المحفظة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-4">
                <span className="text-[11px] text-slate-400 block mb-0.5">الرصيد الحالي:</span>
                <div className="text-2xl font-black font-mono text-white tracking-tight">
                  {formatCurrency(w.balance, w.currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  الرصيد الافتتاحي: <span className="font-mono text-slate-300">{formatCurrency(w.initialBalance, w.currency)}</span>
                </div>
              </div>

              {/* Quick Actions for this wallet */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onTransferFromWallet(w.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-violet-950/40 hover:bg-violet-950/70 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>تحويل منها</span>
                </button>

                <button
                  onClick={() =>
                    setSelectedWalletId(isSelected ? null : w.id)
                  }
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition active:scale-95 ${
                    isSelected
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected ? 'إخفاء الحركات' : 'سجل الحركات'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Selected Wallet Transactions Drawer */}
      {activeWallet && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                معاملات محفظة: {activeWallet.name} ({filteredTransactions.length})
              </h3>
            </div>
            <button
              onClick={() => setSelectedWalletId(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              إغلاق
            </button>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              لا توجد معاملات مسجلة لهذه المحفظة بعد.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredTransactions.map((tx) => {
                const meta = getCategoryMeta(tx.category);
                const Icon = meta.icon;
                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${meta.bgColor}`}>
                        <Icon className={`w-4 h-4 ${meta.textColor}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">{meta.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {formatTransactionDate(tx.date)}
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-mono font-bold text-xs">
                      <span
                        className={
                          tx.type === 'expense'
                            ? 'text-rose-400'
                            : tx.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-violet-400'
                        }
                      >
                        {tx.type === 'expense' && '-'}
                        {tx.type === 'income' && '+'}
                        {formatCurrency(tx.amount, tx.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Adjust Balance Modal */}
      {adjustingWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1">
              تسوية رصيد {adjustingWallet.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنك تحديث الرصيد الحالي يدوياً في حال حدوث فرق مع رصيدك الحقيقي.
            </p>
            <form onSubmit={handleSaveAdjust} className="space-y-4">
              <input
                type="number"
                step="any"
                autoFocus
                value={newBalanceInput}
                onChange={(e) => setNewBalanceInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-center text-xl font-bold font-mono rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                >
                  حفظ الرصيد الجديد
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustingWallet(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Wallet Modal */}
      {walletToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-500/40 p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-white">
                حذف محفظة {walletToDelete.name}؟
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تنبيه: سيؤدي حذف المحفظة إلى حذف جميع المعاملات المرتبطة بها نهائياً. هل أنت متأكد من المتابعة؟
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition"
              >
                تأكيد الحذف
              </button>
              <button
                type="button"
                onClick={() => setWalletToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

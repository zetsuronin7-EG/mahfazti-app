import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRightLeft,
  ArrowDown,
  Info,
  Calendar,
  StickyNote,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultSourceId?: string;
  defaultTargetId?: string;
  onOpenAddWallet?: () => void;
}

export const TransferModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultSourceId,
  defaultTargetId,
  onOpenAddWallet,
}) => {
  const { wallets, transferMoney, ratesToEgp } = useWallet();

  // Pick initial source & target
  const initialSource = defaultSourceId || wallets[0]?.id || '';
  const initialTarget =
    defaultTargetId ||
    wallets.find((w) => w.id !== initialSource)?.id ||
    wallets[1]?.id ||
    '';

  const [sourceWalletId, setSourceWalletId] = useState<string>(initialSource);
  const [targetWalletId, setTargetWalletId] = useState<string>(initialTarget);
  const [amount, setAmount] = useState<string>('');
  const [customTargetAmount, setCustomTargetAmount] = useState<string>('');
  const [isCustomTarget, setIsCustomTarget] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${mins}`;
  });

  // Keep source & target in sync whenever modal opens or defaultSourceId changes
  useEffect(() => {
    if (isOpen) {
      const src = defaultSourceId || wallets[0]?.id || '';
      const tgt =
        defaultTargetId ||
        wallets.find((w) => w.id !== src)?.id ||
        wallets[1]?.id ||
        '';
      setSourceWalletId(src);
      setTargetWalletId(tgt);
      setAmount('');
      setCustomTargetAmount('');
      setIsCustomTarget(false);
      setNote('');
    }
  }, [isOpen, defaultSourceId, defaultTargetId, wallets]);

  const sourceWallet = wallets.find((w) => w.id === sourceWalletId) || wallets[0];
  const targetWallet = wallets.find((w) => w.id === targetWalletId) || wallets.find((w) => w.id !== sourceWallet?.id);

  const isCrossCurrency =
    Boolean(sourceWallet && targetWallet && sourceWallet.currency !== targetWallet.currency);

  // Auto calculate target amount based on rates
  useEffect(() => {
    if (!isCustomTarget && sourceWallet && targetWallet) {
      const numAmount = parseFloat(amount);
      if (!numAmount || isNaN(numAmount)) {
        setCustomTargetAmount('');
        return;
      }

      if (sourceWallet.currency === targetWallet.currency) {
        setCustomTargetAmount(numAmount.toString());
      } else {
        const srcRate = ratesToEgp[sourceWallet.currency] || 1;
        const tgtRate = ratesToEgp[targetWallet.currency] || 1;
        const converted = (numAmount * srcRate) / tgtRate;
        setCustomTargetAmount(converted.toFixed(2));
      }
    }
  }, [amount, sourceWalletId, targetWalletId, isCustomTarget, ratesToEgp, sourceWallet, targetWallet]);

  // ALL HOOKS CALLED ABOVE. Safe conditional returns below:
  if (!isOpen) return null;

  // If user has fewer than 2 wallets
  if (wallets.length < 2) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 text-violet-400 flex items-center justify-center mx-auto">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              {wallets.length === 0 ? 'لا توجد محافظ مضافة' : 'تحتاج إلى محفظتين للتحويل'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {wallets.length === 0
                ? 'لإجراء تحويل مالي، أضف أولاً محفظتين (مثلاً كاش وحساب بنكي).'
                : 'التحويل يتم بين محفظتين مختلفتين. يرجى إضافة محفظة أخرى للمتابعة.'}
            </p>
          </div>
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenAddWallet?.();
              }}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-950/50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{wallets.length === 0 ? 'إضافة محفظتك الأولى' : 'إضافة محفظة ثانية'}</span>
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

  const numAmount = parseFloat(amount) || 0;
  const numTargetAmount = parseFloat(customTargetAmount) || 0;

  const sourceBalanceAfter = sourceWallet ? sourceWallet.balance - numAmount : 0;
  const targetBalanceAfter = targetWallet ? targetWallet.balance + numTargetAmount : 0;
  const isOverdrawn = sourceWallet && sourceBalanceAfter < 0;

  const handleSwap = () => {
    if (!targetWallet) return;
    const prevSrc = sourceWalletId;
    const prevTgt = targetWalletId;
    setSourceWalletId(prevTgt);
    setTargetWalletId(prevSrc);
    setIsCustomTarget(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceWallet || !targetWallet || sourceWallet.id === targetWallet.id) return;
    if (numAmount <= 0) return;

    const success = transferMoney({
      sourceWalletId: sourceWallet.id,
      targetWalletId: targetWallet.id,
      amount: numAmount,
      targetAmount: numTargetAmount > 0 ? numTargetAmount : numAmount,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    });

    if (success) {
      onClose();
    }
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

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">تحويل بين المحافظ</h3>
              <p className="text-[11px] text-slate-400">
                تحويل فوري وتحديث تلقائي للأرصدة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {/* Source & Target Wallets with Swap */}
          <div className="space-y-2 relative">
            {/* From Wallet */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">
                  من محفظة:
                </span>
                {sourceWallet && (
                  <span className="text-xs font-mono text-slate-400">
                    الرصيد: {formatCurrency(sourceWallet.balance, sourceWallet.currency)}
                  </span>
                )}
              </div>
              <select
                value={sourceWalletId}
                onChange={(e) => {
                  const newSource = e.target.value;
                  setSourceWalletId(newSource);
                  if (newSource === targetWalletId) {
                    const alt = wallets.find((w) => w.id !== newSource);
                    if (alt) setTargetWalletId(alt.id);
                  }
                  setIsCustomTarget(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatCurrency(w.balance, w.currency)})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 -translate-x-1/2 -my-3 z-10">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-violet-600 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer"
                title="تبديل المحفظتين"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* To Wallet */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">
                  إلى محفظة:
                </span>
                {targetWallet && (
                  <span className="text-xs font-mono text-slate-400">
                    الرصيد: {formatCurrency(targetWallet.balance, targetWallet.currency)}
                  </span>
                )}
              </div>
              <select
                value={targetWalletId}
                onChange={(e) => {
                  const newTarget = e.target.value;
                  setTargetWalletId(newTarget);
                  if (newTarget === sourceWalletId) {
                    const alt = wallets.find((w) => w.id !== newTarget);
                    if (alt) setSourceWalletId(alt.id);
                  }
                  setIsCustomTarget(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatCurrency(w.balance, w.currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center focus-within:border-violet-500/60 transition-colors">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              مبلغ التحويل ({sourceWallet?.currency})
            </label>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                step="any"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setIsCustomTarget(false);
                }}
                placeholder="0.00"
                className="w-full text-center text-3xl font-extrabold font-mono bg-transparent text-white focus:outline-none placeholder:text-slate-700"
                required
              />
              <span className="text-sm font-semibold text-violet-400 font-mono">
                {sourceWallet?.currency}
              </span>
            </div>

            {/* Quick Balance transfer buttons */}
            {sourceWallet && sourceWallet.balance > 0 && (
              <div className="flex items-center justify-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => setAmount((sourceWallet.balance * 0.25).toFixed(0))}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setAmount((sourceWallet.balance * 0.5).toFixed(0))}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(sourceWallet.balance.toString())}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-violet-950 text-violet-300 border border-violet-800/60 hover:bg-violet-900 cursor-pointer"
                >
                  كامل الرصيد
                </button>
              </div>
            )}
          </div>

          {/* Cross currency converted amount if applicable */}
          {isCrossCurrency && targetWallet && (
            <div className="p-3.5 rounded-2xl bg-violet-950/20 border border-violet-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  فرق العملة ({sourceWallet?.currency} ➔ {targetWallet.currency})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomTarget(!isCustomTarget)}
                  className="text-[11px] text-violet-400 hover:underline cursor-pointer"
                >
                  {isCustomTarget ? 'تلقائي' : 'تحديد المبلغ المستلم'}
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  المبلغ المستلم في {targetWallet.name}:
                </label>
                <input
                  type="number"
                  step="any"
                  value={customTargetAmount}
                  onChange={(e) => {
                    setCustomTargetAmount(e.target.value);
                    setIsCustomTarget(true);
                  }}
                  className="w-full bg-slate-900 border border-violet-500/40 rounded-xl px-3 py-2 text-sm font-bold font-mono text-emerald-400 focus:outline-none focus:border-violet-400"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Real-time Balances Preview */}
          {numAmount > 0 && sourceWallet && targetWallet && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">رصيد {sourceWallet.name} بعد التحويل:</span>
                <span
                  className={`font-mono font-bold ${
                    isOverdrawn ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {formatCurrency(sourceBalanceAfter, sourceWallet.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">رصيد {targetWallet.name} بعد الاستلام:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(targetBalanceAfter, targetWallet.currency)}
                </span>
              </div>
              {isOverdrawn && (
                <div className="flex items-center gap-1.5 text-amber-400 text-[11px] pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>تنبيه: المبلغ أكبر من الرصيد المتوفر بالمحفظة</span>
                </div>
              )}
            </div>
          )}

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
                placeholder="مثال: تغذية حساب، سحب نقدي..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>التاريخ:</span>
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-white focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={numAmount <= 0 || !sourceWallet || !targetWallet || sourceWallet.id === targetWallet.id}
              className="w-full py-3 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>إتمام التحويل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

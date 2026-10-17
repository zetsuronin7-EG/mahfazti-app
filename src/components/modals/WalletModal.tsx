import React, { useState, useEffect } from 'react';
import { X, Check, Wallet as WalletIconLucide } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import {
  CurrencyCode,
  CURRENCIES,
  Wallet,
  WalletColor,
  WalletIcon,
} from '../../types';
import { WalletIconBadge } from '../WalletIconBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  walletToEdit?: Wallet | null;
}

const COLORS: { key: WalletColor; name: string; bg: string }[] = [
  { key: 'emerald', name: 'زمردي', bg: 'bg-emerald-500' },
  { key: 'sky', name: 'سماوي', bg: 'bg-sky-500' },
  { key: 'purple', name: 'بنفسجي', bg: 'bg-purple-500' },
  { key: 'amber', name: 'عنبري', bg: 'bg-amber-500' },
  { key: 'rose', name: 'وردي', bg: 'bg-rose-500' },
  { key: 'indigo', name: 'نيلي', bg: 'bg-indigo-500' },
  { key: 'teal', name: 'تركوازي', bg: 'bg-teal-500' },
  { key: 'slate', name: 'رمادي', bg: 'bg-slate-500' },
];

const ICONS: { key: WalletIcon; label: string }[] = [
  { key: 'wallet', label: 'محفظة' },
  { key: 'smartphone', label: 'موبايل كاش' },
  { key: 'bank', label: 'بنك' },
  { key: 'creditCard', label: 'بطاقة' },
  { key: 'piggyBank', label: 'حصالة' },
  { key: 'coins', label: 'نقود' },
  { key: 'briefcase', label: 'عمل' },
  { key: 'shieldCheck', label: 'أمان' },
];

export const WalletModal: React.FC<Props> = ({
  isOpen,
  onClose,
  walletToEdit,
}) => {
  const { addWallet, updateWallet } = useWallet();

  const [name, setName] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyCode>('EGP');
  const [initialBalance, setInitialBalance] = useState<string>('0');
  const [color, setColor] = useState<WalletColor>('emerald');
  const [icon, setIcon] = useState<WalletIcon>('wallet');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (walletToEdit) {
      setName(walletToEdit.name);
      setCurrency(walletToEdit.currency);
      setInitialBalance(walletToEdit.balance.toString());
      setColor(walletToEdit.color);
      setIcon(walletToEdit.icon);
      setDescription(walletToEdit.description || '');
    } else {
      setName('');
      setCurrency('EGP');
      setInitialBalance('0');
      setColor('emerald');
      setIcon('wallet');
      setDescription('');
    }
  }, [walletToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numBalance = parseFloat(initialBalance) || 0;

    if (walletToEdit) {
      updateWallet(walletToEdit.id, {
        name: name.trim(),
        currency,
        balance: numBalance,
        color,
        icon,
        description: description.trim() || undefined,
      });
    } else {
      addWallet({
        name: name.trim(),
        currency,
        initialBalance: numBalance,
        color,
        icon,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <WalletIconBadge icon={icon} color={color} size="sm" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {walletToEdit ? 'تعديل المحفظة' : 'إنشاء محفظة جديدة'}
              </h3>
              <p className="text-[11px] text-slate-400">
                خصص الاسم، العملة، الأيقونة والرصيد
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {/* Wallet Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              اسم المحفظة:
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: فودافون كاش، كاش شخصي، البنك الأهلي..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Currency and Initial Balance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                العملة:
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbolAr} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {walletToEdit ? 'الرصيد الحالي:' : 'الرصيد الافتتاحي:'}
              </label>
              <input
                type="number"
                step="any"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 text-xs font-mono font-bold rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              لون المحفظة:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-transform flex items-center justify-center cursor-pointer ${
                    color === c.key ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-105 opacity-80'
                  }`}
                  title={c.name}
                >
                  {color === c.key && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              رمز وأيقونة المحفظة:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.key}
                  type="button"
                  onClick={() => setIcon(ic.key)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer ${
                    icon === ic.key
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <WalletIconBadge icon={ic.key} color={color} size="sm" className="mb-1" />
                  <span className="text-[10px] font-medium truncate w-full">{ic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              وصف إضافي (اختياري):
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: الحساب المخصص لمصاريف المنزل والإنترنت"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{walletToEdit ? 'حفظ التعديلات' : 'إضافة المحفظة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

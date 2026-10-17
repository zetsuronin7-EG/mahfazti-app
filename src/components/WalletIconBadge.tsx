import React from 'react';
import {
  Wallet as WalletIconLucide,
  Smartphone,
  Landmark,
  CreditCard,
  PiggyBank,
  Coins,
  Briefcase,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { WalletColor, WalletIcon } from '../types';

const ICON_MAP: Record<WalletIcon, LucideIcon> = {
  wallet: WalletIconLucide,
  smartphone: Smartphone,
  bank: Landmark,
  creditCard: CreditCard,
  piggyBank: PiggyBank,
  coins: Coins,
  briefcase: Briefcase,
  shieldCheck: ShieldCheck,
};

const COLOR_STYLES: Record<WalletColor, { bg: string; text: string; ring: string; gradient: string }> = {
  emerald: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    ring: 'border-emerald-500/30',
    gradient: 'from-emerald-600/30 via-emerald-700/20 to-slate-900',
  },
  sky: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    ring: 'border-sky-500/30',
    gradient: 'from-sky-600/30 via-sky-700/20 to-slate-900',
  },
  purple: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    ring: 'border-purple-500/30',
    gradient: 'from-purple-600/30 via-purple-700/20 to-slate-900',
  },
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    ring: 'border-amber-500/30',
    gradient: 'from-amber-600/30 via-amber-700/20 to-slate-900',
  },
  rose: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    ring: 'border-rose-500/30',
    gradient: 'from-rose-600/30 via-rose-700/20 to-slate-900',
  },
  indigo: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    ring: 'border-indigo-500/30',
    gradient: 'from-indigo-600/30 via-indigo-700/20 to-slate-900',
  },
  slate: {
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
    ring: 'border-slate-500/30',
    gradient: 'from-slate-600/30 via-slate-700/20 to-slate-900',
  },
  teal: {
    bg: 'bg-teal-500/15',
    text: 'text-teal-400',
    ring: 'border-teal-500/30',
    gradient: 'from-teal-600/30 via-teal-700/20 to-slate-900',
  },
};

interface Props {
  icon: WalletIcon;
  color: WalletColor;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WalletIconBadge: React.FC<Props> = ({
  icon,
  color,
  size = 'md',
  className = '',
}) => {
  const IconComponent = ICON_MAP[icon] || WalletIconLucide;
  const style = COLOR_STYLES[color] || COLOR_STYLES.emerald;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg p-1.5',
    md: 'w-10 h-10 rounded-xl p-2.5',
    lg: 'w-13 h-13 rounded-2xl p-3.5',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div
      className={`flex items-center justify-center border ${style.bg} ${style.text} ${style.ring} ${sizeClasses} ${className}`}
    >
      <IconComponent className={iconSizes} />
    </div>
  );
};

export function getWalletGradient(color: WalletColor): string {
  return COLOR_STYLES[color]?.gradient || COLOR_STYLES.emerald.gradient;
}

export function getWalletColorText(color: WalletColor): string {
  return COLOR_STYLES[color]?.text || COLOR_STYLES.emerald.text;
}

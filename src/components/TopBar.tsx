import React, { useState } from 'react';
import {
  Plus,
  ArrowRightLeft,
  Share2,
  Menu,
  X,
  Smartphone,
  LayoutDashboard,
  WalletCards,
  ReceiptText,
  PieChart,
  Settings,
} from 'lucide-react';
import { ActiveTab, CURRENCIES, CurrencyCode } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { useWallet } from '../context/WalletContext';
import { WalletBrandLogo } from './WalletBrandLogo';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddExpense: () => void;
  onOpenTransfer: () => void;
  onOpenShare: () => void;
  onOpenApkGuide: () => void;
}

export const TopBar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenAddExpense,
  onOpenTransfer,
  onOpenShare,
  onOpenApkGuide,
}) => {
  const { baseCurrency, setBaseCurrency } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'wallets', label: 'المحافظ', icon: WalletCards },
    { id: 'transactions', label: 'المعاملات', icon: ReceiptText },
    { id: 'analytics', label: 'التحليلات', icon: PieChart },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleNextCurrency = () => {
    const list: CurrencyCode[] = ['EGP', 'USD', 'EUR', 'SAR'];
    const idx = list.indexOf(baseCurrency);
    const next = list[(idx + 1) % list.length];
    setBaseCurrency(next);
  };

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark with Chic Logo */}
        <div
          onClick={() => handleTabClick('dashboard')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group select-none"
        >
          <WalletBrandLogo size="sm" variant="emblem" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans group-hover:text-amber-200 transition-colors">
              محفظتي
              <span className="text-[9px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-600/40 rounded-md px-1.5 py-0.5 tracking-wider uppercase">
                Élégant
              </span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop lg screens) */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-inner border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Quick Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Currency Toggle */}
          <button
            onClick={handleNextCurrency}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-300 font-medium transition cursor-pointer"
            title="تغيير عملة العرض الموحدة"
          >
            <span className="text-slate-400 text-[11px] hidden xs:inline">العملة:</span>
            <span className="font-bold text-emerald-400 font-mono text-[11px] sm:text-xs">
              {CURRENCIES[baseCurrency]?.symbolAr || baseCurrency}
            </span>
          </button>

          {/* Transfer button (desktop shortcut) */}
          <button
            onClick={onOpenTransfer}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition active:scale-95 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-violet-400" />
            <span>تحويل</span>
          </button>

          {/* Add Expense (primary action) */}
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">معاملة</span>
            <span className="sm:hidden text-[11px]">تسجيل</span>
          </button>

          {/* APK Guide Button */}
          <button
            onClick={onOpenApkGuide}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/40 text-xs font-semibold text-emerald-300 transition active:scale-95 cursor-pointer"
            title="تحميل التطبيق كملف APK أندرويد"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>APK</span>
          </button>

          {/* Share & Publish App Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 text-xs font-semibold text-amber-300 transition active:scale-95 cursor-pointer shadow-sm"
            title="نشر ومشاركة رابط التطبيق واللوجو"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">مشاركة</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Mobile Menu Hamburger Toggle (for screens < lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="القائمة الرئيسية"
            title="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-semibold text-slate-400 px-2 py-1">
            أقسام التطبيق:
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition text-right ${
                    isActive
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-inner'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 border border-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Additional Quick Mobile Actions */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApkGuide();
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-950/50 border border-emerald-600/40 text-emerald-300 text-xs font-semibold"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>تحميل APK أندرويد</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShare();
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-950/50 border border-amber-600/40 text-amber-300 text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>نشر ومشاركة الرابط</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  WalletCards,
  Plus,
  ReceiptText,
  PieChart,
  Settings,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenQuickAdd,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 pb-safe shadow-2xl">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">الرئيسية</span>
        </button>

        {/* Tab 2: Wallets */}
        <button
          onClick={() => setActiveTab('wallets')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'wallets' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <WalletCards className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">المحافظ</span>
        </button>

        {/* Center: Quick Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenQuickAdd}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-90 transition-transform cursor-pointer -mt-4 border-2 border-slate-950"
            title="تسجيل معاملة سريعة"
            aria-label="تسجيل معاملة جديدة"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Transactions */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'transactions' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ReceiptText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">المعاملات</span>
        </button>

        {/* Tab 5: Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">التقارير</span>
        </button>
      </div>
    </nav>
  );
};

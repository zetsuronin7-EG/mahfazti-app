import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 border border-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4 text-slate-950" />
      <span>وضع عدم الاتصال: يمكنك الاستمرار في تسجيل المصاريف وسيحفظ كل شيء محلياً</span>
    </div>
  );
};

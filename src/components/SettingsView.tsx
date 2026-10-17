import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  Globe,
  Coins,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { CURRENCIES, CurrencyCode } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { WALLET_LOGOS } from './WalletBrandLogo';

interface SettingsViewProps {
  onOpenShare?: () => void;
  onOpenApkGuide?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenShare, onOpenApkGuide }) => {
  const {
    baseCurrency,
    setBaseCurrency,
    ratesToEgp,
    setExchangeRate,
    exportDataJson,
    importDataJson,
    resetToSampleData,
    clearAllData,
    wallets,
    transactions,
  } = useWallet();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleExport = () => {
    try {
      const json = exportDataJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mahfazti_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showFeedback('success', 'تم تصدير نسخة احتياطية من بياناتك بنجاح');
    } catch {
      showFeedback('error', 'حدث خطأ أثناء تصدير البيانات');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        showFeedback('success', 'تم استيراد واسترجاع بيانات المحافظ بنجاح');
      } else {
        showFeedback('error', 'ملف النسخة الاحتياطية غير صالح أو تالف');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          الإعدادات والنسخ الاحتياطي
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          إدارة تفضيلات العملات، أسعار التحويل، وحفظ البيانات محلياً (Offline LocalStorage)
        </p>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* PWA & APK Section Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              تطبيق ويب تقدمي (PWA) وحزمة أندرويد (APK)
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-md px-1.5 py-0.2">
                Android / iOS
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              يعمل دون اتصال بالإنترنت (Offline First) وقابل للتثبيت أو تحويله إلى ملف APK
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap">
          {onOpenApkGuide && (
            <button
              onClick={onOpenApkGuide}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>تحويل إلى ملف APK</span>
            </button>
          )}
          <PWAInstallButton />
        </div>
      </div>

      {/* Brand & Share Card (Clean & Compact) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
            <img
              src={WALLET_LOGOS.crownTransparent}
              alt="شعار محفظتي"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">شعار وهوية التطبيق</h3>
            <p className="text-xs text-slate-400">
              شعار محفظتي عالي الدقة وبدون خلفية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={WALLET_LOGOS.crownTransparent}
            download="mahfazti_logo_transparent.png"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>تحميل اللوجو (PNG)</span>
          </a>

          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة الرابط</span>
            </button>
          )}
        </div>
      </div>

      {/* Currency Settings */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">عملة العرض الموحدة (Base Currency)</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.values(CURRENCIES).map((curr) => {
            const isSelected = baseCurrency === curr.code;
            return (
              <button
                key={curr.code}
                onClick={() => setBaseCurrency(curr.code)}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500/80 bg-emerald-950/30 text-white ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5">{curr.name}</div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  {curr.code} ({curr.symbolAr})
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exchange Rates Management */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Coins className="w-4 h-4 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white">أسعار التحويل مقابل الجنيه المصري (EGP)</h2>
            <p className="text-[11px] text-slate-400">
              تُستخدم عند التحويل بين محافظ بعملات مختلفة ولحساب إجمالي الثروة الموحدة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(['USD', 'EUR', 'SAR', 'AED', 'KWD'] as CurrencyCode[]).map((code) => {
            const currentRate = ratesToEgp[code] || 1;
            const config = CURRENCIES[code];

            return (
              <div
                key={code}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-bold text-white block">
                    1 {config.name} ({code})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    سعر الصرف الحالي
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={currentRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setExchangeRate(code, val);
                    }}
                    className="w-24 px-2.5 py-1.5 text-xs text-center font-bold font-mono rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-400 font-mono">ج.م</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">النسخ الاحتياطي والأمان المحلي</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          بياناتك مخزنة 100% داخل جهازك وفي ذاكرة متصفحك. لا ترسل البيانات إلى أي خادم خارجي. يمكنك تنزيل نسخة احتياطية بصيغة JSON لنقلها إلى جهاز آخر أو للاحتفاظ بأمان كامل.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>استيراد نسخة احتياطية</span>
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-3">
          <span>إجمالي المحافظ المخزنة: <strong className="text-white font-mono">{wallets.length}</strong></span>
          <span aria-hidden="true">·</span>
          <span>إجمالي المعاملات: <strong className="text-white font-mono">{transactions.length}</strong></span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
        <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          إعادة الضبط ومسح البيانات
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold transition active:scale-95 cursor-pointer shadow-md shadow-rose-950/40"
            >
              <Trash2 className="w-4 h-4" />
              <span>تفريغ ومسح جميع البيانات والبدء من الصفر</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                  showFeedback('success', 'تم مسح جميع البيانات بنجاح');
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition"
              >
                تأكيد المسح النهائي
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition"
              >
                إلغاء
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

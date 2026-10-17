import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow when beforeinstallprompt fired
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
        title="تثبيت التطبيق كـ PWA رسمي على جهازك"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">تثبيت التطبيق</span>
        <span className="xs:hidden">تثبيت</span>
      </button>
    );
  }

  // Fallback: Show guided install button for iOS or when running inside preview iframe / Chrome before trigger
  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 transition active:scale-95 cursor-pointer shadow-sm"
        title="تثبيت التطبيق كـ WebAPK على الهاتف"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">تثبيت التطبيق</span>
        <span className="sm:hidden">تثبيت</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 shadow-2xl text-slate-100 text-right space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>تثبيت التطبيق على هاتفك</span>
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              /* iOS Safari Guide */
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    اضغط على أيقونة <strong>المشاركة (Share)</strong>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" /> في شريط متصفح سفاري بالأسفل.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    مرر لأسفل واختر <strong>إضافة إلى الشاشة الرئيسية</strong>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <PlusSquare className="w-3.5 h-3.5 text-emerald-400" /> ثم اضغط <strong>إضافة (Add)</strong> بالأعلى.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Android Chrome Guide */
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    افتح الرابط في متصفح <strong>Google Chrome</strong> على الهاتف.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    اضغط على قائمة الخيارات (نقاط القائمة الثلاث <strong>⋮</strong> في زاوية المتصفح).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                  <div>
                    اضغط على <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>يقوم أندرويد تلقائياً بإنشاء حزمة WebAPK وتثبيتها كأي تطبيق عادي!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer shadow-md shadow-emerald-950"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};

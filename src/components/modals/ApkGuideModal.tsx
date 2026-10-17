import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WalletBrandLogo } from '../WalletBrandLogo';
import { getPublicAppUrl } from '../../utils/appUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = getPublicAppUrl();

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const pwabuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar space-y-6 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                تحويل التطبيق إلى ملف APK أندرويد
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-700/50 rounded-md px-1.5 py-0.2 font-mono">
                  APK / Android
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                طريقتان سهلتان لتثبيت التطبيق كملف APK رسمي على هاتفك
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method 1: PWABuilder (Direct Download APK) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
              الطريقة الأولى (تحميل ملف .APK جاهز)
            </span>
            <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              أداة مايكروسوفت وجوجل
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            باستخدام أداة <strong>PWABuilder</strong> المعتمدة، يمكنك تحويل هذا التطبيق بضغطة زر إلى حزمة APK رسمية تثبتها مباشرة على هاتفك أو ترفعها على Google Play:
          </p>

          <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside pr-1">
            <li className="leading-relaxed">
              انسخ رابط التطبيق الحالي:
              <div className="mt-1.5 flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-transparent px-2 text-xs font-mono text-emerald-400 focus:outline-none text-left"
                  dir="ltr"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>

              {/* Critical tip for 404 and APK resolution */}
              <div className="mt-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed space-y-1">
                <div>
                  ⚠️ <strong>لتجنب خطأ 404 (Page Not Found):</strong>
                </div>
                <div>
                  رابط المعاينة العام يتم تفعيله بالكامل على سيرفرات جوجل عندما تضغط على زر <strong>Share / Publish</strong> في الشريط العلوي لمنصة AI Studio. إذا ظهر خطأ 404، فإن أسرع طريقة وأضمنها هي استخدام <strong>الطريقة الثانية بالأسفل (التثبيت المباشر من متصفح Chrome)</strong> والتي تعمل بنسبة 100% فوراً وبدون إنترنت!
                </div>
              </div>
            </li>
            <li className="leading-relaxed">
              افتح موقع <strong>PWABuilder</strong> والصق الرابط ثم اضغط <strong>Start</strong>.
            </li>
            <li className="leading-relaxed">
              اضغط على زر <strong>Package for Android</strong> واختر تحميل <strong>APK</strong> مباشر.
            </li>
          </ol>

          <div className="pt-2">
            <a
              href={pwabuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <span>فتح موقع PWABuilder وتحميل الـ APK الآن</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Method 2: WebAPK Direct (No Downloads Required) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
              الطريقة الثانية (WebAPK التلقائي من أندرويد)
            </span>
            <span className="text-[11px] text-slate-400">بدون برامج خارجية</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            نظام أندرويد وGoogle Chrome يدعمان ميزة <strong>WebAPK</strong> الرسمية. بمجرد الضغط على:
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[11px] font-bold">1</span>
              <span>افتح رابط التطبيق في متصفح <strong>Google Chrome</strong> على هاتفك الأندرويد.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[11px] font-bold">2</span>
              <span>اضغط على قائمة الخيارات (نقاط القائمة ⋮ في زاوية المتصفح).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[11px] font-bold">3</span>
              <span>اختر <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>ماذا يحدث؟</strong> يقوم نظام أندرويد نفسه بإنشاء ملف APK رسمي للتطبيق على جهازك فوراً، ويظهر له أيقونة مستقلة باللوجو الأنيق في قائمة التطبيقات الرئيسية بدون شريط المتصفح ويعمل أوفلاين.
            </p>
          </div>
        </div>

        {/* Why did top navigation disappear on mobile? Clear explanation */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>توضيح: أين توجد «المعاملات» و«التحليلات» في الهاتف؟</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            في شاشات الهواتف المحمولة وتطبيقات الأندرويد، يتم وضع أقسام التنقل (الرئيسية، المحافظ، المعاملات، والتقارير) في <strong>الشريط السفلي الثابت (Bottom Bar)</strong> أسفل الشاشة ليسهل الوصول إليها بإبهام اليد الواحدة. أما في شاشات الكمبيوتر والمتصفحات العريضة، فتظهر في الشريط العلوي.
          </p>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};

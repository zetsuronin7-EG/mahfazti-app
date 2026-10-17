import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Globe,
  Sparkles,
  ExternalLink,
  Smartphone,
  Eye,
} from 'lucide-react';
import { WalletBrandLogo } from '../WalletBrandLogo';
import { getPublicAppUrl } from '../../utils/appUrl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenApkGuide?: () => void;
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose, onOpenApkGuide }) => {
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState(getPublicAppUrl());
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    setAppUrl(getPublicAppUrl());
  }, []);

  if (!isOpen) return null;

  const appTitle = 'محفظتي Élégant – المحفظة المالية الذكية وتتبع المصاريف';
  const appDesc = 'إدارة المحافظ والتحويلات اللحظية وتتبع المصاريف بتصميم فاخر وأنيق.';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: appTitle,
          text: appDesc,
          url: appUrl,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopy();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=064e3b&bgcolor=f8fafc&data=${encodeURIComponent(
    appUrl || 'https://mahfazti.app'
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar space-y-5 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                نشر ومشاركة التطبيق
                <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-600/40 rounded-md px-1.5 py-0.2 font-mono">
                  ÉLÉGANT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                رابط التطبيق الرسمي واللوجو ومعاينة بطاقة النشر
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

        {/* Live Social Card Preview (What friends/users see when shared) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5 text-amber-300">
              <Eye className="w-3.5 h-3.5" />
              معاينة كارت المشاركة (Social Share Card)
            </span>
            <span className="text-[10px] text-slate-400">واتساب، فيسبوك، تيليجرام</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-lg">
            {/* Social Banner Image */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden">
              <img
                src="/social_share_banner.jpg"
                alt="بانر مشاركة محفظتي"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/og-image.jpg';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 border border-amber-500/40 text-[10px] text-amber-300 font-mono">
                ÉLÉGANT EDITION
              </div>
            </div>

            {/* Card Content Snippet */}
            <div className="p-3.5 space-y-1 bg-slate-900/90 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <WalletBrandLogo size="xs" variant="emblem" showGlow={false} />
                <h4 className="text-xs font-bold text-white tracking-tight">
                  {appTitle}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {appDesc}
              </p>
              <div className="text-[10px] text-emerald-400 font-mono pt-1">
                {appUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Direct Link Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            رابط التطبيق المباشر (Direct Public URL):
          </label>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-emerald-500/50 transition">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 bg-transparent px-3 text-xs font-mono text-emerald-400 select-all focus:outline-none text-left"
              dir="ltr"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-emerald-600/90 hover:bg-emerald-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons: Native Share + QR Code Toggle */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>مشاركة عبر الهاتف</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>{showQr ? 'إخفاء رمز QR' : 'عرض رمز QR'}</span>
          </button>
        </div>

        {onOpenApkGuide && (
          <button
            onClick={() => {
              onClose();
              onOpenApkGuide();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>تحويل التطبيق إلى ملف APK أندرويد (.apk)</span>
          </button>
        )}

        {/* QR Code Section */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 animate-in fade-in">
            <div className="p-3 bg-slate-100 rounded-2xl shadow-xl">
              <img
                src={qrCodeUrl}
                alt="QR Code للتطبيق"
                referrerPolicy="no-referrer"
                className="w-44 h-44 object-contain rounded-lg"
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              امسح الكود بكاميرا أي هاتف لفتح التطبيق وتثبيته فوراً كـ PWA.
            </p>
          </div>
        )}

        {/* Custom Branded Link Guide */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/20 to-slate-950 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كيف تحصل على رابط مميز وقصير خاص بك؟</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            للحصول على رابط مخصص مثل <strong className="font-mono text-amber-200" dir="ltr">bit.ly/mahfazti-app</strong> أو <strong className="font-mono text-amber-200" dir="ltr">mahfazti.me</strong>:
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li>
              يمكنك استخدام موقع اختصار روابط مجاني مثل <span className="font-mono text-slate-300">Bitly</span> أو <span className="font-mono text-slate-300">TinyURL</span> وتخصيص الاسم المكتوب في الرابط.
            </li>
            <li>
              أو حجز دومين خاص وربطه بإعادة توجيه (301 Redirect) مباشرة إلى رابط هذا التطبيق.
            </li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

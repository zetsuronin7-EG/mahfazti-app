import React, { useState } from 'react';

interface WalletBrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'crown' | 'emblem' | 'leather';
  showGlow?: boolean;
  className?: string;
}

export const WALLET_LOGOS = {
  crown: '/royal_wallet_crown.jpg',
  crownTransparent: '/royal_wallet_transparent.png',
  emblem: '/wallet_app_icon.jpg',
  leather: '/elegant_wallet_logo.jpg',
} as const;

export const WalletBrandLogo: React.FC<WalletBrandLogoProps> = ({
  size = 'md',
  variant = 'crown',
  showGlow = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  };

  const imageSrc = WALLET_LOGOS[variant] || WALLET_LOGOS.crown;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center p-[1.5px] bg-gradient-to-tr from-amber-400/90 via-emerald-500/80 to-teal-300/90 ${sizeMap[size]} ${
        showGlow ? 'shadow-lg shadow-emerald-950/70' : ''
      } transition-transform group-hover:scale-105 duration-300 ${className}`}
    >
      <div className="w-full h-full overflow-hidden rounded-[inherit] bg-slate-950 relative flex items-center justify-center">
        {!imgError ? (
          <img
            src={imageSrc}
            alt="شعار محفظتي الأنيق"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center scale-[1.03] select-none"
            loading="eager"
          />
        ) : (
          <img
            src="/icon.svg"
            alt="شعار محفظتي"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-1"
          />
        )}
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

import React, { useState } from 'react';

interface BankLogoProps {
  name: string;
  code: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({
  name,
  code,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Generate 2-3 letter initials for fallback
  const getInitials = (bankName: string, bankCode: string) => {
    const clean = bankName.replace(/banco/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (clean.length >= 2) {
      return clean.substring(0, 2).toUpperCase();
    }
    return bankCode ? bankCode.slice(-2) : 'VN';
  };

  const initials = getInitials(name, code);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  }[size];

  const logoContainerSize = {
    sm: 'w-8 h-8 p-1',
    md: 'w-12 h-12 p-1.5',
    lg: 'w-16 h-16 p-2',
  }[size];

  const showFallback = !logoUrl || imageFailed;

  if (showFallback) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-[10px] bg-[#1a1815] border border-[#e8a54b]/30 shadow-[inset_0_1px_0_rgba(232,165,75,0.2)] shrink-0 select-none ${sizeClasses} ${className}`}
        title={`${name} (${code})`}
      >
        <span className="font-display font-extrabold text-[#e8a54b] tracking-wider leading-none">
          {initials}
        </span>
        {size !== 'sm' && (
          <span className="font-mono text-[9px] text-[#a09b93] tracking-tighter mt-0.5 leading-none">
            {code}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-[10px] bg-[#1f1f24] border border-white/10 shrink-0 overflow-hidden ${logoContainerSize} ${className}`}
    >
      <img
        src={logoUrl}
        alt={`Logo ${name}`}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className="w-full h-full object-contain filter brightness-95 contrast-105"
        loading="lazy"
      />
    </div>
  );
};

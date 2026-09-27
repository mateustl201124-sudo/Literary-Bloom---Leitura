import React from 'react';

interface TulipOrnamentProps {
  className?: string;
  flipped?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Botanical Purple Tulip Illustration:
 * Authentic tulip flowers with cup-shaped petals, delicate stems, and smooth leaves.
 */
export const TulipOrnament: React.FC<TulipOrnamentProps> = ({
  className = '',
  flipped = false,
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-16 h-14',
    md: 'w-24 h-20',
    lg: 'w-36 h-28',
    xl: 'w-52 h-40',
  };

  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${flipped ? '-scale-x-100' : ''} ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Gradients for natural orchid & lavender tulip petals */}
        <linearGradient id="petalGradOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="45%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>

        <linearGradient id="petalGradInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5eefb" />
          <stop offset="50%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        <linearGradient id="petalGradBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="60%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        <linearGradient id="tulipStemGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="70%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>

        <linearGradient id="tulipLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.5" />
        </linearGradient>

        <filter id="tulipGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#a855f7" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Curved Stem */}
      <path
        d="M10 78 C25 72 38 62 48 46 C52 38 54 28 55 20"
        stroke="url(#tulipStemGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Secondary Stem branching to side bud */}
      <path
        d="M38 58 C52 56 65 48 72 36 C75 32 77 28 78 24"
        stroke="url(#tulipStemGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Broad, elegant botanical tulip leaves cradling the stems */}
      {/* Lower left leaf */}
      <path
        d="M10 76 C20 64 26 50 24 38 C28 52 32 66 38 72 C28 76 18 78 10 76 Z"
        fill="url(#tulipLeafGrad)"
      />
      {/* Mid leaf arching outward */}
      <path
        d="M36 60 C42 46 54 38 64 36 C56 46 48 58 44 64 Z"
        fill="url(#tulipLeafGrad)"
      />

      {/* Main Tulip Bloom (Centered on main stem: x=55, y=20) */}
      <g transform="translate(38, 0)" filter="url(#tulipGlow)">
        {/* Back Petals (Cup silhouette) */}
        <path
          d="M10 24 C5 14 6 5 17 1 C19 9 20 17 21 24 Z"
          fill="url(#petalGradBack)"
        />
        <path
          d="M24 24 C29 14 28 5 17 1 C15 9 14 17 13 24 Z"
          fill="url(#petalGradBack)"
        />

        {/* Center Petal (Inner light highlight) */}
        <path
          d="M17 25 C13 14 15 3 17 0 C19 3 21 14 17 25 Z"
          fill="url(#petalGradInner)"
        />

        {/* Front Left Overlapping Petal */}
        <path
          d="M12 25 C6 18 6 9 13 4 C17 10 18 18 17 25 Z"
          fill="url(#petalGradOuter)"
        />

        {/* Front Right Overlapping Petal */}
        <path
          d="M22 25 C28 18 28 9 21 4 C17 10 16 18 17 25 Z"
          fill="url(#petalGradOuter)"
        />

        {/* Base calyx / receptacle connection */}
        <ellipse cx="17" cy="25" rx="3.5" ry="1.5" fill="#6b21a8" />
      </g>

      {/* Secondary Tulip Bloom / Bud (On secondary stem: x=78, y=24) */}
      <g transform="translate(66, 8) scale(0.72)" filter="url(#tulipGlow)">
        <path
          d="M8 22 C4 13 4 5 14 1 C16 9 17 16 17 22 Z"
          fill="url(#petalGradBack)"
        />
        <path
          d="M20 22 C24 13 24 5 14 1 C12 9 11 16 11 22 Z"
          fill="url(#petalGradBack)"
        />
        <path
          d="M14 23 C11 13 12 3 14 0 C16 3 17 13 14 23 Z"
          fill="url(#petalGradInner)"
        />
        <path
          d="M10 23 C5 16 5 8 11 3 C14 9 15 16 14 23 Z"
          fill="url(#petalGradOuter)"
        />
        <path
          d="M18 23 C23 16 23 8 17 3 C14 9 13 16 14 23 Z"
          fill="url(#petalGradOuter)"
        />
        <ellipse cx="14" cy="23" rx="3" ry="1.2" fill="#6b21a8" />
      </g>
    </svg>
  );
};

/**
 * Full Background Atmosphere:
 * Stays strictly behind all interactive content and top bar (`z-0` with `pointer-events-none`).
 * The header has `z-40` and main content boxes have `z-10`, so the tulips appear behind them.
 */
export const TulipBackgroundAtmosphere: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Top-Left Corner Tulip Cluster - peeking behind top bar and content */}
      <div className="absolute top-0 left-0 sm:left-2 opacity-85 sm:opacity-90">
        <TulipOrnament size="xl" className="w-56 h-44 sm:w-72 sm:h-56 drop-shadow-[0_4px_20px_rgba(168,85,247,0.4)]" />
      </div>

      {/* Top-Right Corner Tulip Cluster - peeking behind top bar and controls */}
      <div className="absolute top-0 right-0 sm:right-2 opacity-80 sm:opacity-90">
        <TulipOrnament size="xl" flipped className="w-56 h-44 sm:w-72 sm:h-56 drop-shadow-[0_4px_20px_rgba(168,85,247,0.4)]" />
      </div>

      {/* Mid-Left Side Accent */}
      <div className="absolute top-1/3 -left-8 opacity-65 sm:opacity-80 rotate-12">
        <TulipOrnament size="lg" className="w-44 h-36 sm:w-56 sm:h-44" />
      </div>

      {/* Mid-Right Side Accent */}
      <div className="absolute top-1/2 -right-8 opacity-65 sm:opacity-80 -rotate-12">
        <TulipOrnament size="lg" flipped className="w-44 h-36 sm:w-56 sm:h-44" />
      </div>

      {/* Bottom-Left Corner Atmosphere */}
      <div className="absolute bottom-0 left-0 opacity-75 sm:opacity-85">
        <TulipOrnament size="xl" className="w-52 h-40 sm:w-64 sm:h-52 drop-shadow-[0_4px_16px_rgba(168,85,247,0.3)]" />
      </div>

      {/* Bottom-Right Corner Atmosphere */}
      <div className="absolute bottom-0 right-0 opacity-75 sm:opacity-85">
        <TulipOrnament size="xl" flipped className="w-52 h-40 sm:w-64 sm:h-52 drop-shadow-[0_4px_16px_rgba(168,85,247,0.3)]" />
      </div>

      {/* Subtle orchid ambient lighting */}
      <div className="absolute -top-10 left-10 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-fuchsia-950/20 rounded-full blur-3xl" />
    </div>
  );
};

export const TulipFrameCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = '' }) => {
  const transforms = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1 -scale-x-100',
    'bottom-left': 'bottom-1 left-1 -scale-y-100',
    'bottom-right': 'bottom-1 right-1 -scale-x-100 -scale-y-100',
  };

  return (
    <div className={`absolute ${transforms[position]} pointer-events-none opacity-60 z-0 ${className}`} aria-hidden="true">
      <TulipOrnament size="sm" />
    </div>
  );
};

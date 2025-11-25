import React from 'react';

// A single bamboo stick
export const StickSVG: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg 
    viewBox="0 0 20 200" 
    className={className} 
    style={style}
    preserveAspectRatio="none"
  >
    {/* Main body of stick */}
    <rect x="2" y="0" width="16" height="200" rx="2" fill="#d4a373" stroke="#8c4b20" strokeWidth="1" />
    {/* Red tip at top */}
    <rect x="2" y="0" width="16" height="30" rx="2" fill="#aa0000" />
    {/* Simulated text lines */}
    <line x1="10" y1="40" x2="10" y2="180" stroke="#8c4b20" strokeWidth="2" strokeDasharray="4 2" />
  </svg>
);

// The collection of sticks inside the pot
export const StickBundleSVG: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative w-32 h-40 ${className}`}>
      {/* Generate random sticks to look like a bundle */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 w-3 h-48 bg-wood-light border-x border-wood-dark rounded-t-sm"
          style={{
            left: `${10 + i * 6 + (Math.random() * 4 - 2)}%`,
            height: `${80 + Math.random() * 20}%`,
            transform: `rotate(${(i - 6) * 3 + (Math.random() * 4 - 2)}deg) translateY(${Math.random() * 10}px)`,
            zIndex: i,
            background: 'linear-gradient(to right, #bc6c25, #d4a373, #bc6c25)'
          }}
        >
          <div className="w-full h-4 bg-lucky-red opacity-80 rounded-t-sm"></div>
        </div>
      ))}
    </div>
  );
};

// The Cylinder (Kau Chim Container)
export const CylinderSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 300" className={className}>
    {/* Dark interior shadow */}
    <ellipse cx="100" cy="40" rx="70" ry="20" fill="#3f1d0b" />
    
    {/* Back Body */}
    <path d="M30 40 L30 250 A70 20 0 0 0 170 250 L170 40" fill="#8c4b20" />
    
    {/* Body Gradient - Wood Texture */}
    <defs>
      <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5c2e14" />
        <stop offset="20%" stopColor="#8c4b20" />
        <stop offset="50%" stopColor="#bc6c25" />
        <stop offset="80%" stopColor="#8c4b20" />
        <stop offset="100%" stopColor="#5c2e14" />
      </linearGradient>
    </defs>
    
    <rect x="30" y="40" width="140" height="210" fill="url(#woodGradient)" />
    
    {/* Top Rim */}
    <ellipse cx="100" cy="40" rx="70" ry="20" fill="#6d3616" stroke="#3f1d0b" strokeWidth="2" />
    <ellipse cx="100" cy="38" rx="70" ry="20" fill="none" stroke="#bc6c25" strokeWidth="1" />
    
    {/* Bottom Rim/Base */}
    <ellipse cx="100" cy="250" rx="70" ry="20" fill="#5c2e14" stroke="#3f1d0b" strokeWidth="2" />
    
    {/* Decorative Bands */}
    <path d="M30 80 A70 20 0 0 0 170 80" fill="none" stroke="#3f1d0b" strokeWidth="3" opacity="0.5" />
    <path d="M30 150 A70 20 0 0 0 170 150" fill="none" stroke="#3f1d0b" strokeWidth="3" opacity="0.5" />
    <path d="M30 220 A70 20 0 0 0 170 220" fill="none" stroke="#3f1d0b" strokeWidth="3" opacity="0.5" />
    
    {/* Character Label on Pot */}
    <rect x="80" y="90" width="40" height="40" fill="#aa0000" rx="2" />
    <text x="100" y="118" textAnchor="middle" fill="#d4a373" fontFamily="serif" fontSize="24" fontWeight="bold">签</text>
  </svg>
);

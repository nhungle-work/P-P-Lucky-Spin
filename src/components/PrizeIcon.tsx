import React from 'react';

interface PrizeIconProps {
  id: string;
  className?: string;
}

export default function PrizeIcon({ id, className = "w-full h-full" }: PrizeIconProps) {
  switch (id) {
    case 'combo':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Back sheet */}
          <g transform="rotate(10 40 36)">
            <rect x="24" y="14" width="30" height="42" rx="3" fill="#ffffff" stroke="#1d70b8" strokeWidth="2" />
            <line x1="29" y1="21" x2="49" y2="21" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="29" y1="27" x2="49" y2="27" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="29" y1="33" x2="49" y2="33" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="29" y1="39" x2="49" y2="39" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="29" y1="45" x2="41" y2="45" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Middle sheet */}
          <g transform="rotate(3 34 32)">
            <rect x="18" y="10" width="30" height="42" rx="3" fill="#ffffff" stroke="#1d70b8" strokeWidth="2" />
            <line x1="23" y1="17" x2="43" y2="17" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="23" x2="43" y2="23" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="29" x2="43" y2="29" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="35" x2="43" y2="35" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="41" x2="35" y2="41" stroke="#1d70b8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Top sheet */}
          <g transform="rotate(-4 27 28)">
            <rect x="12" y="6" width="30" height="42" rx="3" fill="#ffffff" stroke="#104f9b" strokeWidth="2.5" />
            <line x1="18" y1="15" x2="36" y2="15" stroke="#104f9b" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="18" y1="21" x2="36" y2="21" stroke="#104f9b" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="18" y1="27" x2="36" y2="27" stroke="#104f9b" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="18" y1="33" x2="36" y2="33" stroke="#104f9b" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="18" y1="39" x2="28" y2="39" stroke="#104f9b" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'notebook':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Notebook cover */}
          <rect x="18" y="8" width="34" height="48" rx="4" fill="#3b7cb3" stroke="#1a3f66" strokeWidth="2.5" />
          
          {/* Spiral rings on the left side */}
          <ellipse cx="18" cy="14" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />
          <ellipse cx="18" cy="20" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />
          <ellipse cx="18" cy="26" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />
          <ellipse cx="18" cy="32" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />
          <ellipse cx="18" cy="38" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />
          <ellipse cx="18" cy="44" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />
          <ellipse cx="18" cy="50" rx="4.5" ry="2.2" fill="none" stroke="#eab308" strokeWidth="2" />

          {/* White label on the cover */}
          <rect x="25" y="16" width="20" height="12" rx="2" fill="#ffffff" stroke="#1a3f66" strokeWidth="1.8" />
        </svg>
      );

    case 'tag':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g transform="rotate(-8 32 32)">
            {/* Strap loop on the left */}
            <path d="M16 32 C4 32 4 24 10 22 C16 20 22 32 22 32" fill="none" stroke="#0080ff" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M16 32 C4 32 4 24 10 22 C16 20 22 32 22 32" fill="none" stroke="#004080" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Tag Body */}
            <rect x="22" y="18" width="36" height="28" rx="5" fill="#0080ff" stroke="#004080" strokeWidth="2.5" />
            
            {/* Inner Card */}
            <rect x="27" y="22" width="26" height="20" rx="2" fill="#fffef0" stroke="#004080" strokeWidth="1.8" />
            
            {/* Lines on Inner Card representing text fields */}
            <line x1="31" y1="27" x2="49" y2="27" stroke="#004080" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="31" y1="32" x2="49" y2="32" stroke="#004080" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="31" y1="37" x2="49" y2="37" stroke="#004080" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

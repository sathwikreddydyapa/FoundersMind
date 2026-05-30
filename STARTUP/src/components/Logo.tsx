import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0 font-sans">
      {/* Stylized Brand Vector Logo Tree-Circuit SVG */}
      <div className="w-11 h-11 shrink-0">
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Top Half Branches (Navy/Classic Brand Blue) */}
          <path 
            d="M100 100 V65 C100 50 82 40 68 35 M100 80 C100 62 118 50 132 45 M82 52 C72 44 60 44 52 50 M118 52 C128 44 140 44 148 50 M100 100 V105" 
            stroke="#0a2540" 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          <path 
            d="M82 62 C74 52 64 50 58 56 M118 62 C126 52 136 50 142 56" 
            stroke="#0f4c81" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          
          {/* Top Half Green Leaves (Vibrant Emerald / Mint Green) */}
          {/* Left Wing Leaves */}
          <path d="M68 35 C64 26 54 28 50 37 C54 41 64 39 68 35 Z" fill="#10b981" />
          <path d="M52 50 C45 43 38 48 38 57 C45 57 49 53 52 50 Z" fill="#059669" />
          <path d="M58 56 C51 49 44 54 44 63 C51 63 55 59 58 56 Z" fill="#10b981" />
          
          {/* Right Wing Leaves */}
          <path d="M132 45 C136 36 146 38 150 47 C146 51 136 49 132 45 Z" fill="#10b981" />
          <path d="M148 50 C155 43 162 48 162 57 C155 57 151 53 148 50 Z" fill="#059669" />
          <path d="M142 56 C149 49 156 54 156 63 C149 63 145 59 142 56 Z" fill="#10b981" />
          
          {/* Crown Top Leaves */}
          <path d="M100 65 C100 42 90 40 86 49 C90 58 95 62 100 65 Z" fill="#059669" />
          <path d="M100 65 C100 42 110 40 114 49 C110 58 105 62 100 65 Z" fill="#10b981" />

          {/* Bottom Half Digital Circuit Roots (Green & Blue) */}
          {/* Trunk Base */}
          <path d="M100 100 V115" stroke="#0a2540" strokeWidth="6.5" strokeLinecap="round" />
          
          {/* Left Circuit Roots (Blue Nodes) */}
          <path d="M100 112 C88 120 78 120 72 130 H48 V150" stroke="#1d4ed8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="48" cy="150" r="5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
          
          <path d="M82 120 C74 130 64 130 58 140 H35" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="35" cy="140" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          
          {/* Right Circuit Roots (Green Nodes) */}
          <path d="M100 115 C112 124 122 124 128 134 H152 V155" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="152" cy="155" r="5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
          
          <path d="M112 122 C122 132 132 132 138 142 H165" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <circle cx="165" cy="142" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

          {/* Center Deep Roots (Navy/Blue) */}
          <path d="M100 115 V138 L90 148 V162" stroke="#0a2540" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="90" cy="162" r="5" fill="#0a2540" stroke="#ffffff" strokeWidth="2" />
          
          <path d="M100 130 L110 140 V152" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="152" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Brand Text Block */}
      <div className="flex flex-col">
        <span className="font-outfit font-extrabold text-[18px] text-[#0a2540] tracking-tight leading-none">
          FoundersMind
        </span>
        <span className="text-[10px] text-slate-400 font-semibold tracking-normal mt-1 leading-none">
          AI for Institutional Knowledge
        </span>
      </div>
    </div>
  );
};

export default Logo;

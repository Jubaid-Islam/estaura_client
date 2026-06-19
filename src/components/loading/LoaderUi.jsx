import React from 'react';

export default function LoaderUi({size=52}) {

  return (
    <div>
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div style={{ position: "relative", width: size, height: size * 1.06 }}>

        {/* Ghost logo */}
        <svg
          width={size} height={size * 1.06} viewBox="0 0 28 30"
          style={{ position: "absolute", inset: 0, opacity: 0.1 }}
        >
          <polygon points="14,1 26,10 20,10 8,1" fill="#4f46e5" />
          <polygon points="8,1 20,10 14,10 2,1" fill="#6366f1" />
          <polygon points="14,15 26,29 20,29 8,15" fill="#4f46e5" />
          <polygon points="8,15 20,29 14,29 2,15" fill="#6366f1" />
        </svg>

        {/* Animated fill logo */}
        <svg
          width={size} height={size * 1.06} viewBox="0 0 28 30"
          style={{
            position: "absolute",
            inset: 0,
            animation: "fillTopBot 1.4s ease-in-out infinite alternate",
          }}
        >
          <defs>
            <linearGradient id="spinnerGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <polygon points="14,1 26,10 20,10 8,1" fill="url(#spinnerGrad)" />
          <polygon points="8,1 20,10 14,10 2,1" fill="#6366f1" opacity="0.8" />
          <polygon points="14,15 26,29 20,29 8,15" fill="url(#spinnerGrad)" />
          <polygon points="8,15 20,29 14,29 2,15" fill="#6366f1" opacity="0.8" />
        </svg>
      </div>

      <style>{`
        @keyframes fillTopBot {
          0%   { clip-path: inset(50% 0 50% 0); }
          100% { clip-path: inset(0% 0 0% 0); }
        }
      `}</style>
    </div>
    </div>
  );
}
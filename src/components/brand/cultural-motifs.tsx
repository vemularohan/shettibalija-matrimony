import { cn } from "@/lib/utils";

/**
 * Handcrafted Indian Cultural 3D Motifs
 * Traditional cultural motifs with subtle physical depth and restrained gold detailing.
 * NO neon, NO cyberpunk, NO cartoonish 3D.
 */

interface MotifProps {
  className?: string;
  size?: number;
}

/**
 * Traditional Indian Wedding Arch / Torana motif
 * Subtle gold ornamental arch inspired by South Indian temple architecture
 */
export function TraditionalArch({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center pointer-events-none select-none", className)}>
      <svg
        viewBox="0 0 320 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[320px] h-auto text-[#D1A329]"
      >
        {/* Subtle drop shadow for depth */}
        <filter id="arch-shadow" x="-5%" y="-10%" width="110%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="rgba(36,16,63,0.12)" />
        </filter>
        <g filter="url(#arch-shadow)">
          {/* Main arch curve */}
          <path
            d="M20 35 C80 35, 110 8, 160 8 C210 8, 240 35, 300 35"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.45"
          />
          {/* Parallel secondary arch */}
          <path
            d="M30 35 C85 35, 115 13, 160 13 C205 13, 235 35, 290 35"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.3"
          />
          {/* Center Kalash / Lotus top pinnacle */}
          <path
            d="M160 2 L163 7 L160 10 L157 7 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
          <circle cx="160" cy="18" r="2.5" fill="currentColor" fillOpacity="0.6" />
          {/* Flanking ornamental dots */}
          <circle cx="140" cy="12" r="1.5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="180" cy="12" r="1.5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="120" cy="17" r="1.5" fill="currentColor" fillOpacity="0.4" />
          <circle cx="200" cy="17" r="1.5" fill="currentColor" fillOpacity="0.4" />
          <circle cx="95" cy="24" r="1.5" fill="currentColor" fillOpacity="0.35" />
          <circle cx="225" cy="24" r="1.5" fill="currentColor" fillOpacity="0.35" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Handcrafted Diya Motif
 * Traditional brass ceremonial oil lamp with gentle warm ambient glow
 */
export function DiyaMotif({ size = 28, className }: MotifProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#D1A329]"
      >
        {/* Soft warm light glow behind the flame (not neon, just warm candlelight warmth) */}
        <radialGradient id="diya-glow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#D1A329" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D1A329" stopOpacity="0" />
        </radialGradient>
        <circle cx="16" cy="10" r="8" fill="url(#diya-glow)" />

        {/* Diya Lamp Body (Brushed brass look) */}
        <path
          d="M6 18 C6 24 11 26 16 26 C21 26 26 24 26 18 C26 17 25 16 23 16 C18 17 14 17 9 16 C7 16 6 17 6 18 Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
        {/* Diya Rim Highlight */}
        <path
          d="M6 18 C11 19.5 21 19.5 26 18"
          stroke="#FAF8F3"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
        {/* Base Pedestal */}
        <path
          d="M12 26 L11 28 L21 28 L20 26 Z"
          fill="currentColor"
          fillOpacity="0.7"
        />
        {/* Sacred Flame */}
        <path
          d="M16 6 C17 9 18.5 12 18.5 14 C18.5 15.5 17.5 16.5 16 16.5 C14.5 16.5 13.5 15.5 13.5 14 C13.5 12 15 9 16 6 Z"
          fill="#D1A329"
        />
        {/* Inner Flame core */}
        <path
          d="M16 9 C16.5 11 17 13 17 14.2 C17 14.9 16.5 15.4 16 15.4 C15.5 15.4 15 14.9 15 14.2 C15 13 15.5 11 16 9 Z"
          fill="#FAF8F3"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
}

/**
 * Ornamental Divider Line with Center Diamond and Gold Detailing
 */
export function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 w-full my-6", className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D1A329]/35 to-[#D1A329]/60" />
      <div className="flex items-center gap-1.5 shrink-0 text-[#D1A329]/75">
        <span className="text-[6px]">◆</span>
        <span className="text-[9px]">◆</span>
        <span className="text-[6px]">◆</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D1A329]/35 to-[#D1A329]/60" />
    </div>
  );
}

/**
 * Architectural Album Corner Accents
 * Gold brackets that give photos or cards a physical album corner mounting feel
 */
export function AlbumCornerAccents() {
  return (
    <>
      <span className="arch-corner arch-corner-tl pointer-events-none" style={{ width: 18, height: 18, top: 6, left: 6 }} />
      <span className="arch-corner arch-corner-tr pointer-events-none" style={{ width: 18, height: 18, top: 6, right: 6 }} />
      <span className="arch-corner arch-corner-bl pointer-events-none" style={{ width: 18, height: 18, bottom: 6, left: 6 }} />
      <span className="arch-corner arch-corner-br pointer-events-none" style={{ width: 18, height: 18, bottom: 6, right: 6 }} />
    </>
  );
}

import React, { useEffect, useState } from 'react';

interface ScamSleuthLogoProps {
  reducedMotion?: boolean;
}

/**
 * Clean, confident modern investigative thriller title lockup for SCAM SLEUTH.
 * Relies on strong, readable display typography, natural letter spacing,
 * soft white lettering (#F2F5FA), vivid pink SLEUTH (#F05A9D) with electric blue (#39BDF7) accent lines,
 * and subtle drop shadow for clean separation from the background.
 */
export const ScamSleuthLogo: React.FC<ScamSleuthLogoProps> = ({
  reducedMotion = false,
}) => {
  const [visible, setVisible] = useState<boolean>(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 40);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div
      className={`flex flex-col items-center text-center select-none ${
        reducedMotion
          ? 'opacity-100'
          : `transition-opacity duration-300 ease-out ${
              visible ? 'opacity-100' : 'opacity-0'
            }`
      }`}
    >
      {/* Floating Incident Kicker (No Box or Border) */}
      <div className="mb-[clamp(2px,0.7dvh,8px)] flex items-center gap-2 font-pixel text-[clamp(8px,min(1.25vw,1.55dvh),13px)] tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#39BDF7] drop-shadow-[0_0_8px_rgba(57,189,247,0.65)]">
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] shrink-0 ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
        />
        <span>CYBER FRAUD DIVISION · INVESTIGATION ARCHIVE</span>
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] shrink-0 ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
        />
      </div>

      {/* Floating Neon Sign Title (No Box, Panel, Border, or Corner Markers) */}
      <div className="relative px-3 sm:px-6 py-[clamp(1px,0.4dvh,6px)] flex flex-col items-center">
        {/* Soft Unboxed Atmospheric Neon Color Spill Behind Letters */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 sm:-inset-x-14 -inset-y-3 sm:-inset-y-6"
          style={{
            background:
              'radial-gradient(ellipse 44% 68% at 30% 50%, rgba(57, 189, 247, 0.28) 0%, rgba(240, 90, 157, 0.07) 65%, transparent 100%), radial-gradient(ellipse 48% 68% at 70% 50%, rgba(240, 90, 157, 0.30) 0%, rgba(57, 189, 247, 0.07) 65%, transparent 100%)',
          }}
        />

        {/* Understated Floating Pixel Fragments Around the Neon Sign */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -left-2 sm:-left-4 top-1.5 sm:top-2 w-1.5 h-1.5 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] ${
            reducedMotion ? 'opacity-60' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '1.2s' }}
          className={`pointer-events-none absolute left-[46%] -top-1 w-1 h-1 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] ${
            reducedMotion ? 'opacity-50' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '0.7s' }}
          className={`pointer-events-none absolute -right-2 sm:-right-4 bottom-2 w-1.5 h-1.5 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] ${
            reducedMotion ? 'opacity-60' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '1.9s' }}
          className={`pointer-events-none absolute right-[44%] -bottom-0.5 w-1 h-1 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] ${
            reducedMotion ? 'opacity-50' : 'animate-pixel-shard'
          }`}
        />

        <h1 className="relative z-10 font-pixel font-bold uppercase text-[clamp(1.45rem,min(5.2vw,6.8dvh),4.25rem)] tracking-[0.08em] leading-[1.05] text-[#F2F5FA] whitespace-nowrap">
          <span
            className={`sleuth-neon-scam ${
              reducedMotion ? '' : 'animate-neon-scam'
            }`}
          >
            SCAM{' '}
          </span>
          <span
            className={`sleuth-neon-word ${
              reducedMotion ? '' : 'animate-neon-sleuth'
            }`}
          >
            SLEUTH
          </span>
        </h1>

        {/* Thin Digital Clue-Trail Line Passing Beneath the Words */}
        <div
          aria-hidden="true"
          className="relative z-10 mt-[clamp(3px,0.8dvh,10px)] w-full max-w-[94%] flex items-center justify-center"
        >
          <span className="w-1.5 h-1.5 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] shrink-0" />
          <div className="h-[1.5px] sm:h-[2px] flex-1 bg-gradient-to-r from-[#39BDF7] via-[#F05A9D] to-[#39BDF7] opacity-85 shadow-[0_0_8px_rgba(57,189,247,0.65),0_0_10px_rgba(240,90,157,0.55)]" />
          <span className="mx-1.5 sm:mx-2 w-1.5 h-1.5 bg-[#F2F5FA] shadow-[0_0_8px_#39BDF7] shrink-0" />
          <div className="h-[1.5px] sm:h-[2px] flex-1 bg-gradient-to-r from-[#F05A9D] via-[#39BDF7] to-[#F05A9D] opacity-85 shadow-[0_0_8px_rgba(240,90,157,0.65),0_0_10px_rgba(57,189,247,0.55)]" />
          <span className="w-1.5 h-1.5 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] shrink-0" />
        </div>
      </div>

      {/* Subtitle */}
      <div className="mt-[clamp(2px,0.7dvh,8px)] flex items-center gap-2">
        <p className="font-mono font-semibold text-[clamp(8.5px,min(1.35vw,1.65dvh),15px)] text-[#F2F5FA]/90 tracking-[0.12em] sm:tracking-[0.18em] uppercase drop-shadow-[0_2px_4px_rgba(2,6,18,0.95)]">
          EVERY DIGITAL INTERACTION LEAVES A TRACE
        </p>
      </div>
    </div>
  );
};

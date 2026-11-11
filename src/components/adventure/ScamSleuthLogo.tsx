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
      <div className="mb-1.5 sm:mb-2.5 flex items-center gap-2 sm:gap-2.5 font-pixel text-[9px] sm:text-[11px] lg:text-xs xl:text-sm tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#39BDF7] drop-shadow-[0_0_8px_rgba(57,189,247,0.65)]">
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
        />
        <span>CYBER FRAUD DIVISION · INVESTIGATION ARCHIVE</span>
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
        />
      </div>

      {/* Floating Neon Sign Title (No Box, Panel, Border, or Corner Markers) */}
      <div className="relative px-3 sm:px-6 py-1 sm:py-2 flex flex-col items-center">
        {/* Soft Unboxed Atmospheric Neon Color Spill Behind Letters */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 sm:-inset-x-16 -inset-y-4 sm:-inset-y-8"
          style={{
            background:
              'radial-gradient(ellipse 44% 68% at 30% 50%, rgba(57, 189, 247, 0.28) 0%, rgba(240, 90, 157, 0.07) 65%, transparent 100%), radial-gradient(ellipse 48% 68% at 70% 50%, rgba(240, 90, 157, 0.30) 0%, rgba(57, 189, 247, 0.07) 65%, transparent 100%)',
          }}
        />

        {/* Understated Floating Pixel Fragments Around the Neon Sign */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -left-2 sm:-left-4 top-1.5 sm:top-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] ${
            reducedMotion ? 'opacity-60' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '1.2s' }}
          className={`pointer-events-none absolute left-[46%] -top-1 sm:-top-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] ${
            reducedMotion ? 'opacity-50' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '0.7s' }}
          className={`pointer-events-none absolute -right-2 sm:-right-4 bottom-2.5 sm:bottom-3.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] ${
            reducedMotion ? 'opacity-60' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '1.9s' }}
          className={`pointer-events-none absolute right-[44%] -bottom-0.5 sm:-bottom-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] ${
            reducedMotion ? 'opacity-50' : 'animate-pixel-shard'
          }`}
        />

        <h1 className="relative z-10 font-pixel font-bold uppercase text-[clamp(1.85rem,5.4vw,4.65rem)] tracking-[0.08em] leading-[1.08] text-[#F2F5FA]">
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
          className="relative z-10 mt-2 sm:mt-3 w-full max-w-[94%] flex items-center justify-center"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] shrink-0" />
          <div className="h-[1.5px] sm:h-[2px] flex-1 bg-gradient-to-r from-[#39BDF7] via-[#F05A9D] to-[#39BDF7] opacity-85 shadow-[0_0_8px_rgba(57,189,247,0.65),0_0_10px_rgba(240,90,157,0.55)]" />
          <span className="mx-1.5 sm:mx-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F2F5FA] shadow-[0_0_8px_#39BDF7] shrink-0" />
          <div className="h-[1.5px] sm:h-[2px] flex-1 bg-gradient-to-r from-[#F05A9D] via-[#39BDF7] to-[#F05A9D] opacity-85 shadow-[0_0_8px_rgba(240,90,157,0.65),0_0_10px_rgba(57,189,247,0.55)]" />
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] shrink-0" />
        </div>
      </div>

      {/* Subtitle */}
      <div className="mt-1.5 sm:mt-2.5 flex items-center gap-2">
        <p className="font-mono font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base text-[#F2F5FA]/90 tracking-[0.14em] sm:tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(2,6,18,0.95)]">
          EVERY DIGITAL INTERACTION LEAVES A TRACE
        </p>
      </div>
    </div>
  );
};

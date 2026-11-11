import React, { useEffect, useState } from 'react';

interface ScamSleuthLogoProps {
  reducedMotion?: boolean;
}

/**
 * Floating neon sign lockup for SCAM SLEUTH.
 * Keeps the existing pixel font, letter shapes, spacing, and wording unchanged,
 * scaling up confidently on desktop/laptop and proportionally on phones.
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
      <div className="mb-1.5 sm:mb-2.5 lg:mb-3 flex items-center gap-2 sm:gap-3 font-pixel text-[9.5px] sm:text-xs md:text-[13px] lg:text-sm tracking-[0.16em] sm:tracking-[0.24em] uppercase text-[#39BDF7] drop-shadow-[0_0_8px_rgba(57,189,247,0.65)]">
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[#F05A9D] shadow-[0_0_8px_#F05A9D] shrink-0 ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
        />
        <span>CYBER FRAUD DIVISION · INVESTIGATION ARCHIVE</span>
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[#39BDF7] shadow-[0_0_8px_#39BDF7] shrink-0 ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
        />
      </div>

      {/* Floating Neon Sign Title (No Box, Panel, Border, or Corner Markers) */}
      <div className="relative px-3 sm:px-8 lg:px-12 py-1 sm:py-2 flex flex-col items-center">
        {/* Soft Unboxed Atmospheric Neon Color Spill Behind Letters */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 sm:-inset-x-16 lg:-inset-x-24 -inset-y-4 sm:-inset-y-8"
          style={{
            background:
              'radial-gradient(ellipse 46% 72% at 30% 50%, rgba(57, 189, 247, 0.34) 0%, rgba(240, 90, 157, 0.10) 65%, transparent 100%), radial-gradient(ellipse 48% 72% at 70% 50%, rgba(240, 90, 157, 0.36) 0%, rgba(57, 189, 247, 0.10) 65%, transparent 100%)',
          }}
        />

        {/* Understated Floating Pixel Fragments Around the Neon Sign */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -left-1 sm:-left-4 lg:-left-6 top-1.5 sm:top-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[#39BDF7] shadow-[0_0_8px_#39BDF7] ${
            reducedMotion ? 'opacity-60' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '1.2s' }}
          className={`pointer-events-none absolute left-[45%] -top-1 sm:-top-2 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7] ${
            reducedMotion ? 'opacity-50' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '0.7s' }}
          className={`pointer-events-none absolute -right-1 sm:-right-4 lg:-right-6 bottom-2 sm:bottom-3 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[#F05A9D] shadow-[0_0_8px_#F05A9D] ${
            reducedMotion ? 'opacity-60' : 'animate-pixel-shard'
          }`}
        />
        <span
          aria-hidden="true"
          style={{ animationDelay: '1.9s' }}
          className={`pointer-events-none absolute right-[43%] -bottom-0.5 sm:-bottom-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] ${
            reducedMotion ? 'opacity-50' : 'animate-pixel-shard'
          }`}
        />

        <h1 className="relative z-10 font-pixel font-bold uppercase text-[clamp(2rem,7.5vw,5.4rem)] sm:text-5xl md:text-6xl lg:text-[4.35rem] xl:text-[5.25rem] tracking-[0.09em] leading-[1.05] text-[#F2F5FA] whitespace-nowrap">
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
          className="relative z-10 mt-2 sm:mt-3 lg:mt-4 w-full max-w-[96%] flex items-center justify-center"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[#39BDF7] shadow-[0_0_8px_#39BDF7] shrink-0" />
          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#39BDF7] via-[#F05A9D] to-[#39BDF7] opacity-90 shadow-[0_0_8px_rgba(57,189,247,0.65),0_0_10px_rgba(240,90,157,0.55)]" />
          <span className="mx-2 sm:mx-3 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-[#F2F5FA] shadow-[0_0_8px_#39BDF7] shrink-0" />
          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#F05A9D] via-[#39BDF7] to-[#F05A9D] opacity-90 shadow-[0_0_8px_rgba(240,90,157,0.65),0_0_10px_rgba(57,189,247,0.55)]" />
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[#F05A9D] shadow-[0_0_8px_#F05A9D] shrink-0" />
        </div>
      </div>

      {/* Subtitle */}
      <div className="mt-1.5 sm:mt-2.5 lg:mt-3.5 flex items-center gap-2">
        <p className="font-mono font-semibold text-[11px] sm:text-sm md:text-base lg:text-lg xl:text-[19px] text-[#F2F5FA]/95 tracking-[0.14em] sm:tracking-[0.22em] uppercase drop-shadow-[0_2px_6px_rgba(2,6,18,0.95)]">
          EVERY DIGITAL INTERACTION LEAVES A TRACE
        </p>
      </div>
    </div>
  );
};

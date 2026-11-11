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
          : `transition-opacity duration-500 ease-out ${
              visible ? 'opacity-100' : 'opacity-0'
            }`
      }`}
    >
      <h1 className="font-heading font-bold uppercase text-4xl sm:text-5xl lg:text-6xl tracking-[0.08em] sm:tracking-[0.1em] leading-[1.08] text-[#F2F5FA] [text-shadow:0_2px_18px_rgba(8,20,38,0.95)]">
        <span>SCAM </span>
        <span className="text-[#F05A9D] [text-shadow:0_0_28px_rgba(240,90,157,0.55),0_2px_14px_rgba(8,20,38,0.95)]">
          SLEUTH
        </span>
      </h1>

      <div className="mt-2.5 flex items-center gap-2.5">
        <span className="h-[1.5px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-[#39BDF7] to-[#F05A9D]" />
        <p className="font-sans font-normal text-sm sm:text-base text-[#F2F5FA]/90 tracking-[0.03em] [text-shadow:0_1px_10px_rgba(8,20,38,0.95)]">
          Every message leaves a clue.
        </p>
        <span className="h-[1.5px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-[#39BDF7] to-[#F05A9D]" />
      </div>
    </div>
  );
};

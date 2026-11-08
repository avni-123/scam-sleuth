import React, { useEffect, useState } from 'react';

interface ScamSleuthLogoProps {
  reducedMotion?: boolean;
}

/**
 * Clean, confident modern investigative thriller title lockup for SCAM SLEUTH.
 * Relies on strong, readable display typography, natural letter spacing,
 * warm ivory lettering, a single restrained warm-amber accent on the subtitle,
 * and a subtle drop shadow for clean separation from the background.
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
      <h1 className="font-heading font-bold uppercase text-4xl sm:text-5xl lg:text-6xl tracking-[0.08em] sm:tracking-[0.1em] leading-[1.08] text-[#F6F1E6] [text-shadow:0_2px_14px_rgba(0,0,0,0.75)]">
        <span>SCAM </span>
        <span className="text-[#F2C97D]">SLEUTH</span>
      </h1>

      <p className="mt-2.5 sm:mt-3 font-sans font-normal text-sm sm:text-base text-[#E6DFD3]/85 tracking-[0.03em] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
        Every message leaves a clue.
      </p>
    </div>
  );
};

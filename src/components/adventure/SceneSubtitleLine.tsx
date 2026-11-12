import React from 'react';
import { GameSettings } from '../../types/adventure';

/**
 * Splits a multi-sentence dialogue string into short, readable single-breath lines
 * so subtitles never form a wall of text over the 3D scene.
 */
export function splitIntoShortSubtitleLines(rawText: string): string[] {
  const cleaned = rawText.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [''];

  // Split on sentence boundaries (. ! ? —) while keeping punctuation attached
  const sentenceParts = cleaned
    .split(/(?<=[.!?])\s+|(?:\s*—\s*)/)
    .map((s) => s.trim())
    .filter(Boolean);

  const shortLines: string[] = [];

  for (const part of sentenceParts) {
    if (part.length <= 72) {
      shortLines.push(part);
    } else {
      // Further split long sentences at natural comma / conjunction pauses
      const clauses = part.split(/(?<=,)\s+(?=\w{2,})/);
      let buffer = '';
      for (const clause of clauses) {
        if (!buffer) {
          buffer = clause;
        } else if ((buffer + ' ' + clause).length <= 72) {
          buffer += ' ' + clause;
        } else {
          shortLines.push(buffer);
          buffer = clause;
        }
      }
      if (buffer) shortLines.push(buffer);
    }
  }

  return shortLines.length > 0 ? shortLines : [cleaned];
}

interface SceneSubtitleLineProps {
  speaker?: string;
  showSpeakerName?: boolean;
  text: string;
  visible?: boolean;
  settings?: GameSettings;
}

/**
 * Direct-over-scene subtitle renderer using the unified interface font family.
 * - Centered near the bottom safe area of the screen
 * - Balanced line height and letter spacing for comfortable reading
 */
export const SceneSubtitleLine: React.FC<SceneSubtitleLineProps> = ({
  speaker,
  showSpeakerName = true,
  text,
  visible = true,
  settings,
}) => {
  if (settings?.subtitlesEnabled === false || !text) {
    return null;
  }

  const sizeMode =
    settings?.subtitleSize || (settings?.textSize === 'large' ? 'large' : 'normal');

  const textSizeClass =
    sizeMode === 'extra-large'
      ? 'text-base sm:text-lg'
      : sizeMode === 'large'
      ? 'text-sm sm:text-base'
      : 'text-xs sm:text-sm';

  const speakerSizeClass =
    sizeMode === 'extra-large'
      ? 'text-xs sm:text-sm'
      : sizeMode === 'large'
      ? 'text-[11px] sm:text-xs'
      : 'text-[10px] sm:text-xs';

  const contrastShadowClass = settings?.highContrast
    ? '[text-shadow:-1.5px_-1.5px_0_#020617,1.5px_-1.5px_0_#020617,-1.5px_1.5px_0_#020617,1.5px_1.5px_0_#020617,0_2px_10px_rgba(2,6,23,0.98)] font-bold'
    : '[text-shadow:-1px_-1px_0_rgba(2,6,23,0.98),1px_-1px_0_rgba(2,6,23,0.98),-1px_1px_0_rgba(2,6,23,0.98),1px_1px_0_rgba(2,6,23,0.98),0_2px_12px_rgba(2,6,23,0.95)] font-normal';

  const speakerShadowClass =
    '[text-shadow:-1px_-1px_0_rgba(2,6,23,0.98),1px_1px_0_rgba(2,6,23,0.98),0_1px_6px_rgba(2,6,23,0.95)]';

  const fadeTransitionClass = settings?.reducedMotion
    ? ''
    : 'transition-opacity duration-300 ease-in-out';

  const isInvestigatorSpeaker = Boolean(
    speaker && /detective|rowan|investigator/i.test(speaker)
  );

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-14 sm:bottom-16 z-40 flex flex-col items-center justify-end px-4 sm:px-12 select-none ${fadeTransitionClass} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
    >
      <div className="max-w-3xl w-full text-center space-y-1.5 px-4 py-2.5 rounded-2xl bg-[#04091A]/80 backdrop-blur-sm border border-sky-500/25 shadow-[0_8px_28px_rgba(2,6,23,0.85)]">
        {showSpeakerName && speaker && (
          <div
            className={`font-pixel ${speakerSizeClass} ${
              isInvestigatorSpeaker ? 'text-[#38BDF8]' : 'text-pink-300'
            } tracking-[0.12em] uppercase font-bold ${speakerShadowClass}`}
          >
            {speaker}
          </div>
        )}
        <p
          className={`font-pixel text-[#F8FAFC] ${textSizeClass} leading-relaxed tracking-[0.03em] ${contrastShadowClass}`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

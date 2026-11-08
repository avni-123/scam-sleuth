import React from 'react';
import { GameSettings } from '../../types/adventure';

/**
 * Splits a multi-sentence dialogue string into short, readable single-breath lines
 * (like the reference video: "Oh no!", "I'll be late for work!", "I should be on my car by now.")
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
    if (part.length <= 78) {
      shortLines.push(part);
    } else {
      // Further split long sentences at natural comma / conjunction pauses
      const clauses = part.split(/(?<=,)\s+(?=\w{2,})/);
      let buffer = '';
      for (const clause of clauses) {
        if (!buffer) {
          buffer = clause;
        } else if ((buffer + ' ' + clause).length <= 78) {
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
 * Box-free, direct-over-scene subtitle renderer matching the reference video.
 * - Centered near the bottom safe area of the screen
 * - White text with a subtle multi-layered dark outline/shadow for contrast against both light and dark 3D backgrounds
 * - No panel, speech bubble, card, banner, or translucent rectangle
 * - Gentle fade in/out transition
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
      ? 'text-xl sm:text-2xl'
      : sizeMode === 'large'
      ? 'text-lg sm:text-xl'
      : 'text-base sm:text-lg';

  const speakerSizeClass =
    sizeMode === 'extra-large'
      ? 'text-sm sm:text-base'
      : sizeMode === 'large'
      ? 'text-xs sm:text-sm'
      : 'text-xs';

  // Crisp dark outline + subtle shadow so white words read effortlessly on both bright plaster walls and dark scenes without any box
  const contrastShadowClass = settings?.highContrast
    ? '[text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,0_2px_8px_rgba(0,0,0,0.98)] font-semibold'
    : '[text-shadow:0_1px_2px_rgba(0,0,0,0.98),0_0_5px_rgba(0,0,0,0.9),0_2px_10px_rgba(0,0,0,0.85)] font-medium';

  const speakerShadowClass =
    '[text-shadow:0_1px_2px_rgba(0,0,0,0.98),0_0_4px_rgba(0,0,0,0.9)]';

  const fadeTransitionClass = settings?.reducedMotion
    ? ''
    : 'transition-opacity duration-300 ease-in-out';

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-14 sm:bottom-16 z-40 flex flex-col items-center justify-end px-6 sm:px-12 select-none ${fadeTransitionClass} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
    >
      <div className="max-w-2xl w-full text-center space-y-1">
        {showSpeakerName && speaker && (
          <div
            className={`font-sans ${speakerSizeClass} text-slate-200/90 tracking-wide font-normal ${speakerShadowClass}`}
          >
            {speaker}
          </div>
        )}
        <p
          className={`font-sans text-white ${textSizeClass} leading-snug tracking-normal ${contrastShadowClass}`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

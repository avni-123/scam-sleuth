import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NpcDef, GameSettings } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';
import {
  SceneSubtitleLine,
  splitIntoShortSubtitleLines,
} from './SceneSubtitleLine';

interface DialogueOverlayProps {
  npc: NpcDef;
  onClose: () => void;
  onTriggerDecision?: () => void;
  showDecisionAction?: boolean;
  settings?: GameSettings;
  onUpdateSettings?: (settings: Partial<GameSettings>) => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  npc,
  onClose,
  onTriggerDecision,
  showDecisionAction = false,
  settings,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(npc.dialogue[0]?.id || '');
  const currentNode =
    npc.dialogue.find((d) => d.id === currentNodeId) || npc.dialogue[0];

  // Split the current node's text into short, single-breath lines timed to speech
  const shortLines = useMemo(
    () => (currentNode ? splitIntoShortSubtitleLines(currentNode.text) : ['']),
    [currentNode]
  );

  const [lineIndex, setLineIndex] = useState<number>(0);
  const [isLineVisible, setIsLineVisible] = useState<boolean>(true);

  const activeLineText = shortLines[lineIndex] || shortLines[0] || '';

  // Reset short-line index and play voice audio whenever the dialogue node changes
  useEffect(() => {
    if (!currentNode) return;
    setLineIndex(0);
    setIsLineVisible(true);
    soundEngine.stopDialogueAudio();
    soundEngine.speakDialogueAudio(currentNode.speaker, currentNode.text);

    return () => {
      soundEngine.stopDialogueAudio();
    };
  }, [currentNodeId, currentNode]);

  const advanceNodeOrClose = useCallback(() => {
    soundEngine.stopDialogueAudio();
    soundEngine.playDialogueBlip();
    if (currentNode?.nextId) {
      setCurrentNodeId(currentNode.nextId);
    } else {
      onClose();
    }
  }, [currentNode, onClose]);

  const handleAdvance = useCallback(() => {
    if (lineIndex < shortLines.length - 1) {
      if (settings?.reducedMotion) {
        setLineIndex((idx) => idx + 1);
      } else {
        setIsLineVisible(false);
        setTimeout(() => {
          setLineIndex((idx) => idx + 1);
          setIsLineVisible(true);
        }, 160);
      }
    } else {
      advanceNodeOrClose();
    }
  }, [lineIndex, shortLines.length, settings?.reducedMotion, advanceNodeOrClose]);

  // Automatically time short subtitle lines to the character's speech
  useEffect(() => {
    if (!activeLineText) return;
    const wordCount = activeLineText.split(/\s+/).length;
    const lineDurationMs = Math.max(2200, Math.min(4200, wordCount * 290 + 950));

    const fadeOutTimer = setTimeout(() => {
      if (!settings?.reducedMotion) {
        setIsLineVisible(false);
      }
    }, Math.max(400, lineDurationMs - 240));

    const nextTimer = setTimeout(() => {
      if (lineIndex < shortLines.length - 1) {
        setLineIndex((idx) => idx + 1);
        setIsLineVisible(true);
      } else if (settings?.subtitleAutoAdvance !== false) {
        advanceNodeOrClose();
      } else {
        setIsLineVisible(true);
      }
    }, lineDurationMs);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextTimer);
    };
  }, [
    activeLineText,
    lineIndex,
    shortLines.length,
    settings?.reducedMotion,
    settings?.subtitleAutoAdvance,
    advanceNodeOrClose,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (
        e.code === 'Space' ||
        e.code === 'Enter' ||
        e.code === 'KeyT' ||
        e.code === 'KeyE' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault();
        handleAdvance();
      } else if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (currentNode) {
          soundEngine.stopDialogueAudio();
          soundEngine.speakDialogueAudio(currentNode.speaker, currentNode.text);
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        soundEngine.stopDialogueAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdvance, currentNode, onClose]);

  if (!currentNode) return null;

  // Put the speaker's name above the dialogue in a smaller, understated style,
  // or omit it on continuation lines when the speaking character in the scene is already established
  const isSpeakingNpcInScene =
    currentNode.speaker.toLowerCase() === npc.name.toLowerCase();
  const shouldShowSpeaker = !isSpeakingNpcInScene || lineIndex === 0;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-auto select-none cursor-pointer"
      onClick={handleAdvance}
      role="region"
      aria-label={`Dialogue with ${npc.name}`}
    >
      {/* Box-free direct-over-scene subtitle centered near the bottom */}
      <SceneSubtitleLine
        speaker={currentNode.speaker}
        showSpeakerName={shouldShowSpeaker}
        text={activeLineText}
        visible={isLineVisible}
        settings={settings}
      />

      {/* Minimal, box-free corner hint & optional Chapter 3 decision trigger kept well away from the subtitle safe area */}
      <div
        className="fixed bottom-4 right-5 z-40 flex items-center gap-4 text-xs font-mono text-slate-300/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {showDecisionAction && onTriggerDecision && (
          <button
            type="button"
            onClick={onTriggerDecision}
            className="text-amber-300 hover:text-amber-200 underline underline-offset-4 font-semibold cursor-pointer"
          >
            Make Case Decision
          </button>
        )}
        <button
          type="button"
          onClick={handleAdvance}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Space · Next
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.stopDialogueAudio();
            onClose();
          }}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Esc · Close
        </button>
      </div>
    </div>
  );
};

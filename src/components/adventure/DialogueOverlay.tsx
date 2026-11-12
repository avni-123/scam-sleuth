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
  isPaused?: boolean;
  onPause?: () => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  npc,
  onClose,
  onTriggerDecision,
  showDecisionAction = false,
  settings,
  isPaused = false,
  onPause,
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
  const [lineElapsedMs, setLineElapsedMs] = useState<number>(0);
  const [isLineVisible, setIsLineVisible] = useState<boolean>(true);

  const activeLineText = shortLines[lineIndex] || shortLines[0] || '';
  const wordCount = useMemo(
    () => (activeLineText ? activeLineText.split(/\s+/).length : 1),
    [activeLineText]
  );
  const lineDurationMs = useMemo(
    () => Math.max(2200, Math.min(4200, wordCount * 290 + 950)),
    [wordCount]
  );

  // Reset short-line index and play voice audio ONLY when the dialogue node changes
  // (Pausing/resuming does not re-run this effect, preserving voice playback position)
  useEffect(() => {
    if (!currentNode) return;
    setLineIndex(0);
    setLineElapsedMs(0);
    setIsLineVisible(true);
    soundEngine.stopDialogueAudio();
    if (settings?.voiceAudioEnabled !== false) {
      soundEngine.speakDialogueAudio(currentNode.speaker, currentNode.text);
    }

    return () => {
      soundEngine.stopDialogueAudio();
    };
  }, [currentNodeId, currentNode, settings?.voiceAudioEnabled]);

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
    if (isPaused) return;
    if (lineIndex < shortLines.length - 1) {
      if (settings?.reducedMotion) {
        setLineIndex((idx) => idx + 1);
        setLineElapsedMs(0);
        setIsLineVisible(true);
      } else {
        setIsLineVisible(false);
        setTimeout(() => {
          setLineIndex((idx) => idx + 1);
          setLineElapsedMs(0);
          setIsLineVisible(true);
        }, 160);
      }
    } else {
      advanceNodeOrClose();
    }
  }, [isPaused, lineIndex, shortLines.length, settings?.reducedMotion, advanceNodeOrClose]);

  // Increment elapsed subtitle time only while not paused so pausing preserves exact subtitle progress
  useEffect(() => {
    if (!activeLineText || isPaused) return;
    const stepMs = 60;
    const interval = setInterval(() => {
      setLineElapsedMs((prev) => prev + stepMs);
    }, stepMs);
    return () => clearInterval(interval);
  }, [activeLineText, isPaused]);

  // Evaluate subtitle visibility and line progression from accumulated elapsed time
  useEffect(() => {
    if (!activeLineText || isPaused) return;
    const fadeStartMs = Math.max(400, lineDurationMs - 240);

    if (lineElapsedMs >= lineDurationMs) {
      if (lineIndex < shortLines.length - 1) {
        setLineIndex((idx) => idx + 1);
        setLineElapsedMs(0);
        setIsLineVisible(true);
      } else if (settings?.subtitleAutoAdvance !== false) {
        advanceNodeOrClose();
      } else {
        setIsLineVisible(true);
      }
    } else if (lineElapsedMs >= fadeStartMs && !settings?.reducedMotion) {
      setIsLineVisible(false);
    } else {
      setIsLineVisible(true);
    }
  }, [
    lineElapsedMs,
    lineDurationMs,
    activeLineText,
    isPaused,
    lineIndex,
    shortLines.length,
    settings?.reducedMotion,
    settings?.subtitleAutoAdvance,
    advanceNodeOrClose,
  ]);

  // Keyboard navigation (disabled while paused; Esc is handled by global pause system)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
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
        if (currentNode && settings?.voiceAudioEnabled !== false) {
          soundEngine.stopDialogueAudio();
          soundEngine.speakDialogueAudio(currentNode.speaker, currentNode.text);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, handleAdvance, currentNode, settings?.voiceAudioEnabled]);

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

      {/* Minimal corner hint & optional Chapter 3 decision trigger kept well away from the subtitle safe area */}
      <div
        className="fixed bottom-4 right-5 z-40 flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#081426]/90 border border-[#39BDF7]/30 backdrop-blur-md text-xs font-mono text-[#F2F5FA] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {showDecisionAction && onTriggerDecision && (
          <button
            type="button"
            disabled={isPaused}
            onClick={onTriggerDecision}
            className="text-[#F05A9D] hover:text-pink-200 underline underline-offset-4 font-semibold cursor-pointer disabled:opacity-50"
          >
            Make Case Decision
          </button>
        )}
        <button
          type="button"
          disabled={isPaused}
          onClick={handleAdvance}
          className="text-[#39BDF7] hover:text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          Space · Next
        </button>
        <span className="text-slate-600">·</span>
        <button
          type="button"
          disabled={isPaused}
          onClick={() => {
            soundEngine.stopDialogueAudio();
            onClose();
          }}
          className="text-[#F2F5FA]/80 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          End Talk
        </button>
        {onPause && (
          <>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={onPause}
              className="text-[#F05A9D] hover:text-white transition-colors cursor-pointer"
            >
              Esc · Pause
            </button>
          </>
        )}
      </div>
    </div>
  );
};

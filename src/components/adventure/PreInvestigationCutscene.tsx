import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FastForward,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Laptop,
  PhoneCall,
  LayoutGrid,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Footprints,
} from 'lucide-react';
import { AdventureLevel, GameSettings } from '../../types/adventure';
import {
  LevelIntroCutscene,
  CutsceneCameraShot,
  IntroCutsceneBeat,
} from '../../data/levelIntroCutscenes';
import { soundEngine } from '../../utils/proceduralAudio';
import {
  SceneSubtitleLine,
  splitIntoShortSubtitleLines,
} from './SceneSubtitleLine';

interface PreInvestigationCutsceneProps {
  level: AdventureLevel;
  cutscene: LevelIntroCutscene;
  settings: GameSettings;
  onUpdateSettings?: (partial: Partial<GameSettings>) => void;
  onBeatChange: (shot: CutsceneCameraShot, isSpeaking: boolean) => void;
  onComplete: () => void;
  onSkip: () => void;
}

export const PreInvestigationCutscene: React.FC<PreInvestigationCutsceneProps> = ({
  level,
  cutscene,
  settings,
  onBeatChange,
  onComplete,
  onSkip,
}) => {
  const [beatIndex, setBeatIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [beatElapsedMs, setBeatElapsedMs] = useState<number>(0);
  const [isLineVisible, setIsLineVisible] = useState<boolean>(true);

  const beats = cutscene.beats;
  const currentBeat: IntroCutsceneBeat = beats[beatIndex] || beats[0];
  const isFinalBeat = beatIndex === beats.length - 1;
  const currentBeatDurationMs = currentBeat.durationSec * 1000;

  // Split each beat's dialogue into short, single-breath subtitle lines timed across the beat
  const shortLines = useMemo(
    () => splitIntoShortSubtitleLines(currentBeat.subtitleText),
    [currentBeat.subtitleText]
  );

  // Determine which short line is active based on elapsed time in the current beat
  const lineIndex = useMemo(() => {
    if (shortLines.length <= 1) return 0;
    const progressRatio = Math.min(0.999, Math.max(0, beatElapsedMs / Math.max(1, currentBeatDurationMs)));
    return Math.min(shortLines.length - 1, Math.floor(progressRatio * shortLines.length));
  }, [beatElapsedMs, currentBeatDurationMs, shortLines.length]);

  const activeLineText = shortLines[lineIndex] || shortLines[0] || '';

  // Gentle fade out right before a short line or beat transitions
  useEffect(() => {
    if (settings.reducedMotion) {
      setIsLineVisible(true);
      return;
    }
    const segmentDurationMs = currentBeatDurationMs / Math.max(1, shortLines.length);
    const elapsedInSegment = beatElapsedMs % segmentDurationMs;
    const shouldFade = segmentDurationMs - elapsedInSegment < 220;
    setIsLineVisible(!shouldFade);
  }, [beatElapsedMs, currentBeatDurationMs, shortLines.length, settings.reducedMotion]);

  // Notify parent 3D scene of current camera shot and speaking state, and trigger voice audio
  useEffect(() => {
    const isCharacterSpeaking = Boolean(currentBeat.isNpcSpeaking);
    onBeatChange(currentBeat.cameraShot, isCharacterSpeaking);
    soundEngine.stopDialogueAudio();
    soundEngine.playDialogueBlip();
    soundEngine.speakDialogueAudio(currentBeat.speaker, currentBeat.subtitleText);

    return () => {
      soundEngine.stopDialogueAudio();
    };
  }, [beatIndex, currentBeat, onBeatChange]);

  // Reset to Beat 0 when level changes
  useEffect(() => {
    setBeatIndex(0);
    setBeatElapsedMs(0);
    setIsPaused(false);
  }, [level.id]);

  // Smooth timer for auto-advancing through the 4 story beats (~27s total)
  useEffect(() => {
    if (isPaused) return;
    const stepMs = 80;
    const interval = setInterval(() => {
      setBeatElapsedMs((prev) => {
        const next = prev + stepMs;
        if (next >= currentBeatDurationMs) {
          if (beatIndex < beats.length - 1) {
            setBeatIndex((idx) => Math.min(beats.length - 1, idx + 1));
            return 0;
          } else {
            clearInterval(interval);
            soundEngine.stopDialogueAudio();
            onComplete();
            return currentBeatDurationMs;
          }
        }
        return next;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [beatIndex, beats.length, currentBeatDurationMs, isPaused, onComplete]);

  const handleNextBeat = useCallback(() => {
    soundEngine.stopDialogueAudio();
    soundEngine.playInteract();
    if (beatIndex < beats.length - 1) {
      setBeatIndex((idx) => idx + 1);
      setBeatElapsedMs(0);
    } else {
      onComplete();
    }
  }, [beatIndex, beats.length, onComplete]);

  const handlePrevBeat = useCallback(() => {
    soundEngine.stopDialogueAudio();
    soundEngine.playInteract();
    if (beatIndex > 0) {
      setBeatIndex((idx) => idx - 1);
      setBeatElapsedMs(0);
    }
  }, [beatIndex]);

  // Keyboard shortcuts during cutscene (Space = Skip, Right/Enter = Next Beat, Left = Prev Beat)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        soundEngine.stopDialogueAudio();
        soundEngine.playInteract();
        onSkip();
      } else if (e.code === 'ArrowRight' || e.code === 'Enter') {
        e.preventDefault();
        handleNextBeat();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevBeat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextBeat, handlePrevBeat, onSkip]);

  const activeSizeMode =
    settings.subtitleSize || (settings.textSize === 'large' ? 'large' : 'normal');

  const actionFontClass =
    activeSizeMode === 'extra-large'
      ? 'text-sm sm:text-base'
      : activeSizeMode === 'large'
      ? 'text-xs sm:text-sm'
      : 'text-xs';

  const popup = cutscene.devicePopup;
  const showDeviceCard = Boolean(currentBeat.showDevicePopup) || beatIndex === 1;
  const accentMode: 'rose' | 'cyan' | 'amber' =
    popup.deviceType === 'audio_call'
      ? 'rose'
      : popup.deviceType === 'laptop' || popup.deviceType === 'case_board'
      ? 'cyan'
      : 'amber';

  // Omit speaker name on continuation lines when the visibly speaking character in the 3D scene is already established
  const shouldShowSpeaker = !currentBeat.isNpcSpeaking || lineIndex === 0;

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-auto flex flex-col justify-between p-3 sm:p-5 select-none"
      role="region"
      aria-label={`Pre-investigation story for ${level.title}`}
    >
      {/* =====================================================================
          TOP COMPACT BAR: TIME/LOCATION KICKER + SKIP BUTTON
      ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-6xl mx-auto">
        {/* Left: Compact Time & Place Text over Scene */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_0_8px_rgba(0,0,0,0.85)]">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-amber-300 font-semibold">{cutscene.levelNumberLabel}</span>
          <span>·</span>
          <span>{cutscene.timeAndPlaceKicker}</span>
        </div>

        {/* Right: Skip Button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              soundEngine.stopDialogueAudio();
              soundEngine.playInteract();
              onSkip();
            }}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            title="Skip opening story and start gameplay with a 1-line context summary (Space)"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          UPPER-RIGHT DEVICE INCIDENT SCREEN PREVIEW (Only during device beat, kept away from bottom subtitles)
      ===================================================================== */}
      <div className="my-auto flex items-start justify-end max-w-6xl w-full mx-auto pb-24 pointer-events-none">
        {showDeviceCard && (
          <div
            className={`pointer-events-auto w-full max-w-sm rounded-2xl bg-[#070D1E]/92 border ${
              accentMode === 'rose'
                ? 'border-rose-500/70'
                : accentMode === 'cyan'
                ? 'border-[#00F0FF]/70'
                : 'border-amber-400/70'
            } p-3.5 backdrop-blur-xl shadow-2xl ${
              settings.reducedMotion ? '' : 'transition-opacity duration-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    accentMode === 'rose'
                      ? 'bg-rose-500/20 text-rose-300'
                      : accentMode === 'cyan'
                      ? 'bg-[#00F0FF]/15 text-[#00F0FF]'
                      : 'bg-amber-400/20 text-amber-300'
                  }`}
                >
                  {popup.deviceType === 'phone' && <Smartphone className="w-3.5 h-3.5" />}
                  {popup.deviceType === 'laptop' && <Laptop className="w-3.5 h-3.5" />}
                  {popup.deviceType === 'audio_call' && <PhoneCall className="w-3.5 h-3.5" />}
                  {popup.deviceType === 'case_board' && <LayoutGrid className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {popup.headerTitle} · {popup.timestamp}
                  </span>
                  <span className="block font-mono text-xs font-bold text-white truncate">
                    {popup.senderOrUrl}
                  </span>
                </div>
              </div>

              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono text-[10px] font-bold shrink-0">
                {popup.alertBadge}
              </span>
            </div>

            <div className="rounded-lg bg-[#0B132B] border border-white/10 p-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className={`font-mono text-slate-100 leading-snug ${actionFontClass}`}>
                  {popup.messagePreview}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-amber-200 font-mono text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{popup.mysteryHighlight}</span>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          BOX-FREE DIRECT-OVER-SCENE SUBTITLE (Matches Reference Video)
      ===================================================================== */}
      <SceneSubtitleLine
        speaker={currentBeat.speaker}
        showSpeakerName={shouldShowSpeaker}
        text={activeLineText}
        visible={isLineVisible}
        settings={settings}
      />

      {/* =====================================================================
          MINIMAL BOTTOM-CORNER PLAYBACK CONTROLS (Kept outside center subtitle area)
      ===================================================================== */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-xs font-mono text-slate-300/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.95)] pt-2">
        <span className="truncate max-w-md hidden sm:inline">
          {isFinalBeat ? `Objective: ${cutscene.startingObjective}` : cutscene.compellingQuestion}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={handlePrevBeat}
            disabled={beatIndex === 0}
            className="hover:text-white disabled:opacity-35 flex items-center gap-0.5 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Beat (Left Arrow)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playInteract();
              setIsPaused((prev) => !prev);
            }}
            className="hover:text-white flex items-center gap-1 cursor-pointer"
            title={isPaused ? 'Resume Story' : 'Pause Story'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={handleNextBeat}
            className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {isFinalBeat ? (
              <>
                <Footprints className="w-3.5 h-3.5" />
                <span>Investigate</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import {
  BookOpen,
  Footprints,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Hand,
  Search,
  Target,
  CheckCircle2,
  Film,
} from 'lucide-react';
import { AdventureLevel, GameSettings } from '../../types/adventure';
import { NearbyTarget } from '../3d/AdventureWorld';

interface MissionHudProps {
  level: AdventureLevel;
  activeChapterNum?: 1 | 2 | 3;
  onSelectChapter?: (ch: 1 | 2 | 3) => void;
  hasSpokenToNpc?: boolean;
  settings: GameSettings;
  collectedClueIds: string[];
  activeNearby: NearbyTarget | null;
  openingContextSummary?: string | null;
  onDismissOpeningSummary?: () => void;
  onReplayOpeningStory?: () => void;
  onOpenJournal: () => void;
  onOpenChapterQuestion?: () => void;
  onTalkToPerson?: () => void;
  onOpenSettings: () => void;
  onToggleCamera: () => void;
  onTogglePhoneInHand?: () => void;
  onTriggerDecision: () => void;
  onMobileInteract: () => void;
  onMobileMove: (vec: { x: number; y: number }) => void;
  isMobileJogging: boolean;
  onToggleMobileJog: () => void;
}

export const MissionHud: React.FC<MissionHudProps> = ({
  level,
  activeChapterNum = 1,
  onSelectChapter,
  hasSpokenToNpc = false,
  settings,
  collectedClueIds,
  activeNearby,
  openingContextSummary,
  onDismissOpeningSummary,
  onReplayOpeningStory,
  onOpenJournal,
  onOpenChapterQuestion,
  onTalkToPerson,
  onOpenSettings,
  onToggleCamera,
  onTogglePhoneInHand,
  onTriggerDecision,
  onMobileInteract,
  onMobileMove,
  isMobileJogging,
  onToggleMobileJog,
}) => {
  const totalClues = level.objects.length;
  const foundCount = collectedClueIds.length;

  // Collapsible/hideable state for top-left compact case card (Shortcut: H key)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
  const [isHideChipHidden, setIsHideChipHidden] = useState<boolean>(false);

  useEffect(() => {
    const handleTogglePanelKey = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'KeyH' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+H hides even the tiny Show/Hide button completely
          setIsHideChipHidden((prev) => {
            const next = !prev;
            if (next) setIsPanelCollapsed(true);
            return next;
          });
        } else {
          if (isHideChipHidden) {
            setIsHideChipHidden(false);
            setIsPanelCollapsed(false);
          } else {
            setIsPanelCollapsed((prev) => !prev);
          }
        }
      }
    };

    window.addEventListener('keydown', handleTogglePanelKey);
    return () => window.removeEventListener('keydown', handleTogglePanelKey);
  }, [isHideChipHidden]);

  const shortPhaseName =
    activeChapterNum === 1
      ? 'Setup'
      : activeChapterNum === 2
      ? 'Investigation'
      : 'Decision';

  const activeChapter =
    level.chapters?.[activeChapterNum - 1] ||
    level.chapters?.[0] || {
      number: activeChapterNum,
      phase: `The ${shortPhaseName}`,
      title: `Chapter ${activeChapterNum}`,
      summary: level.objective,
    };

  // Track nearest undiscovered clue from 3D telemetry & gentle stuck-player guidance
  const [nearestUndiscoveredClueName, setNearestUndiscoveredClueName] = useState<string | null>(null);
  const [isPlayerStuck, setIsPlayerStuck] = useState<boolean>(false);

  useEffect(() => {
    const handleTelemetry = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && 'nearestUndiscoveredClueName' in detail) {
        setNearestUndiscoveredClueName(detail.nearestUndiscoveredClueName || null);
      }
    };
    window.addEventListener('sleuth-telemetry', handleTelemetry);
    return () => window.removeEventListener('sleuth-telemetry', handleTelemetry);
  }, []);

  useEffect(() => {
    setIsPlayerStuck(false);
    if (foundCount >= totalClues || activeChapterNum === 3) return;
    const stuckTimer = setTimeout(() => {
      setIsPlayerStuck(true);
    }, 10000);
    return () => clearTimeout(stuckTimer);
  }, [foundCount, hasSpokenToNpc, level.id, activeChapterNum, totalClues]);

  // Concise, dynamic current objective that updates as the player completes actions
  const npcFull = level.npcs[0]?.name || 'Witness';
  const npcFirstName = npcFull.split(' ')[0];
  const isLevel1 = level.id === 'tutorial-delivery';

  const currentObjectiveText = (() => {
    if (activeChapterNum === 3) {
      return `Choose the safe response to resolve ${npcFirstName}’s case.`;
    }
    if (!hasSpokenToNpc) {
      return isLevel1
        ? `Ask ${npcFirstName} about the delivery message.`
        : `Ask ${npcFirstName} about the alert.`;
    }
    if (foundCount < totalClues) {
      if (foundCount === 0) {
        return `Inspect ${npcFirstName}’s phone and check the notices.`;
      }
      return nearestUndiscoveredClueName
        ? `Check ${nearestUndiscoveredClueName} (${foundCount}/${totalClues} clues found).`
        : `Inspect remaining evidence (${foundCount}/${totalClues} clues found).`;
    }
    return `All clues collected. Make your decision.`;
  })();

  // Subtle chapter transition toast (respects reduced motion)
  const [showIntroSplash, setShowIntroSplash] = useState<boolean>(false);

  useEffect(() => {
    if (settings.reducedMotion) {
      setShowIntroSplash(false);
      return;
    }
    setShowIntroSplash(true);
    const timer = setTimeout(() => {
      setShowIntroSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [level.id, activeChapterNum, settings.reducedMotion]);

  // Virtual Joystick touch handling for mobile
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState<boolean>(false);

  const handleJoystickStart = (e: React.TouchEvent) => {
    setIsJoystickActive(true);
    handleJoystickMove(e);
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 40;
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;
    setKnobPos({ x: knobX, y: knobY });

    onMobileMove({
      x: knobX / maxRadius,
      y: knobY / maxRadius,
    });
  };

  const handleJoystickEnd = () => {
    setIsJoystickActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMobileMove({ x: 0, y: 0 });
  };

  const textScaleClass = settings.textSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-4 ${textScaleClass}`}
    >
      {/* Top Row: Compact Collapsible Case Panel (Left) + Clear Objective Pill (Center) + Toolbar (Right, padded away from floating controls) */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-2.5 w-full pr-0 sm:pr-12">
        {/* LEFT: Compact, Collapsible Case & Chapter Progress Panel */}
        {isHideChipHidden ? (
          <div className="w-1 h-1 pointer-events-none" />
        ) : (
          <div
            className={`pointer-events-auto bg-[#060D20]/92 border ${
              settings.highContrast ? 'border-white' : 'border-sky-500/25'
            } rounded-2xl px-3.5 py-2.5 backdrop-blur-md shadow-[0_12px_32px_rgba(2,6,23,0.85)] ${
              isPanelCollapsed ? 'w-auto' : 'w-full max-w-[310px] sm:max-w-[335px]'
            } transition-all`}
          >
            {/* Compact Header Row: Chapter Progress Indicator + Collapse Button (Shortcut: H) */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded-md bg-pink-500/15 border border-pink-400/45 text-pink-300 font-mono text-[11px] font-bold tracking-wide">
                Chapter {activeChapter.number} of 3 — {shortPhaseName}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsPanelCollapsed((prev) => !prev)}
                  className="px-2 py-0.5 rounded-lg bg-[#0B1630] hover:bg-[#13244A] border border-sky-500/25 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-mono"
                  title={isPanelCollapsed ? 'Show Case Panel (Press H)' : 'Hide Case Panel (Press H)'}
                >
                  <span>{isPanelCollapsed ? 'Show' : 'Hide'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-pink-500/20 border border-pink-400/45 text-pink-300 text-[10px] font-bold">
                    H
                  </span>
                  {isPanelCollapsed ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPanelCollapsed(true);
                    setIsHideChipHidden(true);
                  }}
                  className="px-1.5 py-0.5 rounded-lg bg-[#0B1630] hover:bg-rose-500/20 border border-sky-500/20 hover:border-rose-400/40 text-slate-400 hover:text-rose-200 transition-colors cursor-pointer text-[11px] font-mono"
                  title="Hide this bar completely (Shift + H, press H to restore)"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Level Title (Only when expanded so collapsed state stays ultra-compact) */}
            {!isPanelCollapsed && (
              <h2 className="font-heading font-bold text-xs sm:text-sm text-white leading-snug mt-1 truncate">
                {level.title}
              </h2>
            )}

          {/* Collapsible Body: Only Short Objective, Clue Progress, and Current-Chapter Action */}
          {!isPanelCollapsed && (
            <div className="mt-2 pt-2 border-t border-sky-500/20 space-y-2">
              <p className="text-xs text-slate-100 leading-snug">
                <span className="text-[#38BDF8] font-semibold">Objective: </span>
                {currentObjectiveText}
              </p>

              {/* Clue Progress Bar & Counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span>Clue progress:</span>
                  </span>
                  <span
                    className={`font-bold tabular-nums ${
                      foundCount >= totalClues ? 'text-emerald-300' : 'text-pink-300'
                    }`}
                  >
                    {foundCount}/{totalClues} clues found
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0B1630] rounded-full overflow-hidden border border-sky-500/15">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      foundCount >= totalClues
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-[#F05A9D] via-pink-400 to-[#39BDF7]'
                    }`}
                    style={{
                      width: `${Math.min(100, (foundCount / Math.max(1, totalClues)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Chapter Action ONLY (Never shows Chapter 3 decision early in Chapter 1) */}
              <div className="pt-1 flex flex-col gap-1.5">
                {onOpenChapterQuestion && (
                  <button
                    type="button"
                    onClick={onOpenChapterQuestion}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#081426] hover:bg-[#0B1A33] border border-[#39BDF7]/50 text-[#39BDF7] hover:text-white font-mono text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-[#F05A9D]" />
                      <span>Press Q to inspect clues</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#F05A9D]/20 border border-[#F05A9D]/40 text-[10px] text-[#F05A9D] font-bold">
                      Q
                    </span>
                  </button>
                )}

                {/* Chapter 3 Decision Action ONLY visible when in Chapter 3 */}
                {activeChapterNum === 3 && (
                  <button
                    type="button"
                    onClick={onTriggerDecision}
                    className="w-full px-3 py-2 rounded-xl bg-[#39BDF7] hover:bg-sky-300 text-slate-950 font-heading font-bold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-[0_0_18px_rgba(57,189,247,0.3)]"
                  >
                    <span>Make Case Decision (4 Options)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          </div>
        )}

        {/* CENTER-TOP: Clear, Single-Line Current Objective Banner */}
        <div className="pointer-events-auto mx-auto hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#081426]/95 border border-[#39BDF7]/40 shadow-[0_12px_32px_rgba(2,6,23,0.85)] backdrop-blur-md max-w-lg">
          <div className="w-6 h-6 rounded-lg bg-[#39BDF7]/15 border border-[#39BDF7]/40 flex items-center justify-center text-[#39BDF7] shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block font-mono text-[10px] text-pink-300 uppercase tracking-wider font-bold">
              Current Objective · {foundCount}/{totalClues} clues found
            </span>
            <span className="block font-heading font-semibold text-xs sm:text-sm text-white truncate">
              {currentObjectiveText}
            </span>
          </div>
        </div>

        {/* RIGHT: Clean Investigator Toolbar (Replay Opening, Journal) */}
        <div className="flex flex-row items-center gap-2 self-end md:self-start pointer-events-auto">
          {onReplayOpeningStory && (
            <button
              type="button"
              onClick={onReplayOpeningStory}
              className="px-3 py-2 rounded-xl bg-[#060D20]/92 hover:bg-[#101F42] border border-pink-400/45 text-pink-300 hover:text-white transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              title="Replay Pre-Investigation Opening Story"
            >
              <Film className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline font-mono text-xs font-semibold">
                Opening Story
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenJournal}
            className="px-3 py-2 rounded-xl bg-[#060D20]/92 hover:bg-[#101F42] border border-sky-500/30 text-slate-100 hover:text-white transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            title="Open Case Journal & Full Chapter List (J)"
          >
            <BookOpen className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-mono text-xs font-semibold">
              Journal ({foundCount}/{totalClues})
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          1-LINE OPENING CONTEXT SUMMARY BANNER (Shown when opening is skipped or just completed)
      ===================================================================== */}
      {openingContextSummary && (
        <div className="pointer-events-auto self-center mt-2 w-full max-w-3xl px-2">
          <div className="px-4 py-2.5 rounded-xl bg-[#060D20]/95 border border-pink-400/50 shadow-[0_12px_36px_rgba(2,6,23,0.9)] backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-400/45 text-pink-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                Case Context
              </span>
              <p className="font-sans text-xs sm:text-sm text-slate-100 truncate sm:whitespace-normal">
                {openingContextSummary}
              </p>
            </div>
            {onDismissOpeningSummary && (
              <button
                type="button"
                onClick={onDismissOpeningSummary}
                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white font-mono text-xs shrink-0 cursor-pointer"
                title="Dismiss context banner"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Subtle Upper-Center Chapter Banner on Chapter Transition (Non-blocking) */}
      {showIntroSplash && !openingContextSummary && (
        <div className="pointer-events-none self-center mt-2 animate-fade-in">
          <div className="px-5 py-2.5 rounded-2xl bg-[#060D20]/95 border border-pink-400/65 shadow-[0_12px_36px_rgba(2,6,23,0.9),0_0_24px_rgba(236,72,153,0.22)] backdrop-blur-md text-center">
            <span className="font-mono text-[10px] text-pink-300 uppercase tracking-widest block font-bold">
              Chapter {activeChapter.number} of 3 — {shortPhaseName}
            </span>
            <span className="font-heading font-bold text-sm text-white block mt-0.5">
              {activeChapter.title}
            </span>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUBTLE CENTER RETICLE ONLY (Pink for clues/objects, Electric Cyan for NPCs)
      ===================================================================== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center">
        {activeNearby ? (
          <div className="relative w-7 h-7 flex items-center justify-center transition-all duration-200">
            <div
              className={`w-2 h-2 rounded-full ${
                activeNearby.type === 'object'
                  ? 'bg-[#F05A9D] shadow-[0_0_10px_#F05A9D]'
                  : 'bg-[#39BDF7] shadow-[0_0_10px_#39BDF7]'
              }`}
            />
            <div
              className={`absolute inset-0 rounded-full border ${
                activeNearby.type === 'object'
                  ? 'border-[#F05A9D]/80'
                  : 'border-[#39BDF7]/80'
              }`}
            />
          </div>
        ) : (
          <div className="relative flex items-center justify-center opacity-75">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-100 shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
            <div className="absolute w-4 h-4 rounded-full border border-sky-300/30" />
          </div>
        )}
      </div>

      {/* =====================================================================
          BOTTOM HUD: CHAPTER 3 DECISION + CONCISE CONTROLS (NO GPS / MINIMAP)
      ===================================================================== */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-3 pointer-events-none mt-auto pr-0 sm:pr-12">
        <div className="flex flex-col items-center gap-2 pointer-events-auto mx-auto pb-0.5">
          {/* Show Chapter 3 Decision Button ONLY when player is in Chapter 3 */}
          {activeChapterNum === 3 && (
            <button
              type="button"
              onClick={onTriggerDecision}
              className="px-5 py-2.5 rounded-2xl bg-[#39BDF7] hover:bg-sky-300 text-slate-950 font-heading font-black text-xs sm:text-sm uppercase tracking-wide shadow-[0_0_25px_rgba(57,189,247,0.45)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Chapter 3: Make Your Decision (4 Options)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Simplified, High-Contrast Bottom Control Strip */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#081426]/95 border border-[#39BDF7]/25 text-xs font-mono text-[#F2F5FA] backdrop-blur-md shadow-[0_8px_28px_rgba(2,6,23,0.85)]">
            <span>
              <strong className="text-white">WASD</strong> Move
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-[#F05A9D]">E</strong> Inspect Clue
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-[#39BDF7]">T</strong> Talk
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-[#39BDF7]">P</strong> Phone
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-pink-300">Q</strong> Case Clues
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-pink-300">H</strong> Hide Panel
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-[#38BDF8]">J</strong> Journal
            </span>
            <span className="text-slate-500">·</span>
            <span>
              <strong className="text-slate-300">ESC</strong> Settings
            </span>
          </div>
        </div>

        {/* Mobile Touch Controls */}
        <div className="flex md:hidden items-end justify-between w-full pointer-events-none pt-2">
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            onTouchCancel={handleJoystickEnd}
            className="pointer-events-auto w-20 h-20 rounded-full bg-[#060D20]/90 border-2 border-sky-400/35 relative flex items-center justify-center backdrop-blur-md touch-none shadow-lg"
          >
            <div
              className={`w-8 h-8 rounded-full transition-transform ${
                isJoystickActive ? 'bg-[#39BDF7] shadow-[0_0_15px_#39BDF7]' : 'bg-sky-200/45'
              }`}
              style={{
                transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              }}
            />
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {onOpenChapterQuestion && (
              <button
                type="button"
                onClick={onOpenChapterQuestion}
                className="px-3 py-2.5 rounded-xl bg-[#081426]/95 border border-[#F05A9D]/55 text-[#F05A9D] font-mono text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg"
              >
                <Search className="w-3.5 h-3.5 text-[#F05A9D]" />
                <span>Clues (Q)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleMobileJog}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
                isMobileJogging
                  ? 'bg-[#39BDF7] text-slate-950 border-sky-300'
                  : 'bg-[#081426]/95 text-slate-200 border-[#39BDF7]/30'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>{isMobileJogging ? 'Fast' : 'Walk'}</span>
            </button>

            <button
              type="button"
              onClick={onMobileInteract}
              className={`w-14 h-14 rounded-2xl font-heading font-black text-xs flex flex-col items-center justify-center border-2 transition-all shadow-xl backdrop-blur-md ${
                activeNearby
                  ? activeNearby.type === 'object'
                    ? 'bg-[#F05A9D] text-white border-pink-300 shadow-[0_0_20px_rgba(240,90,157,0.65)]'
                    : 'bg-[#39BDF7] text-slate-950 border-white shadow-[0_0_20px_rgba(57,189,247,0.6)]'
                  : 'bg-[#081426]/95 text-slate-400 border-[#39BDF7]/25'
              }`}
            >
              <Hand className="w-4 h-4 mb-0.5" />
              <span>{activeNearby?.type === 'npc' ? 'T' : 'E'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

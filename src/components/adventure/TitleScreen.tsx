import React, { useState } from 'react';
import {
  Play,
  Settings as SettingsIcon,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  ShieldCheck,
  ChevronRight,
  Award,
  BookOpen,
  Compass,
  FolderOpen,
  RotateCcw,
  FileText,
  UserCheck,
  Search,
} from 'lucide-react';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import { LevelId, AdventureLevel, InspectionData } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';
import { ChapterInvestigationModal } from './ChapterInvestigationModal';
import { CompleteCampaignScriptView } from './CompleteCampaignScriptView';
import detectivePortraitImg from '../../assets/images/detective_character_portrait_1794034150867.jpg';
import caseBoardBackdropImg from '../../assets/images/case_journal_board_backdrop_1794034150256.jpg';

interface TitleScreenProps {
  onStartInvestigation: () => void;
  onSelectLevel: (levelId: LevelId, initialChapter?: 1 | 2 | 3) => void;
  onOpenSettings: () => void;
  completedLevels: string[];
  earnedBadges?: string[];
  cluesByLevel?: Record<string, Record<string, InspectionData>>;
  currentLevelId?: LevelId;
  activeChapterNum?: 1 | 2 | 3;
  hasSpokenToNpc?: boolean;
  onOpenArtDossier?: () => void;
  onUnlockAllLevels?: () => void;
  onRestartFromLevel1?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onSelectLevel,
  onOpenSettings,
  completedLevels,
  earnedBadges = [],
  cluesByLevel = {},
  currentLevelId,
  activeChapterNum = 1,
  hasSpokenToNpc = false,
  onOpenArtDossier,
  onUnlockAllLevels,
  onRestartFromLevel1,
}) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'board' | 'script' | 'controls'>('journal');
  const [boardFilter, setBoardFilter] = useState<'all' | 'current' | 'completed' | 'locked'>('all');
  const [previewLevel, setPreviewLevel] = useState<AdventureLevel | null>(null);
  const [previewChapterNum, setPreviewChapterNum] = useState<1 | 2 | 3>(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [portraitLoaded, setPortraitLoaded] = useState<boolean>(true);

  const totalLevels = ADVENTURE_LEVELS.length; // 10 Levels
  const totalChapters = totalLevels * 3; // 30 Chapters
  const completedCount = completedLevels.length;

  // Unlock levels in campaign order: Level 1 is available at start, Level N unlocks when Level N-1 is completed
  const isLevelUnlocked = (idx: number): boolean => {
    if (idx === 0) return true;
    const prevLevel = ADVENTURE_LEVELS[idx - 1];
    return (
      completedLevels.includes(prevLevel.id) ||
      completedLevels.includes(ADVENTURE_LEVELS[idx].id)
    );
  };

  // Determine the current active campaign level
  const currentActiveIndex = (() => {
    if (currentLevelId) {
      const idx = ADVENTURE_LEVELS.findIndex((l) => l.id === currentLevelId);
      if (idx >= 0 && !completedLevels.includes(currentLevelId) && isLevelUnlocked(idx)) {
        return idx;
      }
    }
    for (let i = 0; i < ADVENTURE_LEVELS.length; i++) {
      if (!completedLevels.includes(ADVENTURE_LEVELS[i].id) && isLevelUnlocked(i)) {
        return i;
      }
    }
    return ADVENTURE_LEVELS.length - 1;
  })();

  const currentLevel = ADVENTURE_LEVELS[currentActiveIndex] || ADVENTURE_LEVELS[0];
  const currentLevelCluesMap = cluesByLevel[currentLevel.id] || {};
  const foundCluesCount = Object.keys(currentLevelCluesMap).length;
  const totalCluesInCurrent = currentLevel.objects.length;
  const remainingCluesCount = Math.max(0, totalCluesInCurrent - foundCluesCount);

  // Determine current chapter for display
  const resolvedChapterNum: 1 | 2 | 3 =
    currentLevel.id === currentLevelId
      ? activeChapterNum
      : foundCluesCount >= totalCluesInCurrent
      ? 3
      : foundCluesCount > 0 || hasSpokenToNpc
      ? 2
      : 1;

  const currentChapterDef =
    currentLevel.chapters.find((c) => c.number === resolvedChapterNum) || currentLevel.chapters[0];

  // Compute concise, actionable next step ("Inspect Alex's phone", etc.)
  const nextObjectiveAction = (() => {
    const npcName = currentLevel.npcs[0]?.name || 'the witness';
    const firstUnfoundObj = currentLevel.objects.find(
      (obj) => !currentLevelCluesMap[obj.inspection.clueId]
    );

    if (resolvedChapterNum === 1 && !hasSpokenToNpc && foundCluesCount === 0) {
      if (firstUnfoundObj) {
        return `Talk to ${npcName} or inspect ${firstUnfoundObj.name}`;
      }
      return `Talk to ${npcName} to hear what happened`;
    }
    if (firstUnfoundObj) {
      return `Inspect ${firstUnfoundObj.name}`;
    }
    return `Make the safe verification decision with ${npcName}`;
  })();

  // Clean exact level title without "Level X: " prefix
  const getCleanLevelTitle = (rawTitle: string): string => {
    return rawTitle.replace(/^Level\s+\d+\s*:\s*/i, '').trim();
  };

  // Investigator rank title based on solved cases
  const investigatorRank =
    completedCount >= 10
      ? 'Master Lead Investigator'
      : completedCount >= 6
      ? 'Senior Cyber Sleuth'
      : completedCount >= 3
      ? 'Field Investigator'
      : 'Junior Neighborhood Investigator';

  // Last completed case for the Recent Case Recap
  const lastCompletedLevel = (() => {
    if (completedLevels.length === 0) return null;
    for (let i = ADVENTURE_LEVELS.length - 1; i >= 0; i--) {
      if (completedLevels.includes(ADVENTURE_LEVELS[i].id)) {
        return ADVENTURE_LEVELS[i];
      }
    }
    return null;
  })();

  // Filtered levels for the Campaign Case Board
  const filteredLevels = ADVENTURE_LEVELS.map((lvl, idx) => ({ lvl, idx })).filter(({ lvl, idx }) => {
    const isCompleted = completedLevels.includes(lvl.id);
    const isCurrent = idx === currentActiveIndex && !isCompleted;
    const isLocked = !isLevelUnlocked(idx) && !isCompleted;
    if (boardFilter === 'completed') return isCompleted;
    if (boardFilter === 'current') return isCurrent;
    if (boardFilter === 'locked') return isLocked;
    return true;
  });

  return (
    <div className="relative w-full min-h-screen bg-[#0B101E] text-[#F1F5F9] flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Subtle Ambient Desk Backdrop */}
      <div className="fixed inset-0 pointer-events-none opacity-15">
        <img
          src={caseBoardBackdropImg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-[#0B101E]/90 via-[#0B101E]/95 to-[#080C17] pointer-events-none" />

      {/* =====================================================================
          TOP NAVIGATION BAR (Strict 3-Zone Contract)
      ===================================================================== */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 bg-[#0B101E]/95 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab('journal')}
          className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          Scam Sleuth
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('journal');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'journal'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Case Journal
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('board');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'board'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Case Board
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('script');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'script'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            30 Chapters
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('controls');
            }}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'controls'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Field Guide
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuSelect();
              onOpenSettings();
            }}
            className="py-1 border-b-2 border-transparent text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action CTA */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMissionStart();
              onSelectLevel(currentLevel.id, resolvedChapterNum);
            }}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Continue Investigation</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN DETECTIVE'S CASE JOURNAL WORKSPACE
      ===================================================================== */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 pb-20 space-y-10">
        {statusMessage && (
          <div className="text-xs font-mono text-amber-200 bg-amber-500/10 border border-amber-400/30 px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-white hover:underline ml-4 cursor-pointer whitespace-nowrap shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'journal' && (
          <>
            {/* ===============================================================
                PRIORITY 1 & 3 & 4: DETECTIVE PROFILE + CURRENT LEVEL & OBJECTIVE
                Balanced 12-Column Split with Character Artwork Anchor
            =============================================================== */}
            <section
              aria-label="Investigator Profile and Active Case Assignment"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left 5 Columns: Player Profile & Character Portrait Visual Anchor */}
              <div className="lg:col-span-5 rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="relative h-72 sm:h-80 w-full bg-[#0D1322] overflow-hidden">
                  {portraitLoaded ? (
                    <img
                      src={detectivePortraitImg}
                      alt="Detective Rowan Vance examining digital evidence at the desk"
                      referrerPolicy="no-referrer"
                      onError={() => setPortraitLoaded(false)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-center">
                      <UserCheck className="w-12 h-12 text-amber-400 mb-2" />
                      <span className="font-heading font-bold text-base text-white">
                        Detective Rowan Vance
                      </span>
                    </div>
                  )}
                  {/* Measured Contrast Scrim for Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/35 to-transparent" />

                  <div className="absolute bottom-4 left-5 right-5 space-y-1">
                    <div className="text-xs font-mono text-amber-300 tracking-wide">
                      <span>{investigatorRank}</span>
                      <span aria-hidden="true"> · </span>
                      <span>Sunset Heights Desk</span>
                    </div>
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                      Detective Rowan Vance
                    </h1>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Neighborhood cyber-safety investigator documenting the{' '}
                    <strong className="text-white font-semibold">Glasshouse</strong> campaign. You
                    verify suspicious delivery notices, urgent payment requests, and look-alike login
                    pages before residents lose their savings.
                  </p>

                  {/* Tabular Campaign Standing Summary */}
                  <div className="pt-4 border-t border-slate-800/90 grid grid-cols-3 gap-4 text-left font-mono tabular-nums">
                    <div>
                      <span className="text-xs text-slate-400 block">Cases Solved</span>
                      <span className="text-lg font-bold text-white">
                        {completedCount} / {totalLevels}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Badges Earned</span>
                      <span className="text-lg font-bold text-amber-400">
                        {earnedBadges.length} / {totalLevels}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Chapters</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {completedCount * 3} / {totalChapters}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 7 Columns: Active Case Dossier, Current Objective, Clues & Recap */}
              <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-amber-400/50 p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-lg">
                <div className="space-y-5">
                  {/* Top Kicker & Level Progress */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div className="text-xs font-mono text-amber-400">
                      <span>Active Case File 0{currentActiveIndex + 1}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{currentLevel.locationName}</span>
                      <span aria-hidden="true"> · </span>
                      <span>
                        Chapter {resolvedChapterNum} of 3 ({currentChapterDef.phase})
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      Case {currentActiveIndex + 1} of {totalLevels}
                    </span>
                  </div>

                  {/* Level Title & Chapter Subtitle */}
                  <div className="space-y-1.5">
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight text-balance">
                      {currentLevel.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-300">
                      {currentChapterDef.title} — {currentChapterDef.summary}
                    </p>
                  </div>

                  {/* Current Objective Callout + Case Progress (Clues Found & Remaining) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Current Objective */}
                    <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800/90 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                        <Compass className="w-4 h-4 shrink-0" />
                        <span>Current Objective</span>
                      </div>
                      <p className="font-heading font-bold text-base text-white leading-snug">
                        {nextObjectiveAction}
                      </p>
                      <p className="text-xs text-slate-400">
                        Witness on scene: {currentLevel.npcs[0]?.name} ({currentLevel.npcs[0]?.role})
                      </p>
                    </div>

                    {/* Case Progress: Clues Found & Remaining */}
                    <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800/90 space-y-2 font-mono tabular-nums">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Case Clues</span>
                        </span>
                        <span className="text-white font-bold">
                          {foundCluesCount} Found · {remainingCluesCount} Remaining
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-300"
                          style={{
                            width: `${Math.max(
                              12,
                              Math.round((foundCluesCount / Math.max(1, totalCluesInCurrent)) * 100)
                            )}%`,
                          }}
                        />
                      </div>

                      {/* Individual Clue Status List */}
                      <div className="space-y-1 pt-1 text-[11px]">
                        {currentLevel.objects.map((obj) => {
                          const isFound = Boolean(currentLevelCluesMap[obj.inspection.clueId]);
                          return (
                            <div
                              key={obj.id}
                              className="flex items-center justify-between gap-2 text-slate-300"
                            >
                              <span className="truncate">{obj.name}</span>
                              <span
                                className={
                                  isFound
                                    ? 'text-emerald-400 font-semibold shrink-0'
                                    : 'text-slate-500 shrink-0'
                                }
                              >
                                {isFound ? 'Logged ✓' : 'Uninspected'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recent Case Recap (Compact Summary of Last Completed Case or Field Note) */}
                  <div className="p-4 rounded-xl bg-[#0B101E]/75 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {lastCompletedLevel
                            ? `Recent Case Recap · ${lastCompletedLevel.title}`
                            : 'Recent Case Recap · Investigator Field Note'}
                        </span>
                      </span>
                      {lastCompletedLevel && (
                        <span className="text-slate-400">
                          Badge: {lastCompletedLevel.debrief.badgeName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lastCompletedLevel
                        ? `${lastCompletedLevel.debrief.summary} Habit: ${lastCompletedLevel.debrief.realWorldHabit}`
                        : 'No cases closed yet. Begin with Case 01 in Sunset Heights Apartment 4B: inspect Alex’s smartphone delivery text and compare it with the building’s official courier policy card.'}
                    </p>
                  </div>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playGtaMissionStart();
                      onSelectLevel(currentLevel.id, resolvedChapterNum);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2.5 cursor-pointer transition-colors shadow-md whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span>
                      Continue Investigation · {getCleanLevelTitle(currentLevel.title)}
                    </span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5] shrink-0" />
                  </button>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playGtaMenuHover();
                        setPreviewChapterNum(resolvedChapterNum);
                        setPreviewLevel(currentLevel);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Case Notes & Clues</span>
                    </button>

                    {onOpenArtDossier && (
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playGtaMenuSelect();
                          onOpenArtDossier();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span>Character Dossier</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ===============================================================
                PRIORITY 2: ACHIEVEMENTS & EARNED INVESTIGATOR BADGES
                Earned badges prominent; upcoming achievements as locked previews
            =============================================================== */}
            <section aria-label="Investigator Achievements and Badges" className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="font-heading font-bold text-xl text-white tracking-tight">
                    Investigator Achievements & Safety Badges
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Earned by making verified safe decisions in Chapter 3 of each case.
                  </p>
                </div>
                <span className="font-mono text-xs text-amber-400 tabular-nums">
                  {earnedBadges.length} of {totalLevels} Badges Earned
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {ADVENTURE_LEVELS.map((lvl, idx) => {
                  const badgeTitle = lvl.debrief.badgeName;
                  const isEarned =
                    earnedBadges.includes(badgeTitle) || completedLevels.includes(lvl.id);
                  const isNextTarget = idx === currentActiveIndex && !isEarned;

                  return (
                    <div
                      key={lvl.id}
                      onClick={() => {
                        soundEngine.playGtaMenuHover();
                        setPreviewChapterNum(3);
                        setPreviewLevel(lvl);
                      }}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                        isEarned
                          ? 'bg-[#111D2B] border-emerald-500/50 hover:border-emerald-400'
                          : isNextTarget
                          ? 'bg-[#131B2E] border-amber-400/50 hover:border-amber-400'
                          : 'bg-[#0E1424]/70 border-slate-800/80 opacity-65 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isEarned
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isNextTarget
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isEarned ? (
                            <Award className="w-5 h-5" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                          Case 0{idx + 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3
                          className={`font-heading font-bold text-sm leading-snug ${
                            isEarned ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {badgeTitle}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {isEarned
                            ? lvl.debrief.realWorldHabit
                            : `Complete ${getCleanLevelTitle(lvl.title)} to unlock this habit badge.`}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        {isEarned ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Earned</span>
                          </span>
                        ) : isNextTarget ? (
                          <span className="text-amber-300 font-semibold">Active Target</span>
                        ) : (
                          <span className="text-slate-500">Locked Preview</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ===============================================================
            CAMPAIGN INVESTIGATION CASE BOARD (Shown on 'journal' and 'board')
            All 10 levels arranged as connected case files with Completed,
            Current, and Locked states.
        =============================================================== */}
        {(activeTab === 'journal' || activeTab === 'board') && (
          <section aria-label="Campaign Investigation Case Board" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs font-mono text-amber-400">
                  <span>The Glasshouse Files</span>
                  <span aria-hidden="true"> · </span>
                  <span>10 Connected Case Files</span>
                  <span aria-hidden="true"> · </span>
                  <span>30 Chapters</span>
                </div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
                  Investigation Case Board
                </h2>
              </div>

              {/* Interactive Filter Controls + Secondary Campaign Tools */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-[#111827] border border-slate-800 rounded-lg">
                  {(
                    [
                      { id: 'all', label: 'All Cases (10)' },
                      { id: 'current', label: 'Current' },
                      { id: 'completed', label: `Solved (${completedCount})` },
                      { id: 'locked', label: 'Locked' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playGtaMenuHover();
                        setBoardFilter(tab.id);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        boardFilter === tab.id
                          ? 'bg-amber-400 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {onUnlockAllLevels && completedCount < totalLevels && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playGtaMenuSelect();
                      onUnlockAllLevels();
                      setStatusMessage('All 10 Case Files unlocked for inspection.');
                    }}
                    className="px-3 py-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  >
                    <Unlock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Unlock All Cases</span>
                  </button>
                )}

                {onRestartFromLevel1 && completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playGtaMenuSelect();
                      onRestartFromLevel1();
                      setStatusMessage('Case Journal reset to Case 01: The Parcel That Never Came.');
                    }}
                    className="px-3 py-2 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Reset Journal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Connected Case Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredLevels.map(({ lvl, idx }) => {
                const levelNum = idx + 1;
                const cleanTitle = getCleanLevelTitle(lvl.title);
                const isCompleted = completedLevels.includes(lvl.id);
                const isAvailable = isLevelUnlocked(idx);
                const isCurrent = idx === currentActiveIndex && !isCompleted;
                const lvlCluesFound = Object.keys(cluesByLevel[lvl.id] || {}).length;
                const lvlCluesTotal = lvl.objects.length;

                return (
                  <article
                    key={lvl.id}
                    className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all ${
                      isCurrent
                        ? 'bg-[#131C31] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
                        : isCompleted
                        ? 'bg-[#0F1928] border-emerald-500/45'
                        : 'bg-[#0E1422]/75 border-slate-800/80 opacity-75 hover:opacity-95'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Case File Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-xs font-mono text-slate-400 tabular-nums">
                            <span>Case File 0{levelNum}</span>
                            <span aria-hidden="true"> · </span>
                            <span>{lvl.locationName}</span>
                            <span aria-hidden="true"> · </span>
                            <span>{lvl.npcs[0]?.name}</span>
                          </div>
                          <h3 className="font-heading font-bold text-lg sm:text-xl text-white leading-snug">
                            {levelNum}. {cleanTitle}
                          </h3>
                        </div>

                        {/* Clear Semantic State Label with Icon */}
                        <div className="shrink-0 font-mono text-xs font-semibold flex items-center gap-1.5">
                          {isCompleted ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>Solved</span>
                            </span>
                          ) : isCurrent ? (
                            <span className="text-amber-300 flex items-center gap-1">
                              <FolderOpen className="w-4 h-4 shrink-0" />
                              <span>Active Case</span>
                            </span>
                          ) : isAvailable ? (
                            <span className="text-slate-200">Available</span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5 shrink-0" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Objective & Clue Tally Summary */}
                      <p className="text-xs text-slate-300 leading-relaxed">{lvl.objective}</p>

                      {/* 3 Connected Chapter Step Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                          <span>3 Investigation Chapters</span>
                          <span>
                            {isCompleted
                              ? `${lvlCluesTotal}/${lvlCluesTotal} Clues Verified`
                              : `${lvlCluesFound}/${lvlCluesTotal} Clues Logged`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {lvl.chapters.map((ch) => (
                            <button
                              key={ch.number}
                              type="button"
                              onClick={() => {
                                soundEngine.playGtaMenuSelect();
                                if (isAvailable) {
                                  onSelectLevel(lvl.id, ch.number);
                                } else {
                                  setPreviewChapterNum(ch.number);
                                  setPreviewLevel(lvl);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1 ${
                                isCompleted
                                  ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                                  : isCurrent && ch.number === resolvedChapterNum
                                  ? 'bg-amber-400/15 border-amber-400 text-white'
                                  : isAvailable
                                  ? 'bg-[#0B101E] border-slate-800 hover:border-slate-600'
                                  : 'bg-[#0B101E]/50 border-slate-800/60 hover:border-slate-700'
                              }`}
                            >
                              <span className="font-mono text-[10px] text-amber-300 font-semibold">
                                Ch {ch.number} · {ch.phase.replace('The ', '')}
                              </span>
                              <span className="font-heading font-semibold text-xs text-white line-clamp-1">
                                {ch.title.replace(/^Chapter\s+\d+\s*:\s*/i, '')}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Case File Footer Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playGtaMenuHover();
                          setPreviewChapterNum(1);
                          setPreviewLevel(lvl);
                        }}
                        className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Read Case File</span>
                      </button>

                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playGtaMissionStart();
                            onSelectLevel(lvl.id, isCurrent ? resolvedChapterNum : 1);
                          }}
                          className={`px-4 py-2 rounded-lg font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                            isCurrent
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>
                            {isCurrent
                              ? `Continue Case 0${levelNum}`
                              : isCompleted
                              ? `Replay Case 0${levelNum}`
                              : `Start Case 0${levelNum}`}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playGtaMenuSelect();
                            setPreviewChapterNum(1);
                            setPreviewLevel(lvl);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span>Preview Dossier</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================================================================
            COMPLETE 30-CHAPTER STORY, QUESTIONS & GRAPHICS TAB
        =================================================================== */}
        {activeTab === 'script' && (
          <CompleteCampaignScriptView
            onPlayChapter={(lvlId, chNum) => onSelectLevel(lvlId, chNum)}
            isLevelUnlocked={isLevelUnlocked}
            onUnlockAllLevels={onUnlockAllLevels}
          />
        )}

        {/* ===================================================================
            FIELD GUIDE & CONTROLS TAB (Secondary Panel)
        =================================================================== */}
        {activeTab === 'controls' && (
          <section className="max-w-3xl mx-auto w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs text-amber-400 block">
                  Investigator Field Manual
                </span>
                <h2 className="font-heading font-bold text-xl text-white">
                  How to Investigate Each 3-Chapter Case
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('journal')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
              >
                Back to Case Journal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800 space-y-1.5">
                <span className="font-mono text-amber-400 font-semibold block">
                  Chapter 1 · The Setup
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Enter the 3D scene and press <strong className="text-white">T</strong> (or click
                  Talk) to speak with the resident and hear what happened.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800 space-y-1.5">
                <span className="font-mono text-amber-400 font-semibold block">
                  Chapter 2 · The Investigation
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Walk up to phones, laptops, and notices and press{' '}
                  <strong className="text-white">E</strong> to inspect digital evidence and log clues.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800 space-y-1.5">
                <span className="font-mono text-emerald-400 font-semibold block">
                  Chapter 3 · The Decision
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Choose the safest verification route from 4 options. Unsafe choices let you retry
                  immediately with all clues kept.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3.5 rounded-xl bg-[#0B101E] border border-slate-800">
                <span className="text-base font-bold text-amber-400 block">W / A / S / D</span>
                <span className="text-xs text-slate-400">Move Investigator</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B101E] border border-slate-800">
                <span className="text-base font-bold text-white block">E / T Keys</span>
                <span className="text-xs text-slate-400">Inspect / Talk</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B101E] border border-slate-800">
                <span className="text-base font-bold text-emerald-400 block">J Key</span>
                <span className="text-xs text-slate-400">Case Journal</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B101E] border border-slate-800">
                <span className="text-base font-bold text-slate-200 block">V Key</span>
                <span className="text-xs text-slate-400">1st / 3rd Person</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Need audio, subtitle, or camera sensitivity adjustments?
              </span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Open Settings</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================================
          INTERACTIVE CHAPTER STORY, GRAPHICS, CLUES & QUESTION MODAL
      ===================================================================== */}
      {previewLevel && (
        <ChapterInvestigationModal
          level={previewLevel}
          activeChapterNum={previewChapterNum}
          onSelectChapter={(ch) => setPreviewChapterNum(ch)}
          onClose={() => setPreviewLevel(null)}
          onTriggerFinalDecision={() => {
            const target = previewLevel;
            setPreviewLevel(null);
            onSelectLevel(target.id, 3);
          }}
          isGameplayMode={false}
        />
      )}

      {/* =====================================================================
          QUIET FOOTER
      ===================================================================== */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-4 bg-[#080C17] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Scam Sleuth: The Glasshouse Files · Educational Cyber-Safety Case Journal</span>
        </div>

        <div className="font-mono text-xs text-slate-400 tabular-nums">
          {completedCount} of {totalLevels} Cases Solved · {earnedBadges.length} of {totalLevels} Badges
        </div>
      </footer>
    </div>
  );
};

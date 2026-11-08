import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  FolderOpen,
  Award,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import {
  LevelId,
  AdventureLevel,
  InspectionData,
  GameSettings,
} from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';
import { ChapterInvestigationModal } from './ChapterInvestigationModal';
import { CompleteCampaignScriptView } from './CompleteCampaignScriptView';
import { ScamSleuthLogo } from './ScamSleuthLogo';
import rainyDeskBgImg from '../../assets/images/scam_sleuth_rainy_desk_bg_1794040522608.jpg';
import detectivePortraitImg from '../../assets/images/detective_character_portrait_1794034150867.jpg';

interface TitleScreenProps {
  onStartInvestigation: () => void;
  onNewInvestigation?: () => void;
  onSelectLevel: (levelId: LevelId, initialChapter?: 1 | 2 | 3) => void;
  onOpenSettings: () => void;
  completedLevels: string[];
  earnedBadges?: string[];
  cluesByLevel?: Record<string, Record<string, InspectionData>>;
  currentLevelId?: LevelId;
  activeChapterNum?: 1 | 2 | 3;
  hasSpokenToNpc?: boolean;
  settings?: GameSettings;
  onUpdateSettings?: (partial: Partial<GameSettings>) => void;
  onOpenArtDossier?: () => void;
  onUnlockAllLevels?: () => void;
  onRestartFromLevel1?: () => void;
}

type ActiveSubModal = 'none' | 'case-files' | 'achievements' | 'new-confirm' | 'quit';

const RAIN_STREAKS = [
  { left: '8%', delay: '0s', duration: '2.4s', height: '68px' },
  { left: '16%', delay: '0.6s', duration: '2.1s', height: '54px' },
  { left: '24%', delay: '1.3s', duration: '2.6s', height: '72px' },
  { left: '33%', delay: '0.3s', duration: '2.2s', height: '60px' },
  { left: '42%', delay: '1.7s', duration: '2.5s', height: '64px' },
  { left: '51%', delay: '0.9s', duration: '2.0s', height: '58px' },
  { left: '60%', delay: '1.4s', duration: '2.3s', height: '70px' },
  { left: '68%', delay: '0.2s', duration: '2.4s', height: '62px' },
  { left: '76%', delay: '1.1s', duration: '2.2s', height: '56px' },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onNewInvestigation,
  onSelectLevel,
  onOpenSettings,
  completedLevels,
  earnedBadges = [],
  cluesByLevel = {},
  currentLevelId,
  activeChapterNum = 1,
  hasSpokenToNpc = false,
  settings,
  onUpdateSettings,
  onOpenArtDossier,
  onUnlockAllLevels,
  onRestartFromLevel1,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeSubModal, setActiveSubModal] = useState<ActiveSubModal>('none');
  const [caseFilesTab, setCaseFilesTab] = useState<'board' | 'script'>('board');
  const [boardFilter, setBoardFilter] = useState<'all' | 'current' | 'completed' | 'locked'>('all');
  const [previewLevel, setPreviewLevel] = useState<AdventureLevel | null>(null);
  const [previewChapterNum, setPreviewChapterNum] = useState<1 | 2 | 3>(1);
  const [bgLoaded, setBgLoaded] = useState<boolean>(true);
  const [portraitLoaded, setPortraitLoaded] = useState<boolean>(true);
  const [entered, setEntered] = useState<boolean>(false);

  const reducedMotion = Boolean(settings?.reducedMotion);
  const totalLevels = ADVENTURE_LEVELS.length; // 10 Levels
  const completedCount = completedLevels.length;

  // Cinematic fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 40);
    return () => clearTimeout(t);
  }, []);

  // Unlock levels in campaign order
  const isLevelUnlocked = useCallback(
    (idx: number): boolean => {
      if (idx === 0) return true;
      const prevLevel = ADVENTURE_LEVELS[idx - 1];
      return (
        completedLevels.includes(prevLevel.id) ||
        completedLevels.includes(ADVENTURE_LEVELS[idx].id)
      );
    },
    [completedLevels]
  );

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

  const resolvedChapterNum: 1 | 2 | 3 =
    currentLevel.id === currentLevelId
      ? activeChapterNum
      : foundCluesCount >= totalCluesInCurrent
      ? 3
      : foundCluesCount > 0 || hasSpokenToNpc
      ? 2
      : 1;

  const getCleanLevelTitle = (rawTitle: string): string =>
    rawTitle.replace(/^Level\s+\d+\s*:\s*/i, '').trim();

  const totalCluesLoggedAcrossCampaign = Object.values(cluesByLevel).reduce(
    (acc, map) => acc + Object.keys(map || {}).length,
    0
  );

  const hasSavedProgress =
    completedCount > 0 ||
    totalCluesLoggedAcrossCampaign > 0 ||
    hasSpokenToNpc ||
    activeChapterNum > 1;

  // Investigator rank title
  const investigatorRank =
    completedCount >= 10
      ? 'Master Lead Investigator'
      : completedCount >= 6
      ? 'Senior Cyber Sleuth'
      : completedCount >= 3
      ? 'Field Investigator'
      : 'Neighborhood Investigator';

  // Latest earned achievement (or next target preview)
  const latestAchievement = (() => {
    for (let i = ADVENTURE_LEVELS.length - 1; i >= 0; i--) {
      const lvl = ADVENTURE_LEVELS[i];
      if (
        earnedBadges.includes(lvl.debrief.badgeName) ||
        completedLevels.includes(lvl.id)
      ) {
        return {
          earned: true,
          badgeName: lvl.debrief.badgeName,
          caseLabel: `Case 0${i + 1}`,
          habit: lvl.debrief.realWorldHabit,
        };
      }
    }
    return {
      earned: false,
      badgeName: currentLevel.debrief.badgeName,
      caseLabel: `Case 0${currentActiveIndex + 1} Target`,
      habit: currentLevel.debrief.realWorldHabit,
    };
  })();

  const handleActivateMenuOption = useCallback(
    (index: number) => {
      soundEngine.playGtaMenuSelect();
      switch (index) {
        case 0: // Continue Investigation
          soundEngine.playGtaMissionStart();
          onSelectLevel(currentLevel.id, resolvedChapterNum);
          break;
        case 1: // New Investigation
          if (hasSavedProgress) {
            setActiveSubModal('new-confirm');
          } else if (onNewInvestigation) {
            onNewInvestigation();
          } else {
            onSelectLevel('tutorial-delivery', 1);
          }
          break;
        case 2: // Case Files
          setCaseFilesTab('board');
          setActiveSubModal('case-files');
          break;
        case 3: // Achievements
          setActiveSubModal('achievements');
          break;
        case 4: // Settings
          onOpenSettings();
          break;
        case 5: // Quit
          setActiveSubModal('quit');
          break;
        default:
          break;
      }
    },
    [
      currentLevel.id,
      resolvedChapterNum,
      hasSavedProgress,
      onNewInvestigation,
      onSelectLevel,
      onOpenSettings,
    ]
  );

  // Keyboard / Controller navigation for the vertical menu
  useEffect(() => {
    if (activeSubModal !== 'none' || previewLevel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        soundEngine.playGtaMenuHover();
        setSelectedIndex((prev) => (prev + 1) % 6);
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        soundEngine.playGtaMenuHover();
        setSelectedIndex((prev) => (prev - 1 + 6) % 6);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleActivateMenuOption(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubModal, previewLevel, selectedIndex, handleActivateMenuOption]);

  // Close sub-modals on Escape
  useEffect(() => {
    if (activeSubModal === 'none') return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        setActiveSubModal('none');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeSubModal]);

  const filteredLevels = ADVENTURE_LEVELS.map((lvl, idx) => ({ lvl, idx })).filter(
    ({ lvl, idx }) => {
      const isCompleted = completedLevels.includes(lvl.id);
      const isCurrent = idx === currentActiveIndex && !isCompleted;
      const isLocked = !isLevelUnlocked(idx) && !isCompleted;
      if (boardFilter === 'completed') return isCompleted;
      if (boardFilter === 'current') return isCurrent;
      if (boardFilter === 'locked') return isLocked;
      return true;
    }
  );

  const menuOptions = [
    {
      id: 'continue',
      label: 'Start Investigation',
      meta: `Case 0${currentActiveIndex + 1}: ${getCleanLevelTitle(
        currentLevel.title
      )} · Ch. ${resolvedChapterNum}/3 · ${completedCount}/${totalLevels} Solved`,
      disabled: false,
    },
    {
      id: 'new',
      label: 'New Investigation',
      meta: hasSavedProgress
        ? 'Start fresh from Case 01: The Parcel That Never Came'
        : 'Begin Case 01 in Sunset Heights Apt 4B',
      disabled: false,
    },
    {
      id: 'case-files',
      label: 'Case Files',
      meta: `${completedCount} of ${totalLevels} Cases Solved · 30 Investigation Chapters`,
      disabled: false,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      meta: `${earnedBadges.length} of ${totalLevels} Investigator Safety Badges Earned`,
      disabled: false,
    },
    {
      id: 'settings',
      label: 'Settings',
      meta: 'Audio, Subtitles, Camera Sensitivity & Accessibility',
      disabled: false,
    },
    {
      id: 'quit',
      label: 'Quit',
      meta: 'Stand down from the investigation desk',
      disabled: false,
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060A14] text-slate-100 select-none font-sans flex flex-col justify-between">
      {/* =====================================================================
          1. FULL-SCREEN CINEMATIC RAINY APARTMENT & DETECTIVE DESK ARTWORK
      ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bgLoaded ? (
          <img
            src={rainyDeskBgImg}
            alt="Late-night detective desk facing a rain-streaked apartment window with case notes and a glowing smartphone"
            referrerPolicy="no-referrer"
            onError={() => setBgLoaded(false)}
            className={`w-full h-full object-cover object-center ${
              reducedMotion
                ? ''
                : 'transition-transform duration-[18000ms] ease-out scale-[1.03]'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#070D1B] via-[#0F1B33] to-[#1A1423]" />
        )}

        {/* Measured Contrast Scrim: keeps left/center menu high-contrast while revealing the rainy window, lamp, and glowing phone */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#040711]/80 via-[#050A17]/60 to-[#040711]/92"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(6,11,24,0.45)_0%,rgba(4,7,17,0.88)_100%)]"
          aria-hidden="true"
        />

        {/* Subtle Rain Streaks Over Window Glass (Disabled when Reduced Motion is On) */}
        {!reducedMotion && (
          <div className="absolute inset-0 overflow-hidden opacity-30" aria-hidden="true">
            <style>{`
              @keyframes sleuthRainFall {
                0% { transform: translate3d(0, -120px, 0) rotate(8deg); opacity: 0; }
                20% { opacity: 0.55; }
                80% { opacity: 0.45; }
                100% { transform: translate3d(-45px, 105vh, 0) rotate(8deg); opacity: 0; }
              }
            `}</style>
            {RAIN_STREAKS.map((drop, i) => (
              <div
                key={i}
                style={{
                  left: drop.left,
                  height: drop.height,
                  animation: `sleuthRainFall ${drop.duration} linear ${drop.delay} infinite`,
                }}
                className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-sky-200/50 to-transparent"
              />
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
          2. TOP SUBTLE AMBIENT HEADER (Quiet Case File Kicker & Reduced Motion Toggle)
      ===================================================================== */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-6 flex items-center justify-between text-xs font-mono text-slate-300/80">
        <div className="flex items-center gap-2">
          <span className="text-amber-300/90 font-semibold">THE GLASSHOUSE FILES</span>
          <span aria-hidden="true">·</span>
          <span>10 CASES · 30 CHAPTERS</span>
        </div>

        <div className="flex items-center gap-4">
          {onUpdateSettings && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playGtaMenuHover();
                onUpdateSettings({ reducedMotion: !reducedMotion });
              }}
              className="text-slate-300/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1.5 py-0.5"
              title="Toggle Reduced Background Motion"
            >
              Motion: {reducedMotion ? 'Reduced' : 'Subtle'}
            </button>
          )}
          {onOpenArtDossier && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playGtaMenuSelect();
                onOpenArtDossier();
              }}
              className="text-slate-300/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1.5 py-0.5"
            >
              Character Dossier
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          3. CENTER / UPPER-CENTER TITLE & SIMPLE VERTICAL MENU OVER THE SCENE
      ===================================================================== */}
      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 transition-opacity duration-700 ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Clean, Confident SCAM SLEUTH Title & Subtitle */}
        <div className="mb-8 sm:mb-12">
          <ScamSleuthLogo reducedMotion={reducedMotion} />
        </div>

        {/* Simple Vertical Menu Over the Scene */}
        <nav
          aria-label="Main Menu"
          className="w-full max-w-md flex flex-col items-center space-y-1.5 sm:space-y-2"
        >
          {menuOptions.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const isContinue = item.id === 'continue';

            return (
              <div key={item.id} className="w-full flex flex-col items-center">
                <button
                  type="button"
                  disabled={item.disabled}
                  onMouseEnter={() => {
                    if (selectedIndex !== idx) {
                      soundEngine.playGtaMenuHover();
                      setSelectedIndex(idx);
                    }
                  }}
                  onFocus={() => setSelectedIndex(idx)}
                  onClick={() => handleActivateMenuOption(idx)}
                  className={`group relative w-full py-2 sm:py-2.5 px-6 flex flex-col items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg ${
                    item.disabled ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {/* Subtle Left Selection Marker */}
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'bg-amber-400 shadow-[0_0_10px_#F59E0B] scale-125'
                          : 'bg-transparent'
                      }`}
                    />

                    <span
                      className={`font-heading tracking-wider transition-all duration-150 [text-shadow:0_2px_12px_rgba(0,0,0,0.98),0_1px_3px_rgba(0,0,0,0.95)] ${
                        isSelected
                          ? 'text-xl sm:text-2xl font-bold text-white'
                          : 'text-lg sm:text-xl font-medium text-slate-300/85 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'bg-amber-400 shadow-[0_0_10px_#F59E0B] scale-125'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>

                  {/* Subtle Underline / Soft Glow on Active Selection */}
                  <div
                    aria-hidden="true"
                    className={`mt-1 h-[2px] rounded-full transition-all duration-200 ${
                      isSelected
                        ? 'w-44 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_14px_rgba(245,158,11,0.8)]'
                        : 'w-0 bg-transparent'
                    }`}
                  />

                  {/* Campaign Progress & Current Level beneath Continue Investigation (and subtle context on active selection) */}
                  {(isContinue || isSelected) && (
                    <span
                      className={`mt-1 font-mono text-[11px] sm:text-xs tracking-wide [text-shadow:0_1px_4px_rgba(0,0,0,0.98)] transition-opacity duration-200 ${
                        isContinue
                          ? 'text-amber-300/95 font-medium'
                          : 'text-slate-300/85'
                      }`}
                    >
                      {item.meta}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </main>

      {/* =====================================================================
          4. BOTTOM BAR: COMPACT PLAYER PORTRAIT & LATEST ACHIEVEMENT
      ===================================================================== */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Compact Player-Character Portrait & Investigator Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-400/60 bg-[#0D1527] shrink-0 shadow-[0_0_16px_rgba(0,0,0,0.85)]">
            {portraitLoaded ? (
              <img
                src={detectivePortraitImg}
                alt="Detective Rowan Vance"
                referrerPolicy="no-referrer"
                onError={() => setPortraitLoaded(false)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-heading font-bold text-xs text-amber-300">
                RV
              </div>
            )}
          </div>
          <div className="[text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-white">
              <span>Detective Rowan Vance</span>
              <span className="text-slate-400 font-normal">·</span>
              <span className="text-amber-300/90 text-xs font-mono font-normal">
                {investigatorRank}
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-300/85 tabular-nums">
              {completedCount}/{totalLevels} Cases Solved · {totalCluesLoggedAcrossCampaign} Clues Logged
            </div>
          </div>
        </div>

        {/* Right: Latest Achievement / Next Badge Preview */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playGtaMenuSelect();
            setActiveSubModal('achievements');
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg px-2 py-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]"
          title="View All Investigator Achievements"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              latestAchievement.earned
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                : 'bg-amber-400/15 border-amber-400/40 text-amber-300'
            }`}
          >
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-300/80">
              {latestAchievement.earned ? 'Latest Achievement' : 'Next Achievement Target'} ·{' '}
              {latestAchievement.caseLabel}
            </div>
            <div className="font-heading font-semibold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
              {latestAchievement.badgeName}
            </div>
          </div>
        </button>
      </footer>

      {/* =====================================================================
          5. CASE FILES OVERLAY MODAL (Opened when selecting "Case Files")
      ===================================================================== */}
      {activeSubModal === 'case-files' && (
        <div
          className="fixed inset-0 z-40 bg-[#050914]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Case Files"
        >
          <div className="w-full max-w-5xl max-h-[90vh] bg-[#0B1222] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-amber-400 block">
                  THE GLASSHOUSE FILES · 10 CONNECTED CASES
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  Investigation Case Files
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-[#111827] border border-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCaseFilesTab('board')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      caseFilesTab === 'board'
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Case Board (10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseFilesTab('script')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      caseFilesTab === 'script'
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    All 30 Chapters
                  </button>
                </div>

                {onUnlockAllLevels && completedCount < totalLevels && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playGtaMenuSelect();
                      onUnlockAllLevels();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unlock All</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveSubModal('none')}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  title="Close Case Files (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {caseFilesTab === 'board' ? (
                <>
                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
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
                          onClick={() => setBoardFilter(tab.id)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            boardFilter === tab.id
                              ? 'bg-slate-700 text-white font-semibold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Case Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all ${
                            isCurrent
                              ? 'bg-[#131C31] border-amber-400'
                              : isCompleted
                              ? 'bg-[#0F1928] border-emerald-500/45'
                              : 'bg-[#0E1422]/80 border-slate-800 opacity-75 hover:opacity-95'
                          }`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-mono text-slate-400">
                                  Case 0{levelNum} · {lvl.locationName} · {lvl.npcs[0]?.name}
                                </div>
                                <h3 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
                                  {levelNum}. {cleanTitle}
                                </h3>
                              </div>

                              <span className="font-mono text-xs font-semibold shrink-0">
                                {isCompleted ? (
                                  <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Solved
                                  </span>
                                ) : isCurrent ? (
                                  <span className="text-amber-300 flex items-center gap-1">
                                    <FolderOpen className="w-3.5 h-3.5" />
                                    Active
                                  </span>
                                ) : isAvailable ? (
                                  <span className="text-slate-300">Available</span>
                                ) : (
                                  <span className="text-slate-500 flex items-center gap-1">
                                    <Lock className="w-3.5 h-3.5" />
                                    Locked
                                  </span>
                                )}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {lvl.objective}
                            </p>

                            {/* 3 Chapter Launch Buttons */}
                            <div className="grid grid-cols-3 gap-1.5 pt-2">
                              {lvl.chapters.map((ch) => (
                                <button
                                  key={ch.number}
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playGtaMenuSelect();
                                    if (isAvailable) {
                                      setActiveSubModal('none');
                                      onSelectLevel(lvl.id, ch.number);
                                    } else {
                                      setPreviewChapterNum(ch.number);
                                      setPreviewLevel(lvl);
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-[#090E1A] hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                                >
                                  <span className="block font-mono text-[10px] text-amber-300">
                                    Ch {ch.number} · {ch.phase.replace('The ', '')}
                                  </span>
                                  <span className="block font-heading text-xs text-white truncate">
                                    {ch.title.replace(/^Chapter\s+\d+\s*:\s*/i, '')}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                              {isCompleted
                                ? `${lvlCluesTotal}/${lvlCluesTotal} Clues Verified`
                                : `${lvlCluesFound}/${lvlCluesTotal} Clues Logged`}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewChapterNum(1);
                                  setPreviewLevel(lvl);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-400" />
                                <span>Notes</span>
                              </button>

                              {isAvailable && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playGtaMissionStart();
                                    setActiveSubModal('none');
                                    onSelectLevel(lvl.id, isCurrent ? resolvedChapterNum : 1);
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>
                                    {isCurrent
                                      ? 'Continue'
                                      : isCompleted
                                      ? 'Replay'
                                      : 'Investigate'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : (
                <CompleteCampaignScriptView
                  onPlayChapter={(lvlId, chNum) => {
                    setActiveSubModal('none');
                    onSelectLevel(lvlId, chNum);
                  }}
                  isLevelUnlocked={isLevelUnlocked}
                  onUnlockAllLevels={onUnlockAllLevels}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. ACHIEVEMENTS OVERLAY MODAL (Opened when selecting "Achievements")
      ===================================================================== */}
      {activeSubModal === 'achievements' && (
        <div
          className="fixed inset-0 z-40 bg-[#050914]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Investigator Achievements"
        >
          <div className="w-full max-w-4xl max-h-[88vh] bg-[#0B1222] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-amber-400 block">
                  INVESTIGATOR RECORD · {earnedBadges.length} OF {totalLevels} EARNED
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  Achievements & Cyber-Safety Badges
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubModal('none')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Close Achievements (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ADVENTURE_LEVELS.map((lvl, idx) => {
                const badgeTitle = lvl.debrief.badgeName;
                const isEarned =
                  earnedBadges.includes(badgeTitle) || completedLevels.includes(lvl.id);
                const isNextTarget = idx === currentActiveIndex && !isEarned;

                return (
                  <div
                    key={lvl.id}
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                      isEarned
                        ? 'bg-[#101D2E] border-emerald-500/50'
                        : isNextTarget
                        ? 'bg-[#131C31] border-amber-400/50'
                        : 'bg-[#0D1322]/75 border-slate-800 opacity-65'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isEarned
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isNextTarget
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isEarned ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-slate-400">Case 0{idx + 1}</span>
                        <span>·</span>
                        {isEarned ? (
                          <span className="text-emerald-400 font-semibold">Earned</span>
                        ) : isNextTarget ? (
                          <span className="text-amber-300 font-semibold">Current Target</span>
                        ) : (
                          <span className="text-slate-500">Locked Preview</span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                        {badgeTitle}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEarned
                          ? lvl.debrief.realWorldHabit
                          : `Solve Case 0${idx + 1} (${getCleanLevelTitle(
                              lvl.title
                            )}) to unlock this verification habit badge.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          7. NEW INVESTIGATION CONFIRMATION MODAL
      ===================================================================== */}
      {activeSubModal === 'new-confirm' && (
        <div
          className="fixed inset-0 z-40 bg-[#050914]/88 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Start New Investigation"
        >
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-300 font-heading font-bold text-lg">
              <RotateCcw className="w-5 h-5" />
              <span>Start a New Investigation?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This will reset your current campaign journal ({completedCount}/{totalLevels} cases
              solved) and begin fresh at <strong>Case 01: The Parcel That Never Came</strong>.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubModal('none')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSubModal('none');
                  if (onNewInvestigation) {
                    onNewInvestigation();
                  } else {
                    onRestartFromLevel1?.();
                    onSelectLevel('tutorial-delivery', 1);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Begin New Investigation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          8. QUIT / STAND DOWN MODAL
      ===================================================================== */}
      {activeSubModal === 'quit' && (
        <div
          className="fixed inset-0 z-40 bg-[#050914]/92 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Quit Session"
        >
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-lg text-white">
              Case Progress Saved to Journal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Detective Rowan Vance’s case notes ({completedCount}/{totalLevels} cases solved,{' '}
              {totalCluesLoggedAcrossCampaign} clues logged) are safely stored in your browser.
              You can close this tab anytime or return to the desk.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubModal('none')}
                className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs cursor-pointer"
              >
                Return to Main Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          9. CHAPTER PREVIEW DOSSIER MODAL
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
            setActiveSubModal('none');
            onSelectLevel(target.id, 3);
          }}
          isGameplayMode={false}
        />
      )}
    </div>
  );
};

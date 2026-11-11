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
import rainyDeskBgImg from '../../assets/images/scam_sleuth_blue_pink_desk_1794314110762.jpg';
import detectivePortraitImg from '../../assets/images/detective_character_portrait_1794034150867.jpg';
import {
  PixelCaseFolderIcon,
  PixelNewCaseIcon,
  PixelArchiveGridIcon,
  PixelBadgeIcon,
  PixelCharacterDossierIcon,
  PixelSettingsGearIcon,
  PixelQuitIcon,
  PixelMagnifierIcon,
} from './PixelIcons';

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

  const menuOptions = [
    {
      id: 'continue',
      hotkey: '1',
      slotTag: `CASE 0${currentActiveIndex + 1} · CH ${resolvedChapterNum}/3`,
      label: hasSavedProgress ? 'Continue Investigation' : 'Start Investigation',
      shortLabel: 'Active Case',
      icon: PixelCaseFolderIcon,
      itemType: 'PRIMARY INCIDENT DOSSIER',
      title: `Case 0${currentActiveIndex + 1}: ${getCleanLevelTitle(currentLevel.title)}`,
      desc: currentLevel.objective || currentLevel.subtitle,
      meta: `Chapter ${resolvedChapterNum} of 3 · ${foundCluesCount}/${totalCluesInCurrent} Clues Found`,
      actionLabel: hasSavedProgress ? 'CONTINUE INVESTIGATION' : 'START INVESTIGATION',
    },
    {
      id: 'new',
      hotkey: '2',
      slotTag: 'START CH 1',
      label: 'New Investigation',
      shortLabel: 'New Case',
      icon: PixelNewCaseIcon,
      itemType: 'FRESH CAMPAIGN START',
      title: 'Case 01: The Parcel That Never Came',
      desc: 'Reset active campaign journal and begin fresh investigation in Sunset Heights Apt 4B.',
      meta: hasSavedProgress ? `${completedCount}/${totalLevels} Cases Solved in Current Journal` : 'No Prior Journal History',
      actionLabel: 'COMMENCE FRESH CASE',
    },
    {
      id: 'case-files',
      hotkey: '3',
      slotTag: `${completedCount}/${totalLevels} SOLVED`,
      label: 'Case Files Archive',
      shortLabel: 'Case Board',
      icon: PixelArchiveGridIcon,
      itemType: 'CRIME BOARD & SCRIPT ARCHIVE',
      title: 'The Glasshouse Files (10 Cases)',
      desc: 'Browse all 10 connected cyber incidents, 30 investigation chapters, dialogue logs, and real-world habits.',
      meta: `${completedCount} Solved · ${totalLevels - completedCount} Unsolved`,
      actionLabel: 'OPEN CASE BOARD',
    },
    {
      id: 'achievements',
      hotkey: '4',
      slotTag: `${earnedBadges.length}/${totalLevels} EARNED`,
      label: 'Investigator Badges',
      shortLabel: 'Badges',
      icon: PixelBadgeIcon,
      itemType: 'CYBER SAFETY MEDAL RACK',
      title: '10 Field Investigator Safety Badges',
      desc: 'Collect commemorative safety badges for mastering phishing verification, QR safety, 2FA hygiene, and scam defense.',
      meta: `${earnedBadges.length} of ${totalLevels} Badges Earned`,
      actionLabel: 'VIEW BADGE RACK',
    },
    {
      id: 'settings',
      hotkey: '5',
      slotTag: 'CONFIG',
      label: 'Terminal Settings',
      shortLabel: 'Settings',
      icon: PixelSettingsGearIcon,
      itemType: 'SYSTEM CONFIGURATION',
      title: 'Investigation Preferences & Controls',
      desc: 'Configure procedural audio volume, camera sensitivity, subtitles, contrast, and reduced motion.',
      meta: `Motion: ${reducedMotion ? 'Reduced' : 'Subtle'} · Audio: Active`,
      actionLabel: 'OPEN SETTINGS',
    },
    {
      id: 'quit',
      hotkey: '6',
      slotTag: 'SAVE & EXIT',
      label: 'Stand Down & Save',
      shortLabel: 'Stand Down',
      icon: PixelQuitIcon,
      itemType: 'TERMINAL SESSION STAND DOWN',
      title: 'Save Campaign Progress to Browser',
      desc: 'Securely verify that all clues and solved cases are committed to local persistent storage before stepping away.',
      meta: `${totalCluesLoggedAcrossCampaign} Total Clues Logged`,
      actionLabel: 'VERIFY PROGRESS & QUIT',
    },
  ];

  const handleActivateMenuOption = useCallback(
    (index: number) => {
      soundEngine.playGtaMenuSelect();
      const item = menuOptions[index];
      if (!item) return;

      switch (item.id) {
        case 'continue':
          soundEngine.playGtaMissionStart();
          onSelectLevel(currentLevel.id, resolvedChapterNum);
          break;
        case 'new':
          if (hasSavedProgress) {
            setActiveSubModal('new-confirm');
          } else if (onNewInvestigation) {
            onNewInvestigation();
          } else {
            onSelectLevel('tutorial-delivery', 1);
          }
          break;
        case 'case-files':
          setCaseFilesTab('board');
          setActiveSubModal('case-files');
          break;
        case 'achievements':
          setActiveSubModal('achievements');
          break;
        case 'dossier':
          onOpenArtDossier?.();
          break;
        case 'settings':
          onOpenSettings();
          break;
        case 'quit':
          setActiveSubModal('quit');
          break;
        default:
          break;
      }
    },
    [
      menuOptions,
      currentLevel.id,
      resolvedChapterNum,
      hasSavedProgress,
      onNewInvestigation,
      onSelectLevel,
      onOpenArtDossier,
      onOpenSettings,
    ]
  );

  // Keyboard navigation for the inventory hotbar (WASD, Arrows, 1-7 numbers, Enter/Space)
  useEffect(() => {
    if (activeSubModal !== 'none' || previewLevel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      const totalOptions = menuOptions.length;

      if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        soundEngine.playGtaMenuHover();
        setSelectedIndex((prev) => (prev + 1) % totalOptions);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        soundEngine.playGtaMenuHover();
        setSelectedIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleActivateMenuOption(selectedIndex);
      } else if (e.key >= '1' && e.key <= String(totalOptions)) {
        const targetIdx = parseInt(e.key, 10) - 1;
        if (targetIdx >= 0 && targetIdx < totalOptions) {
          e.preventDefault();
          soundEngine.playGtaMenuHover();
          setSelectedIndex(targetIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubModal, previewLevel, selectedIndex, handleActivateMenuOption, menuOptions.length]);

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

  return (
    <div className="relative w-full min-h-[100dvh] h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#081426] text-[#F2F5FA] select-none font-sans flex flex-col justify-between">
      {/* =====================================================================
          1. FULL-SCREEN CINEMATIC RAINY APARTMENT & DETECTIVE DESK ARTWORK
      ===================================================================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {bgLoaded ? (
          <img
            src={rainyDeskBgImg}
            alt="Late-night detective desk with electric blue and vivid pink reflections facing a rain-streaked apartment window"
            referrerPolicy="no-referrer"
            onError={() => setBgLoaded(false)}
            className={`w-full h-full object-cover object-center ${
              reducedMotion
                ? ''
                : 'transition-transform duration-[18000ms] ease-out scale-[1.03]'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#081426] via-[#0E2445] to-[#1F102B]" />
        )}

        {/* Deepened Navy Shadows & Atmospheric Suspense Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#020612]/92 via-[#081426]/65 to-[#01040A]/96"
          aria-hidden="true"
        />

        {/* Restrained Magenta Warning Glow & Electric Blue Reflections (Occasional subtle flicker) */}
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(240,90,157,0.18)_0%,transparent_60%),radial-gradient(circle_at_18%_35%,rgba(57,189,247,0.18)_0%,transparent_50%),radial-gradient(circle_at_82%_30%,rgba(240,90,157,0.14)_0%,transparent_50%)] pointer-events-none ${
            reducedMotion ? '' : 'animate-sleuth-flicker'
          }`}
          aria-hidden="true"
        />

        {/* Cyber Detective Scanlines Overlay */}
        <div
          className="absolute inset-0 sleuth-scanlines opacity-40 pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* Subtle Rain Streaks Over Window Glass (Disabled when Reduced Motion is On) */}
        {!reducedMotion && (
          <div className="absolute inset-0 overflow-hidden opacity-35" aria-hidden="true">
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
                className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-[#39BDF7]/55 to-transparent"
              />
            ))}
          </div>
        )}

        {/* =================================================================
            SUBTLE PIXEL-ART CLUES & DECORATIVE ACCENTS NEAR SCREEN EDGES
        ================================================================= */}
        {/* Safe-Margin Corner Pixel Reticles */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute top-3 left-3 lg:top-5 lg:left-5 w-4 h-4 border-t-2 border-l-2 border-[#39BDF7]/35"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute top-3 right-3 lg:top-5 lg:right-5 w-4 h-4 border-t-2 border-r-2 border-[#F05A9D]/35"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute bottom-3 left-3 lg:bottom-5 lg:left-5 w-4 h-4 border-b-2 border-l-2 border-[#F05A9D]/35"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute bottom-3 right-3 lg:bottom-5 lg:right-5 w-4 h-4 border-b-2 border-r-2 border-[#39BDF7]/35"
        />

        {/* Left Edge Pixel-Art Clue Trace Accent (Visible on Laptop/Desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:flex flex-col items-center gap-3 absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 opacity-55"
        >
          <span className="w-1.5 h-1.5 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7]" />
          <div className="w-[2px] h-16 bg-gradient-to-b from-[#39BDF7]/70 via-[#F05A9D]/40 to-transparent" />
          <div className="p-1.5 text-[#39BDF7] drop-shadow-[0_0_8px_rgba(57,189,247,0.7)]">
            <PixelMagnifierIcon className="w-5 h-5" />
          </div>
          <span className="font-pixel text-[8px] tracking-[0.2em] text-[#39BDF7]/80 uppercase [writing-mode:vertical-rl] rotate-180">
            CLUE TRACE // {foundCluesCount}/{totalCluesInCurrent} LOGGED
          </span>
          <div className="w-[2px] h-16 bg-gradient-to-t from-[#F05A9D]/70 via-[#39BDF7]/40 to-transparent" />
          <span className="w-1.5 h-1.5 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D]" />
        </div>

        {/* Right Edge Pixel-Art Case Signal Accent (Visible on Laptop/Desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:flex flex-col items-center gap-3 absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 opacity-55"
        >
          <span className="w-1.5 h-1.5 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D]" />
          <div className="w-[2px] h-16 bg-gradient-to-b from-[#F05A9D]/70 via-[#39BDF7]/40 to-transparent" />
          <div className="p-1.5 text-[#F05A9D] drop-shadow-[0_0_8px_rgba(240,90,157,0.7)]">
            <PixelCaseFolderIcon className="w-5 h-5" />
          </div>
          <span className="font-pixel text-[8px] tracking-[0.2em] text-[#F05A9D]/80 uppercase [writing-mode:vertical-rl]">
            CASE 0{currentActiveIndex + 1} // CH.{resolvedChapterNum} ACTIVE
          </span>
          <div className="w-[2px] h-16 bg-gradient-to-t from-[#39BDF7]/70 via-[#F05A9D]/40 to-transparent" />
          <span className="w-1.5 h-1.5 bg-[#39BDF7] shadow-[0_0_6px_#39BDF7]" />
        </div>
      </div>

      {/* =====================================================================
          2. TOP AMBIENT TERMINAL HEADER (Safe Margins & Compact on Phones)
      ===================================================================== */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-3 sm:pt-5 lg:pt-6 shrink-0 flex items-center justify-between gap-2 text-xs font-mono text-[#F2F5FA]">
        <div className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#060D1A]/90 border-2 border-[#0E2445] shadow-[2px_2px_0_0_#02050A] flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D] shrink-0" />
          <span className="font-pixel text-[9px] sm:text-[10px] lg:text-[11px] text-[#F05A9D] tracking-wider uppercase truncate">
            GLASSHOUSE ARCHIVE
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline font-mono text-[10px] lg:text-xs text-[#39BDF7] shrink-0">
            10 CASES // 30 CHAPTERS
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onUpdateSettings && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playGtaMenuHover();
                onUpdateSettings({ reducedMotion: !reducedMotion });
              }}
              className="pixel-btn px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] lg:text-[11px] font-pixel text-[#F2F5FA] hover:text-[#39BDF7] cursor-pointer"
              title="Toggle Reduced Motion / Pixel FX"
            >
              FX: {reducedMotion ? 'MINIMAL' : 'ACTIVE'}
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          3. CENTER FOCAL GROUP: SCALED NEON TITLE & TEXT-ONLY VERTICAL MENU
      ===================================================================== */}
      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-2 sm:py-4 my-auto transition-opacity duration-500 ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Scam Sleuth Floating Neon Title Lockup */}
        <div className="mb-3 sm:mb-5 lg:mb-7">
          <ScamSleuthLogo reducedMotion={reducedMotion} />
        </div>

        {/* Centered Vertical List of Text-Only Menu Options (Generous Invisible Touch Targets, No Boxes) */}
        <nav
          aria-label="Main Menu"
          className="w-full max-w-lg mx-auto flex flex-col items-center gap-0.5 sm:gap-1.5 lg:gap-2.5"
        >
          {menuOptions.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  handleActivateMenuOption(idx);
                }}
                onMouseEnter={() => {
                  if (selectedIndex !== idx) {
                    soundEngine.playGtaMenuHover();
                    setSelectedIndex(idx);
                  }
                }}
                onFocus={() => {
                  if (selectedIndex !== idx) {
                    soundEngine.playGtaMenuHover();
                    setSelectedIndex(idx);
                  }
                }}
                onTouchStart={() => {
                  if (selectedIndex !== idx) {
                    setSelectedIndex(idx);
                  }
                }}
                className="group relative min-h-[40px] sm:min-h-[46px] lg:min-h-[52px] px-6 py-1 sm:py-1.5 inline-flex flex-col items-center justify-center bg-transparent border-0 outline-none cursor-pointer select-none transition-all duration-150"
              >
                <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3.5">
                  {/* Small Pixel Cursor (Preserves Center Alignment) */}
                  <span
                    aria-hidden="true"
                    className={`font-pixel text-xs sm:text-sm lg:text-base leading-none transition-opacity duration-150 ${
                      isSelected
                        ? 'opacity-100 text-[#F05A9D] drop-shadow-[0_0_8px_rgba(240,90,157,0.9)]'
                        : 'opacity-0'
                    }`}
                  >
                    ►
                  </span>

                  {/* Pixel Icon */}
                  <IconComp
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0 transition-all duration-150 ${
                      isSelected
                        ? 'text-[#F05A9D] drop-shadow-[0_0_10px_rgba(240,90,157,0.9)] scale-110'
                        : 'text-[#39BDF7]/90 group-hover:text-[#39BDF7] drop-shadow-[0_2px_4px_rgba(2,6,18,0.95)]'
                    }`}
                  />

                  {/* Option Label */}
                  <span
                    className={`font-pixel text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl uppercase tracking-[0.14em] transition-all duration-150 ${
                      isSelected
                        ? 'text-[#39BDF7] font-bold drop-shadow-[0_0_12px_rgba(57,189,247,0.95)]'
                        : 'text-[#F2F5FA] group-hover:text-[#39BDF7] drop-shadow-[0_2px_4px_rgba(2,6,18,0.95)]'
                    }`}
                  >
                    {item.shortLabel}
                  </span>

                  {/* Keyboard Shortcut */}
                  <span
                    className={`font-pixel text-[10px] sm:text-xs lg:text-sm tracking-wider transition-all duration-150 ${
                      isSelected
                        ? 'text-[#F05A9D] drop-shadow-[0_0_8px_rgba(240,90,157,0.9)]'
                        : 'text-[#39BDF7]/75 group-hover:text-[#F05A9D] drop-shadow-[0_2px_4px_rgba(2,6,18,0.95)]'
                    }`}
                  >
                    [{item.hotkey}]
                  </span>
                </div>

                {/* Thin Neon Underline for Selected Option Only */}
                <span
                  aria-hidden="true"
                  className={`mt-1 sm:mt-1.5 h-[2px] transition-all duration-150 ${
                    isSelected
                      ? 'w-full bg-gradient-to-r from-[#39BDF7] via-[#F05A9D] to-[#39BDF7] shadow-[0_0_10px_#39BDF7]'
                      : 'w-0 bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </main>

      {/* =====================================================================
          4. BOTTOM BAR: COMPACT PLAYER PORTRAIT & LATEST ACHIEVEMENT
      ===================================================================== */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-3 sm:pb-5 lg:pb-6 pt-1 shrink-0 flex flex-row items-center justify-between gap-2 sm:gap-4 text-xs">
        {/* Left: Detective Avatar & Status in Pixel Frame */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#060D1A]/90 border-2 border-[#0E2445] shadow-[2px_2px_0_0_#02050A] min-w-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 border-2 border-[#39BDF7] bg-[#081426] shrink-0 overflow-hidden">
            {portraitLoaded ? (
              <img
                src={detectivePortraitImg}
                alt="Detective Rowan Vance"
                referrerPolicy="no-referrer"
                onError={() => setPortraitLoaded(false)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-pixel text-[9px] sm:text-[10px] text-[#39BDF7]">
                RV
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-pixel text-[9px] sm:text-[10px] lg:text-[11px] text-[#F2F5FA] truncate">
                ROWAN VANCE
              </span>
              <span className="hidden md:inline text-slate-600">·</span>
              <span className="hidden md:inline font-mono text-[10px] lg:text-xs text-[#39BDF7] truncate">
                {investigatorRank}
              </span>
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] lg:text-[11px] text-[#94A3B8] truncate">
              {completedCount}/{totalLevels} CASES<span className="hidden sm:inline"> SOLVED</span> · {totalCluesLoggedAcrossCampaign} CLUES
            </div>
          </div>
        </div>

        {/* Right: Latest Collectible Badge Preview */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playGtaMenuSelect();
            setActiveSubModal('achievements');
          }}
          className="pixel-btn px-2.5 py-1 sm:px-3.5 sm:py-1.5 flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer shrink-0"
          title="Inspect All 10 Investigator Badges"
        >
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0 border-2 ${
              latestAchievement.earned
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-[#F05A9D]/20 border-[#F05A9D] text-[#F05A9D]'
            }`}
          >
            <PixelBadgeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-pixel text-[8px] sm:text-[8.5px] lg:text-[9.5px] text-[#F05A9D] uppercase truncate">
              {latestAchievement.earned ? 'LATEST BADGE' : 'NEXT TARGET'}
              <span className="hidden sm:inline"> · {latestAchievement.caseLabel}</span>
            </div>
            <div className="font-pixel text-[9px] sm:text-[10px] lg:text-[11px] text-[#F2F5FA] truncate max-w-[120px] sm:max-w-none">
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
          className="fixed inset-0 z-40 bg-[#081426]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Case Files"
        >
          <div className="w-full max-w-5xl max-h-[92vh] pixel-panel border-4 border-[#0D1C34] flex flex-col overflow-hidden text-[#F2F5FA] animate-block-reveal relative">
            {/* Pixel Corner Pins */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#39BDF7]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#39BDF7]" />

            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b-2 border-[#0D1C34] bg-[#060D1A] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-pixel text-[9px] text-[#F05A9D] tracking-wider block">
                  GLASSHOUSE ARCHIVE // 10 CONNECTED CYBER INCIDENTS
                </span>
                <h2 className="font-pixel text-base sm:text-xl text-[#F2F5FA] mt-0.5">
                  INVESTIGATION CASE BOARD
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 p-1 bg-[#040914] border-2 border-[#0D1C34]">
                  <button
                    type="button"
                    onClick={() => setCaseFilesTab('board')}
                    className={`px-3 py-1 font-pixel text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                      caseFilesTab === 'board'
                        ? 'bg-[#39BDF7] text-[#081426] font-bold shadow-[inset_1px_1px_0_0_#BAE6FD]'
                        : 'text-[#F2F5FA]/70 hover:text-white'
                    }`}
                  >
                    Case Board (10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseFilesTab('script')}
                    className={`px-3 py-1 font-pixel text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                      caseFilesTab === 'script'
                        ? 'bg-[#39BDF7] text-[#081426] font-bold shadow-[inset_1px_1px_0_0_#BAE6FD]'
                        : 'text-[#F2F5FA]/70 hover:text-white'
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
                    className="pixel-btn px-2.5 py-1 text-[9.5px] font-pixel text-[#39BDF7] hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5 text-[#39BDF7]" />
                    <span>UNLOCK ALL</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveSubModal('none')}
                  className="pixel-btn p-1.5 text-slate-400 hover:text-white cursor-pointer"
                  title="Close Case Files (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {caseFilesTab === 'board' ? (
                <>
                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 p-1 bg-[#040914] border-2 border-[#0D1C34]">
                      {(
                        [
                          { id: 'all', label: 'All Cases (10)' },
                          { id: 'current', label: 'Current Focus' },
                          { id: 'completed', label: `Solved (${completedCount})` },
                          { id: 'locked', label: 'Locked' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setBoardFilter(tab.id)}
                          className={`px-2.5 py-1 font-pixel text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
                            boardFilter === tab.id
                              ? 'bg-[#F05A9D] text-[#081426] font-bold shadow-[inset_1px_1px_0_0_#FBCFE8]'
                              : 'text-[#F2F5FA]/70 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Case Grid (Collectible Inventory Tiles) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                          className={`p-4 flex flex-col justify-between gap-3 transition-all ${
                            isCurrent
                              ? 'pixel-slot-active'
                              : isCompleted
                              ? 'pixel-slot border-emerald-500/60 bg-[#061226]'
                              : 'pixel-slot opacity-85 hover:opacity-100'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-[10px] font-pixel text-[#94A3B8]">
                                  <span className="text-[#F05A9D]">CASE 0{levelNum}</span> // {lvl.locationName}
                                </div>
                                <h3 className="font-pixel text-xs sm:text-sm text-white mt-0.5">
                                  {cleanTitle}
                                </h3>
                              </div>

                              <span className="font-pixel text-[9px] shrink-0">
                                {isCompleted ? (
                                  <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                                    [SOLVED]
                                  </span>
                                ) : isCurrent ? (
                                  <span className="px-1.5 py-0.5 bg-[#F05A9D] text-[#081426] font-bold animate-pulse">
                                    [ACTIVE]
                                  </span>
                                ) : isAvailable ? (
                                  <span className="px-1.5 py-0.5 bg-[#39BDF7]/20 border border-[#39BDF7] text-[#39BDF7]">
                                    [READY]
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-slate-500">
                                    [LOCKED]
                                  </span>
                                )}
                              </span>
                            </div>

                            <p className="font-sans text-xs text-[#F2F5FA]/85 leading-relaxed">
                              {lvl.objective}
                            </p>

                            {/* 3 Chapter Launch Buttons */}
                            <div className="grid grid-cols-3 gap-1.5 pt-1">
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
                                  className="pixel-btn p-1.5 text-left transition-colors cursor-pointer"
                                >
                                  <span className="block font-pixel text-[8px] text-[#F05A9D]">
                                    CH {ch.number}
                                  </span>
                                  <span className="block font-sans text-[11px] text-white truncate font-medium">
                                    {ch.phase.replace('The ', '')}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-[#0D1D38] flex items-center justify-between gap-2 text-[10px] font-mono">
                            <span className="text-[#94A3B8] tabular-nums">
                              {isCompleted
                                ? `${lvlCluesTotal}/${lvlCluesTotal} CLUES FOUND`
                                : `${lvlCluesFound}/${lvlCluesTotal} CLUES LOGGED`}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewChapterNum(1);
                                  setPreviewLevel(lvl);
                                }}
                                className="pixel-btn px-2 py-1 text-[9px] font-pixel text-[#F2F5FA] flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-[#F05A9D]" />
                                <span>NOTES</span>
                              </button>

                              {isAvailable && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playGtaMissionStart();
                                    setActiveSubModal('none');
                                    onSelectLevel(lvl.id, isCurrent ? resolvedChapterNum : 1);
                                  }}
                                  className="pixel-btn-action px-3 py-1 text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>
                                    {isCurrent
                                      ? 'RESUME'
                                      : isCompleted
                                      ? 'REPLAY'
                                      : 'INVESTIGATE'}
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
          className="fixed inset-0 z-40 bg-[#081426]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Investigator Achievements"
        >
          <div className="w-full max-w-4xl max-h-[90vh] pixel-panel border-4 border-[#0D1C34] flex flex-col overflow-hidden text-[#F2F5FA] animate-block-reveal relative">
            {/* Pixel Corner Pins */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#39BDF7]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#39BDF7]" />

            <div className="px-5 py-3.5 border-b-2 border-[#0D1C34] bg-[#060D1A] flex items-center justify-between">
              <div>
                <span className="font-pixel text-[9px] text-[#F05A9D] tracking-wider block">
                  INVESTIGATOR RECORD // {earnedBadges.length} OF {totalLevels} BADGES EARNED
                </span>
                <h2 className="font-pixel text-base sm:text-xl text-[#F2F5FA] mt-0.5">
                  CYBER-SAFETY BADGE RACK
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubModal('none')}
                className="pixel-btn p-1.5 text-slate-400 hover:text-white cursor-pointer"
                title="Close Achievements (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ADVENTURE_LEVELS.map((lvl, idx) => {
                const badgeTitle = lvl.debrief.badgeName;
                const isEarned =
                  earnedBadges.includes(badgeTitle) || completedLevels.includes(lvl.id);
                const isNextTarget = idx === currentActiveIndex && !isEarned;

                return (
                  <div
                    key={lvl.id}
                    className={`p-3.5 flex items-start gap-3 transition-all ${
                      isEarned
                        ? 'pixel-slot border-emerald-500/60 bg-[#061226]'
                        : isNextTarget
                        ? 'pixel-slot-active'
                        : 'pixel-slot opacity-75'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 border-2 flex items-center justify-center shrink-0 ${
                        isEarned
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : isNextTarget
                          ? 'border-[#F05A9D] bg-[#F05A9D]/20 text-[#F05A9D]'
                          : 'border-[#0D1D38] bg-[#02050A] text-slate-600'
                      }`}
                    >
                      <PixelBadgeIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[9px] font-pixel">
                        <span className="text-[#F05A9D]">CASE 0{idx + 1}</span>
                        <span className="text-slate-600">·</span>
                        {isEarned ? (
                          <span className="text-emerald-400 font-bold">[EARNED]</span>
                        ) : isNextTarget ? (
                          <span className="text-[#F05A9D] font-bold">[ACTIVE TARGET]</span>
                        ) : (
                          <span className="text-slate-500">[LOCKED]</span>
                        )}
                      </div>
                      <h3 className="font-pixel text-xs text-white">
                        {badgeTitle}
                      </h3>
                      <p className="font-sans text-xs text-[#F2F5FA]/80 leading-relaxed">
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
          className="fixed inset-0 z-40 bg-[#081426]/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Start New Investigation"
        >
          <div className="w-full max-w-md pixel-panel border-4 border-[#0D1C34] p-5 sm:p-6 space-y-4 shadow-2xl text-[#F2F5FA] relative">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#39BDF7]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#39BDF7]" />

            <div className="flex items-center gap-2 text-[#F05A9D] font-pixel text-sm">
              <RotateCcw className="w-4 h-4" />
              <span>START A NEW INVESTIGATION?</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#F2F5FA]/90 leading-relaxed">
              This will reset your active campaign journal ({completedCount}/{totalLevels} cases
              solved) and begin fresh at <strong className="text-white">Case 01: The Parcel That Never Came</strong>.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubModal('none')}
                className="pixel-btn px-4 py-2 font-pixel text-[10px] text-[#F2F5FA] cursor-pointer"
              >
                CANCEL
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
                className="pixel-btn-action px-4 py-2 text-[10px] flex items-center gap-1.5 cursor-pointer"
              >
                <span>BEGIN FRESH</span>
                <ChevronRight className="w-3.5 h-3.5" />
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
          className="fixed inset-0 z-40 bg-[#081426]/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Quit Session"
        >
          <div className="w-full max-w-md pixel-panel border-4 border-[#0D1C34] p-5 sm:p-6 space-y-4 shadow-2xl text-center text-[#F2F5FA] relative">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#39BDF7]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#F05A9D]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#39BDF7]" />

            <div className="w-10 h-10 border-2 border-emerald-400 bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-pixel text-sm sm:text-base text-white">
              CAMPAIGN PROGRESS COMMITTED
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#F2F5FA]/90 leading-relaxed">
              Detective Rowan Vance’s case notes ({completedCount}/{totalLevels} cases solved,{' '}
              {totalCluesLoggedAcrossCampaign} clues logged) are safely stored in your browser.
              You can close this tab anytime or return to the terminal.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubModal('none')}
                className="pixel-btn-action px-5 py-2 text-[10px] cursor-pointer"
              >
                RETURN TO DESK
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

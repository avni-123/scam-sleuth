import React, { useState } from 'react';
import {
  Play,
  Settings as SettingsIcon,
  Sparkles,
  CheckCircle,
  Star,
  MapPin,
  Lock,
  Unlock,
  Eye,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import { LevelId, AdventureLevel } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';
import { ChapterInvestigationModal } from './ChapterInvestigationModal';
import { CompleteCampaignScriptView } from './CompleteCampaignScriptView';

interface TitleScreenProps {
  onStartInvestigation: () => void;
  onSelectLevel: (levelId: LevelId, initialChapter?: 1 | 2 | 3) => void;
  onOpenSettings: () => void;
  completedLevels: string[];
  onOpenArtDossier?: () => void;
  onUnlockAllLevels?: () => void;
  onRestartFromLevel1?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onSelectLevel,
  onOpenSettings,
  completedLevels,
  onOpenArtDossier,
  onUnlockAllLevels,
  onRestartFromLevel1,
}) => {
  const [activeTab, setActiveTab] = useState<'campaign' | 'script' | 'dossier' | 'controls'>('campaign');
  const [threatStars, setThreatStars] = useState<number>(5);
  const [previewLevel, setPreviewLevel] = useState<AdventureLevel | null>(null);
  const [previewChapterNum, setPreviewChapterNum] = useState<1 | 2 | 3>(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const totalLevels = ADVENTURE_LEVELS.length; // 10 Levels
  const totalChapters = totalLevels * 3; // 30 Chapters
  const completedCount = completedLevels.length;
  const completedChaptersCount = completedCount * 3;

  // Unlock levels in campaign order: Level 1 is available at start, Level N unlocks when Level N-1 is completed
  const isLevelUnlocked = (idx: number): boolean => {
    if (idx === 0) return true;
    const prevLevel = ADVENTURE_LEVELS[idx - 1];
    return (
      completedLevels.includes(prevLevel.id) ||
      completedLevels.includes(ADVENTURE_LEVELS[idx].id)
    );
  };

  // Next active available level in campaign order
  const nextActiveIndex = (() => {
    for (let i = 0; i < ADVENTURE_LEVELS.length; i++) {
      if (!completedLevels.includes(ADVENTURE_LEVELS[i].id) && isLevelUnlocked(i)) {
        return i;
      }
    }
    return 0;
  })();
  const nextActiveLevel = ADVENTURE_LEVELS[nextActiveIndex] || ADVENTURE_LEVELS[0];

  // Clean exact level title without "Level X: " prefix so we can display Level number + exact title cleanly
  const getCleanLevelTitle = (rawTitle: string): string => {
    return rawTitle.replace(/^Level\s+\d+\s*:\s*/i, '').trim();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#060A17] text-white flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* DARK ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0c122c] via-[#171233] to-[#060814] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/15 via-purple-900/10 to-transparent pointer-events-none" />

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 bg-[#060A17]/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-black font-heading font-black shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300 shrink-0">
            <span className="text-lg tracking-tighter font-black">SS</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-black text-xl sm:text-2xl tracking-tight text-white uppercase leading-none">
                SCAM SLEUTH
              </h1>
              <span className="text-amber-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                · THE GLASSHOUSE FILES
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-widest block font-bold mt-0.5">
              10 LEVELS · 3 CHAPTERS PER LEVEL · 30 CHAPTERS TOTAL
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-heading font-black tracking-wider uppercase">
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('campaign');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'campaign'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            All 10 Levels
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('script');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'script'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            30 Chapters & Questions
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('dossier');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dossier'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            Glasshouse Story
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuHover();
              setActiveTab('controls');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            Controls
          </button>
          {onOpenArtDossier && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playGtaMenuSelect();
                onOpenArtDossier();
              }}
              className="hidden md:inline-block px-3 py-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all cursor-pointer whitespace-nowrap"
            >
              Characters
            </button>
          )}
        </nav>

        {/* Right: Rating & Settings */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-black/80 rounded-xl border border-amber-400/30">
            {[1, 2, 3, 4, 5].map((starIdx) => {
              const isLit = starIdx <= threatStars;
              return (
                <Star
                  key={starIdx}
                  onClick={() => {
                    soundEngine.playGtaRadarBlip();
                    setThreatStars(starIdx);
                  }}
                  className={`w-3.5 h-3.5 cursor-pointer transition-transform hover:scale-125 ${
                    isLit
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                      : 'text-white/20 fill-transparent'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playGtaMenuSelect();
              onOpenSettings();
            }}
            className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 text-[#CBD5E1] hover:text-amber-400 transition-colors cursor-pointer"
            title="Settings & Accessibility (Esc)"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 pb-28 space-y-6">
        {activeTab === 'campaign' && (
          <>
            {/* Campaign Hero Banner */}
            <section className="rounded-3xl bg-gradient-to-r from-[#0B152E] via-[#111C3D] to-[#0A1228] border-2 border-amber-400/60 p-5 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.75)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-amber-300 font-bold tracking-wider">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>THE GLASSHOUSE FILES · 10 LEVELS · 30 CHAPTERS</span>
                </div>
                <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                  Investigate All 10 Cases Across the City
                </h2>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  Every level is a complete cyber-safety case told across three chapters: <strong className="text-amber-300">Chapter 1 (The Setup)</strong>, <strong className="text-[#00F0FF]">Chapter 2 (The Investigation)</strong>, and <strong className="text-emerald-400">Chapter 3 (The Decision)</strong>. Solve each case to unlock the next level and uncover the <strong className="text-white">Glasshouse</strong> campaign.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playGtaMissionStart();
                    onSelectLevel(nextActiveLevel.id, 1);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-[0.99] text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                >
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>
                    {completedCount === 0
                      ? 'Start Level 1: The Parcel That Never Came'
                      : `Continue Level ${nextActiveIndex + 1}: ${getCleanLevelTitle(nextActiveLevel.title)}`}
                  </span>
                </button>

                {onUnlockAllLevels && completedCount < totalLevels && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playGtaMenuSelect();
                      onUnlockAllLevels();
                      setStatusMessage('All 10 levels are now unlocked!');
                    }}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-[#131E3A] hover:bg-[#1C2D56] border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Unlock className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlock All 10 Levels</span>
                  </button>
                )}

                {onRestartFromLevel1 && completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playGtaMenuSelect();
                      onRestartFromLevel1();
                      setStatusMessage('Campaign restarted from Level 1: The Parcel That Never Came.');
                    }}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Restart from Level 1</span>
                  </button>
                )}
              </div>
            </section>

            {statusMessage && (
              <div className="text-xs font-mono text-amber-300 bg-amber-500/15 border border-amber-400/40 px-4 py-2.5 rounded-xl flex items-center justify-between">
                <span>{statusMessage}</span>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="text-white hover:underline ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* ===============================================================
                ALL 10 INDIVIDUAL LEVEL CARDS WITH 3 CHAPTERS UNDERNEATH EACH
            =============================================================== */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading font-black text-lg sm:text-xl text-white uppercase tracking-wide">
                  Campaign Levels (1 – 10)
                </h3>
                <span className="font-mono text-xs text-[#94A3B8]">
                  {completedCount} of {totalLevels} Levels Completed · {completedChaptersCount} of {totalChapters} Chapters
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {ADVENTURE_LEVELS.map((lvl, idx) => {
                  const levelNum = idx + 1;
                  const cleanTitle = getCleanLevelTitle(lvl.title);
                  const isCompleted = completedLevels.includes(lvl.id);
                  const isAvailable = isLevelUnlocked(idx);
                  const statusLabel = isCompleted
                    ? 'Completed'
                    : isAvailable
                    ? 'Available'
                    : 'Locked';

                  return (
                    <article
                      key={lvl.id}
                      className={`rounded-2xl border-2 p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all ${
                        isCompleted
                          ? 'bg-[#09182C]/95 border-emerald-500/60 shadow-lg'
                          : isAvailable
                          ? 'bg-[#0A1329]/95 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                          : 'bg-[#070D1D]/90 border-white/15'
                      }`}
                    >
                      {/* Level Header + Visible Status Badge */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider block">
                              Level {levelNum}
                            </span>
                            <h4 className="font-heading font-black text-lg sm:text-xl text-white leading-snug">
                              {levelNum}. {cleanTitle}
                            </h4>
                            <p className="text-xs font-mono text-[#94A3B8]">
                              {lvl.locationName} · {lvl.npcs[0]?.name}
                            </p>
                          </div>

                          {/* Visible Status: Completed, Available, or Locked */}
                          {isCompleted ? (
                            <span className="shrink-0 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Completed</span>
                            </span>
                          ) : isAvailable ? (
                            <span className="shrink-0 px-3 py-1 rounded-lg bg-amber-400 text-black font-mono text-xs font-black uppercase">
                              Available
                            </span>
                          ) : (
                            <span className="shrink-0 px-3 py-1 rounded-lg bg-white/10 text-[#CBD5E1] border border-white/15 font-mono text-xs font-bold flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>

                        {/* Three Chapter Names Directly Underneath */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          {lvl.chapters.map((ch) => (
                            <div
                              key={ch.number}
                              onClick={() => {
                                soundEngine.playGtaMenuSelect();
                                if (isAvailable) {
                                  onSelectLevel(lvl.id, ch.number);
                                } else {
                                  setPreviewChapterNum(ch.number);
                                  setPreviewLevel(lvl);
                                }
                              }}
                              className={`p-3 rounded-xl border transition-colors flex flex-col gap-2 ${
                                isCompleted
                                  ? 'bg-emerald-950/30 border-emerald-500/30 hover:bg-emerald-950/50 cursor-pointer'
                                  : isAvailable
                                  ? 'bg-[#101E42]/90 border-amber-400/30 hover:border-amber-400 cursor-pointer'
                                  : 'bg-black/40 border-white/10 hover:border-white/25 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-0.5">
                                  <div className="font-heading font-bold text-xs sm:text-sm text-white leading-snug">
                                    {ch.title}
                                  </div>
                                  <p className="text-[11px] text-[#94A3B8] leading-snug">
                                    {ch.learningGoal || ch.summary}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      soundEngine.playGtaMenuHover();
                                      setPreviewChapterNum(ch.number);
                                      setPreviewLevel(lvl);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-black text-[10px] font-mono font-semibold text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    Story, Clues & Question
                                  </button>
                                  <span className="font-mono text-[10px] font-bold text-[#00F0FF] uppercase">
                                    {ch.phase.replace('The ', '')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer: Clear Action to Open, Continue, or Preview Level */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playGtaMenuHover();
                            setPreviewChapterNum(1);
                            setPreviewLevel(lvl);
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-bold text-[#E2E8F0] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
                          <span>Chapters, Clues & Questions</span>
                        </button>

                        {isAvailable ? (
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playGtaMissionStart();
                              onSelectLevel(lvl.id, 1);
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>
                              {isCompleted
                                ? `Replay Level ${levelNum}`
                                : `Open Level ${levelNum}`}
                            </span>
                            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playGtaMenuSelect();
                              setPreviewChapterNum(1);
                              setPreviewLevel(lvl);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#131E3A] hover:bg-[#1C2C54] border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Level {levelNum}</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
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
            THE GLASSHOUSE FILES MYSTERY TAB
        =================================================================== */}
        {activeTab === 'dossier' && (
          <div className="max-w-5xl mx-auto w-full bg-[#070D1E]/95 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-5 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  CAMPAIGN PREMISE · THE GLASSHOUSE FILES
                </span>
                <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tight">
                  HOW ALL 10 CASES & 30 CHAPTERS CONNECT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('campaign')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold cursor-pointer"
              >
                Back to All 10 Levels
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              In <strong className="text-white">Scam Sleuth: The Glasshouse Files</strong>, you help neighbors Alex Rivera, Maya Chen, Marcus Vance, and Priya Sharma navigate suspicious messages, account warnings, and payment tricks. Every case reveals another piece of the <strong className="text-amber-300">Glasshouse</strong> campaign.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {ADVENTURE_LEVELS.map((lvl, idx) => (
                <div
                  key={lvl.id}
                  className="p-4 rounded-2xl bg-[#091124] border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-amber-400 font-bold uppercase">Level {idx + 1}</span>
                    <span className="text-[#00F0FF]">{lvl.locationName}</span>
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    {idx + 1}. {getCleanLevelTitle(lvl.title)}
                  </h4>
                  <ul className="text-[#CBD5E1] space-y-1 font-mono text-[11px]">
                    {lvl.chapters.map((ch) => (
                      <li key={ch.number}>{ch.title}</li>
                    ))}
                  </ul>
                  {lvl.glasshouseClue && (
                    <p className="text-[11px] font-mono text-emerald-300 pt-1.5 border-t border-white/10">
                      Clue: {lvl.glasshouseClue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TUTORIAL & CONTROLS TAB */}
        {activeTab === 'controls' && (
          <div className="max-w-3xl mx-auto w-full bg-[#070D1E]/95 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-black text-xl text-white uppercase">
                HOW TO PLAY · 3 CHAPTERS PER LEVEL
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('campaign')}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold cursor-pointer"
              >
                Back to All 10 Levels
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#091124] border border-amber-400/40 space-y-1">
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase block">
                  Chapter 1 · The Setup
                </span>
                <p className="text-[#CBD5E1]">
                  Explore the 3D location and press <strong className="text-white">E</strong> to talk with the character via subtitled dialogue.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#091124] border border-[#00F0FF]/40 space-y-1">
                <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase block">
                  Chapter 2 · The Investigation
                </span>
                <p className="text-[#CBD5E1]">
                  Walk up to phones, laptops, and notices and press <strong className="text-white">E</strong> to inspect messages and find clues.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#091124] border border-emerald-400/40 space-y-1">
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase block">
                  Chapter 3 · The Decision
                </span>
                <p className="text-[#CBD5E1]">
                  Choose from <strong className="text-white">4 concise options</strong>. Unsafe choices let you <strong className="text-white">Retry this moment</strong> with all clues kept.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="font-mono text-lg font-black text-amber-400 block">W / A / S / D</span>
                <span className="text-xs text-[#94A3B8] font-bold">MOVE AROUND</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="font-mono text-lg font-black text-[#00F0FF] block">E KEY</span>
                <span className="text-xs text-[#94A3B8] font-bold">INTERACT / INSPECT</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="font-mono text-lg font-black text-emerald-400 block">J KEY</span>
                <span className="text-xs text-[#94A3B8] font-bold">CASE JOURNAL</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="font-mono text-lg font-black text-purple-400 block">V KEY</span>
                <span className="text-xs text-[#94A3B8] font-bold">1ST / 3RD PERSON</span>
              </div>
            </div>
          </div>
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

      {/* BOTTOM BAR */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-4 bg-black/70 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Fictional & Safe Educational Simulation</span>
        </div>

        <div className="text-[11px] text-amber-400 font-bold tracking-wider uppercase">
          SCAM SLEUTH: THE GLASSHOUSE FILES · 10 LEVELS · 30 CHAPTERS
        </div>
      </footer>
    </div>
  );
};

import React, { useEffect } from 'react';
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Network,
} from 'lucide-react';
import { LevelDebrief, LevelId } from '../../types/adventure';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import { soundEngine } from '../../utils/proceduralAudio';

interface LevelDebriefModalProps {
  debrief: LevelDebrief;
  levelId?: LevelId;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onReturnToMenu: () => void;
  hasNextLevel: boolean;
}

export const LevelDebriefModal: React.FC<LevelDebriefModalProps> = ({
  debrief,
  levelId,
  onNextLevel,
  onReplayLevel,
  onReturnToMenu,
  hasNextLevel,
}) => {
  const currentIdx = ADVENTURE_LEVELS.findIndex((l) => l.id === levelId);
  const currentLevel = currentIdx >= 0 ? ADVENTURE_LEVELS[currentIdx] : ADVENTURE_LEVELS[0];
  const nextLevel =
    currentIdx >= 0 && currentIdx < ADVENTURE_LEVELS.length - 1
      ? ADVENTURE_LEVELS[currentIdx + 1]
      : null;

  useEffect(() => {
    soundEngine.playGtaMissionPassed();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040814]/92 backdrop-blur-md animate-fade-in pointer-events-auto select-none cursor-default">
      <div className="w-full max-w-3xl bg-[#070E22] border-2 border-pink-400/65 rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(2,6,23,0.95),0_0_55px_rgba(236,72,153,0.25)] relative text-white space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-1.5 pb-4 border-b border-sky-500/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/18 border border-pink-400/45 text-pink-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>
              THE GLASSHOUSE FILES · LEVEL {currentIdx >= 0 ? currentIdx + 1 : 1} OF {ADVENTURE_LEVELS.length} · ALL 3 CHAPTERS COMPLETE
            </span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-200 to-pink-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {currentLevel.title} — RESOLVED
          </h1>

          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              <span>Badge Earned: {debrief.badgeName}</span>
            </span>
            <span className="text-[#64748B]">·</span>
            <span className="text-emerald-400 font-mono text-xs sm:text-sm font-black flex items-center gap-1">
              <CheckCircle className="w-4 h-4 fill-emerald-500 text-black" />
              3 / 3 CHAPTERS COMPLETED
            </span>
          </div>
        </div>

        {/* 3 Completed Chapters Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {currentLevel.chapters.map((ch) => (
            <div
              key={ch.number}
              className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-left space-y-1"
            >
              <div className="flex items-center justify-between font-mono text-[10px] font-bold text-emerald-300">
                <span>{ch.phase}</span>
                <span>✓</span>
              </div>
              <div className="font-heading font-bold text-xs text-white leading-tight">
                {ch.title}
              </div>
            </div>
          ))}
        </div>

        {/* The 4 Core Debrief Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#0B1530] border border-sky-500/20 space-y-1 shadow-md">
            <span className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider block font-bold">
              01. What Happened
            </span>
            <p className="text-slate-200 font-medium leading-relaxed">
              {debrief.summary}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B1530] border border-pink-400/30 space-y-1 shadow-md">
            <span className="font-mono text-[10px] text-pink-300 uppercase tracking-wider block font-bold">
              02. Which Clue Mattered
            </span>
            <p className="text-slate-200 font-medium leading-relaxed">
              {debrief.keyClue}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B1530] border border-emerald-500/30 space-y-1 shadow-md">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
              03. Why The Safe Choice Helped
            </span>
            <p className="text-slate-200 font-medium leading-relaxed">
              {debrief.safeRationale}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0F1F44] border border-[#00F0FF]/45 space-y-1">
            <span className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider block font-bold">
              04. Real-World Habit To Remember
            </span>
            <p className="text-white font-bold leading-relaxed">
              {debrief.realWorldHabit}
            </p>
          </div>
        </div>

        {/* Glasshouse Files Thread */}
        {currentLevel.glasshouseClue && (
          <div className="p-3.5 rounded-2xl bg-[#050A18] border border-pink-400/35 text-xs space-y-1">
            <span className="font-mono text-[10px] text-pink-300 uppercase font-bold block">
              The Glasshouse Files Thread
            </span>
            <p className="text-slate-100">{currentLevel.glasshouseClue}</p>
          </div>
        )}

        {/* Next Unlocked Level in Campaign Order */}
        {nextLevel ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-[#0A1329] to-[#00F0FF]/15 border border-pink-400/45 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-pink-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-pink-400" />
                <span>NEXT CASE UNLOCKED · {nextLevel.levelNumber} (3 CHAPTERS)</span>
              </span>
              <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
                {nextLevel.locationName}
              </span>
            </div>
            <div className="font-heading font-bold text-sm text-white">
              {nextLevel.title}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {nextLevel.chapters.map((c) => c.title).join(' · ')}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-[#0A1329] to-pink-500/20 border border-emerald-400/50 space-y-1.5">
            <span className="font-mono text-[10px] text-emerald-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              <span>THE GLASSHOUSE FILES COMPLETE · ALL 10 LEVELS & 30 CHAPTERS SOLVED</span>
            </span>
            <p className="text-xs text-white leading-relaxed font-medium">
              Congratulations! You and the neighborhood coalition solved all 10 cases (30 chapters) and helped the entire community build lasting cyber-safety confidence.
            </p>
          </div>
        )}

        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-sky-500/20">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onReturnToMenu}
              className="px-4 py-2.5 rounded-xl bg-[#0B1530] hover:bg-[#13244A] border border-sky-500/25 text-slate-200 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              10-Level Board
            </button>
            <button
              type="button"
              onClick={onReplayLevel}
              className="px-4 py-2.5 rounded-xl bg-[#0B1530] hover:bg-[#13244A] border border-sky-500/25 text-slate-200 hover:text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
              <span>Replay Case</span>
            </button>
          </div>

          {hasNextLevel && nextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#00F0FF] hover:bg-sky-300 active:scale-[0.98] text-[#050A18] font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.45)]"
            >
              <span>CONTINUE TO {nextLevel.title.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onReturnToMenu}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#00F0FF] hover:bg-sky-300 active:scale-[0.98] text-[#050A18] font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.45)]"
            >
              <span>ALL 10 LEVELS SOLVED · RETURN TO HUB</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

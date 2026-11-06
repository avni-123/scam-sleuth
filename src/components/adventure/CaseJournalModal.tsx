import React from 'react';
import {
  BookOpen,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AdventureLevel, InspectionData } from '../../types/adventure';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';

interface CaseJournalModalProps {
  currentLevel: AdventureLevel;
  collectedClues: Record<string, InspectionData>;
  completedLevels: string[];
  badges: string[];
  onClose: () => void;
}

export const CaseJournalModal: React.FC<CaseJournalModalProps> = ({
  currentLevel,
  collectedClues,
  completedLevels,
  badges,
  onClose,
}) => {
  const levelClues = currentLevel.objects.map((obj) => obj.inspection);
  const totalLevels = ADVENTURE_LEVELS.length; // 10 Levels
  const totalChapters = totalLevels * 3; // 30 Chapters

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in pointer-events-auto cursor-default">
      <div className="w-full max-w-4xl bg-[#091124] border-2 border-[#00F0FF] rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,240,255,0.3)] relative text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#00F0FF] uppercase tracking-wider block">
                THE GLASSHOUSE FILES · {completedLevels.length}/10 LEVELS · {completedLevels.length * 3}/{totalChapters} CHAPTERS
              </span>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white">
                Investigator Case Journal & Clues
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Level & 3-Chapter Breakdown */}
        <div className="p-4 rounded-2xl bg-[#050A18] border border-amber-400/40 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-wider">
              Active Case: {currentLevel.title} ({currentLevel.locationName})
            </span>
            <span className="font-mono text-[10px] text-[#00F0FF] font-bold">
              3 Playable Chapters
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {currentLevel.chapters.map((ch) => (
              <div
                key={ch.number}
                className="p-2.5 rounded-xl bg-[#0E1A38] border border-white/10 space-y-0.5"
              >
                <span className="font-mono text-[9px] text-amber-300 font-bold uppercase block">
                  Ch {ch.number} · {ch.phase}
                </span>
                <span className="font-heading font-bold text-white block text-[11px]">
                  {ch.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Discovered Clues in Active Case */}
        <div className="space-y-3">
          <h3 className="font-heading font-black text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <span>Clues & Messages in {currentLevel.title}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {levelClues.map((clue) => {
              const isFound = Boolean(collectedClues[clue.clueId]);

              return (
                <div
                  key={clue.clueId}
                  className={`p-3.5 rounded-2xl border-2 transition-all space-y-1.5 ${
                    isFound
                      ? 'bg-[#0E1A38] border-emerald-500/50 shadow-md'
                      : 'bg-[#060D1E]/60 border-dashed border-white/10 opacity-65'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-heading font-bold text-xs text-white">
                      {isFound ? clue.title : 'Uninspected Clue'}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold ${
                        isFound ? 'text-emerald-400' : 'text-[#64748B]'
                      }`}
                    >
                      {isFound ? 'LOGGED ✓' : 'PRESS E IN WORLD'}
                    </span>
                  </div>

                  {isFound ? (
                    <>
                      <p className="text-[11px] text-[#CBD5E1] leading-snug">
                        {clue.evidenceClue}
                      </p>
                      <span className="text-[10px] font-mono text-amber-300 block">
                        Source: {clue.senderOrSource}
                      </span>
                    </>
                  ) : (
                    <p className="text-[11px] text-[#64748B] italic">
                      Inspect objects and messages in {currentLevel.locationName} during Chapter 2 (The Investigation).
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 10-Level Campaign Tracker (30 Chapters Total) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/40 to-[#00F0FF]/10 border border-amber-400/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>THE GLASSHOUSE FILES · 10 LEVELS × 3 CHAPTERS (30 CHAPTERS)</span>
            </span>
            <span className="text-[10px] font-mono text-[#00F0FF] font-bold tabular-nums">
              {completedLevels.length}/10 Cases Solved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[10px]">
            {ADVENTURE_LEVELS.map((lvl, idx) => {
              const done = completedLevels.includes(lvl.id);
              const unlocked =
                idx === 0 ||
                completedLevels.includes(ADVENTURE_LEVELS[idx - 1].id) ||
                done;
              const isCurrent = lvl.id === currentLevel.id;

              return (
                <div
                  key={lvl.id}
                  className={`p-3 rounded-xl border ${
                    done
                      ? 'bg-emerald-500/15 border-emerald-500/40'
                      : isCurrent
                      ? 'bg-amber-400/15 border-amber-400'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white truncate">{lvl.title}</span>
                    <span className="text-amber-300 shrink-0">
                      {done ? '3/3 Ch ✓' : unlocked ? 'Open' : <Lock className="w-3 h-3 inline" />}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-1.5">
                    {lvl.chapters.map((ch) => (
                      <div
                        key={ch.number}
                        className={`px-1.5 py-1 rounded text-[9px] truncate border ${
                          done
                            ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-200'
                            : unlocked
                            ? 'bg-black/40 border-white/15 text-[#CBD5E1]'
                            : 'bg-black/30 border-white/5 text-[#64748B]'
                        }`}
                      >
                        Ch {ch.number}: {ch.phase.replace('The ', '')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earned Safety Habit Badges */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="font-mono text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider block">
            Safety Habits Mastered ({badges.length} / {totalLevels})
          </span>
          {badges.length === 0 ? (
            <p className="text-xs text-[#64748B]">
              Complete Chapter 3 decisions across the 10 cases to log practical safety habits here.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

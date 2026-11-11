import React from 'react';
import {
  BookOpen,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Award,
  Compass,
  Search,
  UserCheck,
} from 'lucide-react';
import { AdventureLevel, InspectionData } from '../../types/adventure';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import detectivePortraitImg from '../../assets/images/detective_character_portrait_1794034150867.jpg';

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
  const levelClues = currentLevel.objects.map((obj) => ({
    objName: obj.name,
    inspection: obj.inspection,
  }));
  const totalLevels = ADVENTURE_LEVELS.length; // 10 Levels
  const foundCount = Object.keys(collectedClues).length;
  const remainingCount = Math.max(0, levelClues.length - foundCount);

  const firstUnfound = currentLevel.objects.find(
    (o) => !collectedClues[o.inspection.clueId]
  );
  const currentObjectiveText = firstUnfound
    ? `Inspect ${firstUnfound.name}`
    : `Make the safe verification decision with ${currentLevel.npcs[0]?.name || 'the resident'}`;

  const lastCompletedLevel = (() => {
    if (completedLevels.length === 0) return null;
    for (let i = ADVENTURE_LEVELS.length - 1; i >= 0; i--) {
      if (completedLevels.includes(ADVENTURE_LEVELS[i].id)) {
        return ADVENTURE_LEVELS[i];
      }
    }
    return null;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in pointer-events-auto cursor-default">
      <div className="w-full max-w-4xl bg-[#081426] border border-[#39BDF7]/30 rounded-2xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(2,6,23,0.9),0_0_32px_rgba(57,189,247,0.15)] relative text-[#F2F5FA] space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#39BDF7]/20">
          <div className="flex items-center gap-3.5">
            <img
              src={detectivePortraitImg}
              alt="Detective Rowan Vance"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover object-top border border-[#F05A9D]/50 shrink-0 shadow-[0_0_12px_rgba(240,90,157,0.2)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div>
              <div className="font-mono text-xs text-[#F05A9D] font-semibold">
                <span>Detective Rowan Vance</span>
                <span aria-hidden="true"> · </span>
                <span className="text-[#39BDF7]">
                  {completedLevels.length}/{totalLevels} Cases Solved
                </span>
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#F2F5FA]">
                Investigator’s Case Journal
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1A33] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Level, Objective & Clue Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B1A33] border border-[#39BDF7]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#39BDF7] font-semibold">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Current Objective · {currentLevel.locationName}</span>
            </div>
            <div className="font-heading font-bold text-base text-[#F2F5FA]">
              {currentObjectiveText}
            </div>
            <p className="text-xs text-slate-300">{currentLevel.title}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1A33] border border-[#F05A9D]/30 space-y-2 font-mono tabular-nums">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#F05A9D] shrink-0" />
                <span>Case Progress</span>
              </span>
              <span className="text-[#F2F5FA] font-bold">
                {foundCount} Found · {remainingCount} Remaining
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#081426] border border-[#39BDF7]/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F05A9D] to-[#39BDF7] transition-all duration-300"
                style={{
                  width: `${Math.max(
                    12,
                    Math.round((foundCount / Math.max(1, levelClues.length)) * 100)
                  )}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-slate-300 block">
              Inspect evidence items in the room by pressing E.
            </span>
          </div>
        </div>

        {/* Logged Clues in Current Case */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#F2F5FA] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#F05A9D]" />
            <span>Evidence & Clues in {currentLevel.title}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {levelClues.map(({ objName, inspection: clue }) => {
              const isFound = Boolean(collectedClues[clue.clueId]);

              return (
                <div
                  key={clue.clueId}
                  className={`p-4 rounded-xl border transition-all space-y-1.5 ${
                    isFound
                      ? 'bg-[#081426] border-emerald-500/50'
                      : 'bg-[#0B1A33]/80 border-[#F05A9D]/30 hover:border-[#F05A9D]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-heading font-bold text-xs text-[#F2F5FA]">
                      {isFound ? clue.title : objName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold shrink-0 ${
                        isFound ? 'text-emerald-400' : 'text-[#F05A9D]'
                      }`}
                    >
                      {isFound ? 'Logged ✓' : 'Uninspected Clue'}
                    </span>
                  </div>

                  {isFound ? (
                    <>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {clue.evidenceClue}
                      </p>
                      <span className="text-[11px] font-mono text-[#F05A9D] block pt-1">
                        Source: {clue.senderOrSource}
                      </span>
                    </>
                  ) : (
                    <p className="text-xs text-slate-300">
                      Approach {objName} in {currentLevel.locationName} and press E to inspect.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Case Recap */}
        {lastCompletedLevel && (
          <div className="p-4 rounded-xl bg-[#0B1A33] border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Recent Case Recap · {lastCompletedLevel.title}</span>
              <span>Badge: {lastCompletedLevel.debrief.badgeName}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {lastCompletedLevel.debrief.summary} Habit: {lastCompletedLevel.debrief.realWorldHabit}
            </p>
          </div>
        )}

        {/* Achievements: Earned Badges & Locked Previews */}
        <div className="space-y-3 pt-2 border-t border-[#39BDF7]/20">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-[#F2F5FA] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F05A9D]" />
              <span>Investigator Achievements ({badges.length} / {totalLevels})</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {ADVENTURE_LEVELS.map((lvl, idx) => {
              const bName = lvl.debrief.badgeName;
              const isEarned = badges.includes(bName) || completedLevels.includes(lvl.id);
              return (
                <div
                  key={lvl.id}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-1.5 ${
                    isEarned
                      ? 'bg-[#081426] border-emerald-500/40 text-[#F2F5FA]'
                      : 'bg-[#081426]/90 border-[#39BDF7]/20 text-slate-300 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={isEarned ? 'text-emerald-300' : 'text-[#F05A9D]/80'}>
                      Case 0{idx + 1}
                    </span>
                    {isEarned ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <span className="font-heading font-semibold text-xs leading-snug truncate">
                    {bName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

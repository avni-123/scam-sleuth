import React, { useState, useEffect } from 'react';
import {
  DetectiveCase,
  ActionOption,
  BadgeType,
} from '../types/game.ts';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseRevealProps {
  currentCase: DetectiveCase;
  chosenAction: ActionOption;
  discoveredClueIds: string[];
  onFinishCase: (selectedInfluentialClueId?: string) => void;
  onReplay: () => void;
}

export const CaseReveal: React.FC<CaseRevealProps> = ({
  currentCase,
  chosenAction,
  discoveredClueIds,
  onFinishCase,
  onReplay,
}) => {
  const [selectedConfidenceClue, setSelectedConfidenceClue] = useState<string | null>(null);

  const isSuccess = chosenAction.isSafe;

  // Trigger celebratory confetti on safe choice
  useEffect(() => {
    if (isSuccess) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#38BDF8', '#FBBF24'],
        });
      } catch {
        // ignore
      }
    }
  }, [isSuccess]);

  // Determine badges earned from this case's clues
  const badgesEarned = Array.from(
    new Set(currentCase.clues.map((c) => c.skillBadge))
  ) as BadgeType[];

  const xpEarned = (isSuccess ? 100 : 30) + discoveredClueIds.length * 20;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-fade-in">
      {/* Top Rubber Stamp & Outcome Header */}
      <div className="text-center space-y-3">
        <div>
          {isSuccess ? (
            <span className="detective-stamp stamp-solved text-sm sm:text-base mb-2">
              CASE CLOSED // SCAM DEFUSED
            </span>
          ) : (
            <span className="detective-stamp stamp-danger text-sm sm:text-base mb-2">
              CASE CLOSED // LESSON LEARNED
            </span>
          )}
        </div>

        <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">
          {isSuccess ? 'Masterful Sleuthing!' : 'Investigation Debrief'}
        </h1>

        <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto">
          {isSuccess
            ? `You spotted the warning signs in ${currentCase.title} and made a safe, defensive call.`
            : `You experienced how scammers use pressure and tricks in ${currentCase.title}. Review the anatomy below to become harder to fool next time.`}
        </p>

        {/* XP Award Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C2541] border border-[#3A506B]/50 text-xs font-mono text-[#F59E0B]">
          <Award className="w-4 h-4 text-[#F59E0B]" />
          <span>+{xpEarned} Detective XP Earned</span>
        </div>
      </div>

      {/* Memorable Practical Takeaway Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1C2541] to-[#151F38] border border-[#F59E0B]/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#F59E0B] tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>Key Habit to Remember</span>
        </div>
        <p className="font-heading text-lg sm:text-xl font-bold text-white leading-snug">
          "{currentCase.practicalTakeaway}"
        </p>
      </div>

      {/* Clues Anatomy Breakdown (One by One) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <h3 className="font-heading text-lg font-bold text-white">
            Clue Breakdown ({currentCase.clues.length} Warning Signs)
          </h3>
          <span className="text-xs font-mono text-[#94A3B8]">
            {discoveredClueIds.length} of {currentCase.clues.length} spotted by you
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentCase.clues.map((clue, idx) => {
            const wasFound = discoveredClueIds.includes(clue.id);

            return (
              <div
                key={clue.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  wasFound
                    ? 'bg-[#131E3A] border-[#10B981]/40'
                    : 'bg-[#0B132B] border-[#1E293B]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1C2541] border border-[#3A506B]/50 font-mono text-xs font-bold flex items-center justify-center text-[#F59E0B]">
                      0{idx + 1}
                    </span>
                    <h4 className="font-heading text-base font-bold text-white">
                      {clue.label}
                    </h4>
                  </div>

                  {wasFound ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30">
                      ✓ Spotted in Message
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#94A3B8] bg-[#1C2541]">
                      Missed Clue
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono bg-[#0B132B] border border-[#1E293B] px-3 py-1.5 rounded-lg text-amber-300 italic mb-2">
                  "{clue.textSnippet}"
                </div>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {clue.explanation}
                </p>

                <div className="mt-3 pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B]">
                  <span>Category: {clue.category}</span>
                  <span className="text-white">Badge: {clue.skillBadge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidence Check: Which clue influenced your decision most? */}
      <div className="p-6 rounded-2xl bg-[#131E3A] border border-[#1E293B] space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#F59E0B]" />
          <div>
            <h4 className="font-heading text-base font-bold text-white">
              Detective Reflection Check
            </h4>
            <p className="text-xs text-[#94A3B8]">
              {currentCase.confidenceFollowup.question}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {currentCase.confidenceFollowup.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedConfidenceClue(opt.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedConfidenceClue === opt.id
                  ? 'bg-[#1C2541] border-[#F59E0B] text-white shadow-xs'
                  : 'bg-[#0B132B] border-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#152238]'
              }`}
            >
              <div className="font-semibold text-white mb-1">
                {opt.text}
              </div>
              {selectedConfidenceClue === opt.id && (
                <p className="text-amber-300 text-[11px] pt-1 border-t border-[#3A506B]/50 leading-relaxed">
                  <strong>Habit Insight:</strong> {opt.habitInsight}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Earned Strip */}
      <div className="p-5 rounded-2xl bg-[#131E3A] border border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-white">
              Detective Skill Badges Practiced
            </h4>
            <p className="text-xs text-[#94A3B8]">
              {badgesEarned.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions: View Case Report / Replay / Next Case */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1E293B]">
        <button
          type="button"
          onClick={onReplay}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#3A506B]/50 text-[#94A3B8] hover:text-white hover:bg-[#1C2541] text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay This Case</span>
        </button>

        <button
          type="button"
          onClick={() => onFinishCase(selectedConfidenceClue || undefined)}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.98] text-[#0B132B] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>View Case Report & Return</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

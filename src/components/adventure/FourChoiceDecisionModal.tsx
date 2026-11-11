import React, { useEffect } from 'react';
import { Zap, HelpCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { AdventureLevel, DecisionOption } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface FourChoiceDecisionModalProps {
  level: AdventureLevel;
  onSelectOption: (option: DecisionOption) => void;
  onCancel: () => void;
}

export const FourChoiceDecisionModal: React.FC<FourChoiceDecisionModalProps> = ({
  level,
  onSelectOption,
  onCancel,
}) => {
  useEffect(() => {
    soundEngine.playDecisionPrompt();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') onSelectOption(level.decisionOptions[0]);
      if (e.key === '2') onSelectOption(level.decisionOptions[1]);
      if (e.key === '3') onSelectOption(level.decisionOptions[2]);
      if (e.key === '4') onSelectOption(level.decisionOptions[3]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [level, onSelectOption]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081426]/90 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-2xl bg-[#081426] border-2 border-[#39BDF7]/60 rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(2,6,23,0.95),0_0_40px_rgba(57,189,247,0.2)] relative text-[#F2F5FA] space-y-6">
        {/* Header */}
        <div className="space-y-1.5 pb-4 border-b border-[#39BDF7]/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F05A9D] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#F05A9D] uppercase tracking-widest">
                {level.act || level.levelNumber} · {level.title}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#F05A9D]/15 border border-[#F05A9D]/40 font-mono text-[10px] text-[#F05A9D] font-bold uppercase">
              CHAPTER 3 · 4 CHOICES
            </span>
          </div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-[#F2F5FA] leading-tight">
            {level.decisionPrompt}
          </h2>
          <p className="text-xs sm:text-sm text-[#CBD5E1] font-medium leading-relaxed">
            {level.decisionContext}
          </p>
        </div>

        {/* The Four Choices (A, B, C, D) */}
        <div className="space-y-3">
          {level.decisionOptions.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOption(opt)}
                className="w-full text-left p-4 rounded-2xl bg-[#0B1A33] hover:bg-[#122347] border-2 border-[#39BDF7]/20 hover:border-[#39BDF7] hover:shadow-[0_0_22px_rgba(57,189,247,0.25)] transition-all flex items-start gap-3.5 group cursor-pointer active:scale-[0.99]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#081426] border border-[#F05A9D]/40 group-hover:border-[#39BDF7] group-hover:bg-[#39BDF7] group-hover:text-[#081426] text-[#F05A9D] font-heading font-black text-xs flex items-center justify-center shrink-0 transition-colors">
                  {letter}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="font-heading font-bold text-xs sm:text-sm text-[#F2F5FA] group-hover:text-[#39BDF7] transition-colors leading-snug">
                    {opt.text}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#39BDF7] shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>

        {/* Footer info & shortcut guide */}
        <div className="flex items-center justify-between pt-2 border-t border-[#39BDF7]/20 text-xs font-mono text-slate-400">
          <span>
            Press keys <strong className="text-[#F05A9D]">1 - 4</strong> to select
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#38BDF8] hover:text-white underline cursor-pointer"
          >
            Review Evidence in World
          </button>
        </div>
      </div>
    </div>
  );
};

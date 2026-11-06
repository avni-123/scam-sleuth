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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-2xl bg-[#091124] border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.3)] relative text-white space-y-6">
        {/* Header */}
        <div className="space-y-1.5 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {level.act || level.levelNumber} · {level.title}
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
              4 CHOICES
            </span>
          </div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-white leading-tight">
            {level.decisionPrompt}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-medium leading-relaxed">
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
                className="w-full text-left p-4 rounded-2xl bg-[#0E1A38] hover:bg-[#162752] border-2 border-[#1E293B] hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all flex items-start gap-3.5 group cursor-pointer active:scale-[0.99]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#070D1E] border border-white/10 group-hover:border-[#00F0FF] group-hover:bg-[#00F0FF] group-hover:text-[#070D1E] text-white font-heading font-black text-xs flex items-center justify-center shrink-0 transition-colors">
                  {letter}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {opt.text}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-white shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>

        {/* Footer info & shortcut guide */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-[#64748B]">
          <span>Press keys <strong className="text-white">1 - 4</strong> to select</span>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#94A3B8] hover:text-white underline cursor-pointer"
          >
            Review Evidence in World
          </button>
        </div>
      </div>
    </div>
  );
};

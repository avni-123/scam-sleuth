import React, { useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  ShieldX,
  Lightbulb,
} from 'lucide-react';
import { DecisionOption } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface ConsequenceModalProps {
  option: DecisionOption;
  onRetry: () => void;
  onContinue: () => void;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  option,
  onRetry,
  onContinue,
}) => {
  useEffect(() => {
    if (option.isSafe) {
      soundEngine.playSafeSuccess();
    } else {
      soundEngine.playUnsafeAlert();
    }
  }, [option.isSafe]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div
        className={`w-full max-w-xl bg-[#091124] border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white space-y-6 ${
          option.isSafe
            ? 'border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.3)]'
            : 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* Outcome Header Banner */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              option.isSafe
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {option.isSafe ? (
              <ShieldCheck className="w-7 h-7" />
            ) : (
              <ShieldX className="w-7 h-7" />
            )}
          </div>

          <div>
            <span
              className={`font-mono text-xs font-bold uppercase tracking-wider block ${
                option.isSafe ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {option.isSafe ? '★ SAFE DECISION VERIFIED' : '⚠ CRITICAL SECURITY RISK TRIGGERED'}
            </span>
            <h2 className="font-heading font-black text-lg sm:text-xl text-white">
              {option.isSafe ? 'Threat Successfully Neutralized' : 'Fell into the Scammer’s Trap'}
            </h2>
          </div>
        </div>

        {/* Narrative Consequence Story */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#050A18] border border-white/10 space-y-2">
          <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider block">
            STORY OUTCOME // WHAT HAPPENED NEXT
          </span>
          <p className="text-sm sm:text-base text-[#F1F5F9] font-medium leading-relaxed">
            {option.consequenceStory}
          </p>
        </div>

        {/* Diagnostic Explanation of Warning Sign */}
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
            option.isSafe
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase">
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>{option.isSafe ? 'Why This Worked' : 'The Clue You Missed'}</span>
          </div>
          <p className="leading-relaxed pl-6 font-medium">
            {option.warningSignExplanation}
          </p>
        </div>

        {/* Practical Habit Pill */}
        <div className="p-3.5 rounded-xl bg-[#0D1836] border border-[#1E293B] flex items-start gap-2.5 text-xs text-[#CBD5E1]">
          <span className="font-bold text-[#00F0FF] uppercase shrink-0 font-mono">
            Cyber Habit:
          </span>
          <span>{option.habitInsight}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {!option.isSafe ? (
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-[#94A3B8] font-mono">
                Preserving collected clues...
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-[#070D1E] font-heading font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY THIS MOMENT</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-[0.98] text-[#070D1E] font-heading font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>CONTINUE TO LEVEL DEBRIEF</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

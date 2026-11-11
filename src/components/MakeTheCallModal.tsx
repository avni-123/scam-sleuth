import React, { useState } from 'react';
import { DetectiveCase, ActionOption } from '../types/game.ts';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  X,
  CheckCircle,
} from 'lucide-react';

interface MakeTheCallModalProps {
  currentCase: DetectiveCase;
  selectedClueCount: number;
  totalClues: number;
  onConfirmDecision: (option: ActionOption) => void;
  onClose: () => void;
}

export const MakeTheCallModal: React.FC<MakeTheCallModalProps> = ({
  currentCase,
  selectedClueCount,
  totalClues,
  onConfirmDecision,
  onClose,
}) => {
  const handleSelect = (opt: ActionOption) => {
    onConfirmDecision(opt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081426]/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#081426] border border-[#39BDF7]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#F2F5FA]">
        {/* Top Modal Header */}
        <div className="sticky top-0 bg-[#081426]/95 backdrop-blur-md border-b border-[#39BDF7]/20 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B1A33] border border-[#F05A9D]/40 flex items-center justify-center text-[#F05A9D]">
              <ShieldAlert className="w-4 h-4 text-[#F05A9D]" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#F2F5FA]">
                Make the Call
              </h3>
              <span className="text-xs font-mono text-[#F2F5FA]/70">
                {currentCase.caseNumber} · {selectedClueCount} of {totalClues} clues gathered
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F2F5FA]/70 hover:text-white hover:bg-[#0B1A33] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-heading text-lg font-bold text-[#F2F5FA] mb-1">
                What should the citizen do next?
              </h4>
              <p className="text-xs text-[#F2F5FA]/80 leading-relaxed">
                Choose the best action. Your decision will immediately trigger an animated story outcome showing the consequences of this move.
              </p>
            </div>

            <div className="space-y-3">
              {currentCase.actionOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left p-4 rounded-2xl bg-[#0B1A33] hover:bg-[#0E223D] border border-[#39BDF7]/25 hover:border-[#F05A9D]/70 transition-all group flex items-start justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#F2F5FA] group-hover:text-[#39BDF7] transition-colors block">
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#F2F5FA]/70 leading-snug">
                      {opt.description}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#39BDF7] group-hover:text-[#F05A9D] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

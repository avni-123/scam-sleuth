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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131E3A] border border-[#3A506B]/60 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#E2E8F0]">
        {/* Top Modal Header */}
        <div className="sticky top-0 bg-[#131E3A]/95 backdrop-blur-md border-b border-[#1E293B] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C2541] border border-[#3A506B]/50 flex items-center justify-center text-[#F59E0B]">
              <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Make the Call
              </h3>
              <span className="text-xs font-mono text-[#94A3B8]">
                {currentCase.caseNumber} · {selectedClueCount} of {totalClues} clues gathered
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1C2541] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-heading text-lg font-bold text-white mb-1">
                What should the citizen do next?
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Choose the best action. Your decision will immediately trigger an animated story outcome showing the consequences of this move.
              </p>
            </div>

            <div className="space-y-3">
              {currentCase.actionOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left p-4 rounded-2xl bg-[#1C2541] hover:bg-[#233054] border border-[#3A506B]/50 hover:border-[#00F0FF]/60 transition-all group flex items-start justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-white group-hover:text-[#00F0FF] transition-colors block">
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-snug">
                      {opt.description}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#00F0FF] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

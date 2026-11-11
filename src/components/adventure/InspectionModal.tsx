import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Laptop,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { InspectionData } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface InspectionModalProps {
  data: InspectionData;
  isAlreadyCollected: boolean;
  onDismiss: () => void;
  onContinueInvestigation: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  data,
  isAlreadyCollected,
  onDismiss,
  onContinueInvestigation,
}) => {
  // Highlight important details only when inspected via the magnifier toggle or clicking the evidence
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(isAlreadyCollected);
  const [hasHighlighted, setHasHighlighted] = useState<boolean>(isAlreadyCollected);

  const isClueHighlighted = isMagnifierActive || hasHighlighted || isAlreadyCollected;

  useEffect(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }

    if (data.itemType === 'phone') {
      soundEngine.playTactilePhoneBuzz();
    }

    const timer = setTimeout(() => {
      if (document.pointerLockElement) {
        document.exitPointerLock?.();
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data.itemType, onDismiss]);

  const getIcon = () => {
    switch (data.itemType) {
      case 'phone':
        return <Smartphone className="w-5 h-5 text-[#00F0FF]" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-[#38BDF8]" />;
      case 'document':
      case 'board':
        return <FileText className="w-5 h-5 text-pink-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-[#00F0FF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081426]/90 backdrop-blur-md animate-fade-in pointer-events-auto cursor-default select-text">
      <div className="w-full max-w-xl pixel-panel border-4 border-[#0D1C34] p-5 sm:p-7 shadow-[0_24px_64px_rgba(2,6,23,0.95),0_0_35px_rgba(57,189,247,0.25)] relative text-[#F2F5FA] space-y-4 rounded-none animate-block-reveal">
        {/* Pixel Corner Pins */}
        <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#39BDF7]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F05A9D]" />
        <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F05A9D]" />
        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#39BDF7]" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-[#1B2F4D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#39BDF7]/40 bg-[#091D3B] flex items-center justify-center rounded-none shrink-0 shadow-[inset_1px_1px_0_0_#93E2FE]">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[9.5px] text-[#F05A9D] uppercase tracking-wider">
                  EVIDENCE INSPECTION
                </span>
                {isAlreadyCollected && (
                  <span className="text-[8.5px] font-pixel bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-none uppercase">
                    CLUE LOGGED ✓
                  </span>
                )}
              </div>
              <h2 className="font-pixel text-sm sm:text-base text-white mt-0.5">
                {data.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="pixel-btn p-1.5 text-[#94A3B8] hover:text-white cursor-pointer rounded-none"
            title="Close without logging clue (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source & Timestamp Meta (Fictional Safe Details) */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3 bg-[#060D1A] border-2 border-[#102344] rounded-none">
          <div>
            <span className="text-[#94A3B8] block text-[9px] font-pixel uppercase">Sender / Source</span>
            <span className="text-white font-semibold truncate block mt-0.5">{data.senderOrSource}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[9px] font-pixel uppercase">Timestamp</span>
            <span className="text-slate-300 block mt-0.5">{data.timestamp}</span>
          </div>
        </div>

        {/* Interactive Magnifier Toggle Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#09162C] border-2 border-[#152B4D] text-xs rounded-none">
          <span className="font-sans text-xs text-slate-200">
            Use the magnifier to highlight suspicious details in the message:
          </span>
          <button
            type="button"
            onClick={() => {
              soundEngine.playDialogueBlip();
              setIsMagnifierActive((prev) => {
                const next = !prev;
                if (next) setHasHighlighted(true);
                return next;
              });
            }}
            className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              isMagnifierActive
                ? 'bg-pink-500 text-white border border-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.45)]'
                : 'bg-[#00F0FF]/15 text-[#00F0FF] hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isMagnifierActive ? 'Magnifier Active' : 'Inspect Details'}</span>
          </button>
        </div>

        {/* Inspected Content Body (Fictional Evidence Preview) */}
        <div className="rounded-2xl bg-[#040814] border-2 border-sky-500/25 overflow-hidden shadow-2xl font-mono text-xs">
          <div className="px-4 py-2 bg-[#081126] border-b border-sky-500/20 flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-bold text-white">
              {data.itemType === 'phone'
                ? 'Fictional Text Message Preview'
                : data.itemType === 'laptop'
                ? 'Fictional Browser Preview'
                : 'Reference Document'}
            </span>
            <span className="text-pink-300 font-semibold">SAFE SIMULATION</span>
          </div>

          <div
            onClick={() => {
              if (!isMagnifierActive) {
                soundEngine.playClueFound();
                setIsMagnifierActive(true);
                setHasHighlighted(true);
              }
            }}
            className={`p-4 sm:p-5 text-slate-100 leading-relaxed whitespace-pre-wrap bg-gradient-to-b from-[#0B1530] to-[#050A18] relative transition-all cursor-pointer ${
              isMagnifierActive ? 'ring-2 ring-pink-400/70' : ''
            }`}
          >
            <div className="text-sm font-medium leading-relaxed text-[#F8FAFC]">{data.content}</div>

            {/* Highlighted Clue Detail when Magnifier is active (Vivid Magenta / Soft Rose) */}
            {isMagnifierActive ? (
              <div className="mt-4 p-3.5 rounded-xl bg-pink-500/18 border-2 border-pink-400 text-pink-100 text-xs flex items-start gap-2.5 shadow-[0_0_22px_rgba(236,72,153,0.28)] animate-fade-in">
                <div className="p-1.5 rounded-lg bg-pink-500 text-white shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-pink-300 block text-xs uppercase tracking-wider">
                    Highlighted Clue
                  </span>
                  <span className="text-xs leading-relaxed block text-white">
                    {data.suspiciousDetail}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-2.5 border-t border-sky-500/20 flex items-center gap-2 text-pink-300 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Click message or “Inspect Details” to highlight the key clue.</span>
              </div>
            )}
          </div>
        </div>

        {/* Clue Summary Notice */}
        {isClueHighlighted ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/35 text-xs text-emerald-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Evidence Clue:</strong> {data.evidenceClue}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A1329]/80 border border-dashed border-pink-400/35 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-pink-400 shrink-0" />
              <span>
                Click the message or <strong className="text-white">“Inspect Details”</strong> to reveal and analyze the clue.
              </span>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-sky-500/20 gap-3">
          <div className="text-xs">
            {!isClueHighlighted ? (
              <span className="text-pink-300 font-mono text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                Highlight clue to enable Continue
              </span>
            ) : (
              <span className="text-emerald-300 font-mono text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Clue analyzed & ready to log
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!isClueHighlighted}
            onClick={() => {
              if (isClueHighlighted) {
                onContinueInvestigation();
              }
            }}
            className={`px-5 py-2.5 font-pixel text-xs transition-all flex items-center gap-2 rounded-none uppercase ${
              isClueHighlighted
                ? 'pixel-btn-action text-[#081426] cursor-pointer shadow-[0_0_20px_rgba(57,189,247,0.4)]'
                : 'bg-[#0B1530] border-2 border-slate-700/60 text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title={isClueHighlighted ? 'Log clue and continue' : 'Highlight the clue above first'}
          >
            <span>LOG CLUE & CONTINUE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

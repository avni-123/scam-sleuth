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
        return <FileText className="w-5 h-5 text-amber-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-[#00F0FF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto cursor-default select-text">
      <div className="w-full max-w-xl bg-[#091124] border-2 border-[#00F0FF]/70 rounded-3xl p-6 sm:p-7 shadow-[0_0_35px_rgba(0,240,255,0.25)] relative text-white space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase tracking-widest">
                  EVIDENCE INSPECTION
                </span>
                {isAlreadyCollected && (
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded uppercase">
                    CLUE LOGGED ✓
                  </span>
                )}
              </div>
              <h2 className="font-heading font-black text-base sm:text-lg text-white">
                {data.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close without logging clue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source & Timestamp Meta (Fictional Safe Details) */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3 rounded-2xl bg-[#050A18] border border-white/10">
          <div>
            <span className="text-[#94A3B8] block text-[10px] uppercase">Fictional Sender / Source</span>
            <span className="text-white font-semibold truncate block">{data.senderOrSource}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[10px] uppercase">Timestamp</span>
            <span className="text-slate-300 block">{data.timestamp}</span>
          </div>
        </div>

        {/* Interactive Magnifier Toggle Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0E1A38] border border-white/10 text-xs">
          <span className="font-mono text-xs text-slate-200">
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
                ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-[#00F0FF]/15 text-[#00F0FF] hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isMagnifierActive ? 'Magnifier Active' : 'Inspect Details'}</span>
          </button>
        </div>

        {/* Inspected Content Body (Fictional Evidence Preview) */}
        <div className="rounded-2xl bg-[#030712] border-2 border-slate-700 overflow-hidden shadow-2xl font-mono text-xs">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-bold text-white">
              {data.itemType === 'phone'
                ? 'Fictional Text Message Preview'
                : data.itemType === 'laptop'
                ? 'Fictional Browser Preview'
                : 'Reference Document'}
            </span>
            <span className="text-amber-300">SAFE SIMULATION</span>
          </div>

          <div
            onClick={() => {
              if (!isMagnifierActive) {
                soundEngine.playClueFound();
                setIsMagnifierActive(true);
                setHasHighlighted(true);
              }
            }}
            className={`p-4 sm:p-5 text-slate-100 leading-relaxed whitespace-pre-wrap bg-gradient-to-b from-[#0B1528] to-[#040914] relative transition-all cursor-pointer ${
              isMagnifierActive ? 'ring-2 ring-amber-400/60' : ''
            }`}
          >
            <div className="text-sm font-medium leading-relaxed">{data.content}</div>

            {/* Highlighted Clue Detail when Magnifier is active */}
            {isMagnifierActive ? (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-100 text-xs flex items-start gap-2.5 shadow-[0_0_20px_rgba(245,158,11,0.25)] animate-fade-in">
                <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-amber-300 block text-xs uppercase tracking-wider">
                    Highlighted Clue
                  </span>
                  <span className="text-xs leading-relaxed block text-white">
                    {data.suspiciousDetail}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-amber-300 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Click message or “Inspect Details” to highlight the key clue.</span>
              </div>
            )}
          </div>
        </div>

        {/* Clue Summary Notice */}
        {isClueHighlighted ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Evidence Clue:</strong> {data.evidenceClue}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400/80 shrink-0" />
              <span>
                Click the message or <strong>“Inspect Details”</strong> to reveal and analyze the clue.
              </span>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-3">
          <div className="text-xs">
            {!isClueHighlighted ? (
              <span className="text-amber-300/90 font-mono text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Highlight clue to enable Continue
              </span>
            ) : (
              <span className="text-emerald-300/90 font-mono text-[11px] flex items-center gap-1.5">
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
            className={`px-5 py-2.5 rounded-xl font-heading text-xs transition-all flex items-center gap-2 ${
              isClueHighlighted
                ? 'bg-[#00F0FF] hover:bg-[#38BDF8] active:scale-[0.98] text-[#070D1E] font-black cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                : 'bg-slate-800/80 border border-slate-700/60 text-slate-500 font-bold cursor-not-allowed opacity-60'
            }`}
            title={isClueHighlighted ? 'Log clue and continue' : 'Highlight the clue above first'}
          >
            <span>Continue Investigating</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

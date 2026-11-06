import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Volume2 } from 'lucide-react';
import { NpcDef, GameSettings } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface DialogueOverlayProps {
  npc: NpcDef;
  onClose: () => void;
  onTriggerDecision?: () => void;
  showDecisionAction?: boolean;
  settings?: GameSettings;
  onUpdateSettings?: (settings: Partial<GameSettings>) => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  npc,
  onClose,
  onTriggerDecision,
  showDecisionAction = false,
  settings,
  onUpdateSettings,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(npc.dialogue[0]?.id || '');
  const currentNode = npc.dialogue.find((d) => d.id === currentNodeId) || npc.dialogue[0];
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Play spoken voice audio for current speaker (character or investigator)
  const playCurrentSpeakerVoice = () => {
    if (!currentNode) return;
    setIsSpeaking(true);
    soundEngine.speakDialogueAudio(currentNode.speaker, currentNode.text, () => {
      setIsSpeaking(false);
    });
  };

  const handleNext = () => {
    soundEngine.stopDialogueAudio();
    setIsSpeaking(false);
    soundEngine.playDialogueBlip();
    if (currentNode?.nextId) {
      setCurrentNodeId(currentNode.nextId);
    } else {
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (
        e.code === 'Space' ||
        e.code === 'Enter' ||
        e.code === 'KeyT' ||
        e.code === 'KeyE'
      ) {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        // M key to replay voice audio manually
        e.preventDefault();
        playCurrentSpeakerVoice();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        soundEngine.stopDialogueAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Whenever a dialogue line changes: play the character or investigator voice audio
  useEffect(() => {
    if (!currentNode) return;
    soundEngine.stopDialogueAudio();
    setIsSpeaking(false);
    playCurrentSpeakerVoice();

    return () => {
      soundEngine.stopDialogueAudio();
      setIsSpeaking(false);
    };
  }, [currentNodeId]);

  if (!currentNode) return null;

  const isDetective =
    currentNode.speaker.toLowerCase().includes('detective') ||
    currentNode.speaker.toLowerCase().includes('you') ||
    currentNode.speaker.toLowerCase().includes('investigator');

  // Dynamic subtitle typography and background opacity according to settings
  const subtitleSizeClass =
    settings?.subtitleSize === 'extra-large'
      ? 'text-xl sm:text-2xl font-bold'
      : settings?.subtitleSize === 'large'
      ? 'text-lg sm:text-xl font-medium'
      : 'text-base sm:text-lg font-medium';

  const subtitleOpacityClass =
    settings?.subtitleOpacity === 'solid'
      ? 'bg-[#030712] border-white/30'
      : settings?.subtitleOpacity === 'translucent'
      ? 'bg-[#030712]/75 backdrop-blur-md border-white/15'
      : 'bg-[#030712]/92 backdrop-blur-xl border-white/20';

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end pointer-events-auto select-none">
      {/* Cinematic Vignette & Gentle Depth-of-Field Overlay (leaves upper character face clear) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15 backdrop-blur-[1.5px] pointer-events-none transition-all duration-300"
        aria-hidden="true"
      />

      {/* Cinematic Lower-Third Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-6 sm:pb-8 animate-fade-in">
        <div className={`w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${subtitleOpacityClass} shadow-[0_12px_45px_rgba(0,0,0,0.85)] transition-all duration-200`}>
          {/* Top Bar: Speaker Badge, Role Tag, Voice Audio Trigger & Manual Button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-heading font-black tracking-wide uppercase shadow-sm ${
                  isDetective
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                }`}
              >
                {currentNode.speaker}
              </span>

              <span className="font-mono text-[11px] text-slate-400 hidden sm:inline truncate">
                {currentNode.role || npc.role}
              </span>
            </div>

            {/* Quick Controls: Manual Replay Voice & Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playDialogueBlip();
                  playCurrentSpeakerVoice();
                }}
                className="p-1.5 px-3 rounded-lg border border-amber-300/60 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                title="Replay character/investigator voice audio (M)"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Manual</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.stopDialogueAudio();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close dialogue (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Spoken Subtitle Line */}
          <div className="min-h-[70px] py-3 flex items-center">
            <p className={`text-white ${subtitleSizeClass} leading-relaxed tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]`}>
              &ldquo;{currentNode.text}&rdquo;
            </p>
          </div>

          {/* Bottom Action Row: Keystroke hint & Next button */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
            <span className="text-xs font-mono text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">Space</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#00F0FF] font-bold">T</kbd> to continue
              {' · '}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold">M</kbd> replay voice
            </span>

            <div className="flex items-center gap-2">
              {showDecisionAction && onTriggerDecision && (
                <button
                  type="button"
                  onClick={onTriggerDecision}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-black text-xs transition-all cursor-pointer shadow-md"
                >
                  Make Case Decision
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] active:scale-[0.98] text-[#070D1E] font-heading font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span>{currentNode.nextId ? 'NEXT' : 'RESUME INVESTIGATION'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

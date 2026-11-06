import React, { useState, useEffect } from 'react';
import {
  DetectiveCase,
  Clue,
  MessageSegment,
} from '../types/game.ts';
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Shield,
  Smartphone,
  Mail,
  Store,
  PhoneCall,
  Pin,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle as QuestionIcon,
  UserCheck,
  Coins,
  PauseCircle,
  Link as LinkIcon,
  RotateCcw,
  MousePointerClick,
  GripVertical,
} from 'lucide-react';
import {
  playAudioFx,
  BOARD_QUESTIONS,
  BoardQuestionId,
  PuzzleCategory,
  getCluePuzzleMeta,
  CluePuzzleMeta,
  CHIEF_INSPECTOR_NOVA,
} from '../data/neonWorldData.ts';

interface InvestigationDeskProps {
  currentCase: DetectiveCase;
  onBack: () => void;
  onMakeTheCall: (selectedClueIds: string[]) => void;
}

export const InvestigationDesk: React.FC<InvestigationDeskProps> = ({
  currentCase,
  onBack,
  onMakeTheCall,
}) => {
  // Clues that have been successfully discovered via the 4-step observation sheet
  const [discoveredClueIds, setDiscoveredClueIds] = useState<string[]>([]);
  
  // Connections made on the Case Board: questionId ('who' | 'what' | 'action') -> clueId
  const [connections, setConnections] = useState<Partial<Record<BoardQuestionId, string>>>({});
  
  // Active inspection modal when player taps a message segment
  const [inspectingSegment, setInspectingSegment] = useState<{
    segment: MessageSegment;
    clue: Clue;
    meta: CluePuzzleMeta;
  } | null>(null);

  // Wrong guess feedback inside inspection modal
  const [inspectionFeedback, setInspectionFeedback] = useState<string | null>(null);

  // Ordinary (non-clue) gentle feedback
  const [neutralFeedback, setNeutralFeedback] = useState<string | null>(null);

  // Selection for tap-to-connect alternative to drag & drop
  const [selectedClueForConnect, setSelectedClueForConnect] = useState<string | null>(null);

  // Connection feedback (e.g. if player mismatched a clue to a board question)
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Magnifier Tool
  const [magnifierMode, setMagnifierMode] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Active detective hint index
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const totalClues = currentCase.clues.length;
  const foundCount = discoveredClueIds.length;
  const connectedCount = Object.keys(connections).length;
  const allConnected = connectedCount >= 3;

  // Clear connection error after 4 seconds
  useEffect(() => {
    if (connectionError) {
      const timer = setTimeout(() => setConnectionError(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [connectionError]);

  // Handle clicking a segment in the simulated message
  const handleSegmentClick = (segment: MessageSegment) => {
    setNeutralFeedback(null);
    setConnectionError(null);

    if (segment.clueId) {
      const clue = currentCase.clues.find((c) => c.id === segment.clueId);
      if (!clue) return;

      if (discoveredClueIds.includes(segment.clueId)) {
        // Already discovered: select it for connecting to case board
        setSelectedClueForConnect(segment.clueId);
        playAudioFx('clue');
        return;
      }

      // Step 1: Open Discovery Inspection Sheet
      const meta = getCluePuzzleMeta(clue.id, segment.text);
      setInspectingSegment({ segment, clue, meta });
      setInspectionFeedback(null);
      playAudioFx('clue');
    } else {
      // Step: Ordinary detail tapped -> show gentle encouragement
      playAudioFx('error');
      setNeutralFeedback(
        'That detail alone isn’t a warning sign. Look for something that creates pressure or asks you to take a risky action!'
      );
    }
  };

  // Player selects what the tapped detail means (Step 3 of discovery)
  const handleChooseCategory = (chosenCat: PuzzleCategory) => {
    if (!inspectingSegment) return;

    if (chosenCat === inspectingSegment.meta.category) {
      // Correct classification!
      playAudioFx('connect');
      setDiscoveredClueIds((prev) => Array.from(new Set([...prev, inspectingSegment.clue.id])));
      // Select it automatically so player can directly slot it into the Case Board
      setSelectedClueForConnect(inspectingSegment.clue.id);
      setInspectingSegment(null);
      setInspectionFeedback(null);
    } else {
      // Incorrect classification: explain why gently without shaming
      playAudioFx('error');
      let tip = 'Not quite. Check whether this detail is creating artificial urgency, hiding sender identity, or asking for money/codes.';
      if (inspectingSegment.meta.category === 'sender') {
        tip = 'Notice how this detail relates to the web address, sender handle, or unverified contact identity.';
      } else if (inspectingSegment.meta.category === 'payment') {
        tip = 'Notice how this detail asks for a payment, credit card fee, gift card code, or 2FA passcode.';
      } else if (inspectingSegment.meta.category === 'pressure') {
        tip = 'Notice how this detail sets an urgent countdown or threat to force you to act without thinking.';
      }
      setInspectionFeedback(tip);
    }
  };

  // Connect a clue to a Board Question Slot (supports Drag & Drop AND Tap to Connect)
  const handleConnectClueToQuestion = (clueId: string, questionId: BoardQuestionId) => {
    const clue = currentCase.clues.find((c) => c.id === clueId);
    if (!clue) return;

    const meta = getCluePuzzleMeta(clue.id, clue.textSnippet);
    const targetDef = BOARD_QUESTIONS.find((q) => q.id === questionId);

    if (meta.questionId === questionId) {
      // Match successful!
      playAudioFx('connect');
      setConnections((prev) => ({
        ...prev,
        [questionId]: clueId,
      }));
      setConnectionError(null);
      setSelectedClueForConnect(null);
    } else {
      // Mismatch: explain encouragingly
      playAudioFx('error');
      let explain = `This clue doesn't quite answer "${targetDef?.question}".`;
      if (meta.questionId === 'who') {
        explain = `This clue points out who is behind the transmission (sender/link identity). Try connecting it to "Who sent this?".`;
      } else if (meta.questionId === 'what') {
        explain = `This clue reveals what the scammer is requesting (money, fee, code). Try connecting it to "What do they want?".`;
      } else if (meta.questionId === 'action') {
        explain = `This clue reveals an artificial pressure tactic. Try connecting it to "What should I do?".`;
      }
      setConnectionError(explain);
    }
  };

  // Disconnect a clue from a slot
  const handleRemoveConnection = (questionId: BoardQuestionId) => {
    playAudioFx('clue');
    setConnections((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // HTML5 Drag and drop helpers
  const handleDragStart = (e: React.DragEvent, clueId: string) => {
    e.dataTransfer.setData('text/plain', clueId);
    setSelectedClueForConnect(clueId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, questionId: BoardQuestionId) => {
    e.preventDefault();
    const clueId = e.dataTransfer.getData('text/plain') || selectedClueForConnect;
    if (clueId) {
      handleConnectClueToQuestion(clueId, questionId);
    }
  };

  // Current puzzle step message
  const getPuzzleGuidance = () => {
    if (allConnected) {
      return {
        step: 'Step 3: Solve the Case',
        instruction: 'Case puzzle solved! All three questions answered. You are ready to make the safe call.',
        accent: 'text-emerald-400',
        border: 'border-emerald-500/50 bg-emerald-950/30',
      };
    }
    if (foundCount > connectedCount) {
      return {
        step: 'Step 2: Connect the Clues',
        instruction: 'Drag or tap a clue from your Clue Tray to match its question on the Case Board.',
        accent: 'text-[#00F0FF]',
        border: 'border-[#00F0FF]/40 bg-[#0C1B38]',
      };
    }
    return {
      step: 'Step 1: Inspect Message',
      instruction: 'Tap anything that feels suspicious: look for urgency threats, strange senders, or payment demands.',
      accent: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/40 bg-[#1A1828]',
    };
  };

  const guidance = getPuzzleGuidance();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[#131E3A] hover:bg-[#1C2541] text-[#94A3B8] hover:text-white border border-[#1E293B] transition-colors cursor-pointer"
            title="Return to City Map"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#00F0FF] tracking-wider uppercase">
                {currentCase.district || 'Cyber City'}
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="font-mono text-xs font-bold text-[#F59E0B] tracking-wider">
                {currentCase.caseNumber}
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-black text-white">
              {currentCase.title}
            </h1>
          </div>
        </div>

        {/* Puzzle Controls & Magnifier Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setMagnifierMode(!magnifierMode);
              playAudioFx('clue');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              magnifierMode
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-2 border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'bg-[#1C2541] text-[#94A3B8] border border-[#3A506B]/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Magnifier: {magnifierMode ? 'ON' : 'OFF'}</span>
          </button>

          <div className="bg-[#131E3A] border border-[#1E293B] px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono">
            <span className="text-[#94A3B8]">Connected:</span>
            <span className="font-bold text-white">
              {connectedCount} of 3
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeHintIndex === null) setActiveHintIndex(0);
              else setActiveHintIndex((activeHintIndex + 1) % currentCase.clues.length);
              playAudioFx('clue');
            }}
            className="px-3 py-1.5 bg-[#1C2541] hover:bg-[#233054] text-[#E2E8F0] border border-[#3A506B]/50 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Get a detective nudge"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Hint</span>
          </button>
        </div>
      </div>

      {/* Dynamic Action Guidance Banner (Keeps next action visible at all times) */}
      <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 shadow-lg transition-all ${guidance.border}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Zap className={`w-5 h-5 ${guidance.accent}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs font-bold uppercase tracking-wider ${guidance.accent}`}>
                {guidance.step}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
              {guidance.instruction}
            </p>
          </div>
        </div>

        {allConnected && (
          <button
            type="button"
            onClick={() => onMakeTheCall(discoveredClueIds)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 active:scale-[0.98] text-[#070D1E] font-heading font-black text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>MAKE THE CALL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Detective Hint Whisper Banner if active */}
      {activeHintIndex !== null && (
        <div className="p-3.5 bg-[#1C2541] border border-[#F59E0B]/40 rounded-xl flex items-center justify-between text-xs text-[#E2E8F0] shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span>
              <strong>Chief Inspector Nova:</strong> &ldquo;Inspect the message closely for{' '}
              <span className="text-[#F59E0B] font-semibold">
                {currentCase.clues[activeHintIndex].category.replace('_', ' ')}
              </span>{' '}
              warning signs. Look for phrasing like "{currentCase.clues[activeHintIndex].textSnippet.slice(0, 32)}..."&rdquo;
            </span>
          </div>
          <button
            onClick={() => setActiveHintIndex(null)}
            className="text-[#94A3B8] hover:text-white ml-2 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Connection Error Coach Banner if mismatch occurred */}
      {connectionError && (
        <div className="p-3.5 bg-amber-950/80 border border-amber-500/50 rounded-xl flex items-center justify-between text-xs text-amber-200 shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Case Connection Check:</strong> {connectionError}
            </span>
          </div>
          <button
            onClick={() => setConnectionError(null)}
            className="text-amber-300 hover:text-white ml-2 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          THE THREE-AREA PUZZLE LAYOUT
          Center: Fictional Message (Large & Readable)
          Left / Top: Clue Tray (Illustrated Cards)
          Right / Bottom: Case Board (3 Questions)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            AREA 1: THE CLUE TRAY (3 cols on desktop)
            Discovered clues land here as illustrated cards
        ===================================================================== */}
        <div className="lg:col-span-3 space-y-3 order-2 lg:order-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
            <span className="flex items-center gap-1.5 font-bold text-white uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Clue Tray</span>
            </span>
            <span>{foundCount} of {totalClues}</span>
          </div>

          <div className="bg-[#0D1832] border-2 border-[#1E293B] rounded-3xl p-4 space-y-3 min-h-[320px] shadow-xl">
            {discoveredClueIds.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-[#1E293B] rounded-2xl space-y-2.5">
                <Search className="w-7 h-7 mx-auto text-[#64748B]" />
                <h4 className="font-heading font-bold text-white text-xs">
                  Tray is empty
                </h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Tap suspicious words, links, or demands in the message to inspect and collect evidence cards here.
                </p>
              </div>
            ) : (
              discoveredClueIds.map((clueId) => {
                const clue = currentCase.clues.find((c) => c.id === clueId);
                if (!clue) return null;
                const meta = getCluePuzzleMeta(clue.id, clue.textSnippet);
                const isSelected = selectedClueForConnect === clue.id;
                const isConnected = Object.values(connections).includes(clue.id);

                return (
                  <div
                    key={clue.id}
                    draggable={!isConnected}
                    onDragStart={(e) => handleDragStart(e, clue.id)}
                    onClick={() => {
                      if (!isConnected) {
                        setSelectedClueForConnect(isSelected ? null : clue.id);
                        playAudioFx('clue');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all select-none relative group cursor-grab active:cursor-grabbing ${
                      isConnected
                        ? 'bg-[#0E223D]/60 border-emerald-500/40 opacity-75'
                        : isSelected
                        ? 'bg-[#182C58] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.35)] scale-[1.02]'
                        : 'bg-[#131E3A] border-[#3A506B]/50 hover:border-white/60 hover:bg-[#182648]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            meta.category === 'sender'
                              ? 'bg-[#00F0FF]'
                              : meta.category === 'payment'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#EC4899]'
                          }`}
                        />
                        <h4 className="font-heading text-xs font-bold text-white leading-tight">
                          {meta.shortLabel}
                        </h4>
                      </div>

                      {isConnected ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                          CONNECTED
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/30">
                          {isSelected ? 'TAP TARGET SLOT' : 'DRAG OR TAP'}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-mono text-[#CBD5E1] bg-[#070D1E] p-2 rounded-xl border border-white/5 line-clamp-2 italic mb-2">
                      &ldquo;{clue.textSnippet}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                      <span className="capitalize text-[#F59E0B]">{meta.category}</span>
                      <span>Target: {meta.questionId === 'who' ? 'Who?' : meta.questionId === 'what' ? 'What?' : 'Action'}</span>
                    </div>
                  </div>
                );
              })
            )}

            {discoveredClueIds.length > 0 && (
              <div className="pt-2 text-center">
                <span className="text-[10px] font-mono text-[#64748B]">
                  💡 Tip: Drag card to Case Board or tap card then tap question
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            AREA 2: THE FICTIONAL MESSAGE (Center: 5 cols on desktop)
            Large and readable simulated phone/email interface
        ===================================================================== */}
        <div className="lg:col-span-5 space-y-3 order-1 lg:order-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
            <span className="flex items-center gap-1.5 text-white font-bold uppercase">
              <Smartphone className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Incoming {currentCase.channel.toUpperCase()} Transmission</span>
            </span>
            <span className="text-[#00F0FF]">Tap suspicious text</span>
          </div>

          {/* Device Mockup Wrapper */}
          <div
            onMouseMove={(e) => {
              if (!magnifierMode) return;
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
            onMouseLeave={() => setMousePos(null)}
            className="bg-[#070D1E] border-2 border-[#1E293B] rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group min-h-[460px] flex flex-col justify-between"
          >
            {/* Cyber Magnifier Lens Reticle Floating Overlay */}
            {magnifierMode && mousePos && (
              <div
                className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] backdrop-brightness-125 transition-transform duration-75 hidden md:flex items-center justify-center"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: 110,
                  height: 110,
                  background:
                    'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(7, 13, 30, 0.25) 70%, rgba(0, 240, 255, 0.25) 100%)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                <span className="absolute -bottom-6 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#070D1E] text-[#00F0FF] border border-[#00F0FF]/40 uppercase tracking-widest whitespace-nowrap">
                  MAGNIFIER LENS
                </span>
              </div>
            )}

            {/* Top Phone / App Status Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4 text-xs font-mono text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300">SECURE INBOX SIMULATION</span>
              </div>
              <span>9:41 AM</span>
            </div>

            {/* Simulated Transmission Content according to channel */}
            <div className="space-y-4 my-auto">
              {/* Sender Details Banner */}
              <div className="p-3 rounded-2xl bg-[#111C38] border border-[#1E293B] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1C2541] border border-[#3A506B]/50 flex items-center justify-center font-mono font-bold text-white text-xs">
                    {currentCase.senderInfo.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-white block leading-tight">
                      {currentCase.senderInfo.name}
                    </span>
                    <span className="font-mono text-[11px] text-[#94A3B8] block">
                      {currentCase.senderInfo.handleOrEmail}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Unverified
                </span>
              </div>

              {/* Message Subject if email */}
              {currentCase.messageContent.subject && (
                <div className="p-2.5 rounded-xl bg-[#0F182E] border border-[#1E293B] text-xs">
                  <span className="text-[#94A3B8] font-mono">Subject: </span>
                  <strong className="text-white">{currentCase.messageContent.subject}</strong>
                </div>
              )}

              {/* Message Segments (The core tap-to-inspect text) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#121F3E] border border-[#23355E] text-sm text-[#E2E8F0] leading-relaxed whitespace-pre-wrap shadow-inner selection:bg-amber-400/30">
                {currentCase.messageContent.segments.map((segment, idx) => {
                  const isClue = Boolean(segment.clueId);
                  const isFound = segment.clueId && discoveredClueIds.includes(segment.clueId);

                  if (isClue) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSegmentClick(segment)}
                        className={`inline text-left font-medium rounded-md px-1.5 py-0.5 my-0.5 transition-all cursor-pointer ${
                          isFound
                            ? 'bg-[#F59E0B] text-[#070D1E] font-bold shadow-xs'
                            : 'bg-[#F59E0B]/15 text-[#FBBF24] hover:bg-[#F59E0B]/35 border-b-2 border-dashed border-[#F59E0B] hover:scale-[1.01]'
                        }`}
                        title="Click to inspect this detail"
                      >
                        {segment.text}
                        {isFound && (
                          <span className="ml-1 text-[9px] font-mono uppercase bg-[#070D1E] text-[#F59E0B] px-1 py-0.2 rounded inline-block">
                            Pinned ✓
                          </span>
                        )}
                      </button>
                    );
                  }

                  return (
                    <span
                      key={idx}
                      onClick={() => handleSegmentClick(segment)}
                      className="cursor-pointer hover:bg-white/5 rounded px-0.5 py-0.5 transition-colors"
                      title="Tap text to inspect"
                    >
                      {segment.text}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span>SIMULATED CYBER INVESTIGATION</span>
              <span>NO REAL LINKS ACTIVE</span>
            </div>
          </div>

          {/* Neutral Feedback Alert if player clicked non-clue text */}
          {neutralFeedback && (
            <div className="p-3.5 bg-[#121B33] border border-[#1E293B] rounded-2xl text-xs text-[#CBD5E1] flex items-start justify-between gap-3 shadow-md animate-fade-in">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>{neutralFeedback}</span>
              </div>
              <button
                onClick={() => setNeutralFeedback(null)}
                className="text-[#64748B] hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* =====================================================================
            AREA 3: THE CASE BOARD (4 cols on desktop)
            Connect each clue to: Who sent this? What do they want? What should I do?
        ===================================================================== */}
        <div className="lg:col-span-4 space-y-3 order-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
            <span className="flex items-center gap-1.5 font-bold text-white uppercase">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Case Board</span>
            </span>
            <span>{connectedCount} of 3 Questions Answered</span>
          </div>

          <div className="bg-[#0A1428] border-2 border-[#1E293B] rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="space-y-1">
              <h3 className="font-heading font-black text-sm text-white">
                Connect the Case Evidence
              </h3>
              <p className="text-xs text-[#94A3B8] leading-snug">
                Slot your clues into the three detective questions to crack the transmission:
              </p>
            </div>

            {/* 3 Question Slots */}
            <div className="space-y-3.5">
              {BOARD_QUESTIONS.map((q) => {
                const connectedClueId = connections[q.id];
                const connectedClue = connectedClueId
                  ? currentCase.clues.find((c) => c.id === connectedClueId)
                  : null;
                const connectedMeta = connectedClue
                  ? getCluePuzzleMeta(connectedClue.id, connectedClue.textSnippet)
                  : null;

                const isTargetForSelected =
                  Boolean(selectedClueForConnect) && !connectedClue;

                return (
                  <div
                    key={q.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, q.id)}
                    onClick={() => {
                      if (selectedClueForConnect && !connectedClue) {
                        handleConnectClueToQuestion(selectedClueForConnect, q.id);
                      }
                    }}
                    className={`rounded-2xl border-2 transition-all p-3.5 space-y-2 relative ${
                      connectedClue
                        ? 'bg-[#0E253D] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : isTargetForSelected
                        ? 'bg-[#122347] border-[#00F0FF] border-dashed shadow-[0_0_15px_rgba(0,240,255,0.25)] animate-pulse cursor-pointer'
                        : 'bg-[#0D1832] border-[#1E293B] border-dashed'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            connectedClue
                              ? 'bg-emerald-500 text-[#070D1E]'
                              : 'bg-[#1C2541] text-[#94A3B8]'
                          }`}
                        >
                          {connectedClue ? '✓' : '?'}
                        </div>
                        <h4 className="font-heading font-bold text-xs text-white">
                          {q.question}
                        </h4>
                      </div>

                      <span className="text-[9px] font-mono text-[#64748B] uppercase">
                        {q.badgeText}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#94A3B8] leading-tight">
                      {q.subtitle}
                    </p>

                    {/* Slot Body: Connected Clue or Empty Prompt */}
                    {connectedClue && connectedMeta ? (
                      <div className="p-2.5 rounded-xl bg-[#071324] border border-emerald-500/50 flex items-start justify-between gap-2 text-xs text-white">
                        <div className="space-y-0.5">
                          <span className="font-heading font-bold text-emerald-300 block text-xs">
                            {connectedMeta.shortLabel}
                          </span>
                          <p className="text-[11px] font-mono text-[#94A3B8] line-clamp-1 italic">
                            &ldquo;{connectedClue.textSnippet}&rdquo;
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveConnection(q.id);
                          }}
                          className="text-[#94A3B8] hover:text-red-400 p-1 cursor-pointer"
                          title="Unslot clue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-2.5 px-3 rounded-xl bg-[#070D1E]/60 border border-white/5 text-center text-xs font-mono text-[#64748B]">
                        {isTargetForSelected ? (
                          <span className="text-[#00F0FF] font-bold">
                            Tap here to connect selected clue!
                          </span>
                        ) : (
                          <span>Drop matching clue card here</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Button: Make the Call */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onMakeTheCall(discoveredClueIds)}
                className={`w-full min-h-[48px] px-6 py-3.5 font-heading font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  allConnected
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-[#070D1E] shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-[#1C2541] hover:bg-[#253358] text-white border border-[#3A506B]/50'
                }`}
              >
                <span>{allConnected ? 'CASE PUZZLE COMPLETE // MAKE THE CALL' : 'MAKE THE CALL NOW'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#64748B] font-mono mt-2">
                {allConnected
                  ? 'All 3 puzzle pieces locked in! Ready for the decision outcome.'
                  : `${connectedCount} of 3 questions connected. You can make the call anytime.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE CLUE DISCOVERY MODAL / SHEET
          When player taps a detail:
          1. Highlight detail
          2. Show 1-sentence observation
          3. Player picks what it means: Pressure tactic, Sender identity, Payment/info request
          4. Turns into colorful evidence card in tray!
      ========================================================================= */}
      {inspectingSegment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0F1B38] border-2 border-[#00F0FF] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#E2E8F0] space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF]">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-white">
                    Inspect Warning Sign
                  </h3>
                  <span className="text-[11px] font-mono text-[#00F0FF]">
                    CLUE DISCOVERY PUZZLE
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingSegment(null)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1 & 2: Highlighted Quote & One-Sentence Observation */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#070D1E] border border-white/10 font-mono text-xs text-[#FBBF24] italic">
                &ldquo;{inspectingSegment.segment.text}&rdquo;
              </div>

              <div className="p-3.5 rounded-2xl bg-[#142347] border border-[#00F0FF]/30 text-xs text-white space-y-1">
                <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block">
                  ★ DETECTIVE OBSERVATION
                </span>
                <p className="font-medium leading-relaxed">
                  {inspectingSegment.meta.observation}
                </p>
              </div>
            </div>

            {/* Step 3: Choose What That Might Mean */}
            <div className="space-y-2.5">
              <label className="font-heading font-bold text-xs text-white block">
                What does this warning sign tell us?
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleChooseCategory('pressure')}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#131E3A] hover:bg-[#1E2E55] border border-[#3A506B]/50 hover:border-[#EC4899] transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EC4899]/20 border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899] shrink-0 font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <span className="font-heading font-bold text-xs text-white group-hover:text-[#EC4899] transition-colors block">
                        Pressure tactic
                      </span>
                      <span className="text-[11px] text-[#94A3B8] block">
                        Urgent countdowns, panic, threats of loss or destruction
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseCategory('sender')}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#131E3A] hover:bg-[#1E2E55] border border-[#3A506B]/50 hover:border-[#00F0FF] transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shrink-0 font-bold text-xs">
                      👤
                    </div>
                    <div>
                      <span className="font-heading font-bold text-xs text-white group-hover:text-[#00F0FF] transition-colors block">
                        Sender identity
                      </span>
                      <span className="text-[11px] text-[#94A3B8] block">
                        Lookalike website domain, unverified address, impostor
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseCategory('payment')}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#131E3A] hover:bg-[#1E2E55] border border-[#3A506B]/50 hover:border-[#F59E0B] transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] shrink-0 font-bold text-xs">
                      💳
                    </div>
                    <div>
                      <span className="font-heading font-bold text-xs text-white group-hover:text-[#F59E0B] transition-colors block">
                        Payment or information request
                      </span>
                      <span className="text-[11px] text-[#94A3B8] block">
                        Micro-fees, retail gift cards, 2FA codes, check forwarding
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* Error Guidance inside Modal */}
            {inspectionFeedback && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 animate-fade-in flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{inspectionFeedback}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

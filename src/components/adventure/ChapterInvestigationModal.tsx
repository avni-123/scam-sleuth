import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  MessageSquare,
  Search,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Monitor,
  Camera,
  Sun,
  Layers,
  Hand,
} from 'lucide-react';
import { AdventureLevel, ChapterDef, ChapterQuestionOption } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface ChapterInvestigationModalProps {
  level: AdventureLevel;
  activeChapterNum: 1 | 2 | 3;
  onSelectChapter: (ch: 1 | 2 | 3) => void;
  onClose: () => void;
  onTriggerFinalDecision?: () => void;
  isGameplayMode?: boolean;
}

export const ChapterInvestigationModal: React.FC<ChapterInvestigationModalProps> = ({
  level,
  activeChapterNum,
  onSelectChapter,
  onClose,
  onTriggerFinalDecision,
  isGameplayMode = true,
}) => {
  const chapter: ChapterDef =
    level.chapters.find((c) => c.number === activeChapterNum) || level.chapters[0];

  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [inspectedClues, setInspectedClues] = useState<Record<string, boolean>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showAllFeedback, setShowAllFeedback] = useState<boolean>(false);

  // Reset question selection when switching chapters
  useEffect(() => {
    setSelectedOptionId(null);
    setShowAllFeedback(false);
  }, [level.id, activeChapterNum]);

  const handleSelectOption = (opt: ChapterQuestionOption) => {
    setSelectedOptionId(opt.id);
    if (opt.isCorrect) {
      soundEngine.playSafeSuccess();
    } else {
      soundEngine.playUnsafeAlert();
    }
  };

  const selectedOption = chapter.question?.options.find((o) => o.id === selectedOptionId) || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#081426]/90 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-5xl pixel-panel border-4 border-[#0D1C34] shadow-[0_24px_60px_rgba(2,6,23,0.95),0_0_32px_rgba(57,189,247,0.2)] text-[#F2F5FA] flex flex-col max-h-[92vh] overflow-hidden rounded-none animate-block-reveal relative">
        {/* Pixel Corner Pins */}
        <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#39BDF7]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F05A9D]" />
        <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#F05A9D]" />
        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#39BDF7]" />

        {/* Top Modal Header */}
        <div className="px-5 sm:px-7 py-3.5 bg-[#060D1A] border-b-2 border-[#1B2F4D] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#F05A9D] font-pixel tracking-wider">
              <span>CASE 0{level.levelNumber}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-[#39BDF7]">{level.locationName}</span>
            </div>
            <h2 className="font-pixel text-base sm:text-lg text-[#F2F5FA] mt-0.5">
              CHAPTER 0{chapter.number}: {chapter.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Chapter Progress Indicator / Switcher */}
            {isGameplayMode ? (
              <div className="px-3 py-1 bg-[#1A0A1C] border-2 border-[#F05A9D]/50 font-pixel text-[10px] text-[#F05A9D] rounded-none">
                CHAPTER {activeChapterNum} OF 3 — {chapter.phase.replace('The ', '')}
              </div>
            ) : (
              <div className="flex items-center gap-1 p-1 bg-[#040914] border-2 border-[#0D1C34]">
                {level.chapters.map((ch) => (
                  <button
                    key={ch.number}
                    type="button"
                    onClick={() => {
                      soundEngine.playInteract();
                      onSelectChapter(ch.number);
                    }}
                    className={`px-3 py-1 text-xs font-pixel uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-none ${
                      ch.number === activeChapterNum
                        ? 'bg-[#39BDF7] text-[#081426] font-bold shadow-[inset_1px_1px_0_0_#BAE6FD]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    CH {ch.number}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="pixel-btn p-1.5 text-slate-400 hover:text-white cursor-pointer rounded-none"
              title="Close Case Window (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Chapter Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* 1. Learning Goal & Story Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0B1636] border border-pink-500/25 space-y-1.5">
              <div className="text-xs font-mono text-pink-300 font-semibold uppercase tracking-wider">
                Learning Goal
              </div>
              <p className="text-sm text-[#F8FAFC] font-medium leading-relaxed">
                {chapter.learningGoal || chapter.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1636] border border-sky-500/25 space-y-1.5">
              <div className="text-xs font-mono text-[#00F0FF] font-semibold uppercase tracking-wider">
                Story Setup
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {chapter.storySetup || chapter.summary}
              </p>
            </div>
          </div>

          {/* 2. Scene and Graphics Direction + Interactive On-Screen Device Preview */}
          {chapter.graphicsDirection && (
            <section className="p-5 rounded-xl bg-[#0A1430] border border-sky-500/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-500/20 pb-3">
                <h3 className="font-heading font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#00F0FF]" />
                  <span>Scene and Graphics</span>
                </h3>
                <span className="text-xs font-mono text-slate-300">
                  Cinematic Third-Person & Over-the-Shoulder Framing
                </span>
              </div>

              {/* Simulated Fictional On-Screen Message Preview */}
              <div className="p-4 rounded-xl bg-[#040918] border border-pink-500/35 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#00F0FF]">
                  <span>ON-SCREEN DEVICE / EVIDENCE DISPLAY (SAFE FICTIONAL PREVIEW)</span>
                  <span className="text-pink-300">NO LIVE LINKS</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-pink-100 leading-relaxed">
                  {chapter.graphicsDirection.onScreenMessage}
                </p>
              </div>

              {/* Art, Character, Props, Camera, Lighting, Clue Effects, Transition */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0D1A3C] border border-sky-500/20 space-y-1">
                  <span className="font-mono text-pink-300 font-semibold block">
                    Background Art & Environment
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {chapter.graphicsDirection.backgroundArt}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1A3C] border border-sky-500/20 space-y-1">
                  <span className="font-mono text-pink-300 font-semibold block">
                    Character Appearance & Pose
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {chapter.graphicsDirection.characterAppearanceAndPose}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1A3C] border border-sky-500/20 space-y-1">
                  <span className="font-mono text-pink-300 font-semibold block">
                    Key Interactive Props
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {chapter.graphicsDirection.keyProps}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1A3C] border border-sky-500/20 space-y-1">
                  <span className="font-mono text-[#00F0FF] font-semibold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera Framing</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {chapter.graphicsDirection.cameraAngle}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1A3C] border border-sky-500/20 space-y-1">
                  <span className="font-mono text-[#00F0FF] font-semibold flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Lighting & Atmosphere</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {chapter.graphicsDirection.lighting}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D1A3C] border border-sky-500/20 space-y-1">
                  <span className="font-mono text-[#00F0FF] font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Interactive Clue Effects & Transition</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {chapter.graphicsDirection.interactiveClueEffects}{' '}
                    <span className="text-slate-300">
                      ({chapter.graphicsDirection.transitionGraphic})
                    </span>
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 3. Characters and Subtitled Dialogue + 4. Player Interaction */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-xl bg-[#0A1430] border border-sky-500/20 space-y-3">
              <h3 className="font-heading font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                <span>Characters and Subtitled Dialogue</span>
              </h3>
              <div className="space-y-2.5">
                {chapter.chapterDialogue?.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#050B1C] border border-sky-500/20 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-pink-300">{d.speaker}</span>
                      {d.role && (
                        <>
                          <span aria-hidden="true" className="text-slate-500">
                            ·
                          </span>
                          <span className="text-slate-300">{d.role}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                      “{d.line}”
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0A1430] border border-sky-500/20 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                  <Hand className="w-4 h-4 text-[#00F0FF]" />
                  <span>Player Interaction</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {chapter.playerInteraction}
                </p>
              </div>

              {level.glasshouseClue && (
                <div className="p-3.5 rounded-xl bg-[#050B1C] border border-pink-400/35 space-y-1">
                  <span className="text-[11px] font-mono text-pink-300 font-semibold uppercase">
                    Recurring Glasshouse Thread
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {level.glasshouseClue}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 5. Clues and Hints (Three Visible / Discoverable Clues) */}
          {chapter.clues && (
            <section className="p-5 rounded-xl bg-[#0A1430] border border-pink-500/25 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                  <Search className="w-4 h-4 text-pink-400" />
                  <span>Clues and Hints (3 Discoverable Chapter Clues)</span>
                </h3>
                <span className="text-xs font-mono text-slate-300">
                  Click any clue to inspect or toggle its hint
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {chapter.clues.map((clue, idx) => {
                  const isInspected = Boolean(inspectedClues[clue.id]);
                  const isHintOpen = Boolean(revealedHints[clue.id]);

                  return (
                    <div
                      key={clue.id}
                      onClick={() => {
                        soundEngine.playClueFound();
                        setInspectedClues((prev) => ({ ...prev, [clue.id]: true }));
                      }}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between space-y-3 ${
                        isInspected
                          ? 'bg-emerald-950/30 border-emerald-500/60'
                          : 'bg-[#0D1A3C] border-pink-500/25 hover:border-pink-400/60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-pink-300 font-semibold">
                            Clue {idx + 1} of 3
                          </span>
                          <span className={isInspected ? 'text-emerald-300' : 'text-[#00F0FF]'}>
                            {isInspected ? 'Inspected ✓' : 'Click to Inspect'}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-[#F8FAFC]">
                          {clue.title}
                        </h4>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {clue.detail}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-sky-500/20 space-y-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRevealedHints((prev) => ({
                              ...prev,
                              [clue.id]: !prev[clue.id],
                            }));
                          }}
                          className="text-xs font-mono text-pink-300 hover:text-pink-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{isHintOpen ? 'Hide Hint' : 'Show Hint'}</span>
                        </button>
                        {isHintOpen && (
                          <p className="text-xs text-pink-100 bg-pink-500/15 border border-pink-400/30 p-2.5 rounded-lg leading-relaxed">
                            <strong>Hint:</strong> {clue.hint}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 6. Knowledge Question and Four Options + 7. Correct Answer and Feedback */}
          {chapter.question && (
            <section className="p-4 sm:p-5 pixel-panel border-2 border-[#16345E] space-y-3.5 rounded-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#F05A9D]" />
                  <h3 className="font-pixel text-xs sm:text-sm text-[#F2F5FA] uppercase tracking-wide">
                    CHAPTER 0{chapter.number} KNOWLEDGE VERIFICATION (4 OPTIONS)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllFeedback((prev) => !prev)}
                  className="text-[10px] font-pixel text-[#39BDF7] hover:underline cursor-pointer"
                >
                  {showAllFeedback
                    ? '[HIDE ANSWER KEY]'
                    : '[SHOW ANSWER KEY & EXPLANATIONS]'}
                </button>
              </div>

              <p className="font-heading font-black text-sm sm:text-base text-[#F2F5FA] leading-snug">
                {chapter.question.prompt}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chapter.question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const showResult = isSelected || showAllFeedback;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3.5 border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 rounded-none ${
                        showResult
                          ? opt.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-400 text-[#F2F5FA] shadow-[inset_1px_1px_0_0_#34D399]'
                            : isSelected
                            ? 'bg-rose-950/40 border-rose-400 text-[#F2F5FA] shadow-[inset_1px_1px_0_0_#F87171]'
                            : 'bg-[#060D1A] border-[#102344] text-slate-400'
                          : isSelected
                          ? 'block-btn-selected'
                          : 'block-btn'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-none font-pixel text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                            showResult && opt.isCorrect
                              ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                              : showResult && isSelected && !opt.isCorrect
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-[#091A36] border-[#1B3B6D] text-[#39BDF7]'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed">
                          {opt.text}
                        </span>
                      </div>

                      {showResult && (
                        <div
                          className={`pt-2 border-t text-xs leading-relaxed flex items-start gap-2 ${
                            opt.isCorrect
                              ? 'border-emerald-500/30 text-emerald-300'
                              : 'border-rose-500/30 text-rose-300'
                          }`}
                        >
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                          )}
                          <span>{opt.feedback}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {(selectedOption || showAllFeedback) && (
                <div className="p-4 rounded-xl bg-[#060C1D] border border-emerald-500/40 space-y-1.5">
                  <div className="text-xs font-mono text-emerald-300 font-semibold uppercase">
                    Safety Lesson & Explanation
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {chapter.question.correctAnswerExplanation}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* 8. Chapter Transition */}
          {chapter.chapterTransition && (
            <div className="p-4 bg-[#0A1430] border-2 border-[#1B2F4D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-none">
              <div className="space-y-1">
                <span className="text-[10px] font-pixel text-[#F05A9D] font-bold uppercase">
                  CHAPTER 0{chapter.number} TRANSITION
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {chapter.chapterTransition}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {activeChapterNum < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playInteract();
                      onSelectChapter((activeChapterNum + 1) as 1 | 2 | 3);
                    }}
                    className="pixel-btn-action px-4 py-2 font-pixel text-xs text-[#081426] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 rounded-none uppercase"
                  >
                    <span>NEXT: CH 0{activeChapterNum + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  onTriggerFinalDecision && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playDecisionPrompt();
                        onClose();
                        onTriggerFinalDecision();
                      }}
                      className="pixel-btn-action px-4 py-2 font-pixel text-xs text-[#081426] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 rounded-none uppercase shadow-[0_0_16px_rgba(57,189,247,0.4)]"
                    >
                      <span>TRIGGER FINAL DECISION</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )
                )}

                {isGameplayMode && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="pixel-btn px-4 py-2 font-pixel text-[10px] text-slate-300 hover:text-white cursor-pointer whitespace-nowrap shrink-0 rounded-none uppercase"
                  >
                    RETURN TO SCENE [ESC]
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

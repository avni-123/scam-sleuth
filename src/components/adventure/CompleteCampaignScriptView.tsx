import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  MessageSquare,
  Monitor,
  Hand,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import { LevelId, ChapterQuestionOption } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface CompleteCampaignScriptViewProps {
  onPlayChapter: (levelId: LevelId, chapterNum: 1 | 2 | 3) => void;
  isLevelUnlocked: (levelIndex: number) => boolean;
  onUnlockAllLevels?: () => void;
}

export const CompleteCampaignScriptView: React.FC<CompleteCampaignScriptViewProps> = ({
  onPlayChapter,
  isLevelUnlocked,
  onUnlockAllLevels,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});

  const visibleLevels =
    selectedLevelFilter === 'all'
      ? ADVENTURE_LEVELS
      : ADVENTURE_LEVELS.filter((l) => l.id === selectedLevelFilter);

  const handleSelectOption = (chapterKey: string, opt: ChapterQuestionOption) => {
    setSelectedAnswers((prev) => ({ ...prev, [chapterKey]: opt.id }));
    if (opt.isCorrect) {
      soundEngine.playSafeSuccess();
    } else {
      soundEngine.playUnsafeAlert();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Level Filter Bar */}
      <div className="p-6 rounded-2xl bg-[#070E22] border border-sky-500/25 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-pink-300 font-semibold">
              SCAM SLEUTH · THE GLASSHOUSE FILES · COMPLETE 10-LEVEL / 30-CHAPTER COMPENDIUM
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#F8FAFC]">
              All 10 Levels & 30 Chapters: Story, Graphics, Clues & Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Browse every level and its three connected chapters below—complete with learning goals, scene and graphics direction, subtitled dialogue, player interactions, 3 discoverable clues with hints, interactive 4-option knowledge questions, full answer feedback, and chapter transitions.
            </p>
          </div>

          {onUnlockAllLevels && (
            <button
              type="button"
              onClick={onUnlockAllLevels}
              className="px-4 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-slate-950 font-heading font-bold text-xs cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_16px_rgba(0,240,255,0.28)]"
            >
              Unlock All 10 Levels to Play Any Chapter
            </button>
          )}
        </div>

        {/* Interactive Level Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-sky-500/20">
          <button
            type="button"
            onClick={() => setSelectedLevelFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedLevelFilter === 'all'
                ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                : 'bg-[#050B1C] text-slate-300 hover:text-white border border-sky-500/20'
            }`}
          >
            All 10 Levels (30 Chapters)
          </button>
          {ADVENTURE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSelectedLevelFilter(lvl.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedLevelFilter === lvl.id
                  ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                  : 'bg-[#050B1C] text-slate-300 hover:text-white border border-sky-500/20'
              }`}
            >
              Level {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Render Levels & Their 3 Chapters */}
      <div className="space-y-10">
        {visibleLevels.map((level) => {
          const levelIdx = ADVENTURE_LEVELS.findIndex((l) => l.id === level.id);
          const unlocked = isLevelUnlocked(levelIdx);

          return (
            <section
              key={level.id}
              className="rounded-2xl bg-[#070E22] border border-sky-500/25 overflow-hidden shadow-xl space-y-6 p-5 sm:p-7"
            >
              {/* Level Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-sky-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-pink-300 font-semibold">
                    <span>{level.levelNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#00F0FF]">{level.locationName}</span>
                    <span aria-hidden="true">·</span>
                    <span>3 Playable Chapters</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F8FAFC]">
                    {level.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {level.objective}
                  </p>
                </div>

                {unlocked && (
                  <button
                    type="button"
                    onClick={() => onPlayChapter(level.id, 1)}
                    className="px-4 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-slate-950 font-heading font-bold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_16px_rgba(0,240,255,0.28)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play {level.levelNumber} in 3D</span>
                  </button>
                )}
              </div>

              {/* Three Chapters for This Level */}
              <div className="space-y-8">
                {level.chapters.map((chapter) => {
                  const chapterKey = `${level.id}-ch-${chapter.number}`;
                  const chosenOptId = selectedAnswers[chapterKey];
                  const correctOpt = chapter.question?.options.find((o) => o.isCorrect);

                  return (
                    <article
                      key={chapter.number}
                      className="rounded-xl bg-[#0B1636] border border-sky-500/20 p-5 sm:p-6 space-y-5"
                    >
                      {/* Chapter Title Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-500/20">
                        <div>
                          <div className="text-xs font-mono text-pink-300 font-semibold">
                            {level.title} · {chapter.phase}
                          </div>
                          <h4 className="font-heading font-bold text-lg sm:text-xl text-[#F8FAFC] mt-0.5">
                            {chapter.title}
                          </h4>
                        </div>

                        {unlocked && (
                          <button
                            type="button"
                            onClick={() => onPlayChapter(level.id, chapter.number)}
                            className="px-3.5 py-2 rounded-xl bg-[#0F214A] hover:bg-[#00F0FF] hover:text-slate-950 border border-sky-400/35 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Launch Chapter {chapter.number}</span>
                          </button>
                        )}
                      </div>

                      {/* Heading 1: Learning goal */}
                      <div className="space-y-1">
                        <h5 className="font-mono text-xs font-semibold text-pink-300 uppercase tracking-wider">
                          Learning goal
                        </h5>
                        <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                          {chapter.learningGoal || chapter.summary}
                        </p>
                        {chapter.storySetup && (
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                            <strong className="text-slate-100">Story setup:</strong>{' '}
                            {chapter.storySetup}
                          </p>
                        )}
                      </div>

                      {/* Heading 2: Scene and graphics */}
                      {chapter.graphicsDirection && (
                        <div className="space-y-2.5 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Scene and graphics</span>
                          </h5>

                          <div className="p-3.5 rounded-xl bg-[#050B1C] border border-pink-500/30 font-mono text-xs text-pink-100 leading-relaxed">
                            <strong className="text-[#00F0FF] block mb-1">
                              On-Screen Fictional Message / Evidence Display:
                            </strong>
                            {chapter.graphicsDirection.onScreenMessage}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-200">
                            <div className="p-3 rounded-lg bg-[#070E22] border border-sky-500/20">
                              <strong className="text-[#F8FAFC] block mb-0.5">Background art:</strong>
                              {chapter.graphicsDirection.backgroundArt}
                            </div>
                            <div className="p-3 rounded-lg bg-[#070E22] border border-sky-500/20">
                              <strong className="text-[#F8FAFC] block mb-0.5">
                                Character appearance & pose:
                              </strong>
                              {chapter.graphicsDirection.characterAppearanceAndPose}
                            </div>
                            <div className="p-3 rounded-lg bg-[#070E22] border border-sky-500/20">
                              <strong className="text-[#F8FAFC] block mb-0.5">Key props:</strong>
                              {chapter.graphicsDirection.keyProps}
                            </div>
                            <div className="p-3 rounded-lg bg-[#070E22] border border-sky-500/20">
                              <strong className="text-[#F8FAFC] block mb-0.5">Camera angle:</strong>
                              {chapter.graphicsDirection.cameraAngle}
                            </div>
                            <div className="p-3 rounded-lg bg-[#070E22] border border-sky-500/20">
                              <strong className="text-[#F8FAFC] block mb-0.5">Lighting:</strong>
                              {chapter.graphicsDirection.lighting}
                            </div>
                            <div className="p-3 rounded-lg bg-[#070E22] border border-sky-500/20">
                              <strong className="text-[#F8FAFC] block mb-0.5">
                                Interactive clue effects & transition graphic:
                              </strong>
                              {chapter.graphicsDirection.interactiveClueEffects} ·{' '}
                              {chapter.graphicsDirection.transitionGraphic}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Heading 3: Characters and dialogue */}
                      {chapter.chapterDialogue && (
                        <div className="space-y-2 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Characters and dialogue</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {chapter.chapterDialogue.map((d, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-lg bg-[#060C1D] border border-sky-500/20 text-xs space-y-1"
                              >
                                <div className="font-mono text-pink-300 font-semibold">
                                  {d.speaker}
                                  {d.role ? ` (${d.role})` : ''}
                                </div>
                                <p className="text-[#F8FAFC] leading-relaxed">“{d.line}”</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Heading 4: Player interaction */}
                      {chapter.playerInteraction && (
                        <div className="space-y-1 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                            <Hand className="w-3.5 h-3.5" />
                            <span>Player interaction</span>
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {chapter.playerInteraction}
                          </p>
                        </div>
                      )}

                      {/* Heading 5: Clues and hints */}
                      {chapter.clues && (
                        <div className="space-y-2 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5" />
                            <span>Clues and hints (3 Chapter Clues)</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {chapter.clues.map((clue, idx) => (
                              <div
                                key={clue.id}
                                className="p-3.5 rounded-lg bg-[#060C1D] border border-pink-500/25 space-y-1.5 text-xs"
                              >
                                <div className="font-mono text-pink-300 font-semibold">
                                  Clue {idx + 1}: {clue.title}
                                </div>
                                <p className="text-slate-200 leading-relaxed">{clue.detail}</p>
                                <p className="text-pink-200/90 pt-1 border-t border-sky-500/20">
                                  <strong>Hint:</strong> {clue.hint}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Heading 6: Question and four options */}
                      {chapter.question && (
                        <div className="space-y-3 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Question and four options</span>
                          </h5>
                          <p className="font-heading font-semibold text-sm sm:text-base text-[#F8FAFC]">
                            {chapter.question.prompt}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {chapter.question.options.map((opt) => {
                              const isSelected = chosenOptId === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleSelectOption(chapterKey, opt)}
                                  className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                                    isSelected
                                      ? opt.isCorrect
                                        ? 'bg-emerald-950/50 border-emerald-400 text-[#F8FAFC]'
                                        : 'bg-red-950/50 border-red-400 text-[#F8FAFC]'
                                      : 'bg-[#060C1D] hover:bg-[#0F1F44] border-sky-500/25 text-slate-200'
                                  }`}
                                >
                                  <span className="font-mono font-bold text-pink-300 shrink-0">
                                    {opt.id}.
                                  </span>
                                  <span className="leading-relaxed">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Heading 7: Correct answer and feedback */}
                      {chapter.question && (
                        <div className="space-y-2.5 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Correct answer and feedback</span>
                          </h5>
                          <div className="p-3.5 rounded-lg bg-[#060C1D] border border-emerald-500/30 space-y-2 text-xs">
                            <div className="text-emerald-300 font-semibold">
                              Correct Answer: Option {correctOpt?.id} — {correctOpt?.text}
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                              <strong>Explanation:</strong>{' '}
                              {chapter.question.correctAnswerExplanation}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-sky-500/20">
                              {chapter.question.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="flex items-start gap-2 text-slate-200"
                                >
                                  {opt.isCorrect ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                  )}
                                  <span>
                                    <strong className="text-[#F8FAFC]">Option {opt.id}:</strong>{' '}
                                    {opt.feedback}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Heading 8: Chapter transition */}
                      {chapter.chapterTransition && (
                        <div className="space-y-1 pt-2 border-t border-sky-500/15">
                          <h5 className="font-mono text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Chapter transition</span>
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {chapter.chapterTransition}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

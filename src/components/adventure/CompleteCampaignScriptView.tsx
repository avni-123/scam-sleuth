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
      <div className="p-6 rounded-2xl bg-[#0B142C] border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-amber-300">
              SCAM SLEUTH · THE GLASSHOUSE FILES · COMPLETE 10-LEVEL / 30-CHAPTER COMPENDIUM
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
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
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              Unlock All 10 Levels to Play Any Chapter
            </button>
          )}
        </div>

        {/* Interactive Level Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setSelectedLevelFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedLevelFilter === 'all'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-[#070D1E] text-slate-300 hover:text-white border border-slate-800'
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
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-[#070D1E] text-slate-300 hover:text-white border border-slate-800'
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
              className="rounded-2xl bg-[#081022] border border-slate-800 overflow-hidden shadow-xl space-y-6 p-5 sm:p-7"
            >
              {/* Level Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <span>{level.levelNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{level.locationName}</span>
                    <span aria-hidden="true">·</span>
                    <span>3 Playable Chapters</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
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
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
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
                      className="rounded-xl bg-[#0B152B] border border-slate-800/90 p-5 sm:p-6 space-y-5"
                    >
                      {/* Chapter Title Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                          <div className="text-xs font-mono text-teal-300">
                            {level.title} · {chapter.phase}
                          </div>
                          <h4 className="font-heading font-bold text-lg sm:text-xl text-white mt-0.5">
                            {chapter.title}
                          </h4>
                        </div>

                        {unlocked && (
                          <button
                            type="button"
                            onClick={() => onPlayChapter(level.id, chapter.number)}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Launch Chapter {chapter.number}</span>
                          </button>
                        )}
                      </div>

                      {/* Heading 1: Learning goal */}
                      <div className="space-y-1">
                        <h5 className="font-mono text-xs font-semibold text-amber-300 uppercase tracking-wider">
                          Learning goal
                        </h5>
                        <p className="text-xs sm:text-sm text-white leading-relaxed">
                          {chapter.learningGoal || chapter.summary}
                        </p>
                        {chapter.storySetup && (
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                            <strong className="text-slate-200">Story setup:</strong>{' '}
                            {chapter.storySetup}
                          </p>
                        )}
                      </div>

                      {/* Heading 2: Scene and graphics */}
                      {chapter.graphicsDirection && (
                        <div className="space-y-2.5 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Scene and graphics</span>
                          </h5>

                          <div className="p-3.5 rounded-xl bg-[#060B18] border border-slate-800 font-mono text-xs text-amber-200 leading-relaxed">
                            <strong className="text-teal-300 block mb-1">
                              On-Screen Fictional Message / Evidence Display:
                            </strong>
                            {chapter.graphicsDirection.onScreenMessage}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
                            <div className="p-3 rounded-lg bg-[#081022] border border-slate-800/80">
                              <strong className="text-white block mb-0.5">Background art:</strong>
                              {chapter.graphicsDirection.backgroundArt}
                            </div>
                            <div className="p-3 rounded-lg bg-[#081022] border border-slate-800/80">
                              <strong className="text-white block mb-0.5">
                                Character appearance & pose:
                              </strong>
                              {chapter.graphicsDirection.characterAppearanceAndPose}
                            </div>
                            <div className="p-3 rounded-lg bg-[#081022] border border-slate-800/80">
                              <strong className="text-white block mb-0.5">Key props:</strong>
                              {chapter.graphicsDirection.keyProps}
                            </div>
                            <div className="p-3 rounded-lg bg-[#081022] border border-slate-800/80">
                              <strong className="text-white block mb-0.5">Camera angle:</strong>
                              {chapter.graphicsDirection.cameraAngle}
                            </div>
                            <div className="p-3 rounded-lg bg-[#081022] border border-slate-800/80">
                              <strong className="text-white block mb-0.5">Lighting:</strong>
                              {chapter.graphicsDirection.lighting}
                            </div>
                            <div className="p-3 rounded-lg bg-[#081022] border border-slate-800/80">
                              <strong className="text-white block mb-0.5">
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
                        <div className="space-y-2 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Characters and dialogue</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {chapter.chapterDialogue.map((d, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-lg bg-[#070D1D] border border-slate-800 text-xs space-y-1"
                              >
                                <div className="font-mono text-amber-300 font-semibold">
                                  {d.speaker}
                                  {d.role ? ` (${d.role})` : ''}
                                </div>
                                <p className="text-slate-100 leading-relaxed">“{d.line}”</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Heading 4: Player interaction */}
                      {chapter.playerInteraction && (
                        <div className="space-y-1 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
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
                        <div className="space-y-2 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5" />
                            <span>Clues and hints (3 Chapter Clues)</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {chapter.clues.map((clue, idx) => (
                              <div
                                key={clue.id}
                                className="p-3.5 rounded-lg bg-[#070D1D] border border-slate-800 space-y-1.5 text-xs"
                              >
                                <div className="font-mono text-emerald-300 font-semibold">
                                  Clue {idx + 1}: {clue.title}
                                </div>
                                <p className="text-slate-200 leading-relaxed">{clue.detail}</p>
                                <p className="text-amber-200/90 pt-1 border-t border-slate-800/80">
                                  <strong>Hint:</strong> {clue.hint}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Heading 6: Question and four options */}
                      {chapter.question && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Question and four options</span>
                          </h5>
                          <p className="font-heading font-semibold text-sm sm:text-base text-white">
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
                                        ? 'bg-emerald-950/50 border-emerald-400 text-white'
                                        : 'bg-red-950/50 border-red-400 text-white'
                                      : 'bg-[#070D1D] hover:bg-[#0F1B38] border-slate-800 text-slate-200'
                                  }`}
                                >
                                  <span className="font-mono font-bold text-amber-300 shrink-0">
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
                        <div className="space-y-2.5 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Correct answer and feedback</span>
                          </h5>
                          <div className="p-3.5 rounded-lg bg-[#070D1D] border border-emerald-500/30 space-y-2 text-xs">
                            <div className="text-emerald-300 font-semibold">
                              Correct Answer: Option {correctOpt?.id} — {correctOpt?.text}
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                              <strong>Explanation:</strong>{' '}
                              {chapter.question.correctAnswerExplanation}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                              {chapter.question.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="flex items-start gap-2 text-slate-300"
                                >
                                  {opt.isCorrect ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                  )}
                                  <span>
                                    <strong className="text-white">Option {opt.id}:</strong>{' '}
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
                        <div className="space-y-1 pt-2 border-t border-slate-800/70">
                          <h5 className="font-mono text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
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

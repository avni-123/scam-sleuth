import React from 'react';
import { DetectiveCase, CaseSessionResult, BadgeType } from '../types/game.ts';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  ArrowRight,
  RotateCcw,
  Shield,
  Download,
} from 'lucide-react';

interface CaseReportProps {
  currentCase: DetectiveCase;
  sessionResult: CaseSessionResult;
  onReturnToCases: () => void;
  onReplayCase: () => void;
}

export const CaseReport: React.FC<CaseReportProps> = ({
  currentCase,
  sessionResult,
  onReturnToCases,
  onReplayCase,
}) => {
  const missedClues = currentCase.clues.filter(
    (c) => !sessionResult.discoveredClueIds.includes(c.id)
  );

  const skillsPracticed = Array.from(
    new Set(currentCase.clues.map((c) => c.skillBadge))
  ) as BadgeType[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
      {/* Official Case Report Header */}
      <div className="evidence-paper rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#E2D6C3] space-y-6 text-[#1E293B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D6C3] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C7853] block">
              OFFICIAL INVESTIGATION REPORT
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#1E293B]">
              Case Dossier: {currentCase.caseNumber}
            </h1>
            <p className="text-xs text-[#645A45]">
              Target: {currentCase.title} · Investigated on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="self-start sm:self-auto">
            {sessionResult.safeChoice ? (
              <span className="detective-stamp stamp-solved text-xs">
                VERDICT: SAFE DEFENSE
              </span>
            ) : (
              <span className="detective-stamp stamp-danger text-xs">
                VERDICT: TRAP TRIGGERED
              </span>
            )}
          </div>
        </div>

        {/* Performance Scorecards */}
        <div className="grid grid-cols-3 gap-3 bg-white/70 p-4 rounded-xl border border-[#D5C7B2]">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase text-[#8C7853] block">Decision</span>
            <span className={`font-heading font-bold text-sm ${sessionResult.safeChoice ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {sessionResult.safeChoice ? '100% Safe' : 'Vulnerable'}
            </span>
          </div>

          <div className="text-center border-x border-[#E2D6C3]">
            <span className="text-[10px] font-mono uppercase text-[#8C7853] block">Clues Spotted</span>
            <span className="font-mono font-bold text-sm text-[#1E293B]">
              {sessionResult.discoveredClueIds.length} / {currentCase.clues.length}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-mono uppercase text-[#8C7853] block">XP Earned</span>
            <span className="font-mono font-bold text-sm text-[#D97706]">
              +{sessionResult.xpEarned} XP
            </span>
          </div>
        </div>

        {/* Skills Practiced */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C7853] block">
            Detective Skills Practiced:
          </span>
          <div className="flex flex-wrap gap-2">
            {skillsPracticed.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#D5C7B2] text-xs font-semibold text-[#1E293B]"
              >
                <Award className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Clues Review: Caught vs Missed */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C7853] block">
            Clue Inspection Audit:
          </span>

          <div className="space-y-2 text-xs">
            {currentCase.clues.map((clue) => {
              const caught = sessionResult.discoveredClueIds.includes(clue.id);

              return (
                <div
                  key={clue.id}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                    caught
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  {caught ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold">{clue.label}:</span>{' '}
                    <span>{clue.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Daily Habit to Remember */}
        <div className="p-4 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-[#D5C7B2] space-y-1 text-xs text-[#1E293B]">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#D97706]">
            <Lightbulb className="w-4 h-4" />
            <span>Habit to Remember in Real Life</span>
          </div>
          <p className="font-heading text-sm font-bold pt-1">
            "{currentCase.practicalTakeaway}"
          </p>
          <p className="text-[#645A45] pt-1">
            Apply this habit whenever an unexpected text, email, or urgent request reaches your phone. Real companies never mind when you take a moment to verify independently.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E2D6C3]">
          <button
            type="button"
            onClick={onReplayCase}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D5C7B2] text-[#475569] hover:text-[#1E293B] hover:bg-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay for Better Score</span>
          </button>

          <button
            type="button"
            onClick={onReturnToCases}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Return to Case Room</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </div>
      </div>
    </div>
  );
};

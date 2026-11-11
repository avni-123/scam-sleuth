import React, { useState } from 'react';
import { DetectiveCase, ActionOption, IllustratedOutcome } from '../types/game.ts';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { playAudioFx, CHIEF_INSPECTOR_NOVA } from '../data/neonWorldData.ts';

interface AnimatedStoryOutcomeProps {
  currentCase: DetectiveCase;
  chosenAction: ActionOption;
  onProceedToReveal: () => void;
  onRewindDecision: () => void;
}

export const AnimatedStoryOutcome: React.FC<AnimatedStoryOutcomeProps> = ({
  currentCase,
  chosenAction,
  onProceedToReveal,
  onRewindDecision,
}) => {
  const isSafe = chosenAction.isSafe;
  const outcome: IllustratedOutcome = chosenAction.outcome || {
    title: isSafe ? 'CYBER SHIELD ACTIVE // SCAM DEFUSED' : 'CREDENTIAL COMPROMISE // SIMULATED BREACH',
    headline: isSafe
      ? `${currentCase.character?.name || 'Citizen'} verified independently and avoided the trap.`
      : `The scammer used pressure to extract private details.`,
    summary: chosenAction.feedback,
    cyberImpact: isSafe ? 'Protected Credentials · $0 Lost · Phishing Blocked' : 'Simulated Breach · Credentials Harvested',
    novaVerdict: isSafe
      ? 'Outstanding defensive instincts, Detective! You proved that pausing and verifying independently wins every time.'
      : 'Hold on, Detective! This is why we train in safe simulations. Let\'s rewind the clock and pick a safe defense.',
    panels: [
      {
        id: 'out-1',
        title: 'Action Chosen',
        narrative: `Citizen chose: "${chosenAction.label}"`,
        speaker: currentCase.character?.name || 'Citizen',
        dialogue: chosenAction.description,
        visualType: isSafe ? 'outcome_safe' : 'outcome_unsafe',
        mood: isSafe ? 'relieved' : 'alarmed',
      },
      {
        id: 'out-2',
        title: 'Consequence in Action',
        narrative: chosenAction.feedback,
        speaker: isSafe ? 'Defensive Firewall' : 'Phishing Threat Bot',
        dialogue: isSafe ? 'Official channels verified. Scammer connection severed.' : 'Credentials entered on spoofed portal.',
        visualType: isSafe ? 'outcome_safe' : 'outcome_unsafe',
        mood: isSafe ? 'relieved' : 'trapped',
      },
      {
        id: 'out-3',
        title: 'Chief Inspector Nova Debrief',
        narrative: chosenAction.safetyTip,
        speaker: CHIEF_INSPECTOR_NOVA.name,
        dialogue: isSafe
          ? 'Exceptional cybersecurity! You protected the citizen from fraud.'
          : 'Zero shame, Detective—learn the habit and rewind time to fix it!',
        visualType: isSafe ? 'outcome_safe' : 'outcome_unsafe',
        mood: isSafe ? 'relieved' : 'curious',
      },
    ],
  };

  const handleRewind = () => {
    playAudioFx('rewind');
    onRewindDecision();
  };

  const handleProceed = () => {
    playAudioFx(isSafe ? 'success' : 'clue');
    onProceedToReveal();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-fade-in">
      {/* Top Banner Outcome Kicker */}
      <div className="text-center space-y-3">
        <div className="inline-block">
          {isSafe ? (
            <span className="detective-stamp stamp-solved text-sm sm:text-base px-4 py-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              CASE OUTCOME // SAFE DEFENSE VERIFIED
            </span>
          ) : (
            <span className="detective-stamp stamp-danger text-sm sm:text-base px-4 py-1.5 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              SIMULATED BREACH // LESSON IN PROGRESS
            </span>
          )}
        </div>

        <h1 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
          {outcome.title}
        </h1>

        <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
          {outcome.headline}
        </p>

        {/* Cyber Impact Strip */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold ${
            isSafe
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          {isSafe ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{outcome.cyberImpact}</span>
        </div>
      </div>

      {/* 3 Outcome Comic Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outcome.panels.map((panel, idx) => (
          <div
            key={panel.id}
            className={`rounded-3xl border-2 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden ${
              isSafe
                ? 'bg-[#0E233C] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'bg-[#261019] border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
            }`}
          >
            <div>
              {/* Comic Panel Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 font-mono text-[11px]">
                <span className={isSafe ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  SCENE {idx + 1} // {panel.title.toUpperCase()}
                </span>
                {panel.soundEffect && (
                  <span className="font-bold text-[#F05A9D]">★ {panel.soundEffect}</span>
                )}
              </div>

              {/* Narrative Text */}
              <p className="text-xs text-[#E2E8F0] leading-relaxed mb-4">
                {panel.narrative}
              </p>

              {/* Speech Bubble */}
              {panel.dialogue && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs text-white shadow-inner relative mt-2 ${
                    isSafe
                      ? 'bg-[#071324] border-emerald-500/40'
                      : 'bg-[#15080E] border-red-500/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] uppercase font-bold text-[#39BDF7]">
                    <span>{panel.speaker || 'Narrator'}</span>
                  </div>
                  <p className="italic text-slate-200">
                    &ldquo;{panel.dialogue}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Panel Status */}
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>{isSafe ? 'THREAT AVERTED' : 'EXPLOIT DEMONSTRATED'}</span>
              <span className="font-bold text-white">STEP {idx + 1} / 3</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chief Inspector Nova Mentor Coaching Box */}
      <div
        className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xl ${
          isSafe
            ? 'bg-gradient-to-r from-[#0C243B] to-[#102C4C] border-emerald-500/50'
            : 'bg-gradient-to-r from-[#29111A] to-[#361622] border-red-500/50'
        }`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#070D1E] border-2 border-white/20 flex items-center justify-center text-white font-heading font-black text-base shrink-0 shadow-md">
            CN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-bold text-white">
                {CHIEF_INSPECTOR_NOVA.name}
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {CHIEF_INSPECTOR_NOVA.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1 leading-relaxed">
              &ldquo;{outcome.novaVerdict}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          {!isSafe && (
            <button
              type="button"
              onClick={handleRewind}
              className="px-5 py-3 bg-[#F05A9D] hover:bg-[#F472B6] text-[#081426] font-heading font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
              <span>REWIND TIME & RETRY</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleProceed}
            className={`px-6 py-3 font-heading font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isSafe
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-[#070D1E]'
                : 'bg-[#1C2541] hover:bg-[#28375C] text-white border border-[#3A506B]'
            }`}
          >
            <span>{isSafe ? 'PROCEED TO CASE REVEAL' : 'CONTINUE TO DEBRIEF'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

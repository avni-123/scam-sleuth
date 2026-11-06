import React, { useState } from 'react';
import { DetectiveCase, ComicPanel } from '../types/game.ts';
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  MapPin,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import { playAudioFx } from '../data/neonWorldData.ts';

interface ComicScenePrologueProps {
  currentCase: DetectiveCase;
  onProceedToInvestigation: () => void;
  onSkip?: () => void;
}

export const ComicScenePrologue: React.FC<ComicScenePrologueProps> = ({
  currentCase,
  onProceedToInvestigation,
  onSkip,
}) => {
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  const panels: ComicPanel[] = currentCase.comicPrologue && currentCase.comicPrologue.length > 0
    ? currentCase.comicPrologue
    : [
        {
          id: 'p1',
          title: `${currentCase.district || 'Cyber City'} Alert`,
          narrative: `A new transmission is flagged in ${currentCase.district || 'the district'}. Citizen ${currentCase.character?.name || 'Kira'} reports a high-priority message.`,
          visualType: 'setting',
          mood: 'neutral',
        },
        {
          id: 'p2',
          title: 'Suspicious Transmission',
          narrative: `An unverified message demands immediate action or financial transfer.`,
          speaker: currentCase.senderInfo.name,
          dialogue: currentCase.subtitle,
          visualType: 'incoming_alert',
          mood: 'alarmed',
        },
        {
          id: 'p3',
          title: 'The Detective Call',
          narrative: `Analyze the red flags and make a defensive call to prevent fraud.`,
          speaker: currentCase.character?.name || 'Citizen',
          dialogue: currentCase.character?.reactionQuote || 'Let\'s check the evidence carefully.',
          visualType: 'character_reaction',
          mood: 'curious',
        },
      ];

  const handleNextPanel = () => {
    if (activePanelIndex < panels.length - 1) {
      setActivePanelIndex((prev) => prev + 1);
      playAudioFx('clue');
    } else {
      playAudioFx('clue');
      onProceedToInvestigation();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fade-in">
      {/* Top Scene Breadcrumb & District Kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1C2541] border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
            {currentCase.district ? currentCase.district.slice(0, 2).toUpperCase() : 'CC'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#F59E0B] tracking-wider uppercase">
                {currentCase.caseNumber}
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                Interactive Comic Prologue
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-black text-white">
              {currentCase.title}
            </h1>
          </div>
        </div>

        {/* Skip or Fast Proceed */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onProceedToInvestigation}
            className="text-xs text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg bg-[#131E3A] hover:bg-[#1C2541] border border-[#1E293B] transition-colors cursor-pointer"
          >
            Skip to Evidence Desk →
          </button>
        </div>
      </div>

      {/* 3 Comic Book Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {panels.map((panel, idx) => {
          const isActive = idx === activePanelIndex;
          const isPassed = idx < activePanelIndex;

          return (
            <div
              key={panel.id}
              onClick={() => setActivePanelIndex(idx)}
              className={`group relative rounded-3xl border-2 transition-all duration-300 p-5 flex flex-col justify-between shadow-xl cursor-pointer ${
                isActive
                  ? 'bg-[#132247] border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-[1.02]'
                  : isPassed
                  ? 'bg-[#0E172F] border-emerald-500/50 hover:border-emerald-400'
                  : 'bg-[#0B132B] border-[#1E293B] hover:border-[#3A506B] opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Comic Panel Header Strip */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">
                    PANEL {idx + 1} // {panel.visualType.replace('_', ' ').toUpperCase()}
                  </span>

                  {panel.soundEffect && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/40 animate-pulse">
                      ★ {panel.soundEffect}
                    </span>
                  )}
                </div>

                {/* Panel Title */}
                <h3 className="font-heading text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#00F0FF] transition-colors">
                  {panel.title}
                </h3>

                {/* Narrative Caption */}
                <p className="text-xs text-[#CBD5E1] leading-relaxed mb-4">
                  {panel.narrative}
                </p>

                {/* Comic Speech / Transmission Bubble */}
                {panel.dialogue && (
                  <div className="relative mt-2 p-3.5 rounded-2xl bg-[#070D1E] border border-[#3A506B]/60 text-xs text-white shadow-inner">
                    {/* Speech Bubble Arrow */}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#070D1E] border-t border-l border-[#3A506B]/60 rotate-45" />

                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-[10px] text-[#00F0FF] uppercase">
                        {panel.speaker || 'Citizen'}
                      </span>
                    </div>

                    <p className="font-medium italic leading-relaxed text-slate-200">
                      &ldquo;{panel.dialogue}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Panel Footer Step Indicator */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className={isActive ? 'text-[#00F0FF] font-bold' : 'text-[#64748B]'}>
                  {isActive ? '● ACTIVE PANEL' : isPassed ? '✓ EXAMINED' : '○ UP NEXT'}
                </span>

                {idx === panels.length - 1 && (
                  <span className="text-amber-400 font-bold">READY TO SOLVE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comic Call to Action Desk Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#101D3A] via-[#15274D] to-[#0D1830] border-2 border-[#00F0FF]/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF]">
            <Zap className="w-4 h-4" />
            <span>Next Step: Evidence Inspection</span>
          </div>
          <p className="text-sm font-heading font-bold text-white">
            Examine the incoming message on the simulated phone screen and magnify clues.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNextPanel}
          className="min-h-[48px] px-8 py-3.5 bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0284C7] hover:brightness-110 active:scale-[0.98] text-[#070D1E] font-heading font-black text-sm rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>
            {activePanelIndex < panels.length - 1
              ? `Next Comic Panel (${activePanelIndex + 1}/${panels.length})`
              : 'ENTER EVIDENCE DESK'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  DetectiveCase,
  PlayerProgress,
  ScamChannel,
  DifficultyLevel,
} from '../types/game.ts';
import {
  Search,
  MessageSquare,
  Mail,
  Store,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  FileText,
  Compass,
  SlidersHorizontal,
  RotateCcw,
  Gauge,
  X,
  Map,
} from 'lucide-react';

interface CaseBoardProps {
  cases: DetectiveCase[];
  progress: PlayerProgress;
  onSelectCase: (caseItem: DetectiveCase) => void;
  onPlayDemoCase: () => void;
  onNavigateToLab: () => void;
  justCompletedCaseId?: string | null;
  onClearJustCompleted?: () => void;
  onSwitchToCityMap?: () => void;
}

export type DifficultyFilter = 'all' | 'Beginner' | 'Intermediate' | 'Master';

export const normalizeDifficulty = (diff?: string): 'Beginner' | 'Intermediate' | 'Master' => {
  if (!diff) return 'Intermediate';
  const lower = diff.toLowerCase();
  if (lower.includes('begin') || lower.includes('rookie')) return 'Beginner';
  if (lower.includes('inter') || lower.includes('investigat')) return 'Intermediate';
  if (lower.includes('mast') || lower.includes('special')) return 'Master';
  return 'Intermediate';
};

// Synthesize tactile rubber stamp impact thud using Web Audio API
export const playStampThud = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Non-blocking fallback
  }
};

export const CaseBoard: React.FC<CaseBoardProps> = ({
  cases,
  progress,
  onSelectCase,
  onPlayDemoCase,
  onNavigateToLab,
  justCompletedCaseId,
  onClearJustCompleted,
  onSwitchToCityMap,
}) => {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  const justCompletedCase = justCompletedCaseId
    ? cases.find((c) => c.id === justCompletedCaseId)
    : null;

  // Trigger stamp sound and auto-scroll to card when newly solved case is detected
  useEffect(() => {
    if (!justCompletedCaseId || !justCompletedCase) return;

    // Reset filters if they would hide the newly stamped case
    if (channelFilter !== 'all' && channelFilter !== justCompletedCase.channel) {
      setChannelFilter('all');
    }
    const targetDiff = normalizeDifficulty(justCompletedCase.difficulty);
    if (difficultyFilter !== 'all' && difficultyFilter !== targetDiff) {
      setDifficultyFilter('all');
    }

    const timer = setTimeout(() => {
      playStampThud();
      const el = document.getElementById(`case-card-${justCompletedCaseId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [justCompletedCaseId, justCompletedCase]);

  const channelIcons: Record<ScamChannel, React.ReactNode> = {
    sms: <MessageSquare className="w-3.5 h-3.5" />,
    email: <Mail className="w-3.5 h-3.5" />,
    marketplace: <Store className="w-3.5 h-3.5" />,
    chat: <PhoneCall className="w-3.5 h-3.5" />,
  };

  const difficultyCounts = {
    all: cases.length,
    Beginner: cases.filter((c) => normalizeDifficulty(c.difficulty) === 'Beginner').length,
    Intermediate: cases.filter((c) => normalizeDifficulty(c.difficulty) === 'Intermediate').length,
    Master: cases.filter((c) => normalizeDifficulty(c.difficulty) === 'Master').length,
  };

  const filteredCases = cases.filter((c) => {
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchesDifficulty =
      difficultyFilter === 'all' || normalizeDifficulty(c.difficulty) === difficultyFilter;
    return matchesChannel && matchesDifficulty;
  });

  const tutorialCase = cases.find((c) => c.id === 'case-tutorial') || cases[0];
  const tutorialSolved = progress.solvedCaseIds.includes(tutorialCase.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 text-[#F2F5FA]">
      {/* Editorial Hero Statement */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#081426] border border-[#39BDF7]/40 text-xs font-mono text-[#39BDF7] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#F05A9D]" />
          <span>Interactive Cybersecurity Simulator · No Account Required</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F2F5FA] leading-[1.15] text-balance">
          A message just came in.{' '}
          <span className="text-[#39BDF7]">Can you spot what it’s hiding?</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#F2F5FA]/80 leading-relaxed max-w-2xl mx-auto">
          Every message is a case. Investigate realistic fictional texts, emails, and payment requests, gather the clues, and choose a safe next step before anyone tricks you.
        </p>

        {/* Primary 1-Minute Hackathon Demo Callout */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPlayDemoCase}
            className="px-6 py-3 bg-[#39BDF7] hover:bg-[#68CEF9] active:scale-[0.98] text-[#081426] font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-[#39BDF7]/25 flex items-center gap-2.5 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Play Demo Case (1 Minute)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNavigateToLab}
            className="px-5 py-3 bg-[#081426] hover:bg-[#0E223D] text-[#F2F5FA] font-medium text-sm sm:text-base rounded-xl border border-[#39BDF7]/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#F05A9D]" />
            <span>AI Case Generator</span>
          </button>
        </div>
      </div>

      {/* Detective Dossier Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0B1A33] border border-[#39BDF7]/20 p-4 rounded-2xl">
        <div className="p-3 bg-[#081426] rounded-xl border border-[#39BDF7]/20">
          <span className="text-[11px] font-mono uppercase text-[#F2F5FA]/70 block">Detective Rank</span>
          <span className="font-heading font-bold text-[#F2F5FA] text-base sm:text-lg truncate block">
            {progress.rank}
          </span>
        </div>

        <div className="p-3 bg-[#081426] rounded-xl border border-[#39BDF7]/20">
          <span className="text-[11px] font-mono uppercase text-[#F2F5FA]/70 block">Cases Solved</span>
          <span className="font-mono font-bold text-emerald-400 text-base sm:text-lg block">
            {progress.solvedCaseIds.length} / {cases.length}
          </span>
        </div>

        <div className="p-3 bg-[#081426] rounded-xl border border-[#39BDF7]/20">
          <span className="text-[11px] font-mono uppercase text-[#F2F5FA]/70 block">Clues Uncovered</span>
          <span className="font-mono font-bold text-[#F05A9D] text-base sm:text-lg block">
            {progress.discoveredClueIds.length}
          </span>
        </div>

        <div className="p-3 bg-[#081426] rounded-xl border border-[#39BDF7]/20">
          <span className="text-[11px] font-mono uppercase text-[#F2F5FA]/70 block">Skill Badges</span>
          <span className="font-mono font-bold text-[#39BDF7] text-base sm:text-lg block">
            {progress.earnedBadges.length} Earned
          </span>
        </div>
      </div>

      {/* Featured Tutorial Dossier Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B1A33] border border-[#39BDF7]/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#39BDF7]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-[#F05A9D] tracking-wider px-2 py-0.5 rounded bg-[#F05A9D]/15 border border-[#F05A9D]/40">
                Recommended First Case
              </span>
              <span className="text-xs text-[#F2F5FA]/70 font-mono">
                {tutorialCase.caseNumber}
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#F2F5FA] mb-2">
              {tutorialCase.title}
            </h2>

            <p className="text-sm text-[#F2F5FA]/80 leading-relaxed mb-4">
              {tutorialCase.subtitle}. Learn the exact method scammers use to disguise tracking domains, create fake urgency, and harvest credit card numbers with $1.98 micro-fees.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#F2F5FA]/70">
              <span className="flex items-center gap-1.5 text-[#F2F5FA]">
                <MessageSquare className="w-3.5 h-3.5 text-[#39BDF7]" />
                <span>SMS Channel</span>
              </span>
              <span>·</span>
              <span>3 Red Flag Clues</span>
              <span>·</span>
              <span>Estimated 60 Seconds</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectCase(tutorialCase)}
              className="w-full sm:w-auto px-6 py-3 bg-[#39BDF7] hover:bg-[#68CEF9] active:scale-[0.98] text-[#081426] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{tutorialSolved ? 'Replay Tutorial Case' : 'Start Tutorial Case'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Board Filter & Case Grid */}
      <div className="space-y-6">
        {/* Newly Completed Detective Case Celebration Banner */}
        {justCompletedCase && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#10243C] to-[#131E3A] border-2 border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_25px_rgba(16,185,129,0.2)] animate-in fade-in duration-300">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="detective-stamp stamp-solved text-[10px] py-0.5 px-2 animate-stamp-slam">
                    OFFICIAL STAMP APPLIED
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {justCompletedCase.caseNumber} Confirmed Solved
                  </span>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1">
                  <strong className="text-white font-medium">{justCompletedCase.title}</strong> — Detective record credited with +100 XP! Takeaway habit: &ldquo;{justCompletedCase.practicalTakeaway}&rdquo;
                </p>
              </div>
            </div>

            {onClearJustCompleted && (
              <button
                type="button"
                onClick={onClearJustCompleted}
                className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-mono text-[#94A3B8] hover:text-white bg-[#0B132B]/80 hover:bg-[#0B132B] border border-[#1E293B] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            )}
          </div>
        )}

        <div className="space-y-4 pb-4 border-b border-[#1E293B]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                Detective Mission Dossiers
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Investigate incoming texts, emails, and marketplace posts. Filter by difficulty level or channel to match your skill.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onSwitchToCityMap && (
                <button
                  type="button"
                  onClick={onSwitchToCityMap}
                  className="text-xs text-[#00F0FF] hover:brightness-125 flex items-center gap-1.5 font-mono px-3 py-1.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 transition-all cursor-pointer shadow-xs"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>View Neon City Map</span>
                </button>
              )}

              {(difficultyFilter !== 'all' || channelFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setDifficultyFilter('all');
                    setChannelFilter('all');
                  }}
                  className="self-start sm:self-auto text-xs text-[#39BDF7] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0B1A33] border border-[#39BDF7]/25 p-3 rounded-2xl">
            {/* 1. Difficulty Level Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono text-[#F2F5FA]/80 flex items-center gap-1.5 mr-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-[#39BDF7]" />
                <span>Difficulty:</span>
              </span>

              <button
                type="button"
                onClick={() => setDifficultyFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  difficultyFilter === 'all'
                    ? 'bg-[#081426] text-[#39BDF7] font-bold border border-[#39BDF7]/50 shadow-xs'
                    : 'text-[#F2F5FA]/70 hover:text-white hover:bg-[#081426]/60'
                }`}
              >
                All Levels ({difficultyCounts.all})
              </button>

              <button
                type="button"
                onClick={() => setDifficultyFilter('Beginner')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  difficultyFilter === 'Beginner'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                    : 'text-[#F2F5FA]/70 hover:text-emerald-400 hover:bg-[#081426]/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Beginner ({difficultyCounts.Beginner})</span>
              </button>

              <button
                type="button"
                onClick={() => setDifficultyFilter('Intermediate')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  difficultyFilter === 'Intermediate'
                    ? 'bg-[#F05A9D]/20 text-[#F05A9D] font-bold border border-[#F05A9D]/40 shadow-xs'
                    : 'text-[#F2F5FA]/70 hover:text-[#F05A9D] hover:bg-[#081426]/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05A9D]" />
                <span>Intermediate ({difficultyCounts.Intermediate})</span>
              </button>

              <button
                type="button"
                onClick={() => setDifficultyFilter('Master')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  difficultyFilter === 'Master'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                    : 'text-[#F2F5FA]/70 hover:text-purple-400 hover:bg-[#081426]/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Master ({difficultyCounts.Master})</span>
              </button>
            </div>

            {/* 2. Channel Filter Bar */}
            <div className="flex items-center gap-1 border-t md:border-t-0 md:border-l border-[#39BDF7]/20 pt-2 md:pt-0 md:pl-3 overflow-x-auto">
              <span className="text-[11px] font-mono text-[#F2F5FA]/60 hidden lg:inline mr-1">
                Channel:
              </span>
              {[
                { id: 'all', label: 'All Channels' },
                { id: 'sms', label: 'SMS' },
                { id: 'email', label: 'Email' },
                { id: 'marketplace', label: 'Market' },
                { id: 'chat', label: 'Chat' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setChannelFilter(f.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    channelFilter === f.id
                      ? 'bg-[#081426] text-[#39BDF7] font-bold border border-[#39BDF7]/50'
                      : 'text-[#F2F5FA]/70 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State when no cases match filter */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0B1A33] border border-[#39BDF7]/20 space-y-3">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-[#39BDF7]" />
            <h3 className="font-heading font-bold text-[#F2F5FA] text-base">
              No cases found for this combination
            </h3>
            <p className="text-xs text-[#F2F5FA]/70 max-w-sm mx-auto">
              No {difficultyFilter !== 'all' ? `${difficultyFilter} difficulty ` : ''}cases found in the {channelFilter !== 'all' ? `${channelFilter.toUpperCase()} channel` : 'selected category'}.
            </p>
            <button
              type="button"
              onClick={() => {
                setDifficultyFilter('all');
                setChannelFilter('all');
              }}
              className="px-4 py-2 bg-[#39BDF7] hover:bg-[#68CEF9] text-[#081426] text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Case Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCases.map((c) => {
              const isSolved = progress.solvedCaseIds.includes(c.id);
              const isJustCompleted = c.id === justCompletedCaseId;
              const normalizedDiff = normalizeDifficulty(c.difficulty);

              return (
                <div
                  id={`case-card-${c.id}`}
                  key={c.id}
                  className={`group relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isJustCompleted
                      ? 'bg-[#0B1A33] border-emerald-500/80 animate-card-highlight shadow-[0_0_24px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/40'
                      : isSolved
                      ? 'bg-[#081426] border-emerald-500/40 hover:border-emerald-500/70'
                      : 'bg-[#0B1A33] border-[#39BDF7]/20 hover:border-[#F05A9D]/60'
                  }`}
                >
                  <div>
                    {/* Top Header: Case Number & Channel */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-[#F05A9D] tracking-wider">
                        {c.caseNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#F2F5FA]/80 bg-[#081426] px-2.5 py-1 rounded-md border border-[#39BDF7]/25">
                        {channelIcons[c.channel]}
                        <span className="uppercase">{c.channel}</span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-heading text-lg font-bold text-[#F2F5FA] group-hover:text-[#39BDF7] transition-colors mb-1.5 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#F2F5FA]/70 mb-4 line-clamp-2">
                      {c.subtitle}
                    </p>

                    {/* Clues & Difficulty Badge */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#F2F5FA]/60 mb-5 font-mono">
                      <span className="text-[#F2F5FA]/90">
                        {c.clues.length} clues hiding
                      </span>

                      {/* Difficulty Level Tag */}
                      {normalizedDiff === 'Beginner' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                          <span>●</span>
                          <span>Beginner</span>
                        </span>
                      )}

                      {normalizedDiff === 'Intermediate' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#F05A9D] bg-[#F05A9D]/15 border border-[#F05A9D]/40 flex items-center gap-1">
                          <span>●●</span>
                          <span>Intermediate</span>
                        </span>
                      )}

                      {normalizedDiff === 'Master' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 flex items-center gap-1">
                          <span>●●●</span>
                          <span>Master</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action & Status */}
                  <div className="pt-4 border-t border-[#39BDF7]/20 flex items-center justify-between">
                    {isSolved ? (
                      <div className="relative inline-flex items-center">
                        {isJustCompleted && (
                          <span className="absolute -inset-1 rounded border-2 border-emerald-400 animate-ink-ripple pointer-events-none" />
                        )}
                        <span
                          className={`detective-stamp stamp-solved text-[11px] ${
                            isJustCompleted
                              ? 'animate-stamp-slam shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400/50'
                              : ''
                          }`}
                        >
                          CASE SOLVED
                        </span>
                        {isJustCompleted && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40 animate-pulse flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                            <span>STAMPED!</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[#F2F5FA]/60 font-mono">
                        Unsolved
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectCase(c)}
                      className="min-h-[40px] px-4 py-2 bg-[#081426] hover:bg-[#39BDF7] hover:text-[#081426] text-[#F2F5FA] font-semibold text-xs rounded-xl border border-[#39BDF7]/40 hover:border-[#39BDF7] transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
                    >
                      <span>{isSolved ? 'Review Case' : 'Open Case File'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

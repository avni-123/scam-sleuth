import React from 'react';
import {
  ShieldAlert,
  Award,
  FileSearch,
  Sparkles,
  RefreshCw,
  Terminal,
  Compass,
  Map,
  Zap,
} from 'lucide-react';
import { PlayerProgress } from '../types/game.ts';

interface HeaderProps {
  currentView: 'map' | 'cases' | 'prologue' | 'investigate' | 'outcome' | 'reveal' | 'report' | 'locker' | 'lab';
  onNavigate: (view: 'map' | 'cases' | 'locker' | 'lab') => void;
  progress: PlayerProgress;
  onResetProgress: () => void;
  onQuickPlay?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  progress,
  onResetProgress,
  onQuickPlay,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#081426]/95 backdrop-blur-md border-b border-[#39BDF7]/20 px-4 md:px-8 py-3 transition-all text-[#F2F5FA]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element with icon) */}
        <div
          onClick={() => onNavigate('map')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#081426] border border-[#39BDF7]/40 text-[#39BDF7] flex items-center justify-center shadow-[0_0_12px_rgba(57,189,247,0.3)] group-hover:border-[#F05A9D] transition-all">
            <ShieldAlert className="w-5 h-5 text-[#39BDF7]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-black tracking-tight text-[#F2F5FA] whitespace-nowrap block leading-tight">
                Scam Sleuth
              </span>
              <span className="text-[10px] font-mono font-bold text-[#F05A9D] px-1.5 py-0.2 rounded bg-[#F05A9D]/15 border border-[#F05A9D]/40">
                CYBER
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#F2F5FA]/70 tracking-wider block uppercase">
              Cyber Detective Mystery Game
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#F2F5FA]/70">
          <button
            onClick={() => onNavigate('map')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              currentView === 'map'
                ? 'text-[#39BDF7] font-bold border-b-2 border-[#39BDF7] pb-0.5'
                : ''
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>City Map</span>
          </button>

          <button
            onClick={() => onNavigate('cases')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              currentView === 'cases' || currentView === 'investigate' || currentView === 'prologue'
                ? 'text-[#F05A9D] font-bold border-b-2 border-[#F05A9D] pb-0.5'
                : ''
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Detective Desk</span>
          </button>

          <button
            onClick={() => onNavigate('locker')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              currentView === 'locker'
                ? 'text-[#F05A9D] font-bold border-b-2 border-[#F05A9D] pb-0.5'
                : ''
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Evidence Locker ({progress.earnedBadges.length})</span>
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              currentView === 'lab'
                ? 'text-[#39BDF7] font-bold border-b-2 border-[#39BDF7] pb-0.5'
                : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F05A9D]" />
            <span>Inspector Lab</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Quick Play & Detective Status */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {onQuickPlay && (
            <button
              onClick={onQuickPlay}
              className="px-3.5 py-1.5 bg-[#39BDF7] hover:bg-[#68CEF9] active:scale-[0.98] text-[#081426] font-heading font-black text-xs rounded-xl shadow-[0_0_15px_rgba(57,189,247,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Jump into first case immediately"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">QUICK PLAY</span>
              <span className="sm:hidden">PLAY</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-[#081426] border border-[#39BDF7]/30 px-3 py-1.5 rounded-xl text-xs">
            <Award className="w-4 h-4 text-[#F05A9D]" />
            <div className="text-left">
              <span className="text-[10px] text-[#F2F5FA]/70 block uppercase font-mono tracking-wider leading-none">
                {progress.rank}
              </span>
              <span className="font-mono font-bold text-[#F2F5FA] text-xs leading-none">
                {progress.xp} XP
              </span>
            </div>
          </div>

          <button
            onClick={onResetProgress}
            title="Reset training record"
            className="p-2 text-[#F2F5FA]/50 hover:text-[#F2F5FA] hover:bg-[#081426] rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

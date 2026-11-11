import React from 'react';
import {
  Settings as SettingsIcon,
  X,
  Volume2,
  Sliders,
  Type,
  Video,
  RotateCcw,
  Unlock,
  Sparkles,
  ALargeSmall,
  Home,
  Keyboard,
  BookOpen,
  Contrast,
} from 'lucide-react';
import { AdventureLevel, GameSettings } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
  onResetProgress?: () => void;
  onUnlockAllLevels?: () => void;
  onReturnToMenu?: () => void;
  currentLevel?: AdventureLevel;
  activeChapterNum?: 1 | 2 | 3;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetProgress,
  onUnlockAllLevels,
  onReturnToMenu,
  currentLevel,
  activeChapterNum = 1,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-2xl bg-[#091124] border-2 border-[#00F0FF]/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.22)] relative text-white space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF]">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                  PAUSE & SETTINGS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-[10px] text-[#E2E8F0]">
                  ESC
                </span>
              </div>
              <h2 className="font-heading font-black text-lg text-white">
                Case Overview, Controls & Accessibility
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReturnToMenu && (
              <button
                type="button"
                onClick={onReturnToMenu}
                className="px-3.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/50 text-pink-200 font-heading font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Return to Home Screen"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Case Story & Full 3-Chapter List (Moved from HUD into Pause/Settings & Journal) */}
        {currentLevel && (
          <div className="p-4 rounded-2xl bg-[#0C1736] border border-pink-400/35 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-pink-300 flex items-center gap-1.5 uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{currentLevel.title} · {currentLevel.locationName}</span>
              </span>
              <span className="font-mono text-[11px] text-[#00F0FF] font-bold">
                Chapter {activeChapterNum} of 3
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentLevel.environmentDescription} {currentLevel.objective}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {currentLevel.chapters.map((ch) => {
                const isCurrent = ch.number === activeChapterNum;
                return (
                  <div
                    key={ch.number}
                    className={`p-2.5 rounded-xl border text-xs ${
                      isCurrent
                        ? 'bg-pink-500/18 border-pink-400 text-[#F8FAFC]'
                        : 'bg-[#070E22] border-sky-500/20 text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-pink-300 font-bold block uppercase">
                      Chapter {ch.number} · {ch.phase}
                    </span>
                    <span className="font-heading font-bold block mt-0.5">{ch.title}</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{ch.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Control List Reference */}
        <div className="p-4 rounded-2xl bg-[#0C1736] border border-sky-500/25 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
            <Keyboard className="w-4 h-4" />
            <span>Full Controls Reference</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-pink-300 font-bold block">WASD / Arrows</span>
              <span className="text-slate-300 text-[11px]">Move Investigator</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-pink-300 font-bold block">E Key</span>
              <span className="text-slate-300 text-[11px]">Interact / Inspect</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-pink-300 font-bold block">Q Key</span>
              <span className="text-slate-300 text-[11px]">Inspect Clues</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#F8FAFC] font-bold block">J Key</span>
              <span className="text-slate-300 text-[11px]">Case Journal</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#F8FAFC] font-bold block">Mouse</span>
              <span className="text-slate-300 text-[11px]">Look Around</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#F8FAFC] font-bold block">Shift</span>
              <span className="text-slate-300 text-[11px]">Move Faster</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#F8FAFC] font-bold block">V Key</span>
              <span className="text-slate-300 text-[11px]">1st / 3rd Person</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#00F0FF] font-bold block">T Key</span>
              <span className="text-slate-300 text-[11px]">Talk to Person</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#00F0FF] font-bold block">P Key</span>
              <span className="text-slate-300 text-[11px]">Show / Hide Phone</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-pink-300 font-bold block">H Key</span>
              <span className="text-slate-300 text-[11px]">Hide / Show Panel</span>
            </div>
            <div className="p-2 rounded-xl bg-[#070E22] border border-sky-500/20">
              <span className="text-[#00F0FF] font-bold block">ESC Key</span>
              <span className="text-slate-300 text-[11px]">Pause / Settings</span>
            </div>
          </div>
        </div>

        {/* Setting Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Camera View Mode (3rd Person / 1st Person) */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Camera Perspective
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  1st-person or 3rd-person view
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ isFirstPerson: !settings.isFirstPerson })}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                settings.isFirstPerson
                  ? 'bg-[#00F0FF] text-[#070D1E] border-white'
                  : 'bg-pink-500 text-white border-pink-400'
              }`}
            >
              {settings.isFirstPerson ? '1st Person' : '3rd Person'}
            </button>
          </div>

          {/* Voice Audio for Characters and Investigator */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Character & Detective Voices
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Audios spoken when on manual
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  voiceAudioEnabled: settings.voiceAudioEnabled === false ? true : false,
                })
              }
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                settings.voiceAudioEnabled !== false
                  ? 'bg-[#00F0FF] text-[#070D1E] border-white'
                  : 'bg-[#1C2541] text-[#94A3B8] border-white/20'
              }`}
            >
              {settings.voiceAudioEnabled !== false ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Dialogue Subtitles */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Dialogue Subtitles
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Show speaker subtitles
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ subtitlesEnabled: !settings.subtitlesEnabled })}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                settings.subtitlesEnabled
                  ? 'bg-emerald-400 text-[#070D1E] border-emerald-300'
                  : 'bg-[#1C2541] text-[#94A3B8] border-white/20'
              }`}
            >
              {settings.subtitlesEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Subtitle Auto-Advance */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Auto-Advance Subtitles
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Advance dialogue automatically
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  subtitleAutoAdvance: !settings.subtitleAutoAdvance,
                })
              }
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                settings.subtitleAutoAdvance
                  ? 'bg-emerald-400 text-[#070D1E] border-emerald-300'
                  : 'bg-[#1C2541] text-[#94A3B8] border-white/20'
              }`}
            >
              {settings.subtitleAutoAdvance ? 'AUTO' : 'MANUAL'}
            </button>
          </div>

          {/* Subtitle Size */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Subtitle Text Size
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Adjust subtitle readability
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {(['normal', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdateSettings({ subtitleSize: size })}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer border ${
                    (settings.subtitleSize || 'normal') === size
                      ? 'bg-emerald-400 text-[#070D1E] border-emerald-300'
                      : 'bg-[#1C2541] text-[#94A3B8] border-white/10 hover:text-white'
                  }`}
                >
                  {size === 'extra-large' ? 'XL' : size === 'large' ? 'LG' : 'MD'}
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle Background Opacity */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Subtitle Background Opacity
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Translucent or solid backdrop
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {(['translucent', 'dark', 'solid'] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => onUpdateSettings({ subtitleOpacity: op })}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer border capitalize ${
                    (settings.subtitleOpacity || 'dark') === op
                      ? 'bg-emerald-400 text-[#070D1E] border-emerald-300'
                      : 'bg-[#1C2541] text-[#94A3B8] border-white/10 hover:text-white'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  Reduced Motion
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Minimize camera bobbing
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                settings.reducedMotion
                  ? 'bg-purple-400 text-[#070D1E] border-purple-300'
                  : 'bg-[#1C2541] text-[#94A3B8] border-white/20'
              }`}
            >
              {settings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Contrast className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <div>
                <span className="font-heading font-bold text-xs text-white block">
                  High Contrast Borders
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Stronger UI outlines
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                settings.highContrast
                  ? 'bg-[#00F0FF] text-[#070D1E] border-white'
                  : 'bg-[#1C2541] text-[#94A3B8] border-white/20'
              }`}
            >
              {settings.highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Camera Sensitivity */}
          <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Camera Sensitivity</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#00F0FF]">
                {settings.mouseSensitivity.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={settings.mouseSensitivity}
              onChange={(e) => onUpdateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
              className="w-full accent-[#00F0FF] cursor-pointer"
            />
          </div>
        </div>

        {/* Sound Volume */}
        <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-pink-400" />
              <span className="font-heading font-bold text-white">
                Sound & Audio Volume
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-pink-300">
              {Math.round(settings.soundVolume * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.soundVolume}
            onChange={(e) => {
              const vol = parseFloat(e.target.value);
              onUpdateSettings({ soundVolume: vol });
              soundEngine.setVolume(vol);
            }}
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>

        {/* Atmospheric Room Tone & Hum Volume */}
        <div className="p-3.5 rounded-2xl bg-[#0E1A38] border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-heading font-bold text-white">
                Atmospheric Ambience (Room Tone & Hum)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ambientAudioEnabled: settings.ambientAudioEnabled === false ? true : false,
                  })
                }
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border cursor-pointer ${
                  settings.ambientAudioEnabled !== false
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/40'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                {settings.ambientAudioEnabled !== false ? 'ENABLED' : 'MUTED'}
              </button>
              <span className="font-mono text-xs font-bold text-[#00F0FF]">
                {Math.round((settings.ambientVolume ?? 0.65) * 100)}%
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.ambientVolume ?? 0.65}
            onChange={(e) => {
              const ambVol = parseFloat(e.target.value);
              onUpdateSettings({ ambientVolume: ambVol });
              soundEngine.setAmbientVolume(ambVol);
            }}
            className="w-full accent-[#00F0FF] cursor-pointer"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {onReturnToMenu && (
              <button
                type="button"
                onClick={onReturnToMenu}
                className="px-3.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/50 text-xs font-mono font-bold text-pink-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}
            {onResetProgress && (
              <button
                type="button"
                onClick={onResetProgress}
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart from Level 1</span>
              </button>
            )}
            {onUnlockAllLevels && (
              <button
                type="button"
                onClick={onUnlockAllLevels}
                className="text-xs font-mono text-pink-300 hover:text-pink-200 flex items-center gap-1 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock All 10 Levels</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#070D1E] font-heading font-black text-xs transition-colors cursor-pointer shadow-[0_0_16px_rgba(0,240,255,0.28)]"
          >
            RESUME GAME (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

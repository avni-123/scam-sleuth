import React, { useRef, useState } from 'react';
import {
  Settings as SettingsIcon,
  X,
  Volume2,
  Sliders,
  Type,
  Video,
  RotateCcw,
  Sparkles,
  Home,
  Keyboard,
  BookOpen,
  Contrast,
  Play,
  Pause,
} from 'lucide-react';
import { AdventureLevel, GameSettings } from '../../types/adventure';
import { soundEngine } from '../../utils/proceduralAudio';
import { PixelSettingsGearIcon } from './PixelIcons';

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
  onReturnToMenu,
  currentLevel,
  activeChapterNum = 1,
}) => {
  const isPauseMenu = Boolean(currentLevel);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const settingsSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectResume = () => {
    soundEngine.playGtaMenuSelect();
    onClose();
  };

  const handleOpenSettingsSection = () => {
    soundEngine.playGtaMenuHover();
    setActiveTab('settings');
    settingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#081426]/90 backdrop-blur-md animate-fade-in pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label={isPauseMenu ? 'Pause Menu' : 'Settings'}
    >
      <div className="w-full max-w-2xl pixel-panel border-4 border-[#0D1C34] p-5 sm:p-7 relative text-[#F2F5FA] space-y-5 max-h-[92vh] overflow-y-auto animate-block-reveal rounded-none shadow-[0_20px_50px_rgba(2,6,23,0.95),0_0_24px_rgba(57,189,247,0.2)]">
        {/* Pixel Corner Pins */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-[#39BDF7] pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F05A9D] pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-[#F05A9D] pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-[#39BDF7] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B2F4D] gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 pixel-slot flex items-center justify-center text-[#39BDF7] rounded-none shrink-0">
              {isPauseMenu ? (
                <Pause className="w-5 h-5 text-[#F05A9D]" />
              ) : (
                <PixelSettingsGearIcon className="w-6 h-6 text-[#39BDF7]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-pixel text-[11px] text-[#39BDF7] uppercase tracking-wider">
                  {isPauseMenu ? 'GAME PAUSED // INVESTIGATION FROZEN' : 'SYS // SYSTEM CONFIGURATION'}
                </span>
                {isPauseMenu && (
                  <span className="px-1.5 py-0.5 font-pixel text-[9px] bg-[#F05A9D]/20 border border-[#F05A9D]/50 text-[#F05A9D]">
                    PAUSED
                  </span>
                )}
              </div>
              <h2 className="font-pixel text-sm sm:text-base text-[#F2F5FA] tracking-wide mt-0.5">
                {isPauseMenu ? 'PAUSE MENU' : 'INVESTIGATOR SETTINGS'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPauseMenu ? (
              <button
                type="button"
                onClick={handleSelectResume}
                className="pixel-btn-action px-4 py-2 text-[#081426] font-pixel text-xs tracking-wider cursor-pointer rounded-none flex items-center gap-1.5 shadow-[0_0_18px_rgba(57,189,247,0.45)]"
                title="Resume Gameplay"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RESUME</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="pixel-btn p-2 text-slate-400 hover:text-[#39BDF7] hover:border-[#39BDF7] cursor-pointer rounded-none"
                title="Close Settings"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Current Case Story & Chapter Slots */}
        {currentLevel && (
          <div className="p-4 pixel-slot border-2 border-[#F05A9D]/40 space-y-2.5 rounded-none relative">
            <div className="flex items-center justify-between gap-2">
              <span className="font-pixel text-[11px] text-[#F05A9D] flex items-center gap-1.5 uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{currentLevel.title} · {currentLevel.locationName}</span>
              </span>
              <span className="font-pixel text-[10px] text-[#39BDF7] px-2 py-0.5 bg-[#081426] border border-[#39BDF7]/40">
                PHASE 0{activeChapterNum} / 03
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {currentLevel.environmentDescription} {currentLevel.objective}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {currentLevel.chapters.map((ch) => {
                const isCurrent = ch.number === activeChapterNum;
                return (
                  <div
                    key={ch.number}
                    className={`p-2.5 border text-xs rounded-none ${
                      isCurrent
                        ? 'pixel-slot-active text-[#F2F5FA]'
                        : 'pixel-slot text-slate-300'
                    }`}
                  >
                    <span className="font-pixel text-[9px] text-[#F05A9D] block uppercase">
                      CHAPTER {ch.number} · {ch.phase}
                    </span>
                    <span className="font-heading font-bold block mt-0.5 text-xs">{ch.title}</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{ch.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Control List Reference as Inventory Tiles */}
        <div className="p-4 pixel-panel border-2 border-[#39BDF7]/30 space-y-2.5 rounded-none">
          <div className="flex items-center gap-2 text-xs font-pixel text-[#39BDF7] uppercase tracking-wider">
            <Keyboard className="w-3.5 h-3.5" />
            <span>HOTKEY & CONTROL MATRIX</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F05A9D] font-pixel text-[10px] block">WASD / ARROWS</span>
              <span className="text-slate-300 text-[11px]">Move Investigator</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#39BDF7] font-pixel text-[10px] block">E KEY</span>
              <span className="text-slate-300 text-[11px]">Inspect / Interact</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#39BDF7] font-pixel text-[10px] block">Q KEY</span>
              <span className="text-slate-300 text-[11px]">Evidence Scan</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F05A9D] font-pixel text-[10px] block">J KEY</span>
              <span className="text-slate-300 text-[11px]">Case Journal</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F2F5FA] font-pixel text-[10px] block">MOUSE</span>
              <span className="text-slate-300 text-[11px]">Camera Pan</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F2F5FA] font-pixel text-[10px] block">SHIFT</span>
              <span className="text-slate-300 text-[11px]">Sprint Move</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#39BDF7] font-pixel text-[10px] block">V KEY</span>
              <span className="text-slate-300 text-[11px]">1st / 3rd Person</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F05A9D] font-pixel text-[10px] block">T KEY</span>
              <span className="text-slate-300 text-[11px]">Interrogate</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#39BDF7] font-pixel text-[10px] block">P KEY</span>
              <span className="text-slate-300 text-[11px]">Phone Device</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F05A9D] font-pixel text-[10px] block">H KEY</span>
              <span className="text-slate-300 text-[11px]">Toggle HUD</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#39BDF7] font-pixel text-[10px] block">1-7 NUM</span>
              <span className="text-slate-300 text-[11px]">Quick Slot Nav</span>
            </div>
            <div className="p-2 pixel-slot rounded-none">
              <span className="text-[#F05A9D] font-pixel text-[10px] block">ESC KEY</span>
              <span className="text-slate-300 text-[11px]">Pause Menu</span>
            </div>
          </div>
        </div>

        {/* Setting Options Grid */}
        <div ref={settingsSectionRef} className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs text-[#39BDF7] uppercase tracking-wider flex items-center gap-2">
              <SettingsIcon className="w-3.5 h-3.5 text-[#F05A9D]" />
              <span>SETTINGS & AUDIO CONTROLS</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Camera View Mode (3rd Person / 1st Person) */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-[#39BDF7] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  CAMERA PERSPECTIVE
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  1st-person or 3rd-person
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ isFirstPerson: !settings.isFirstPerson })}
              className={`pixel-btn px-3 py-1 font-pixel text-[10px] transition-all cursor-pointer rounded-none border shrink-0 ${
                settings.isFirstPerson
                  ? 'bg-[#39BDF7] text-[#081426] border-[#39BDF7]'
                  : 'bg-[#F05A9D] text-white border-[#F05A9D]'
              }`}
            >
              {settings.isFirstPerson ? '1ST PERS' : '3RD PERS'}
            </button>
          </div>

          {/* Voice Audio for Characters and Investigator */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[#39BDF7] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  DETECTIVE VOICES
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Dialogue speech synthesis
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
              className={`pixel-btn px-3 py-1 font-pixel text-[10px] transition-all cursor-pointer rounded-none border shrink-0 ${
                settings.voiceAudioEnabled !== false
                  ? 'bg-[#39BDF7] text-[#081426] border-[#39BDF7]'
                  : 'bg-[#0B1A33] text-[#94A3B8] border-[#1B2F4D]'
              }`}
            >
              {settings.voiceAudioEnabled !== false ? 'ENABLED' : 'OFF'}
            </button>
          </div>

          {/* Dialogue Subtitles */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-[#39BDF7] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  CASE SUBTITLES
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Display speech captions
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ subtitlesEnabled: !settings.subtitlesEnabled })}
              className={`pixel-btn px-3 py-1 font-pixel text-[10px] transition-all cursor-pointer rounded-none border shrink-0 ${
                settings.subtitlesEnabled
                  ? 'bg-[#39BDF7] text-[#081426] border-[#39BDF7]'
                  : 'bg-[#0B1A33] text-[#94A3B8] border-[#1B2F4D]'
              }`}
            >
              {settings.subtitlesEnabled ? 'ENABLED' : 'OFF'}
            </button>
          </div>

          {/* Subtitle Auto-Advance */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-[#F05A9D] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  AUTO-ADVANCE
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Step text automatically
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
              className={`pixel-btn px-3 py-1 font-pixel text-[10px] transition-all cursor-pointer rounded-none border shrink-0 ${
                settings.subtitleAutoAdvance
                  ? 'bg-[#F05A9D] text-white border-[#F05A9D]'
                  : 'bg-[#0B1A33] text-[#94A3B8] border-[#1B2F4D]'
              }`}
            >
              {settings.subtitleAutoAdvance ? 'AUTO' : 'MANUAL'}
            </button>
          </div>

          {/* Subtitle Size */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-[#39BDF7] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  CAPTION SIZE
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Adjust readability scale
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {(['normal', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdateSettings({ subtitleSize: size })}
                  className={`pixel-btn px-2 py-0.5 font-pixel text-[9px] transition-all cursor-pointer rounded-none border ${
                    (settings.subtitleSize || 'normal') === size
                      ? 'bg-[#39BDF7] text-[#081426] border-[#39BDF7]'
                      : 'bg-[#0B1A33] text-slate-300 border-[#1B2F4D] hover:text-white'
                  }`}
                >
                  {size === 'extra-large' ? 'XL' : size === 'large' ? 'LG' : 'MD'}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#F05A9D] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  REDUCED MOTION
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Disable camera sway & flicker
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`pixel-btn px-3 py-1 font-pixel text-[10px] transition-all cursor-pointer rounded-none border shrink-0 ${
                settings.reducedMotion
                  ? 'bg-[#F05A9D] text-white border-[#F05A9D]'
                  : 'bg-[#0B1A33] text-[#94A3B8] border-[#1B2F4D]'
              }`}
            >
              {settings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-3 pixel-slot rounded-none flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Contrast className="w-4 h-4 text-[#39BDF7] shrink-0" />
              <div>
                <span className="font-pixel text-[11px] text-[#F2F5FA] block">
                  HIGH CONTRAST
                </span>
                <span className="text-[11px] text-[#94A3B8] block">
                  Enhanced pixel borders
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`pixel-btn px-3 py-1 font-pixel text-[10px] transition-all cursor-pointer rounded-none border shrink-0 ${
                settings.highContrast
                  ? 'bg-[#39BDF7] text-[#081426] border-[#39BDF7]'
                  : 'bg-[#0B1A33] text-[#94A3B8] border-[#1B2F4D]'
              }`}
            >
              {settings.highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Camera Sensitivity */}
          <div className="p-3 pixel-slot rounded-none space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-pixel text-[10px] text-[#F2F5FA] flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-[#39BDF7]" />
                <span>AIM SENSITIVITY</span>
              </span>
              <span className="font-pixel text-[10px] text-[#39BDF7]">
                {settings.mouseSensitivity.toFixed(1)}X
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={settings.mouseSensitivity}
              onChange={(e) => onUpdateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
              className="w-full accent-[#39BDF7] cursor-pointer"
            />
          </div>
          </div>
        </div>

        {/* Master Sound Volume */}
        <div className="p-3.5 pixel-slot rounded-none space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#F05A9D]" />
              <span className="font-pixel text-[11px] text-[#F2F5FA]">
                SFX & FOLEY VOLUME
              </span>
            </div>
            <span className="font-pixel text-xs text-[#F05A9D]">
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
            className="w-full accent-[#F05A9D] cursor-pointer"
          />
        </div>

        {/* Atmospheric Room Tone & Hum Volume */}
        <div className="p-3.5 pixel-slot rounded-none space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#39BDF7]" />
              <span className="font-pixel text-[11px] text-[#F2F5FA]">
                CYBER CITY AMBIENCE
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
                className={`pixel-btn px-2 py-0.5 font-pixel text-[9px] border cursor-pointer rounded-none ${
                  settings.ambientAudioEnabled !== false
                    ? 'bg-[#39BDF7]/20 text-[#39BDF7] border-[#39BDF7]/60'
                    : 'bg-[#081426] text-slate-400 border-[#1B2F4D]'
                }`}
              >
                {settings.ambientAudioEnabled !== false ? 'ACTIVE' : 'MUTED'}
              </button>
              <span className="font-pixel text-xs text-[#39BDF7]">
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
            className="w-full accent-[#39BDF7] cursor-pointer"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#1B2F4D] gap-2 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {onReturnToMenu && (
              <button
                type="button"
                onClick={onReturnToMenu}
                className="pixel-btn px-3.5 py-2 text-xs font-pixel text-[#F05A9D] border border-[#F05A9D]/50 hover:border-[#F05A9D] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-none uppercase"
              >
                <Home className="w-3.5 h-3.5" />
                <span>RETURN TO TITLE</span>
              </button>
            )}
            {onResetProgress && (
              <button
                type="button"
                onClick={onResetProgress}
                className="font-pixel text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET ALL PROGRESS</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {isPauseMenu && (
              <button
                type="button"
                onClick={handleOpenSettingsSection}
                className={`pixel-btn px-4 py-2.5 font-pixel text-xs tracking-wider cursor-pointer rounded-none flex items-center gap-2 border ${
                  activeTab === 'settings'
                    ? 'border-[#F05A9D] text-[#F05A9D] bg-[#F05A9D]/15'
                    : 'border-[#39BDF7]/50 text-[#39BDF7] hover:border-[#39BDF7]'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>SETTINGS</span>
              </button>
            )}

            <button
              type="button"
              autoFocus
              onClick={handleSelectResume}
              className="pixel-btn-action px-6 py-2.5 text-[#081426] font-pixel text-xs tracking-wider cursor-pointer rounded-none flex items-center gap-2 shadow-[0_0_20px_rgba(57,189,247,0.45)]"
            >
              {isPauseMenu && <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPauseMenu ? 'RESUME' : 'DONE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


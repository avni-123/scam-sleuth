import React from 'react';
import {
  BookOpen,
  X,
  CheckCircle2,
  Lock,
  Award,
  Compass,
  Search,
} from 'lucide-react';
import { AdventureLevel, InspectionData } from '../../types/adventure';
import { ADVENTURE_LEVELS } from '../../data/adventureLevels';
import detectivePortraitImg from '../../assets/images/detective_character_portrait_1794034150867.jpg';
import {
  PixelBadgeIcon,
  PixelCaseFolderIcon,
  PixelMagnifierIcon,
  PixelFloppyDiskIcon,
  PixelUsbDriveIcon,
  PixelPhoneIcon,
  PixelQrIcon,
  PixelNotebookIcon,
  PixelMessageIcon,
  PixelKeycardIcon,
  PixelAudioTapeIcon,
  PixelCameraIcon,
} from './PixelIcons';

const getClueIcon = (objName: string, title: string) => {
  const t = (objName + ' ' + title).toLowerCase();
  if (t.includes('phone') || t.includes('call') || t.includes('sms') || t.includes('caller')) return PixelPhoneIcon;
  if (t.includes('qr') || t.includes('code') || t.includes('scan')) return PixelQrIcon;
  if (t.includes('usb') || t.includes('drive') || t.includes('crypto') || t.includes('flash')) return PixelUsbDriveIcon;
  if (t.includes('card') || t.includes('badge') || t.includes('nfc') || t.includes('key')) return PixelKeycardIcon;
  if (t.includes('voice') || t.includes('audio') || t.includes('tape') || t.includes('record')) return PixelAudioTapeIcon;
  if (t.includes('camera') || t.includes('cctv') || t.includes('video') || t.includes('lens')) return PixelCameraIcon;
  if (t.includes('message') || t.includes('email') || t.includes('notice') || t.includes('chat') || t.includes('text')) return PixelMessageIcon;
  if (t.includes('notebook') || t.includes('letter') || t.includes('contract') || t.includes('invoice') || t.includes('document')) return PixelNotebookIcon;
  if (t.includes('disk') || t.includes('floppy') || t.includes('file')) return PixelFloppyDiskIcon;
  return PixelMagnifierIcon;
};

interface CaseJournalModalProps {
  currentLevel: AdventureLevel;
  collectedClues: Record<string, InspectionData>;
  completedLevels: string[];
  badges: string[];
  onClose: () => void;
}

export const CaseJournalModal: React.FC<CaseJournalModalProps> = ({
  currentLevel,
  collectedClues,
  completedLevels,
  badges,
  onClose,
}) => {
  const levelClues = currentLevel.objects.map((obj) => ({
    objName: obj.name,
    inspection: obj.inspection,
  }));
  const totalLevels = ADVENTURE_LEVELS.length; // 10 Levels
  const foundCount = Object.keys(collectedClues).length;
  const remainingCount = Math.max(0, levelClues.length - foundCount);

  const firstUnfound = currentLevel.objects.find(
    (o) => !collectedClues[o.inspection.clueId]
  );
  const currentObjectiveText = firstUnfound
    ? `Inspect ${firstUnfound.name}`
    : `Make the safe verification decision with ${currentLevel.npcs[0]?.name || 'the resident'}`;

  const lastCompletedLevel = (() => {
    if (completedLevels.length === 0) return null;
    for (let i = ADVENTURE_LEVELS.length - 1; i >= 0; i--) {
      if (completedLevels.includes(ADVENTURE_LEVELS[i].id)) {
        return ADVENTURE_LEVELS[i];
      }
    }
    return null;
  })();

  const progressPercent = Math.max(
    10,
    Math.round((foundCount / Math.max(1, levelClues.length)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081426]/90 backdrop-blur-md animate-fade-in pointer-events-auto cursor-default">
      <div className="w-full max-w-4xl pixel-panel border-4 border-[#0D1C34] p-6 sm:p-8 relative text-[#F2F5FA] space-y-6 max-h-[90vh] overflow-y-auto rounded-none animate-block-reveal shadow-[0_24px_60px_rgba(2,6,23,0.95),0_0_30px_rgba(57,189,247,0.2)]">
        {/* Pixel Corner Pins */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-[#39BDF7] pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F05A9D] pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-[#F05A9D] pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-[#39BDF7] pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1B2F4D]">
          <div className="flex items-center gap-3.5">
            <div className="relative border-2 border-[#F05A9D] bg-[#0B1A33] p-0.5 rounded-none shrink-0 shadow-[0_0_12px_rgba(240,90,157,0.3)]">
              <img
                src={detectivePortraitImg}
                alt="Detective Rowan Vance"
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-cover object-top rounded-none"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute -bottom-1.5 -right-1.5 px-1 py-0.2 bg-[#39BDF7] text-[#081426] font-pixel text-[8px] font-bold">
                RANK
              </div>
            </div>
            <div>
              <div className="font-pixel text-[10px] sm:text-[11px] text-[#F05A9D] flex items-center gap-1.5 flex-wrap">
                <span>DETECTIVE ROWAN VANCE</span>
                <span className="text-[#39BDF7]">
                  // {completedLevels.length}/{totalLevels} CASES CLOSED
                </span>
              </div>
              <h2 className="font-pixel text-base sm:text-lg text-[#F2F5FA] tracking-wide mt-0.5">
                INVESTIGATOR'S CASE JOURNAL
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="pixel-btn p-2 text-slate-400 hover:text-[#39BDF7] hover:border-[#39BDF7] transition-colors cursor-pointer rounded-none"
            title="Close Journal [J]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Level, Objective & Clue Progress Hotbar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 pixel-slot border-2 border-[#39BDF7]/40 space-y-1.5 rounded-none relative">
            <div className="flex items-center gap-2 text-xs font-pixel text-[#39BDF7]">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>CURRENT OBJECTIVE // {currentLevel.locationName}</span>
            </div>
            <div className="font-pixel text-xs sm:text-sm text-[#F2F5FA] leading-snug">
              {currentObjectiveText}
            </div>
            <p className="text-xs text-slate-300 font-sans">{currentLevel.title}</p>
          </div>

          <div className="p-4 pixel-slot border-2 border-[#F05A9D]/40 space-y-2 rounded-none">
            <div className="flex items-center justify-between text-xs font-pixel">
              <span className="text-[#F2F5FA] flex items-center gap-1.5 text-[11px]">
                <Search className="w-3 h-3 text-[#F05A9D] shrink-0" />
                <span>CASE CLUE PROGRESS</span>
              </span>
              <span className="text-[#F05A9D] text-[11px]">
                {foundCount}/{levelClues.length} LOGGED
              </span>
            </div>

            {/* Stepped Pixel Progress Bar */}
            <div className="w-full h-3 bg-[#081426] border-2 border-[#1B2F4D] p-0.5 rounded-none relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F05A9D] to-[#39BDF7] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-pixel text-slate-300">
              <span>{remainingCount} CLUES REMAINING</span>
              <span className="text-[#39BDF7]">PRESS [E] NEAR OBJECTS</span>
            </div>
          </div>
        </div>

        {/* Logged Clues in Current Case styled as Detective Inventory Slots */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1B2F4D] pb-1.5">
            <h3 className="font-pixel text-xs sm:text-sm text-[#F2F5FA] flex items-center gap-2">
              <PixelMagnifierIcon className="w-4 h-4 text-[#F05A9D]" />
              <span>EVIDENCE & CLUE INVENTORY // {currentLevel.title}</span>
            </h3>
            <span className="font-pixel text-[10px] text-[#39BDF7]">
              SLOTS: {levelClues.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {levelClues.map(({ objName, inspection: clue }, idx) => {
              const isFound = Boolean(collectedClues[clue.clueId]);
              const ClueIcon = getClueIcon(objName, clue.title);

              return (
                <div
                  key={clue.clueId}
                  className={`p-3.5 border-2 transition-all space-y-2.5 rounded-none relative ${
                    isFound
                      ? 'pixel-slot-active animate-tile-pop'
                      : 'pixel-slot hover:border-[#39BDF7]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Recessed Square Evidence Icon Slot */}
                      <div
                        className={`w-9 h-9 border-2 flex items-center justify-center shrink-0 rounded-none ${
                          isFound
                            ? 'border-[#39BDF7] bg-[#091D3B] text-[#39BDF7] shadow-[0_0_8px_rgba(57,189,247,0.4)]'
                            : 'border-[#152B4D] bg-[#040914] text-slate-600'
                        }`}
                      >
                        <ClueIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] font-pixel text-[#94A3B8] block">
                          EVIDENCE 0{idx + 1}
                        </span>
                        <h4 className="font-pixel text-xs text-[#F2F5FA] leading-tight truncate">
                          {isFound ? clue.title : objName}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[8.5px] font-pixel shrink-0 px-1.5 py-0.5 border ${
                        isFound
                          ? 'bg-[#39BDF7]/15 text-[#39BDF7] border-[#39BDF7]/50 font-bold'
                          : 'bg-[#F05A9D]/15 text-[#F05A9D] border-[#F05A9D]/50'
                      }`}
                    >
                      {isFound ? 'VERIFIED' : 'UNFOUND'}
                    </span>
                  </div>

                  {isFound ? (
                    <>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {clue.evidenceClue}
                      </p>
                      <div className="pt-1.5 border-t border-[#1B2F4D] flex items-center justify-between text-[9.5px] font-pixel text-[#F05A9D]">
                        <span>SRC: {clue.senderOrSource}</span>
                        <span className="text-[#39BDF7]">TAG // COLLECTED</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Approach <strong className="text-[#F2F5FA]">{objName}</strong> in {currentLevel.locationName} and press [E] to log evidence.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Case Recap */}
        {lastCompletedLevel && (
          <div className="p-3.5 pixel-slot border-2 border-[#39BDF7]/40 space-y-1 rounded-none">
            <div className="flex items-center justify-between text-xs font-pixel text-[#39BDF7] flex-wrap gap-1">
              <span>CASE ARCHIVE LOG // {lastCompletedLevel.title}</span>
              <span className="text-[#F05A9D]">BADGE AWARD: {lastCompletedLevel.debrief.badgeName}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {lastCompletedLevel.debrief.summary} <strong>Protocol Habit:</strong> {lastCompletedLevel.debrief.realWorldHabit}
            </p>
          </div>
        )}

        {/* Achievements: 10 Collectible Pixel Badge Tiles */}
        <div className="space-y-3 pt-2 border-t-2 border-[#1B2F4D]">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs sm:text-sm text-[#F2F5FA] flex items-center gap-2">
              <PixelBadgeIcon className="w-4 h-4 text-[#F05A9D]" />
              <span>COLLECTIBLE BADGE DOCKET ({badges.length}/{totalLevels})</span>
            </span>
            <span className="font-pixel text-[10px] text-[#39BDF7]">
              HOTKEY [J] TO TOGGLE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {ADVENTURE_LEVELS.map((lvl, idx) => {
              const bName = lvl.debrief.badgeName;
              const isEarned = badges.includes(bName) || completedLevels.includes(lvl.id);
              return (
                <div
                  key={lvl.id}
                  className={`p-2.5 border-2 text-xs flex flex-col justify-between gap-2 rounded-none transition-all ${
                    isEarned
                      ? 'voxel-badge-unlocked shadow-[0_0_10px_rgba(240,90,157,0.35)]'
                      : 'voxel-badge-locked opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between font-pixel text-[8.5px]">
                    <span className={isEarned ? 'text-[#F05A9D] font-bold' : 'text-slate-400'}>
                      BADGE 0{idx + 1}
                    </span>
                    {isEarned ? (
                      <span className="w-2 h-2 bg-[#F05A9D] shadow-[0_0_6px_#F05A9D]" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 border flex items-center justify-center shrink-0 ${
                        isEarned
                          ? 'border-[#F05A9D] bg-[#2E0B20] text-[#F05A9D]'
                          : 'border-[#102344] bg-[#03060E] text-slate-600'
                      }`}
                    >
                      <PixelBadgeIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-pixel text-[9.5px] leading-tight text-[#F2F5FA] truncate">
                      {bName}
                    </span>
                  </div>
                  <div className="text-[8px] font-pixel text-slate-400 flex items-center justify-between">
                    <span>{isEarned ? 'AWARDED' : 'LOCKED'}</span>
                    <span className="text-[#39BDF7]">SLOT 0{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn-action px-5 py-2 font-pixel text-xs text-[#081426] cursor-pointer rounded-none"
          >
            RETURN TO INVESTIGATION [J / ESC]
          </button>
        </div>
      </div>
    </div>
  );
};


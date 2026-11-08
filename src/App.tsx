import React, { useState, useEffect, useRef } from 'react';
import { ADVENTURE_LEVELS } from './data/adventureLevels';
import {
  LevelId,
  DecisionOption,
  InspectionData,
  GameSettings,
  NpcDef,
  WorldObjectDef,
} from './types/adventure';
import { AdventureWorld, NearbyTarget } from './components/3d/AdventureWorld';
import { MissionHud } from './components/adventure/MissionHud';
import { DialogueOverlay } from './components/adventure/DialogueOverlay';
import { InspectionModal } from './components/adventure/InspectionModal';
import { FourChoiceDecisionModal } from './components/adventure/FourChoiceDecisionModal';
import { ConsequenceModal } from './components/adventure/ConsequenceModal';
import { LevelDebriefModal } from './components/adventure/LevelDebriefModal';
import { CaseJournalModal } from './components/adventure/CaseJournalModal';
import { SettingsModal } from './components/adventure/SettingsModal';
import { TitleScreen } from './components/adventure/TitleScreen';
import { RealisticGameGraphicsDossier } from './components/adventure/RealisticGameGraphicsDossier';
import { ChapterInvestigationModal } from './components/adventure/ChapterInvestigationModal';
import { PreInvestigationCutscene } from './components/adventure/PreInvestigationCutscene';
import { LEVEL_INTRO_CUTSCENES, CutsceneCameraShot } from './data/levelIntroCutscenes';
import { soundEngine } from './utils/proceduralAudio';

const STORAGE_KEY_PROGRESS = 'scam_sleuth_adventure_progress_v2';
const LEGACY_STORAGE_KEY_PROGRESS = 'scam_sleuth_adventure_progress_v1';
const STORAGE_KEY_SETTINGS = 'scam_sleuth_adventure_settings_v3';

const DEFAULT_SETTINGS: GameSettings = {
  mouseSensitivity: 1.0,
  isFirstPerson: false, // Grounded 3D Investigator view showing the full 3D human investigator character (toggle POV with V anytime)
  showPhoneInHand: true, // Toggle phone inspection in hand with P key anytime
  subtitlesEnabled: true,
  voiceAudioEnabled: true,
  subtitleSize: 'normal',
  subtitleOpacity: 'dark',
  soundVolume: 0.8,
  highContrast: false,
  textSize: 'normal',
  reducedMotion: false,
};

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'title' | 'gameplay'>('title');

  // Active Adventure Level & Active Chapter (1: The Setup, 2: The Investigation, 3: The Decision)
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>('tutorial-delivery');
  const [activeChapterNum, setActiveChapterNum] = useState<1 | 2 | 3>(1);
  const [hasSpokenToNpc, setHasSpokenToNpc] = useState<boolean>(false);

  const activeLevel =
    ADVENTURE_LEVELS.find((l) => l.id === currentLevelId) || ADVENTURE_LEVELS[0];

  // Game Settings State
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Player Game Progress (Reset cleanly to Level 1)
  const [completedLevels, setCompletedLevels] = useState<LevelId[]>(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY_PROGRESS);
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved).completedLevels || [];
    } catch {
      // Ignore
    }
    return [];
  });

  const [earnedBadges, setEarnedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved).badges || [];
    } catch {
      // Ignore
    }
    return [];
  });

  // Collected Evidence Clues by Level (levelId -> (clueId -> InspectionData))
  const [cluesByLevel, setCluesByLevel] = useState<Record<string, Record<string, InspectionData>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved).cluesByLevel || {};
    } catch {
      // Ignore
    }
    return {};
  });

  // Collected Evidence Clues in Current Mission (clueId -> InspectionData)
  const collectedClues = cluesByLevel[currentLevelId] || {};
  const setCollectedClues = (
    updater:
      | Record<string, InspectionData>
      | ((prev: Record<string, InspectionData>) => Record<string, InspectionData>)
  ) => {
    setCluesByLevel((prev) => {
      const currentMap = prev[currentLevelId] || {};
      const nextMap = typeof updater === 'function' ? updater(currentMap) : updater;
      return { ...prev, [currentLevelId]: nextMap };
    });
  };

  // Active Modals & Overlays
  const [activeNearby, setActiveNearby] = useState<NearbyTarget | null>(null);
  const [activeDialogueNpc, setActiveDialogueNpc] = useState<NpcDef | null>(null);
  const [inspectingObject, setInspectingObject] = useState<WorldObjectDef | null>(null);
  const [decisionActive, setDecisionActive] = useState<boolean>(false);
  const [activeConsequence, setActiveConsequence] = useState<DecisionOption | null>(null);
  const [debriefActive, setDebriefActive] = useState<boolean>(false);
  const [journalOpen, setJournalOpen] = useState<boolean>(false);
  const [chapterQuestionOpen, setChapterQuestionOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [artDossierOpen, setArtDossierOpen] = useState<boolean>(false);
  const [introCutsceneActive, setIntroCutsceneActive] = useState<boolean>(false);
  const [introCameraShot, setIntroCameraShot] = useState<CutsceneCameraShot>('character_medium');
  const [isIntroNpcSpeaking, setIsIntroNpcSpeaking] = useState<boolean>(true);
  const [openingContextSummary, setOpeningContextSummary] = useState<string | null>(null);
  const lastEscAutoOpenRef = useRef<number>(0);

  // Mobile Touch Controls State
  const [mobileMoveVector, setMobileMoveVector] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobileJogging, setIsMobileJogging] = useState<boolean>(false);

  // Sync settings and progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
    soundEngine.setVolume(settings.soundVolume);
  }, [settings]);

  // Continuous Atmospheric Soundscape: Room Tone, Fluorescent Hum, Distant City Rumble
  useEffect(() => {
    if (currentView === 'gameplay' && settings.ambientAudioEnabled !== false) {
      soundEngine.setAmbientVolume(settings.ambientVolume ?? 0.65);
      soundEngine.startAtmosphericAmbience(activeLevel.setting);
    } else {
      soundEngine.stopAtmosphericAmbience();
    }
    return () => {
      soundEngine.stopAtmosphericAmbience();
    };
  }, [currentView, activeLevel.setting, settings.ambientAudioEnabled, settings.ambientVolume]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_PROGRESS,
        JSON.stringify({
          completedLevels,
          badges: earnedBadges,
          cluesByLevel,
        })
      );
    } catch {
      // Ignore
    }
  }, [completedLevels, earnedBadges, cluesByLevel]);

  // Global Keyboard Shortcuts (Esc = Immediate Settings Popup, Q = Chapter Question, J = Journal, V = Camera)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.code === 'Escape' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        }
        // Guard against duplicate toggle if pointerlockchange just opened settings milliseconds ago
        if (performance.now() - lastEscAutoOpenRef.current < 250) {
          setSettingsOpen(true);
          return;
        }
        soundEngine.playInteract();
        setSettingsOpen((prev) => !prev);
        return;
      }

      if (introCutsceneActive) return;

      if (e.code === 'KeyQ' || e.key === 'q') {
        if (!inspectingObject && !activeDialogueNpc && !decisionActive && !activeConsequence && !settingsOpen) {
          soundEngine.playInteract();
          setChapterQuestionOpen((prev) => !prev);
        }
      }

      if (e.code === 'KeyJ' || e.key === 'j') {
        if (!inspectingObject && !activeDialogueNpc && !decisionActive && !activeConsequence && !settingsOpen) {
          setJournalOpen((prev) => !prev);
        }
      }

      if (e.code === 'KeyV' || e.key === 'v') {
        if (!settingsOpen) {
          setSettings((prev) => ({ ...prev, isFirstPerson: !prev.isFirstPerson }));
        }
      }

      if (e.code === 'KeyP' || e.key === 'p' || e.key === 'P') {
        if (!settingsOpen) {
          soundEngine.playInteract();
          setSettings((prev) => ({
            ...prev,
            showPhoneInHand: prev.showPhoneInHand === false ? true : false,
          }));
        }
      }

      if (e.code === 'KeyT' || e.key === 't' || e.key === 'T') {
        if (
          currentView === 'gameplay' &&
          !inspectingObject &&
          !activeDialogueNpc &&
          !decisionActive &&
          !activeConsequence &&
          !settingsOpen &&
          !journalOpen &&
          !chapterQuestionOpen
        ) {
          e.preventDefault();
          const targetNpc =
            (activeNearby?.type === 'npc'
              ? activeLevel.npcs.find((n) => n.id === activeNearby.id)
              : null) || activeLevel.npcs[0];
          if (targetNpc) {
            soundEngine.playInteract();
            setHasSpokenToNpc(true);
            setActiveDialogueNpc(targetNpc);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys, true);
    return () => window.removeEventListener('keydown', handleGlobalKeys, true);
  }, [
    currentView,
    activeLevel,
    activeNearby,
    inspectingObject,
    activeDialogueNpc,
    decisionActive,
    journalOpen,
    chapterQuestionOpen,
    activeConsequence,
    settingsOpen,
    introCutsceneActive,
  ]);

  // Handle In-World Proximity Interaction (NPC or Object)
  const handleWorldInteract = (target: NearbyTarget) => {
    if (introCutsceneActive) return;
    soundEngine.playInteract();

    if (target.type === 'npc') {
      const npc = activeLevel.npcs.find((n) => n.id === target.id);
      if (npc) {
        setHasSpokenToNpc(true);
        setActiveDialogueNpc(npc);
      }
    } else if (target.type === 'object') {
      // Release pointer lock only for interactive inspection modal
      if (document.pointerLockElement) {
        document.exitPointerLock?.();
      }
      const obj = activeLevel.objects.find((o) => o.id === target.id);
      if (obj) {
        setInspectingObject(obj);
      }
    }
  };

  // Launch a level (optionally starting at Chapter 1, 2, or 3)
  const startLevel = (levelId: LevelId, initialChapter: 1 | 2 | 3 = 1, resetClues = false) => {
    soundEngine.playGtaMissionStart();
    setCurrentLevelId(levelId);
    setActiveChapterNum(initialChapter);
    setHasSpokenToNpc(initialChapter > 1);
    if (resetClues) {
      setCluesByLevel((prev) => ({ ...prev, [levelId]: {} }));
    }
    setActiveNearby(null);
    setActiveDialogueNpc(null);
    setInspectingObject(null);
    setDecisionActive(initialChapter === 3);
    setActiveConsequence(null);
    setDebriefActive(false);
    setJournalOpen(false);
    setChapterQuestionOpen(false);
    setSettingsOpen(false);
    setOpeningContextSummary(null);
    setIntroCameraShot('character_medium');
    setIsIntroNpcSpeaking(true);
    setIntroCutsceneActive(initialChapter === 1);
    setCurrentView('gameplay');

    // Lock pointer synchronously during user's "Start Investigation" click so no second click is needed after the story ends
    if (initialChapter !== 3 && typeof document !== 'undefined' && document.body?.requestPointerLock) {
      try {
        const lockPromise = document.body.requestPointerLock() as unknown as Promise<void> | undefined;
        if (lockPromise && typeof lockPromise.catch === 'function') {
          lockPromise.catch(() => {});
        }
      } catch {
        // Ignore
      }
    }
  };

  // Handle Player Selecting One of the Four Decision Options (Chapter 3)
  const handleSelectDecisionOption = (option: DecisionOption) => {
    setActiveChapterNum(3);
    setDecisionActive(false);
    setActiveConsequence(option);
  };

  // Handle Safe Outcome Proceed to Debrief
  const handleProceedToDebrief = () => {
    setActiveConsequence(null);
    setDebriefActive(true);

    if (!completedLevels.includes(activeLevel.id)) {
      setCompletedLevels((prev) => [...prev, activeLevel.id]);
    }
    if (!earnedBadges.includes(activeLevel.debrief.badgeName)) {
      setEarnedBadges((prev) => [...prev, activeLevel.debrief.badgeName]);
    }
  };

  // Handle Retry This Moment (restarts only the Chapter 3 decision checkpoint, keeping clues!)
  const handleRetryDecisionMoment = () => {
    setActiveConsequence(null);
    setActiveChapterNum(3);
    setDecisionActive(true);
  };

  // Advance to next level
  const handleNextLevel = () => {
    const currentIndex = ADVENTURE_LEVELS.findIndex((l) => l.id === activeLevel.id);
    if (currentIndex >= 0 && currentIndex < ADVENTURE_LEVELS.length - 1) {
      const nextLevel = ADVENTURE_LEVELS[currentIndex + 1];
      startLevel(nextLevel.id, 1);
    } else {
      setCurrentView('title');
    }
  };

  const handleReturnToTitle = () => {
    setIntroCutsceneActive(false);
    setCurrentView('title');
  };

  const handleUnlockAllLevels = () => {
    soundEngine.playClueFound();
    setCompletedLevels(ADVENTURE_LEVELS.map((l) => l.id));
    setEarnedBadges(ADVENTURE_LEVELS.map((l) => l.debrief.badgeName));
  };

  const handleRestartFromLevel1 = (enterGameplay = true) => {
    setCompletedLevels([]);
    setEarnedBadges([]);
    setCluesByLevel({});
    try {
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
      localStorage.removeItem(LEGACY_STORAGE_KEY_PROGRESS);
    } catch {
      // Ignore
    }
    if (enterGameplay) {
      startLevel('tutorial-delivery', 1, true);
    } else {
      setCurrentLevelId('tutorial-delivery');
      setActiveChapterNum(1);
      setIntroCutsceneActive(false);
      setCurrentView('title');
    }
  };

  const activeCutscene =
    LEVEL_INTRO_CUTSCENES[activeLevel.id] || LEVEL_INTRO_CUTSCENES['tutorial-delivery'];

  const collectedClueIds = Object.keys(collectedClues);
  const currentIndex = ADVENTURE_LEVELS.findIndex((l) => l.id === activeLevel.id);
  const hasNextLevel = currentIndex >= 0 && currentIndex < ADVENTURE_LEVELS.length - 1;

  // Modals that require a visible cursor (excludes in-scene opening story & box-free dialogue so pointer lock stays active)
  const isCursorModalOpen = Boolean(
    inspectingObject ||
    decisionActive ||
    activeConsequence ||
    debriefActive ||
    journalOpen ||
    chapterQuestionOpen ||
    settingsOpen ||
    artDossierOpen
  );

  // Immediately hide cursor across the entire viewport once the story line ends and no modal is open
  useEffect(() => {
    const shouldHideCursor =
      currentView === 'gameplay' && !introCutsceneActive && !isCursorModalOpen;
    document.documentElement.classList.toggle('gameplay-cursor-none', shouldHideCursor);
    document.body.classList.toggle('gameplay-cursor-none', shouldHideCursor);
    if (shouldHideCursor) {
      window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
    }
    return () => {
      document.documentElement.classList.remove('gameplay-cursor-none');
      document.body.classList.remove('gameplay-cursor-none');
    };
  }, [currentView, introCutsceneActive, isCursorModalOpen]);

  return (
    <div
      className={`w-screen h-screen bg-[#070D1E] text-white font-sans antialiased ${
        currentView === 'title' ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'
      }`}
    >
      {currentView === 'title' ? (
        <TitleScreen
          onStartInvestigation={() => startLevel('tutorial-delivery', 1)}
          onNewInvestigation={() => handleRestartFromLevel1(true)}
          onSelectLevel={(id, ch) => startLevel(id, ch || 1)}
          onOpenSettings={() => setSettingsOpen(true)}
          completedLevels={completedLevels}
          earnedBadges={earnedBadges}
          cluesByLevel={cluesByLevel}
          currentLevelId={currentLevelId}
          activeChapterNum={activeChapterNum}
          hasSpokenToNpc={hasSpokenToNpc}
          settings={settings}
          onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
          onOpenArtDossier={() => setArtDossierOpen(true)}
          onUnlockAllLevels={handleUnlockAllLevels}
          onRestartFromLevel1={() => handleRestartFromLevel1(false)}
        />
      ) : (
        <div className="relative w-full h-full">
          {/* Three.js 3D Adventure Canvas */}
          <AdventureWorld
            level={activeLevel}
            settings={settings}
            collectedClueIds={collectedClueIds}
            onInteract={handleWorldInteract}
            onNearbyChange={setActiveNearby}
            onEscapePress={() => {
              lastEscAutoOpenRef.current = performance.now();
              soundEngine.playInteract();
              setSettingsOpen(true);
            }}
            mobileMoveVector={mobileMoveVector}
            isMobileJogging={isMobileJogging}
            isModalOpen={isCursorModalOpen}
            activeDialogueNpcId={activeDialogueNpc?.id || null}
            introCameraShot={introCutsceneActive ? introCameraShot : null}
            isIntroNpcSpeaking={introCutsceneActive && isIntroNpcSpeaking}
          />

          {/* Animated Pre-Investigation Story Overlay (20–40s, Skippable with 1-line summary) */}
          {introCutsceneActive && activeCutscene ? (
            <PreInvestigationCutscene
              level={activeLevel}
              cutscene={activeCutscene}
              settings={settings}
              onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
              onBeatChange={(shot, speaking) => {
                setIntroCameraShot(shot);
                setIsIntroNpcSpeaking(speaking);
              }}
              onComplete={() => {
                setIntroCutsceneActive(false);
                setOpeningContextSummary(activeCutscene.oneLineSkipSummary);
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
              onSkip={() => {
                setIntroCutsceneActive(false);
                setOpeningContextSummary(activeCutscene.oneLineSkipSummary);
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
            />
          ) : !activeDialogueNpc ? (
            /* Mission HUD with 3-Chapter Stepper */
            <MissionHud
              level={activeLevel}
              activeChapterNum={activeChapterNum}
              onSelectChapter={(ch) => setActiveChapterNum(ch)}
              hasSpokenToNpc={hasSpokenToNpc}
              settings={settings}
              collectedClueIds={collectedClueIds}
              activeNearby={activeNearby}
              openingContextSummary={openingContextSummary}
              onDismissOpeningSummary={() => setOpeningContextSummary(null)}
              onReplayOpeningStory={() => {
                soundEngine.playInteract();
                if (document.pointerLockElement) {
                  document.exitPointerLock?.();
                }
                setIntroCameraShot('character_medium');
                setIsIntroNpcSpeaking(true);
                setIntroCutsceneActive(true);
              }}
              onOpenJournal={() => setJournalOpen(true)}
              onOpenChapterQuestion={() => setChapterQuestionOpen(true)}
              onTalkToPerson={() => {
                const targetNpc = activeLevel.npcs[0];
                if (targetNpc) {
                  soundEngine.playInteract();
                  if (document.pointerLockElement) {
                    document.exitPointerLock?.();
                  }
                  setHasSpokenToNpc(true);
                  setActiveDialogueNpc(targetNpc);
                }
              }}
              onOpenSettings={() => setSettingsOpen(true)}
              onToggleCamera={() =>
                setSettings((prev) => ({ ...prev, isFirstPerson: !prev.isFirstPerson }))
              }
              onTogglePhoneInHand={() => {
                soundEngine.playInteract();
                setSettings((prev) => ({
                  ...prev,
                  showPhoneInHand: prev.showPhoneInHand === false ? true : false,
                }));
              }}
              onTriggerDecision={() => {
                setActiveChapterNum(3);
                setDecisionActive(true);
              }}
              onMobileInteract={() => {
                if (activeNearby) handleWorldInteract(activeNearby);
              }}
              onMobileMove={(vec) => setMobileMoveVector(vec)}
              isMobileJogging={isMobileJogging}
              onToggleMobileJog={() => setIsMobileJogging((prev) => !prev)}
            />
          ) : null}

          {/* Subtitled Character Dialogue Overlay (Chapter 1 -> Advances to Chapter 2) */}
          {activeDialogueNpc && (
            <DialogueOverlay
              npc={activeDialogueNpc}
              showDecisionAction={activeChapterNum === 3}
              settings={settings}
              onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
              onClose={() => {
                setActiveDialogueNpc(null);
                if (activeChapterNum === 1) {
                  setActiveChapterNum(2);
                }
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
              onTriggerDecision={() => {
                setActiveDialogueNpc(null);
                setActiveChapterNum(3);
                soundEngine.playAtmosphericTensionDrone();
                setDecisionActive(true);
              }}
            />
          )}

          {/* Evidence Inspection Modal (Clue progression is ONLY marked when clicking Continue Investigating) */}
          {inspectingObject && (
            <InspectionModal
              data={inspectingObject.inspection}
              isAlreadyCollected={Boolean(collectedClues[inspectingObject.inspection.clueId])}
              onDismiss={() => {
                // Closing via the top-right 'X' button does NOT mark clue progression
                setInspectingObject(null);
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
              onContinueInvestigation={() => {
                // Clicking 'Continue Investigating' marks the clue as found and updates progression
                soundEngine.playClueFound();
                const clueId = inspectingObject.inspection.clueId;
                const nextClues = {
                  ...collectedClues,
                  [clueId]: inspectingObject.inspection,
                };
                setCollectedClues(nextClues);
                setInspectingObject(null);

                const nextFoundCount = Object.keys(nextClues).length;
                if (nextFoundCount >= activeLevel.objects.length && activeChapterNum < 3) {
                  setActiveChapterNum(3);
                } else if (activeChapterNum < 2) {
                  setActiveChapterNum(2);
                }
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
            />
          )}

          {/* Chapter 3 — The Decision: Exactly Four Response Options */}
          {decisionActive && (
            <FourChoiceDecisionModal
              level={activeLevel}
              onSelectOption={handleSelectDecisionOption}
              onCancel={() => {
                setDecisionActive(false);
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
            />
          )}

          {/* Outcome & Consequence Scene (With Checkpoint-Only "Retry this moment") */}
          {activeConsequence && (
            <ConsequenceModal
              option={activeConsequence}
              onRetry={handleRetryDecisionMoment}
              onContinue={handleProceedToDebrief}
            />
          )}

          {/* Post-Level Comprehensive Debrief */}
          {debriefActive && (
            <LevelDebriefModal
              debrief={activeLevel.debrief}
              levelId={activeLevel.id}
              onNextLevel={handleNextLevel}
              onReplayLevel={() => startLevel(activeLevel.id, 1)}
              onReturnToMenu={handleReturnToTitle}
              hasNextLevel={hasNextLevel}
            />
          )}

          {/* Case Journal Modal */}
          {journalOpen && (
            <CaseJournalModal
              currentLevel={activeLevel}
              collectedClues={collectedClues}
              completedLevels={completedLevels}
              badges={earnedBadges}
              onClose={() => {
                setJournalOpen(false);
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
            />
          )}

          {/* Active Chapter Story, Clues & 4-Option Knowledge Question Modal */}
          {chapterQuestionOpen && (
            <ChapterInvestigationModal
              level={activeLevel}
              activeChapterNum={activeChapterNum}
              onSelectChapter={(ch) => setActiveChapterNum(ch)}
              onClose={() => {
                setChapterQuestionOpen(false);
                window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
              }}
              onTriggerFinalDecision={() => {
                setChapterQuestionOpen(false);
                setActiveChapterNum(3);
                setDecisionActive(true);
              }}
              isGameplayMode={true}
            />
          )}
        </div>
      )}

      {/* Global Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
          onClose={() => {
            setSettingsOpen(false);
            if (currentView === 'gameplay') {
              window.dispatchEvent(new CustomEvent('sleuth-resume-look'));
            }
          }}
          currentLevel={currentView === 'gameplay' ? activeLevel : undefined}
          activeChapterNum={activeChapterNum}
          onReturnToMenu={() => {
            setSettingsOpen(false);
            setInspectingObject(null);
            setActiveDialogueNpc(null);
            setDecisionActive(false);
            setActiveConsequence(null);
            setDebriefActive(false);
            setJournalOpen(false);
            setChapterQuestionOpen(false);
            handleReturnToTitle();
          }}
          onResetProgress={() => {
            setSettingsOpen(false);
            handleRestartFromLevel1(currentView === 'gameplay');
          }}
          onUnlockAllLevels={() => {
            handleUnlockAllLevels();
            setSettingsOpen(false);
          }}
        />
      )}

      {/* Art & Environment Dossier */}
      {artDossierOpen && (
        <RealisticGameGraphicsDossier onClose={() => setArtDossierOpen(false)} />
      )}
    </div>
  );
}

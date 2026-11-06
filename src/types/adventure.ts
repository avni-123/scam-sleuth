export type LevelId = string;

export interface DecisionOption {
  id: string;
  text: string;
  isSafe: boolean;
  consequenceStory: string;
  warningSignExplanation: string;
  habitInsight: string;
}

export interface InspectionData {
  title: string;
  itemType: 'phone' | 'laptop' | 'package' | 'document' | 'board';
  senderOrSource: string;
  timestamp: string;
  content: string;
  suspiciousDetail: string;
  evidenceClue: string;
  clueId: string;
}

export interface WorldObjectDef {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'package' | 'document' | 'board' | 'door';
  position: [number, number, number];
  rotationY?: number;
  interactionLabel: string;
  inspection: InspectionData;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  role: string;
  avatarColor: string;
  text: string;
  nextId?: string;
  triggersDecision?: boolean;
}

export interface NpcDef {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  rotationY: number;
  bodyColor: string;
  jacketColor: string;
  dialogue: DialogueNode[];
}

export interface LevelDebrief {
  title: string;
  summary: string;
  keyClue: string;
  safeRationale: string;
  realWorldHabit: string;
  badgeName: string;
  badgeIcon: string;
}

export interface ChapterGraphicsDirection {
  backgroundArt: string;
  characterAppearanceAndPose: string;
  keyProps: string;
  cameraAngle: string;
  lighting: string;
  onScreenMessage: string;
  interactiveClueEffects: string;
  transitionGraphic: string;
}

export interface ChapterDialogueLine {
  speaker: string;
  role?: string;
  line: string;
}

export interface ChapterClueItem {
  id: string;
  title: string;
  detail: string;
  hint: string;
}

export interface ChapterQuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ChapterKnowledgeQuestion {
  prompt: string;
  options: [
    ChapterQuestionOption,
    ChapterQuestionOption,
    ChapterQuestionOption,
    ChapterQuestionOption
  ];
  correctAnswerExplanation: string;
}

export interface ChapterDef {
  number: 1 | 2 | 3;
  phase: 'The Setup' | 'The Investigation' | 'The Decision';
  title: string;
  summary: string;
  learningGoal?: string;
  storySetup?: string;
  graphicsDirection?: ChapterGraphicsDirection;
  chapterDialogue?: ChapterDialogueLine[];
  playerInteraction?: string;
  clues?: [ChapterClueItem, ChapterClueItem, ChapterClueItem];
  question?: ChapterKnowledgeQuestion;
  chapterTransition?: string;
}

export interface AdventureLevel {
  id: LevelId;
  title: string;
  subtitle: string;
  levelNumber: string;
  act?: string;
  actIndex?: number; // 1 to 10 (Level 1 to Level 10)
  chapterInAct?: number; // 1 to 3
  chapters: [ChapterDef, ChapterDef, ChapterDef]; // 3 chapters per level (30 total across 10 levels)
  glasshouseClue?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  setting: 'apartment' | 'campus' | 'cafe' | 'office';
  locationName: string;
  environmentDescription: string;
  objective: string;
  playerSpawn: [number, number, number];
  playerSpawnRotationY: number;
  npcs: NpcDef[];
  objects: WorldObjectDef[];
  decisionPrompt: string;
  decisionContext: string;
  decisionOptions: [DecisionOption, DecisionOption, DecisionOption, DecisionOption]; // Exactly four options!
  debrief: LevelDebrief;
}

export interface GameSettings {
  mouseSensitivity: number; // 0.5 to 2.5
  isFirstPerson: boolean;
  showPhoneInHand?: boolean;
  subtitlesEnabled: boolean;
  voiceAudioEnabled?: boolean;
  subtitleSize?: 'normal' | 'large' | 'extra-large';
  subtitleOpacity?: 'translucent' | 'dark' | 'solid';
  subtitleAutoAdvance?: boolean;
  autoAdvanceDelay?: number; // 2 to 6 seconds
  ambientAudioEnabled?: boolean;
  ambientVolume?: number; // 0.0 to 1.0
  soundVolume: number; // 0.0 to 1.0
  highContrast: boolean;
  textSize?: 'normal' | 'large';
  reducedMotion?: boolean;
}

export interface PlayerStats {
  completedLevels: LevelId[];
  badges: string[];
  collectedClues: Record<string, InspectionData>;
}

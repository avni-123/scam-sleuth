export type ScamChannel = 'sms' | 'email' | 'marketplace' | 'chat';

export type ClueCategory =
  | 'urgency'
  | 'sender'
  | 'link'
  | 'payment'
  | 'code_request'
  | 'too_good'
  | 'attachment';

export type BadgeType =
  | 'Link Inspector'
  | 'Pressure-Proof'
  | 'Payment Pause'
  | 'Code Guardian'
  | 'Identity Verifier'
  | 'Offer Skeptic';

export interface Clue {
  id: string;
  label: string;
  category: ClueCategory;
  textSnippet: string;
  explanation: string;
  skillBadge: BadgeType;
}

export type CityDistrict =
  | 'Delivery Dock'
  | 'Marketplace Alley'
  | 'Job-Offer Tower'
  | 'Account Alert Arcade'
  | 'Neon Suburbs';

export interface ComicPanel {
  id: string;
  title: string;
  narrative: string;
  speaker?: string;
  dialogue?: string;
  visualType: 'setting' | 'incoming_alert' | 'character_reaction' | 'outcome_safe' | 'outcome_unsafe';
  mood: 'neutral' | 'curious' | 'alarmed' | 'relieved' | 'trapped';
  avatarBg?: string;
  soundEffect?: string;
}

export interface CaseCharacter {
  name: string;
  role: string;
  district: CityDistrict;
  bio: string;
  avatarColor: string;
  initials: string;
  reactionQuote: string;
}

export interface IllustratedOutcome {
  title: string;
  headline: string;
  summary: string;
  soundEffect?: string;
  panels: ComicPanel[];
  cyberImpact: string;
  novaVerdict: string;
}

export interface ActionOption {
  id: string;
  label: string;
  description: string;
  isSafe: boolean;
  feedback: string;
  safetyTip: string;
  outcome?: IllustratedOutcome;
}

export interface MessageSegment {
  text: string;
  clueId?: string;
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Master';

export interface DetectiveCase {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  channel: ScamChannel;
  difficulty: DifficultyLevel | 'Rookie' | 'Investigator' | 'Specialist';
  district?: CityDistrict;
  character?: CaseCharacter;
  comicPrologue?: ComicPanel[];
  senderInfo: {
    name: string;
    handleOrEmail: string;
    avatar?: string;
    verifiedBadge?: boolean;
    displayPhone?: string;
  };
  messageContent: {
    subject?: string;
    dateStr: string;
    segments: MessageSegment[];
  };
  clues: Clue[];
  actionOptions: ActionOption[];
  practicalTakeaway: string;
  confidenceFollowup: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      habitInsight: string;
    }>;
  };
}

export interface CaseSessionResult {
  caseId: string;
  safeChoice: boolean;
  chosenActionId: string;
  discoveredClueIds: string[];
  totalClues: number;
  xpEarned: number;
  selectedInfluentialClueId?: string;
  timestamp: string;
}

export interface PlayerProgress {
  score: number;
  xp: number;
  rank: 'Rookie Sleuth' | 'Field Investigator' | 'Senior Inspector' | 'Chief Detective';
  solvedCaseIds: string[];
  discoveredClueIds: string[];
  earnedBadges: BadgeType[];
  history: CaseSessionResult[];
}

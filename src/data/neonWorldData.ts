import { CityDistrict, CaseCharacter, ComicPanel, IllustratedOutcome, DetectiveCase } from '../types/game.ts';

export interface DistrictInfo {
  id: CityDistrict;
  name: string;
  tagline: string;
  landmark: string;
  description: string;
  accentColor: string;
  glowColor: string;
  iconName: 'Package' | 'Store' | 'Briefcase' | 'Gamepad2' | 'Radio';
  defaultCaseId: string;
  coordinates: { x: number; y: number }; // Percentage on City Map (0-100)
}

export const NEON_DISTRICTS: DistrictInfo[] = [
  {
    id: 'Delivery Dock',
    name: 'Delivery Dock',
    tagline: 'Parcel Smishing & Artificial Urgency',
    landmark: 'Apex Hyper-Harbor & Automated Crane Bay',
    description: 'Bustling container docks where automated shipping drones land under neon rain. Fraudulent couriers broadcast fake $1.98 redelivery demands.',
    accentColor: '#39BDF7',
    glowColor: 'rgba(57, 189, 247, 0.4)',
    iconName: 'Package',
    defaultCaseId: 'case-tutorial',
    coordinates: { x: 22, y: 35 },
  },
  {
    id: 'Marketplace Alley',
    name: 'Marketplace Alley',
    tagline: 'Overpayment Traps & Gift Card Laundering',
    landmark: 'Underground Neon Bazaar & Tech Swap Stalls',
    description: 'Flickering alleys of vintage synth collectors and peer-to-peer sellers. Scammers exploit remote courier excuses and demand retail gift cards.',
    accentColor: '#F05A9D',
    glowColor: 'rgba(240, 90, 157, 0.4)',
    iconName: 'Store',
    defaultCaseId: 'case-marketplace-overpayment',
    coordinates: { x: 74, y: 65 },
  },
  {
    id: 'Job-Offer Tower',
    name: 'Job-Offer Tower',
    tagline: 'Work-From-Home Scams & Advance Fee Fraud',
    landmark: 'TechPulse Corporate Spire & Holographic Billboards',
    description: 'High-rise glass towers where remote freelancers look for contracts. Impersonators dangle $45/hr salaries and fake check advance fees.',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    iconName: 'Briefcase',
    defaultCaseId: 'case-remote-job',
    coordinates: { x: 50, y: 24 },
  },
  {
    id: 'Account Alert Arcade',
    name: 'Account Alert Arcade',
    tagline: 'Bank Impersonation & 2FA Code Harvesting',
    landmark: 'Pixel Neon Arcade & VR Terminals',
    description: 'Retro gaming lounge with humming CRT glow. Threat actors send fake Horizon Federal freeze warnings demanding 6-digit one-time passcodes.',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    iconName: 'Gamepad2',
    defaultCaseId: 'case-bank-freeze',
    coordinates: { x: 30, y: 72 },
  },
  {
    id: 'Neon Suburbs',
    name: 'Neon Suburbs',
    tagline: 'Family Impersonation & Emotional Coercion',
    landmark: 'Residential Sky-Terraces & Comm Towers',
    description: 'Quiet residential district where scammers blast "Hi Mom, my phone broke" texts to trigger panic and instant untraceable wires.',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    iconName: 'Radio',
    defaultCaseId: 'case-family-emergency',
    coordinates: { x: 80, y: 28 },
  },
];

export const CHIEF_INSPECTOR_NOVA = {
  name: 'Chief Inspector Nova',
  title: 'Lead Cyber Detective',
  badge: 'NEON POLICE CYBER DIVISION',
  avatarBg: 'bg-gradient-to-br from-cyan-500 to-blue-700',
  quote: 'Every message leaves a footprint. Never let panic push your buttons.',
};

export const CASE_CHARACTERS: Record<string, CaseCharacter> = {
  'case-tutorial': {
    name: 'Kira Sparks',
    role: 'Drone Dispatcher & Robotics Student',
    district: 'Delivery Dock',
    bio: 'Working late hours at the harbor drone station, waiting on replacement servo motors for her semester project.',
    avatarColor: '#39BDF7',
    initials: 'KS',
    reactionQuote: 'Wait... I already paid $14 shipping yesterday. Why would they incinerate my servos in two hours?!',
  },
  'case-bank-freeze': {
    name: 'Devon Jax',
    role: 'Retro Arcade Champion & Streamer',
    district: 'Account Alert Arcade',
    bio: 'Midway through an arcade tournament when his phone buzzes with a terrifying 15-minute freeze warning on his debit card.',
    avatarColor: '#10B981',
    initials: 'DJ',
    reactionQuote: 'My savings account locked in 15 minutes?! If I lose my tournament entry fee, I am completely stranded!',
  },
  'case-remote-job': {
    name: 'Aria Chen',
    role: 'Freelance 3D & Motion Designer',
    district: 'Job-Offer Tower',
    bio: 'Looking for steady remote contracts after college graduation. Thrilled by an unexpected offer on chat.',
    avatarColor: '#A855F7',
    initials: 'AC',
    reactionQuote: '$45 an hour for entry-level chat work, no portfolio review? That sounds almost too amazing to be true...',
  },
  'case-marketplace-overpayment': {
    name: 'Marcus Vance',
    role: 'Analog Synth Restorer & Collector',
    district: 'Marketplace Alley',
    bio: 'Selling a vintage dining table to clear workshop space for classic synthesizers. A buyer claims to be on remote military duty.',
    avatarColor: '#F05A9D',
    initials: 'MV',
    reactionQuote: 'Why is a stranger sending me an extra $250 and asking me to buy Apple gift cards for his courier?',
  },
  'case-family-emergency': {
    name: 'Elena Ramos',
    role: 'Neon City Transit Architect',
    district: 'Neon Suburbs',
    bio: 'Commuting home when an unfamiliar number texts claiming to be her son with a broken phone in a towing crisis.',
    avatarColor: '#EC4899',
    initials: 'ER',
    reactionQuote: 'My stomach dropped when I read "Hi Mom, my phone fell in the sink"... but why won\'t he let me call him?',
  },
};

export const CASE_COMIC_PROLOGUES: Record<string, ComicPanel[]> = {
  'case-tutorial': [
    {
      id: 'tut-panel-1',
      title: 'Neon Harbor Drone Bay',
      narrative: 'Rain slants across the shipping containers at Delivery Dock. Kira checks her project clock—her custom servo motors are overdue.',
      visualType: 'setting',
      mood: 'neutral',
      avatarBg: 'bg-cyan-950',
      soundEffect: 'DRONE_HUM...',
    },
    {
      id: 'tut-panel-2',
      title: 'A High-Pressure Ping',
      narrative: 'Her phone screen flares bright amber in the dark. An SMS from an unfamiliar number flashes an urgent countdown.',
      speaker: 'Apex Alert Bot',
      dialogue: 'APEX ALERT: Action required within 2 hours or package AP-8849 will be destroyed. Pay $1.98 redelivery fee now.',
      visualType: 'incoming_alert',
      mood: 'alarmed',
      soundEffect: 'BZZZT!!',
    },
    {
      id: 'tut-panel-3',
      title: 'The Detective Dilemma',
      narrative: 'Kira hovers her thumb over the glowing link. Less than two dollars seems small, but something about that 2-hour threat feels suspicious.',
      speaker: 'Kira Sparks',
      dialogue: 'Should I just pay the $1.98 so I don\'t lose my package... or is this a trap to harvest my credit card?',
      visualType: 'character_reaction',
      mood: 'curious',
    },
  ],
  'case-bank-freeze': [
    {
      id: 'bank-panel-1',
      title: 'Midnight Arcade Heat',
      narrative: 'Neon arcade cabinets buzz with 16-bit synth beats. Devon is one stage away from qualifying for the regional championships.',
      visualType: 'setting',
      mood: 'neutral',
      avatarBg: 'bg-emerald-950',
      soundEffect: 'COIN_DROP!',
    },
    {
      id: 'bank-panel-2',
      title: 'The 15-Minute Ultimatum',
      narrative: 'A red security notification takes over his smartphone status bar. An email claiming to be Horizon Federal demands immediate action.',
      speaker: 'Horizon Security Desk',
      dialogue: 'URGENT: Unauthorized login from Frankfurt! Account will be suspended permanently in 15 minutes unless you enter your 6-digit code.',
      visualType: 'incoming_alert',
      mood: 'alarmed',
      soundEffect: 'KLAXON_ALARM!',
    },
    {
      id: 'bank-panel-3',
      title: 'The Code Harvesting Trap',
      narrative: 'Devon stares at the timer ticking down. His tournament deposit and rent money are in that account.',
      speaker: 'Devon Jax',
      dialogue: 'Fifteen minutes?! If I click this link and hand over my two-factor code, will it save my cash or hand them the keys to my bank?',
      visualType: 'character_reaction',
      mood: 'alarmed',
    },
  ],
  'case-remote-job': [
    {
      id: 'job-panel-1',
      title: 'Tower Coworking Floor',
      narrative: 'Aria sips iced matcha while reviewing her freelance design portfolio in the glass lobby of Job-Offer Tower.',
      visualType: 'setting',
      mood: 'neutral',
      avatarBg: 'bg-purple-950',
      soundEffect: 'KEYBOARD_CLATTER',
    },
    {
      id: 'job-panel-2',
      title: 'Hired On The Spot',
      narrative: 'A direct message lands on Telegram from a profile named "Samantha HR TechPulse Global".',
      speaker: 'Samantha (HR)',
      dialogue: 'Congratulations! You are hired on the spot at $45/hour! We will email you a check for $2,400 to Zelle our laptop software vendor.',
      visualType: 'incoming_alert',
      mood: 'curious',
      soundEffect: 'DING!!',
    },
    {
      id: 'job-panel-3',
      title: 'Too Good To Be True?',
      narrative: 'Aria\'s heart races at $45 an hour. But legitimate corporations rarely hire people over chat without an interview.',
      speaker: 'Aria Chen',
      dialogue: 'No interview? And they want me to deposit a check and send money back to a vendor? This feels like advance-fee check fraud...',
      visualType: 'character_reaction',
      mood: 'curious',
    },
  ],
  'case-marketplace-overpayment': [
    {
      id: 'market-panel-1',
      title: 'Alley Workshop',
      narrative: 'Marcus tests analog oscillator circuits in his workshop off Marketplace Alley. His spare dining table is listed on the local exchange.',
      visualType: 'setting',
      mood: 'neutral',
      avatarBg: 'bg-amber-950',
      soundEffect: 'SYNTH_CHORD',
    },
    {
      id: 'market-panel-2',
      title: 'The Overpayment Con',
      narrative: 'A prospective buyer named Arthur messages claiming to be away on remote military duty.',
      speaker: 'Arthur (Buyer)',
      dialogue: 'I transferred $550 for your $300 table! Please go buy $250 in Apple gift cards right now and send me the codes so my courier can pick it up!',
      visualType: 'incoming_alert',
      mood: 'curious',
      soundEffect: 'MESSAGE_POP!',
    },
    {
      id: 'market-panel-3',
      title: 'The Gift Card Red Flag',
      narrative: 'Marcus scratches his chin. Real buyers don\'t overpay by $250 and demand payment back in retail gift cards.',
      speaker: 'Marcus Vance',
      dialogue: 'Gift cards for a shipping courier? If I send those codes, that fake payment will bounce and I\'ll be out $250 of my own cash.',
      visualType: 'character_reaction',
      mood: 'curious',
    },
  ],
  'case-family-emergency': [
    {
      id: 'fam-panel-1',
      title: 'Evening Transit Commute',
      narrative: 'Elena sits on the elevated train overlooking the glowing skyline of Neon Suburbs after a long day of municipal design meetings.',
      visualType: 'setting',
      mood: 'neutral',
      avatarBg: 'bg-pink-950',
      soundEffect: 'TRAIN_HUM...',
    },
    {
      id: 'fam-panel-2',
      title: 'The Stolen Identity Text',
      narrative: 'A text message arrives from an unknown number with an alarming opening sentence.',
      speaker: 'Unknown Number',
      dialogue: 'Hi Mom! My phone fell in the sink and broke. Please don\'t call, the mic is cracked. My car got towed, urgently need $350 sent to my friend\'s Zelle!',
      visualType: 'incoming_alert',
      mood: 'alarmed',
      soundEffect: 'EMERGENCY_PING!',
    },
    {
      id: 'fam-panel-3',
      title: 'Parental Instinct vs Detective Caution',
      narrative: 'Elena\'s first reflex is to help her child. But she remembers the golden rule of out-of-band verification.',
      speaker: 'Elena Ramos',
      dialogue: 'It pulls at my heartstrings... but why won\'t they let me hear their voice? I should call his actual phone number first.',
      visualType: 'character_reaction',
      mood: 'alarmed',
    },
  ],
};

export const CASE_STORY_OUTCOMES: Record<string, Record<string, IllustratedOutcome>> = {
  'case-tutorial': {
    'act-safe-verify': {
      title: 'OFFICIAL APP CHECKED // SCAMMER DEFUSED',
      headline: 'Kira checks tracking on the official Apex Express app',
      summary: 'Instead of touching the SMS link, Kira opened her verified courier app. Her package was safely on a delivery van with zero fees required!',
      soundEffect: 'SECURITY_SHIELD_ONLINE!',
      cyberImpact: 'Credentials Protected · $0 Lost · Phishing Domain Flagged',
      novaVerdict: 'Exceptional work, Detective! By navigating directly to the courier portal you found independently, you eliminated the threat before it could touch your card.',
      panels: [
        {
          id: 'out-tut-safe-1',
          title: 'Opening Verified Portal',
          narrative: 'Kira ignores the text link and opens the official Apex Express portal on her laptop.',
          speaker: 'Kira Sparks',
          dialogue: 'Let me look up tracking number AP-8849 on the real apexparcel.example portal...',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-tut-safe-2',
          title: 'Package Status: On Track!',
          narrative: 'The official system reports: "Package out for delivery today. Signature required. Balance due: $0.00".',
          speaker: 'Official Courier Terminal',
          dialogue: 'Package #AP-8849 is on delivery vehicle 42. Arriving at 4:15 PM. No action needed.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-tut-safe-3',
          title: 'Chief Inspector Nova Commendation',
          narrative: 'Chief Inspector Nova arrives on the terminal comms with an official cyber clearance seal.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Flawless instinct! That SMS was sent by a phishing kit looking to harvest credit card numbers. Your $1.98 was bait for thousands.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
      ],
    },
    'act-safe-block': {
      title: 'NUMBER BLACKLISTED // THREAT NEUTRALIZED',
      headline: 'Kira blocks the sender and marks the smishing as spam',
      summary: 'Kira refused to reply with "STOP" or tap the link. She blocked the spoofed number and reported it to her mobile provider.',
      soundEffect: 'SPAM_FILTER_CLAMP!',
      cyberImpact: 'Carrier Filter Updated · Phone Active Status Masked',
      novaVerdict: 'Great defensive hygiene! Texting back "STOP" or "NO" tells scammers an active human is at the other end. Blocking quietly is the right move.',
      panels: [
        {
          id: 'out-tut-block-1',
          title: 'Spam Filter Engaged',
          narrative: 'Kira taps "Report Junk and Block Sender" directly in her device settings.',
          speaker: 'Kira Sparks',
          dialogue: 'No replies, no clicks. Marking this spoofed number as spam right now.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-tut-block-2',
          title: 'Scammer Bot Disconnected',
          narrative: 'The automated phishing server receives no pingback and moves on without getting a single byte of personal data.',
          speaker: 'Carrier Security',
          dialogue: 'Number +1-555-019-9482 added to regional smishing blacklist.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-tut-block-3',
          title: 'Case File Closed Cleanly',
          narrative: 'Chief Inspector Nova seals the case dossier in the Delivery Dock archives.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Clean resolution! Always remember: legitimate delivery companies don\'t hold packages hostage over SMS.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
      ],
    },
    'act-unsafe-pay': {
      title: 'CREDIT CARD HARVESTED // SIMULATED BREACH',
      headline: 'The $1.98 micro-charge was a credential stealing trap!',
      summary: 'The link loaded a fraudulent lookalike page. Entering card details gave the threat actor full name, card number, expiration, and CVV.',
      soundEffect: 'BREACH_DETECTED_BEEP',
      cyberImpact: 'Simulated Fraud Alert · Card Compromised · Unauthorized $840 Charge Attempt',
      novaVerdict: 'Hold on, Detective! Don\'t sweat it—this is why we train in simulated cases. Scammers use tiny charges like $1.98 because our brain treats them as harmless.',
      panels: [
        {
          id: 'out-tut-unsafe-1',
          title: 'The Fake Payment Portal',
          narrative: 'Kira clicks the SMS link and arrives at "apex-parcel.track-fee89.example". It looks just like the real courier site.',
          speaker: 'Phishing Screen',
          dialogue: 'Please enter 16-digit Card Number, CVV, and Billing Zip Code to pay $1.98 redelivery fee.',
          visualType: 'outcome_unsafe',
          mood: 'alarmed',
        },
        {
          id: 'out-tut-unsafe-2',
          title: 'Credential Exfiltration',
          narrative: 'The moment "Pay Now" is clicked, the credentials are encrypted and forwarded to an overseas card-dump server.',
          speaker: 'Automated Fraud Bot',
          dialogue: 'Card Captured: **** **** **** 4829. Initiating recurring unauthorized subscription at $49.99/month.',
          visualType: 'outcome_unsafe',
          mood: 'trapped',
        },
        {
          id: 'out-tut-unsafe-3',
          title: 'Inspector Nova Steps In',
          narrative: 'Chief Inspector Nova trips the training firewall and pauses the simulation with zero shame.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Freeze frame! See the trap? The $1.98 was never the point—your card numbers were the real prize. Let\'s rewind time and make the safe call.',
          visualType: 'outcome_unsafe',
          mood: 'curious',
        },
      ],
    },
  },
  'case-bank-freeze': {
    'act-safe-bank-call': {
      title: 'OUT-OF-BAND VERIFICATION SUCCESSFUL',
      headline: 'Devon calls the real number printed on the back of his card',
      summary: 'Devon flipped over his physical debit card and dialed the customer care number. The real representative confirmed his account was completely healthy with zero alerts!',
      soundEffect: 'BANK_VAULT_LOCKED!',
      cyberImpact: 'Bank Account 100% Safe · OTP Kept Secret · Phishing Clone Reported',
      novaVerdict: 'Gold standard cybersecurity! The customer support number printed on physical plastic is impossible for remote email phishers to alter.',
      panels: [
        {
          id: 'out-bank-safe-1',
          title: 'The Back of the Card',
          narrative: 'Devon pulls his debit card from his wallet and dials the fraud prevention hotline printed on the back.',
          speaker: 'Devon Jax',
          dialogue: 'Hi Horizon Support, I received an urgent email saying my account was freezing in 15 minutes. Is this real?',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-bank-safe-2',
          title: 'Horizon Representative Reassurance',
          narrative: 'The bank representative reviews his account in real time.',
          speaker: 'Horizon Support Agent',
          dialogue: 'Your account is in excellent standing with zero security holds, Devon. That email was a malicious phishing attempt trying to harvest your OTP code.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-bank-safe-3',
          title: 'Nova\'s Master Sleuth Seal',
          narrative: 'Chief Inspector Nova records the win on Devon\'s detective dossier.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Master-level defense! Keeping your one-time passwords secret is like guarding your front door keys. You saved your savings account.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
      ],
    },
    'act-unsafe-submit-code': {
      title: '2FA CODE COMPROMISED // ACCOUNT BREACH',
      headline: 'Submitting the 6-digit code handed over account takeover keys!',
      summary: 'The scammers were actively on the real banking site clicking "Forgot Password". Entering the SMS code on the fake link allowed them to reset Devon\'s password.',
      soundEffect: 'KLAXON_WARNING_SIREN',
      cyberImpact: 'Simulated Password Reset · Session Takeover · Unauthorized Wire Attempt',
      novaVerdict: 'Hold on! Don\'t panic—this simulated breach teaches the most vital rule in cybersecurity: never share a one-time verification passcode with anyone.',
      panels: [
        {
          id: 'out-bank-unsafe-1',
          title: 'Entering the One-Time Code',
          narrative: 'Panicking about the 15-minute countdown, Devon enters the 6-digit code on the lookalike website.',
          speaker: 'Fake Bank Gateway',
          dialogue: 'Verifying OTP code 849-201... Authentication successful.',
          visualType: 'outcome_unsafe',
          mood: 'alarmed',
        },
        {
          id: 'out-bank-unsafe-2',
          title: 'Account Password Reset by Attacker',
          narrative: 'Behind the scenes, the scammer\'s script inputs that exact code into the real bank portal to change the master password.',
          speaker: 'Attack Script',
          dialogue: 'Password changed successfully. New login recognized from Berlin, Germany.',
          visualType: 'outcome_unsafe',
          mood: 'trapped',
        },
        {
          id: 'out-bank-unsafe-3',
          title: 'Nova Rewind Intervention',
          narrative: 'Chief Inspector Nova halts the simulated attack with a supportive debrief.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Time out, Detective! Scammers trigger real 2FA codes while you watch, tricking you into relaying the key. Rewind the tape and call the bank directly!',
          visualType: 'outcome_unsafe',
          mood: 'curious',
        },
      ],
    },
  },
  'case-remote-job': {
    'act-safe-research-company': {
      title: 'COMPANY CAREER PORTAL VERIFIED',
      headline: 'Aria checks the real TechPulse website directly',
      summary: 'Aria visited techpulse.example on her browser. The real company website had a giant banner warning that scammers were impersonating their recruiters on Telegram!',
      soundEffect: 'CHIME_LEVEL_UP',
      cyberImpact: 'Advance Fee Avoided · $450 Saved · Phony Recruiter Exposed',
      novaVerdict: 'Sharp intuition, Detective! Legitimate corporations will never ask you to buy laptops by wiring money back from an emailed check image.',
      panels: [
        {
          id: 'out-job-safe-1',
          title: 'Independent Company Verification',
          narrative: 'Aria searches for TechPulse\'s verified corporate headquarters and opens their official careers page.',
          speaker: 'Aria Chen',
          dialogue: 'Let me check their official site. If they\'re hiring remote chat agents, it\'ll be listed right here.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-job-safe-2',
          title: 'Official Fraud Alert Banner',
          narrative: 'TechPulse\'s real site displays: "Notice: We never interview via Telegram and never ask candidates for equipment payments".',
          speaker: 'Verified Company Portal',
          dialogue: 'TechPulse Global conducts all hiring through official @techpulse.example corporate emails and accredited video interviews.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-job-safe-3',
          title: 'Nova Commendation',
          narrative: 'Chief Inspector Nova awards Aria the Job Skeptic detective badge.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'You spotted the fake check trap! High hourly wages with zero interview screening are bait to rush your excitement.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
      ],
    },
    'act-unsafe-deposit-check': {
      title: 'FAKE CHECK BOUNCES // $450 PERSONAL LOSS',
      headline: 'The emailed check bounced after Aria wired $450 from her account',
      summary: 'Due to banking laws, checks show in balances before clearing. When the fake check bounced 4 days later, the bank retracted the full $2,400, leaving Aria down $450.',
      soundEffect: 'CHECK_BOUNCE_THUD',
      cyberImpact: 'Simulated $450 Loss · Bank Overdraft Notice · Check Fraud Flag',
      novaVerdict: 'Take a breath, Detective. Millions fall for this because provisional bank credit makes fake checks look real. Let\'s rewind and examine the trap.',
      panels: [
        {
          id: 'out-job-unsafe-1',
          title: 'The Emailed Check Image',
          narrative: 'Aria prints and deposits the emailed $2,400 check image through her mobile banking app.',
          speaker: 'Banking App Notification',
          dialogue: 'Provisional funds available: $2,400.00. Check pending settlement.',
          visualType: 'outcome_unsafe',
          mood: 'alarmed',
        },
        {
          id: 'out-job-unsafe-2',
          title: 'Zelle Payment Sent to Fake Vendor',
          narrative: 'Believing the money is real, Aria Zelles $450 of her personal money to the "software vendor" on Telegram.',
          speaker: 'Telegram Bot',
          dialogue: '$450 received. Account blocked. User deleted.',
          visualType: 'outcome_unsafe',
          mood: 'trapped',
        },
        {
          id: 'out-job-unsafe-3',
          title: 'The Check Bounces 4 Days Later',
          narrative: 'The Federal clearinghouse detects the stolen account routing numbers on the check and cancels the $2,400 credit.',
          speaker: 'Bank Overdraft Alert',
          dialogue: 'Counterfeit check returned unpaid. Your account balance is now -$450.00.',
          visualType: 'outcome_unsafe',
          mood: 'alarmed',
        },
      ],
    },
  },
  'case-marketplace-overpayment': {
    'act-safe-cash-only': {
      title: 'CASH ON COLLECTION ENFORCED // SCAMMER FLEES',
      headline: 'Marcus insists on in-person inspection and cash only',
      summary: 'The moment Marcus replied that he only accepts cash upon pickup, the "buyer" deleted their account and vanished into the digital ether.',
      soundEffect: 'SCAMMER_DISCONNECTED',
      cyberImpact: 'Furniture Retained · $250 Protected · Marketplace Safety Enforced',
      novaVerdict: 'Classic marketplace street smarts! Scammers operating from overseas cannot collect physical items in cash. Enforcing in-person cash ends the con immediately.',
      panels: [
        {
          id: 'out-market-safe-1',
          title: 'In-Person Inspection Policy',
          narrative: 'Marcus messages back calmly on the marketplace platform.',
          speaker: 'Marcus Vance',
          dialogue: 'I do not accept third-party courier gift cards. Cash upon in-person pickup only at the municipal police parking lot.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-market-safe-2',
          title: 'The Scammer Vanishes',
          narrative: 'The fraudulent buyer account realizes their script failed and instantly deletes the conversation.',
          speaker: 'Marketplace System',
          dialogue: 'User "arthur_buyer_vintage82" has left the conversation.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-market-safe-3',
          title: 'Nova Closes the File',
          narrative: 'Chief Inspector Nova signs off on the case.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Anyone asking you to handle shipping logistics with gift cards is running an overpayment con. You held your ground and won!',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
      ],
    },
    'act-unsafe-buy-card': {
      title: 'GIFT CARDS LAUNDERED // $250 IRREVERSIBLE LOSS',
      headline: 'Marcus bought retail gift cards; the $550 payment email was forged!',
      summary: 'The "payment confirmation email" was fake. The buyer never transferred a cent, and the gift card PINs were instantly redeemed within 30 seconds.',
      soundEffect: 'BUZZER_ERROR_DRAIN',
      cyberImpact: 'Simulated $250 Loss · Untraceable Gift Cards · Forged Payment Email',
      novaVerdict: 'Don\'t beat yourself up! Gift card fraud is a multi-billion dollar scam industry. Remember: gift cards are for presents, never for couriers or bills.',
      panels: [
        {
          id: 'out-market-unsafe-1',
          title: 'Scratching the PIN Foil',
          narrative: 'Marcus buys a $250 Apple card and sends a photo of the scratched-off redemption code over chat.',
          speaker: 'Marcus Vance',
          dialogue: 'Here is the 16-digit gift card code. Please have your courier pick up the table tomorrow.',
          visualType: 'outcome_unsafe',
          mood: 'alarmed',
        },
        {
          id: 'out-market-unsafe-2',
          title: 'Instant Automated Redemption',
          narrative: 'An automated bot network redeems the card balance within 12 seconds across digital storefronts.',
          speaker: 'Laundering Bot',
          dialogue: 'Card Redeemed. Value: $250.00. Funds transferred to digital wallet.',
          visualType: 'outcome_unsafe',
          mood: 'trapped',
        },
        {
          id: 'out-market-unsafe-3',
          title: 'Nova Rewind Intervention',
          narrative: 'Chief Inspector Nova steps into the simulation to guide Marcus back to safety.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Pause right there! Retail gift cards have zero buyer protection. Let\'s rewind and tell that fake buyer cash-only!',
          visualType: 'outcome_unsafe',
          mood: 'curious',
        },
      ],
    },
  },
  'case-family-emergency': {
    'act-safe-call-real-number': {
      title: 'VOICE VERIFICATION CONFIRMED FAMILY SAFETY',
      headline: 'Elena calls her son\'s actual number; he answers laughing!',
      summary: 'Elena dialed her son\'s usual phone number. He answered safely from his apartment, completely unaware someone was impersonating him with a fake broken phone story.',
      soundEffect: 'FAMILY_SAFE_FANFARE',
      cyberImpact: 'Family Protected · $350 Saved · Impersonation Bot Neutralized',
      novaVerdict: 'Heroic instincts, Detective! Scammers rely on emotional panic to stop you from picking up the phone. A single phone call shattered the illusion.',
      panels: [
        {
          id: 'out-fam-safe-1',
          title: 'Dialing the Real Contact',
          narrative: 'Elena opens her contacts and presses call on her son\'s regular phone number.',
          speaker: 'Elena Ramos',
          dialogue: 'Calling Lucas on his regular number right now...',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-fam-safe-2',
          title: 'The Real Son Answers',
          narrative: 'Lucas picks up on the second ring, eating breakfast at home.',
          speaker: 'Lucas (Real Son)',
          dialogue: 'Hey Mom! My phone didn\'t fall in any sink, and my car is parked right outside. Someone is spoofing you!',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
        {
          id: 'out-fam-safe-3',
          title: 'Nova\'s Highest Honors',
          narrative: 'Chief Inspector Nova salutes Elena\'s emotional resilience.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Brilliant! When panic strikes, taking 30 seconds to verify out-of-band turns an emotional crisis into an open-and-shut case.',
          visualType: 'outcome_safe',
          mood: 'relieved',
        },
      ],
    },
    'act-unsafe-wire-now': {
      title: 'P2P TRANSFER SENT TO UNKNOWN STRANGER',
      headline: 'Sending $350 via Zelle to an unfamiliar email cannot be reversed!',
      summary: 'Peer-to-peer transfers are treated like cash. The recipient was an overseas money mule network, and the real child never needed a tow truck.',
      soundEffect: 'WIRE_SENT_EMPTY_ECHO',
      cyberImpact: 'Simulated $350 Irreversible Wire · Stolen Identity Exploit',
      novaVerdict: 'Deep breath, Detective. It is completely human to want to protect family in an emergency. That is why scammers use this trick. Let\'s rewind and verify.',
      panels: [
        {
          id: 'out-fam-unsafe-1',
          title: 'The Rushed Zelle Wire',
          narrative: 'Terrified her child is stranded, Elena sends $350 to "quick-help-pay@fastfunds.example".',
          speaker: 'P2P Wire Confirmation',
          dialogue: 'Transfer Complete: $350.00 sent to QuickHelp LLC. Funds cannot be recalled.',
          visualType: 'outcome_unsafe',
          mood: 'alarmed',
        },
        {
          id: 'out-fam-unsafe-2',
          title: 'The Ghost Vanishes',
          narrative: 'The unknown phone number immediately disconnects and blocks further texts.',
          speaker: 'Scam Operation',
          dialogue: 'Mule transfer confirmed. SIM card deactivated.',
          visualType: 'outcome_unsafe',
          mood: 'trapped',
        },
        {
          id: 'out-fam-unsafe-3',
          title: 'Nova Rewind Intervention',
          narrative: 'Chief Inspector Nova resets the simulation timeline with warmth and empathy.',
          speaker: 'Chief Inspector Nova',
          dialogue: 'Stop the clock, Detective! Your heart was in the right place, but your defenses need an out-of-band verification rule. Let\'s rewind time and call the real number.',
          visualType: 'outcome_unsafe',
          mood: 'curious',
        },
      ],
    },
  },
};

// Sound Synthesis using Web Audio API (Zero external assets, resilient fallback)
export const playAudioFx = (
  type: 'clue' | 'stamp' | 'success' | 'alert' | 'rewind' | 'connect' | 'error'
) => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'clue') {
      // Tactile high-frequency lens snap & ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'connect') {
      // Satisfying electronic puzzle connection chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.06); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'error') {
      // Gentle double-tone blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'stamp') {
      // Physical rubber stamp thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'success') {
      // Ascending triumphant cyber arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } else if (type === 'alert') {
      // Dual tone caution warning
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'rewind') {
      // Retro tape rewind descending-ascending sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // Non-blocking fallback
  }
};

export type PuzzleCategory = 'pressure' | 'sender' | 'payment';
export type BoardQuestionId = 'who' | 'what' | 'action';

export interface BoardQuestionDef {
  id: BoardQuestionId;
  question: string;
  subtitle: string;
  targetCategory: PuzzleCategory;
  categoryLabel: string;
  badgeText: string;
}

export const BOARD_QUESTIONS: BoardQuestionDef[] = [
  {
    id: 'who',
    question: 'Who sent this?',
    subtitle: 'Identify the unverified sender, spoofed lookalike address, or impostor identity.',
    targetCategory: 'sender',
    categoryLabel: 'Sender identity',
    badgeText: 'SENDER IDENTITY',
  },
  {
    id: 'what',
    question: 'What do they want?',
    subtitle: 'Spot the risky demand: micro-fees, gift cards, 2FA codes, or credentials.',
    targetCategory: 'payment',
    categoryLabel: 'Payment or information request',
    badgeText: 'RISKY DEMAND',
  },
  {
    id: 'action',
    question: 'What should I do?',
    subtitle: 'Recognize the pressure tactic to pause, verify independently, and block fraud.',
    targetCategory: 'pressure',
    categoryLabel: 'Pressure tactic',
    badgeText: 'PRESSURE TACTIC',
  },
];

export interface CluePuzzleMeta {
  observation: string;
  category: PuzzleCategory;
  questionId: BoardQuestionId;
  shortLabel: string;
}

export const CLUE_OBSERVATIONS: Record<string, CluePuzzleMeta> = {
  // Case 1: Tutorial Parcel
  'clue-delivery-link': {
    observation: 'This web address points to "track-fee89.example", NOT the verified courier website.',
    category: 'sender',
    questionId: 'who',
    shortLabel: 'Spoofed lookalike link',
  },
  'clue-delivery-fee': {
    observation: 'This message demands an unexpected $1.98 credit card redelivery fee.',
    category: 'payment',
    questionId: 'what',
    shortLabel: 'Surprise $1.98 fee demand',
  },
  'clue-delivery-urgency': {
    observation: 'This message threatens that your package will be destroyed within two hours.',
    category: 'pressure',
    questionId: 'action',
    shortLabel: '2-hour destruction threat',
  },

  // Case 2: Bank Freeze
  'clue-bank-sender': {
    observation: 'The sender address is "horizon-security-desk99.example", not the real financial institution.',
    category: 'sender',
    questionId: 'who',
    shortLabel: 'Mismatched sender domain',
  },
  'clue-bank-otp': {
    observation: 'This message demands you enter your 6-digit one-time verification passcode.',
    category: 'payment',
    questionId: 'what',
    shortLabel: 'Asks for 2FA one-time code',
  },
  'clue-bank-threat': {
    observation: 'This alert threatens that your savings account will close permanently in 15 minutes.',
    category: 'pressure',
    questionId: 'action',
    shortLabel: '15-min countdown threat',
  },

  // Case 3: Remote Job
  'clue-job-offplatform': {
    observation: 'The recruiter redirects corporate hiring to an unmonitored Telegram handle.',
    category: 'sender',
    questionId: 'who',
    shortLabel: 'Off-platform chat redirect',
  },
  'clue-job-advance-fee': {
    observation: 'The sender asks you to deposit an emailed check and Zelle $450 back to a vendor.',
    category: 'payment',
    questionId: 'what',
    shortLabel: 'Fake check & $450 advance fee',
  },
  'clue-job-too-good': {
    observation: 'This offer promises $45/hour for entry-level work with zero interview or screening.',
    category: 'pressure',
    questionId: 'action',
    shortLabel: 'Unrealistic $45/hr bait',
  },

  // Case 4: Marketplace
  'clue-market-excuse': {
    observation: 'The buyer invents a remote military assignment to avoid meeting in person.',
    category: 'sender',
    questionId: 'who',
    shortLabel: 'Remote buyer excuse',
  },
  'clue-market-giftcard': {
    observation: 'The buyer demands you buy retail gift cards to pay their third-party courier.',
    category: 'payment',
    questionId: 'what',
    shortLabel: 'Retail gift card demand',
  },
  'clue-market-overpay': {
    observation: 'The buyer sends an unsolicited $250 overpayment to pressure you into courier shipping.',
    category: 'pressure',
    questionId: 'action',
    shortLabel: 'Unsolicited $250 overpayment',
  },

  // Case 5: Family Emergency
  'clue-family-broken': {
    observation: 'An unfamiliar number texts claiming to be your child with a suddenly broken phone.',
    category: 'sender',
    questionId: 'who',
    shortLabel: 'Unsolicited new number claim',
  },
  'clue-family-stranger-pay': {
    observation: 'The sender demands an instant $350 transfer to an unfamiliar third-party email handle.',
    category: 'payment',
    questionId: 'what',
    shortLabel: 'Instant wire to stranger',
  },
  'clue-family-urgency': {
    observation: 'The message creates an urgent towing impound emergency before 9 AM to cause panic.',
    category: 'pressure',
    questionId: 'action',
    shortLabel: 'Urgent 9 AM towing crisis',
  },
};

export const getCluePuzzleMeta = (clueId: string, textSnippet: string): CluePuzzleMeta => {
  if (CLUE_OBSERVATIONS[clueId]) {
    return CLUE_OBSERVATIONS[clueId];
  }

  // Heuristic based on text content
  const lower = textSnippet.toLowerCase();
  if (lower.includes('http') || lower.includes('@') || lower.includes('from:') || lower.includes('phone') || lower.includes('telegram')) {
    return {
      observation: `This detail points to an unverified sender or address: "${textSnippet}".`,
      category: 'sender',
      questionId: 'who',
      shortLabel: 'Sender identity',
    };
  }
  if (lower.includes('$') || lower.includes('fee') || lower.includes('code') || lower.includes('zelle') || lower.includes('card') || lower.includes('pay')) {
    return {
      observation: `This detail demands money, gift cards, or credentials: "${textSnippet}".`,
      category: 'payment',
      questionId: 'what',
      shortLabel: 'Payment/info demand',
    };
  }
  return {
    observation: `This detail creates artificial urgency or pressure: "${textSnippet}".`,
    category: 'pressure',
    questionId: 'action',
    shortLabel: 'Pressure tactic',
  };
};

// Helper to enrich a DetectiveCase with District, Character, and Comic data
export const enrichCaseWithNeonWorld = (caseItem: DetectiveCase): DetectiveCase => {
  const districtMap: Record<string, CityDistrict> = {
    'case-tutorial': 'Delivery Dock',
    'case-bank-freeze': 'Account Alert Arcade',
    'case-remote-job': 'Job-Offer Tower',
    'case-marketplace-overpayment': 'Marketplace Alley',
    'case-family-emergency': 'Neon Suburbs',
  };

  const district = caseItem.district || districtMap[caseItem.id] || 'Delivery Dock';
  const character = caseItem.character || CASE_CHARACTERS[caseItem.id] || {
    name: 'Alex Vance',
    role: 'Cyber Citizen',
    district,
    bio: 'A resident of Neon City navigating suspicious communications.',
    avatarColor: '#39BDF7',
    initials: 'AV',
    reactionQuote: 'Something feels off about this message. Better investigate closely.',
  };

  const comicPrologue = caseItem.comicPrologue || CASE_COMIC_PROLOGUES[caseItem.id] || [
    {
      id: `${caseItem.id}-p1`,
      title: `${district} Investigation`,
      narrative: `A new mystery arrives at ${district}. Citizen ${character.name} reports a strange incoming alert.`,
      visualType: 'setting',
      mood: 'neutral',
      avatarBg: 'bg-slate-900',
    },
    {
      id: `${caseItem.id}-p2`,
      title: 'Suspicious Transmission',
      narrative: `An unverified message demands immediate attention with unusual conditions.`,
      speaker: caseItem.senderInfo.name,
      dialogue: 'Action required immediately to prevent loss or account suspension.',
      visualType: 'incoming_alert',
      mood: 'alarmed',
    },
    {
      id: `${caseItem.id}-p3`,
      title: 'The Detective Call',
      narrative: `Inspect the evidence, uncover the red flags, and guide the citizen to a safe outcome.`,
      speaker: character.name,
      dialogue: character.reactionQuote,
      visualType: 'character_reaction',
      mood: 'curious',
    },
  ];

  // Enrich action options with illustrated outcomes if available
  const enrichedOptions = caseItem.actionOptions.map((opt) => {
    const outcome = CASE_STORY_OUTCOMES[caseItem.id]?.[opt.id];
    return {
      ...opt,
      outcome: opt.outcome || outcome,
    };
  });

  return {
    ...caseItem,
    district,
    character,
    comicPrologue,
    actionOptions: enrichedOptions,
  };
};

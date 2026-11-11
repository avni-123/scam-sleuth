import { LevelId } from '../types/adventure';

export type CutsceneCameraShot =
  | 'character_medium'
  | 'device_closeup'
  | 'character_and_clue'
  | 'investigator_arrival';

export interface IntroDevicePopup {
  deviceType: 'phone' | 'laptop' | 'audio_call' | 'case_board';
  headerTitle: string;
  senderOrUrl: string;
  timestamp: string;
  alertBadge: string;
  messagePreview: string;
  mysteryHighlight: string;
}

export interface IntroCutsceneBeat {
  id: string;
  durationSec: number;
  cameraShot: CutsceneCameraShot;
  speaker: string;
  speakerRole: string;
  speakerColor: string;
  subtitleText: string;
  actionStageDirection: string;
  showDevicePopup?: boolean;
  isNpcSpeaking?: boolean;
}

export interface LevelIntroCutscene {
  levelId: LevelId;
  levelNumberLabel: string;
  title: string;
  timeAndPlaceKicker: string;
  affectedCharacterName: string;
  affectedCharacterRole: string;
  oneLineSkipSummary: string;
  compellingQuestion: string;
  startingObjective: string;
  devicePopup: IntroDevicePopup;
  beats: [IntroCutsceneBeat, IntroCutsceneBeat, IntroCutsceneBeat, IntroCutsceneBeat];
}

export const LEVEL_INTRO_CUTSCENES: Record<string, LevelIntroCutscene> = {
  'tutorial-delivery': {
    levelId: 'tutorial-delivery',
    levelNumberLabel: 'CASE 01 · PRE-INVESTIGATION',
    title: 'The Parcel That Never Came',
    timeAndPlaceKicker: '8:42 PM · 10 Minutes Before Arrival · Sunset Heights Apt 4B',
    affectedCharacterName: 'Alex Rivera',
    affectedCharacterRole: 'Neighbor & Digital Illustrator',
    oneLineSkipSummary:
      'Alex received a late-night text demanding a $2.85 fee within 2 hours to release a parcel of illustration pens.',
    compellingQuestion:
      'Why would a city courier text from an unlisted mobile number at night—and what is the [GH-PRISM-01] code at the bottom?',
    startingObjective: 'Talk to Alex Rivera or inspect Alex’s Smartphone on the desk.',
    devicePopup: {
      deviceType: 'phone',
      headerTitle: 'New Text Message Alert',
      senderOrUrl: '+1 (555) 019-3382',
      timestamp: 'Tonight · 8:42 PM',
      alertBadge: '2-HOUR HOLD TIMER',
      messagePreview:
        'CITY-POST ALERT: Parcel #CP-8831 is ON HOLD due to an incomplete street label ($2.85 fee). Pay at parcel-relabel-hold.invalid/pay or item returns.',
      mysteryHighlight: 'Unlisted sender number · [Ref: GH-PRISM-01]',
    },
    beats: [
      {
        id: 'l1-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Alex Rivera',
        speakerRole: 'Neighbor · Sunset Heights Apt 4B',
        speakerColor: '#3b82f6',
        subtitleText:
          '“Deadline tomorrow morning, and my box of fine-liner illustration pens still hasn’t arrived...”',
        actionStageDirection: 'Alex paces beside the walnut writing desk in Apartment 4B, checking the hallway door.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l1-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Alex Rivera',
        speakerRole: 'Neighbor · Inspecting Smartphone',
        speakerColor: '#3b82f6',
        subtitleText:
          '“Wait—my phone just buzzed! It says my parcel is stuck at a depot unless I pay a $2.85 address fee in the next two hours.”',
        actionStageDirection: 'On the desk stand, Alex’s smartphone screen lights up with an urgent redelivery fee alert.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l1-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Alex Rivera',
        speakerRole: 'Neighbor · Spotting a Discrepancy',
        speakerColor: '#3b82f6',
        subtitleText:
          '“It’s only $2.85, so part of me wants to just pay it... but why is there a strange [GH-PRISM-01] code in the corner?”',
        actionStageDirection: 'Alex glances from the glowing phone screen toward the building’s courier notice by the door.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l1-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Apt 4B',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Hold on before you tap that link, Alex. Let’s examine the phone and the building courier notice first.”',
        actionStageDirection: 'You step into Sunset Heights Apartment 4B as Alex turns toward you for help.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'level-02': {
    levelId: 'level-02',
    levelNumberLabel: 'CASE 02 · PRE-INVESTIGATION',
    title: 'The Roommate’s Emergency',
    timeAndPlaceKicker: '9:50 PM · 8 Minutes Before Arrival · Sunset Heights Living Room',
    affectedCharacterName: 'Alex Rivera',
    affectedCharacterRole: 'Neighbor & Friend of Jordan',
    oneLineSkipSummary:
      'An unknown number claiming to be Alex’s roommate Jordan just demanded $180 in 10 minutes for a tow truck while refusing a voice call.',
    compellingQuestion:
      'If Jordan really broke their phone, why are they asking for tow money when they take the metro—and using a @GH-Prism-Transfer02 tag?',
    startingObjective: 'Talk to Alex Rivera or inspect the Chat Message on the Tablet.',
    devicePopup: {
      deviceType: 'laptop',
      headerTitle: 'Incoming Chat from Unknown Number',
      senderOrUrl: '+1 (555) 014-9920 · "New Number"',
      timestamp: 'Tonight · 9:50 PM',
      alertBadge: '10-MIN TOW COUNTDOWN',
      messagePreview:
        '“Hey roomie it’s Jordan! Broke my screen so texting from a temp phone. Tow driver wants $180 in 10 mins! Send to @GH-Prism-Transfer02, can’t talk on voice!”',
      mysteryHighlight: 'Refuses voice call · Tag: @GH-Prism-Transfer02',
    },
    beats: [
      {
        id: 'l2-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Alex Rivera',
        speakerRole: 'Neighbor · Sunset Heights Living Room',
        speakerColor: '#3b82f6',
        subtitleText:
          '“After that fake parcel text yesterday, I thought tonight would be quiet—until my tablet chimed from an unknown number.”',
        actionStageDirection: 'Alex stands near the living room coffee table as an urgent chat notification flashes on the tablet.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l2-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Alex Rivera',
        speakerRole: 'Neighbor · Reading Tablet Chat',
        speakerColor: '#3b82f6',
        subtitleText:
          '“It says: ‘Hey roomie, it’s Jordan! Dropped my phone and my sedan is being towed—send $180 in 10 minutes, can’t talk on voice!’”',
        actionStageDirection: 'The tablet screen displays a high-urgency money request to handle @GH-Prism-Transfer02.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l2-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Alex Rivera',
        speakerRole: 'Neighbor · Checking Wall Schedule',
        speakerColor: '#3b82f6',
        subtitleText:
          '“I never want to leave a friend stranded... but didn’t Jordan take the metro to pottery class tonight? And look at that payment tag!”',
        actionStageDirection: 'Alex looks between the tablet chat and the shared roommate calendar pinned on the wall.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l2-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving on Scene',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Don’t send the transfer yet, Alex. Let’s check the tablet chat against the household schedule on the wall.”',
        actionStageDirection: 'You arrive in the living room, ready to compare the chat message with the wall calendar.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'campus-login': {
    levelId: 'campus-login',
    levelNumberLabel: 'CASE 03 · PRE-INVESTIGATION',
    title: 'The Campus Login',
    timeAndPlaceKicker: '11:15 AM · 5 Minutes Before Arrival · Oakridge University Courtyard',
    affectedCharacterName: 'Maya Chen',
    affectedCharacterRole: 'Computer Science Student',
    oneLineSkipSummary:
      'Student Maya Chen received an urgent warning that her university portal will lock in 15 minutes unless she logs into a look-alike page.',
    compellingQuestion:
      'The login screen has the university’s exact green banner—so why does the browser address bar end in ".invalid" with a [GH-PRISM-03] tag?',
    startingObjective: 'Talk to Maya Chen or inspect Maya’s Study Laptop.',
    devicePopup: {
      deviceType: 'laptop',
      headerTitle: 'Browser Alert · Student Portal Warning',
      senderOrUrl: 'oakridge-edu-portal-verify.invalid/login',
      timestamp: 'Today · 11:15 AM',
      alertBadge: '15-MIN DEACTIVATION TIMER',
      messagePreview:
        'URGENT SECURITY NOTICE: Your Oakridge student account expires in 15 minutes. Enter University ID, Password, and 6-digit code to keep access.',
      mysteryHighlight: 'Look-alike URL · [Template: GH-PRISM-03]',
    },
    beats: [
      {
        id: 'l3-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Maya Chen',
        speakerRole: 'CS Student · Oakridge Courtyard',
        speakerColor: '#10b981',
        subtitleText:
          '“Alex told me how you spotted those two Glasshouse messages in Sunset Heights—and now something strange just hit our campus.”',
        actionStageDirection: 'Maya sits at the courtyard study table with her laptop open, preparing to upload her project.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l3-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Maya Chen',
        speakerRole: 'CS Student · Examining Browser Screen',
        speakerColor: '#10b981',
        subtitleText:
          '“Right before I could upload my lab, an alert popped up saying my student portal will be deactivated in 15 minutes unless I sign in here.”',
        actionStageDirection: 'Maya’s laptop displays an official-looking university login prompt with a ticking 15-minute warning.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l3-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Maya Chen',
        speakerRole: 'CS Student · Pausing Before Typing',
        speakerColor: '#10b981',
        subtitleText:
          '“The colors and logo look real, but something about the address bar and the 6-digit code box feels off.”',
        actionStageDirection: 'Maya pulls her hands back from the keyboard and glances toward the Campus IT Security Kiosk.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l3-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Courtyard',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Good catch keeping your hands off the keyboard, Maya. Let’s inspect the browser address bar and the Campus IT notice.”',
        actionStageDirection: 'You walk into the courtyard, ready to inspect Maya’s laptop and the IT kiosk.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'marketplace-meetup': {
    levelId: 'marketplace-meetup',
    levelNumberLabel: 'CASE 04 · PRE-INVESTIGATION',
    title: 'Marketplace Mirage',
    timeAndPlaceKicker: '1:20 PM · Moments Before Arrival · Café Lumière Patio',
    affectedCharacterName: 'Marcus Vance',
    affectedCharacterRole: 'Artisan Woodworker',
    oneLineSkipSummary:
      'A buyer double-parked outside texted woodworker Marcus Vance a "$320 Paid" screenshot, but Marcus’s real payment app still shows $0.00.',
    compellingQuestion:
      'Why does the buyer’s screenshot claim the $320 is "Held in Escrow until handover" while Marcus’s official payment app shows $0.00?',
    startingObjective: 'Talk to Marcus Vance or inspect the Buyer’s Screenshot Message.',
    devicePopup: {
      deviceType: 'phone',
      headerTitle: 'Buyer Chat Image Attachment',
      senderOrUrl: 'Buyer "K. Sterling" · Pickup Outside',
      timestamp: 'Today · 1:20 PM',
      alertBadge: 'CURBSIDE RUSH PICKUP',
      messagePreview:
        'IMAGE RECEIPT: "Paid $320.00 to Marcus Vance ✓ Status: Held in Escrow until Seller hands table to driver. [Stamp: GH-PRISM-04]"',
      mysteryHighlight: 'Crooked font alignment · Real App Balance: $0.00',
    },
    beats: [
      {
        id: 'l4-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Marcus Vance',
        speakerRole: 'Artisan Woodworker · Café Lumière',
        speakerColor: '#39BDF7',
        subtitleText:
          '“I spent three weeks crafting this walnut side table, and a buyer online offered the full $320 without even haggling.”',
        actionStageDirection: 'Marcus stands on the Café Lumière patio beside his packaged handcrafted table.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l4-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Marcus Vance',
        speakerRole: 'Artisan Woodworker · Looking at Phone',
        speakerColor: '#39BDF7',
        subtitleText:
          '“They just pulled up to the curb, honked the horn, and texted me this picture of a receipt saying the $320 is ‘Sent & Held in Escrow.’”',
        actionStageDirection: 'Marcus’s phone displays the buyer’s image attachment with a green checkmark and a [GH-PRISM-04] stamp.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l4-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Marcus Vance',
        speakerRole: 'Artisan Woodworker · Checking Real Balance',
        speakerColor: '#39BDF7',
        subtitleText:
          '“They’re waving at me to load the table into their van right now—but why does my actual payment app still say zero dollars?”',
        actionStageDirection: 'Marcus hesitates between the buyer’s screenshot and his own payment app ledger on the table.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l4-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Patio',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Keep hold of that table, Marcus. Let’s compare their screenshot with your official payment app before anything leaves this patio.”',
        actionStageDirection: 'You step onto the Café Lumière patio as Marcus turns to show you the two screens.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'toogood-job': {
    levelId: 'toogood-job',
    levelNumberLabel: 'CASE 05 · PRE-INVESTIGATION',
    title: 'The Too-Good Job',
    timeAndPlaceKicker: '2:10 PM · 6 Minutes Before Arrival · Co-Working Studio Desk 4',
    affectedCharacterName: 'Priya Sharma',
    affectedCharacterRole: 'UX Designer',
    oneLineSkipSummary:
      'UX designer Priya Sharma received an instant $85/hour remote job offer with no interview that demands a $250 upfront laptop deposit.',
    compellingQuestion:
      'Why would a company hire a designer at $85/hour without an interview—and ask for banking logins and a $250 deposit to [GH-PRISM-05]?',
    startingObjective: 'Talk to Priya Sharma or inspect Priya’s Onboarding Form.',
    devicePopup: {
      deviceType: 'laptop',
      headerTitle: 'Instant-Hire Onboarding Portal',
      senderOrUrl: 'careers-fasttrack-hire.invalid',
      timestamp: 'Today · 2:10 PM',
      alertBadge: '30-MIN ONBOARDING DEADLINE',
      messagePreview:
        'CONGRATULATIONS! Hired on the spot at $85/hr. Enter government ID + banking login, and send $250 laptop deposit to vendor GH-PRISM-05.',
      mysteryHighlight: 'Zero interview · Upfront fee to [GH-PRISM-05]',
    },
    beats: [
      {
        id: 'l5-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Co-Working Studio',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“Maya mentioned you’ve been tracking the Glasshouse cases across town. Look what just landed in my inbox at the co-working studio!”',
        actionStageDirection: 'Priya stands by Desk 4 in the sunlit co-working studio, gesturing toward her open laptop.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l5-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Reading Offer Packet',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“A recruiter offered me an $85-an-hour remote UX role—hired on the spot without even a portfolio review or video interview!”',
        actionStageDirection: 'The laptop screen shows an urgent onboarding form demanding ID, bank credentials, and a $250 deposit.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l5-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Questioning the Form',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“They say the offer vanishes in 30 minutes unless I pay $250 to their laptop vendor... wait, is that another [GH-PRISM] code?”',
        actionStageDirection: 'Priya leans closer to the screen, noticing vendor code GH-PRISM-05 and the company directory nearby.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l5-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Studio',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Don’t enter a single detail on that form, Priya. Let’s inspect the onboarding page and the company’s official recruiting policy.”',
        actionStageDirection: 'You arrive at Co-Working Studio Desk 4 to examine Priya’s laptop and the verified careers notice.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'level-06': {
    levelId: 'level-06',
    levelNumberLabel: 'CASE 06 · PRE-INVESTIGATION',
    title: 'The One-Time Code',
    timeAndPlaceKicker: '3:05 PM · Live Call in Progress · Studio Lounge Phone Booth',
    affectedCharacterName: 'Priya Sharma',
    affectedCharacterRole: 'UX Designer',
    oneLineSkipSummary:
      'A polite caller claiming to be cloud support is on the line asking Priya to read aloud a 6-digit one-time code that just arrived by text.',
    compellingQuestion:
      'The caller sounds calm and helpful—so why does the 6-digit text message explicitly warn: "Our staff will NEVER call you and ask for this code"?',
    startingObjective: 'Talk to Priya Sharma or inspect Priya’s Phone Screen.',
    devicePopup: {
      deviceType: 'audio_call',
      headerTitle: 'Active Call + Incoming SMS Code',
      senderOrUrl: 'Caller: "Cloud Security Desk" · SMS: 492-810',
      timestamp: 'Live Now · 3:05 PM',
      alertBadge: 'CALLER ASKING FOR 6-DIGIT CODE',
      messagePreview:
        'SMS ALERT: Your password-reset code is 492-810. WARNING: Staff will NEVER call and ask for this code. [Caller Ref: GH-PRISM-06]',
      mysteryHighlight: 'Caller wants reset code · [Ref: GH-PRISM-06]',
    },
    beats: [
      {
        id: 'l6-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Studio Lounge',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“Right after I ignored that fake job form, my phone rang. The caller ID says ‘Cloud Storage Security Support’!”',
        actionStageDirection: 'Priya stands near the studio lounge table with her phone on speaker.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l6-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Listening to Speakerphone',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“The caller sounds so polite—they said someone is trying to break into my cloud drive, and they just texted me a 6-digit code to block it.”',
        actionStageDirection: 'On the phone screen, a 6-digit password-reset text pops up while the caller waits on the line.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l6-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Reading the SMS Warning',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“They’re telling me to read the six digits out loud right now before the session times out... but look at the warning inside the text itself!”',
        actionStageDirection: 'Priya covers the microphone with her hand, looking at the SMS warning and the security guide card.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l6-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Stepping In',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Keep that phone muted, Priya! Do not read those digits aloud—let’s inspect the text message and the two-factor guide right now.”',
        actionStageDirection: 'You step into the lounge beside Priya to examine the phone screen and security reference card.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'level-07': {
    levelId: 'level-07',
    levelNumberLabel: 'CASE 07 · PRE-INVESTIGATION',
    title: 'The Fake Charity Drive',
    timeAndPlaceKicker: '3:30 PM · 5 Minutes Before Arrival · Community Center Courtyard',
    affectedCharacterName: 'Marcus Vance',
    affectedCharacterRole: 'Community Volunteer & Woodworker',
    oneLineSkipSummary:
      'Marcus received an urgent DM claiming a 5x matching grant for Oakridge Park disappears in 20 minutes unless he donates via gift card or personal transfer.',
    compellingQuestion:
      'Everyone loves Oakridge Park—but why would a registered park foundation demand prepaid gift cards to personal handle @GH-Prism-Give07?',
    startingObjective: 'Talk to Marcus Vance or inspect the Urgent Fundraiser Message.',
    devicePopup: {
      deviceType: 'phone',
      headerTitle: 'Urgent Direct Message Appeal',
      senderOrUrl: '@Oakridge-Park-Urgent-Fund07',
      timestamp: 'Today · 3:30 PM',
      alertBadge: 'FINAL 20 MINUTES · 5X MATCH',
      messagePreview:
        '“Save Oakridge Park trees today! Send $50 via prepaid gift card code or instant transfer to @GH-Prism-Give07 in 20 mins to unlock a 5x match!”',
      mysteryHighlight: 'Demands gift cards · Handle: @GH-Prism-Give07',
    },
    beats: [
      {
        id: 'l7-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Marcus Vance',
        speakerRole: 'Community Volunteer · Courtyard',
        speakerColor: '#39BDF7',
        subtitleText:
          '“After last week’s storm damaged the old oaks in Oakridge Park, the whole neighborhood has been wanting to pitch in and help.”',
        actionStageDirection: 'Marcus stands in the Community Center Courtyard near the local nonprofit registry board.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l7-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Marcus Vance',
        speakerRole: 'Community Volunteer · Checking DM Alert',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Then this direct message arrived: it says a 5x matching grant for the park expires in 20 minutes unless we donate right now!”',
        actionStageDirection: 'Marcus’s phone screen shows an emotional tree-planting appeal with a 20-minute countdown.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l7-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Marcus Vance',
        speakerRole: 'Community Volunteer · Spotting Red Flags',
        speakerColor: '#39BDF7',
        subtitleText:
          '“I’ve got $50 ready to give—but why are they asking for prepaid gift card codes or a transfer to @GH-Prism-Give07?”',
        actionStageDirection: 'Marcus looks from the DM on his phone toward the Verified Community Charity Board.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l7-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Courtyard',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Let’s make sure your donation actually reaches the park, Marcus. We’ll inspect that DM alongside the official charity directory.”',
        actionStageDirection: 'You join Marcus in the courtyard to verify the charity details before he donates.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'level-08': {
    levelId: 'level-08',
    levelNumberLabel: 'CASE 08 · PRE-INVESTIGATION',
    title: 'The Shared Laptop',
    timeAndPlaceKicker: '4:15 PM · 2 Minutes Before Class · Oakridge Library Print Lounge',
    affectedCharacterName: 'Maya Chen',
    affectedCharacterRole: 'Computer Science Student',
    oneLineSkipSummary:
      'In a rush before class, Maya logged into her personal email on a public library computer where "Keep me signed in" and password autofill are active.',
    compellingQuestion:
      'If Maya just clicks the red X on the browser window to make it to class on time, what stays behind on Library Public Station #04?',
    startingObjective: 'Talk to Maya Chen or inspect the Shared Library Workstation.',
    devicePopup: {
      deviceType: 'laptop',
      headerTitle: 'Library Public Station #04',
      senderOrUrl: 'Public Browser Profile · Active Session',
      timestamp: 'Today · 4:15 PM',
      alertBadge: 'PASSWORD SAVED TO PUBLIC PC',
      messagePreview:
        'Status: Personal Email SIGNED IN ("Keep me signed in" checked). Prompt: "Password saved to Public Profile." File: Return_Label.pdf in Downloads.',
      mysteryHighlight: 'Session stays open if window is only closed',
    },
    beats: [
      {
        id: 'l8-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Maya Chen',
        speakerRole: 'CS Student · Library Print Lounge',
        speakerColor: '#10b981',
        subtitleText:
          '“My laptop battery died ten minutes before lecture, so I hopped onto this public workstation in the print lounge just to print one label.”',
        actionStageDirection: 'Maya stands beside Library Public Station #04 holding her printed return label.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l8-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Maya Chen',
        speakerRole: 'CS Student · Glancing at Monitor',
        speakerColor: '#10b981',
        subtitleText:
          '“My lecture starts in two minutes! I was about to just click the X on the browser corner and sprint to class...”',
        actionStageDirection: 'The shared workstation screen shows Maya’s email inbox open, a saved-password banner, and a downloaded PDF.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l8-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Maya Chen',
        speakerRole: 'CS Student · Noticing Browser Prompts',
        speakerColor: '#10b981',
        subtitleText:
          '“Wait—did the public browser just save my password and check ‘Keep me signed in’? And what’s that [GH-PRISM-08] probe in my spam log?”',
        actionStageDirection: 'Maya pauses with her hand on the mouse, looking at the Public Computer Safety Checklist on the wall.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l8-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Print Lounge',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Hold up before you walk away from that terminal, Maya! Let’s inspect the active session and the library safety checklist.”',
        actionStageDirection: 'You arrive at the print lounge station to help Maya properly lock down the public computer.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'level-09': {
    levelId: 'level-09',
    levelNumberLabel: 'CASE 09 · PRE-INVESTIGATION',
    title: 'The Voice That Sounds Right',
    timeAndPlaceKicker: '4:45 PM · Moments Before Arrival · Design Studio Briefing Room',
    affectedCharacterName: 'Priya Sharma',
    affectedCharacterRole: 'UX Designer',
    oneLineSkipSummary:
      'Priya received an external voice note sounding just like her director Elena, demanding a secret $1,200 wire transfer without verifying on company chat.',
    compellingQuestion:
      'The voice sounds remarkably like Priya’s director Elena—so why was it sent from an external number demanding secrecy and tagged [GH-PRISM-09]?',
    startingObjective: 'Talk to Priya Sharma or inspect the Voice Note Message on Phone.',
    devicePopup: {
      deviceType: 'audio_call',
      headerTitle: 'External Audio Clip · Director_Urgent_Note.wav',
      senderOrUrl: 'Unknown External Account (+1 555-018-6021)',
      timestamp: 'Today · 4:45 PM',
      alertBadge: 'SECRECY DEMAND · DO NOT VERIFY',
      messagePreview:
        'AUDIO WAVEFORM: “Priya, it’s Elena. I’m in a closed meeting—do not message me on company chat. Wire $1,200 to GH-PRISM-09 immediately.”',
      mysteryHighlight: 'Audio Header: SynthVoice-GH-PRISM-09',
    },
    beats: [
      {
        id: 'l9-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Studio Briefing Room',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“Investigator, whoever is behind Glasshouse is getting more sophisticated. Listen to what just arrived on my phone.”',
        actionStageDirection: 'Priya stands in the quiet studio briefing room, staring at an audio waveform on her phone.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l9-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Playing Voice Note',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“It’s a voice note that sounds just like my director, Elena, telling me to wire $1,200 to a contractor and not tell anyone on company chat!”',
        actionStageDirection: 'The phone screen displays the audio clip transcript and metadata header SynthVoice-GH-PRISM-09.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l9-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Priya Sharma',
        speakerRole: 'UX Designer · Noticing the Inconsistency',
        speakerColor: '#8b5cf6',
        subtitleText:
          '“The voice sounds so convincing, like her keynote video last month—but isn’t the real Elena right down the hall in Conference Room B?”',
        actionStageDirection: 'Priya glances from her phone screen toward the Studio Verification Protocol Board.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l9-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Neighborhood Investigator · Arriving at Briefing Room',
        speakerColor: '#39BDF7',
        subtitleText:
          '“Never trust an unexpected voice note alone, Priya. Let’s inspect the audio metadata and the studio’s two-channel verification policy.”',
        actionStageDirection: 'You step into the briefing room to examine the voice note and the verification protocol board.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },

  'level-10': {
    levelId: 'level-10',
    levelNumberLabel: 'CASE 10 · CAMPAIGN FINALE PRE-INVESTIGATION',
    title: 'Glasshouse',
    timeAndPlaceKicker: '5:30 PM · Emergency Coalition Briefing · Neighborhood Cyber Safety Hub',
    affectedCharacterName: 'Alex, Maya, Marcus & Priya',
    affectedCharacterRole: 'Community Safety Coalition',
    oneLineSkipSummary:
      'A coordinated citywide "Glasshouse" alert combining urgency timers, a look-alike login page, and a one-time code trap just hit the neighborhood email list.',
    compellingQuestion:
      'Every clue from Cases 01 to 09 connects to [GH-PRISM-10]—how can we use the pattern we uncovered to protect the entire community at once?',
    startingObjective: 'Talk to Alex, Maya, Marcus & Priya or inspect The Master Glasshouse Case Board.',
    devicePopup: {
      deviceType: 'case_board',
      headerTitle: 'Citywide Alert · [GH-PRISM-10] Campaign',
      senderOrUrl: 'city-utility-rebate-portal.invalid',
      timestamp: 'Today · 5:30 PM',
      alertBadge: 'LAYERED COMMUNITY-WIDE TRAP',
      messagePreview:
        'COMBINED ALERT: Claims a $150 utility rebate expires in 20 minutes, links to a look-alike portal, and asks residents for their 6-digit SMS code.',
      mysteryHighlight: 'Combines Cases 01–09 · Master Tag [GH-PRISM-10]',
    },
    beats: [
      {
        id: 'l10-b1',
        durationSec: 6.5,
        cameraShot: 'character_medium',
        speaker: 'Alex Rivera & Maya Chen',
        speakerRole: 'Community Safety Coalition · Investigation Hub',
        speakerColor: '#3b82f6',
        subtitleText:
          '“Everyone’s here at the Hub—Alex, Maya, Marcus, and Priya. We pinned all nine [GH-PRISM] clues onto the master board, and then our phones chimed at once.”',
        actionStageDirection: 'At the Neighborhood Cyber Safety Hub, your neighbors gather between the Master Case Board and the alert terminal.',
        showDevicePopup: false,
        isNpcSpeaking: true,
      },
      {
        id: 'l10-b2',
        durationSec: 7.5,
        cameraShot: 'device_closeup',
        speaker: 'Marcus Vance & Priya Sharma',
        speakerRole: 'Community Safety Coalition · Reviewing Terminal',
        speakerColor: '#39BDF7',
        subtitleText:
          '“A mass message just went out to the whole neighborhood! It combines a 20-minute rebate timer, a look-alike login page, and a fake support caller asking for 6-digit codes.”',
        actionStageDirection: 'The terminal screen shows the layered [GH-PRISM-10] alert combining every trick from earlier cases.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l10-b3',
        durationSec: 7.0,
        cameraShot: 'character_and_clue',
        speaker: 'Alex, Maya, Marcus & Priya',
        speakerRole: 'Community Safety Coalition · Looking to You',
        speakerColor: '#10b981',
        subtitleText:
          '“Every single case we solved was part of this Glasshouse kit. How should we warn our neighbors and shut this campaign down for good?”',
        actionStageDirection: 'The camera pans from the terminal to the Master Glasshouse Case Board where all 10 cases connect.',
        showDevicePopup: true,
        isNpcSpeaking: true,
      },
      {
        id: 'l10-b4',
        durationSec: 6.0,
        cameraShot: 'investigator_arrival',
        speaker: 'Detective Rowan Vance (You)',
        speakerRole: 'Lead Investigator · Taking Command of the Hub',
        speakerColor: '#39BDF7',
        subtitleText:
          '“We know their exact formula now. Let’s inspect the Master Case Board and the terminal so we can protect the whole community.”',
        actionStageDirection: 'You step forward into the Investigation Hub as playable control begins.',
        showDevicePopup: false,
        isNpcSpeaking: false,
      },
    ],
  },
};

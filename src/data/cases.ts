import { DetectiveCase } from '../types/game.ts';

export const INITIAL_CASES: DetectiveCase[] = [
  {
    id: 'case-tutorial',
    caseNumber: 'TUTORIAL-00',
    title: 'The $1.98 Rescheduled Package',
    subtitle: 'SMS Smishing & Artificial Urgency',
    channel: 'sms',
    difficulty: 'Beginner',
    senderInfo: {
      name: 'Apex Express Notification',
      handleOrEmail: '+1 (555) 019-9482',
      displayPhone: '+1-555-019-9482',
    },
    messageContent: {
      dateStr: 'Today, 2:42 PM',
      segments: [
        { text: 'APEX PARCEL ALERT: Package #AP-8849 could not be delivered to your address. ' },
        { text: 'Action required within 2 hours or item will be destroyed: ', clueId: 'clue-delivery-urgency' },
        { text: 'Please pay the $1.98 redelivery processing fee ', clueId: 'clue-delivery-fee' },
        { text: 'and confirm your street address at ', clueId: undefined },
        { text: 'https://apex-parcel.track-fee89.example/redelivery', clueId: 'clue-delivery-link' },
        { text: ' to prevent permanent return to warehouse.' },
      ],
    },
    clues: [
      {
        id: 'clue-delivery-urgency',
        label: 'Artificial Urgency Threat',
        category: 'urgency',
        textSnippet: 'Action required within 2 hours or item will be destroyed',
        explanation:
          'Scammers create tight, stressful deadlines so you react quickly without thinking. Real delivery companies do not incinerate packages within two hours.',
        skillBadge: 'Pressure-Proof',
      },
      {
        id: 'clue-delivery-link',
        label: 'Spoofed Lookalike Domain',
        category: 'link',
        textSnippet: 'https://apex-parcel.track-fee89.example/redelivery',
        explanation:
          'Look closely at the domain: the actual website is "track-fee89.example", NOT "apexparcel.example". Scammers put the company name at the beginning of subdomains to fool rushed eyes.',
        skillBadge: 'Link Inspector',
      },
      {
        id: 'clue-delivery-fee',
        label: 'Unexpected Micro-Payment Demand',
        category: 'payment',
        textSnippet: 'pay the $1.98 redelivery processing fee',
        explanation:
          'A tiny charge ($1.98) feels trivial, but it is a credential-harvesting trap. Entering your card details hands over your full card number and CVV to an unauthorized party.',
        skillBadge: 'Payment Pause',
      },
    ],
    actionOptions: [
      {
        id: 'act-safe-verify',
        label: 'Check the real courier app or website directly',
        description: 'Open the official Apex Express app or visit apexparcel.example using a bookmark or search engine, and check your tracking number there.',
        isSafe: true,
        feedback: 'Spot on! Real couriers allow you to track packages directly in their official app or verified website without clicking links in unsolicited texts.',
        safetyTip: 'Never click tracking links in unexpected SMS messages. Always verify on the courier’s official portal.',
      },
      {
        id: 'act-safe-block',
        label: 'Block the sender & report spam',
        description: 'Mark the message as junk and block the phone number without replying or clicking anything.',
        isSafe: true,
        feedback: 'Great defense! Reporting the message helps filter out future spam and prevents accidental clicks.',
        safetyTip: 'Do not text back "STOP" or "NO" to unknown numbers—replying confirms your phone number is active.',
      },
      {
        id: 'act-unsafe-pay',
        label: 'Click the link and pay $1.98 so the package arrives',
        description: 'It is less than two dollars, so it seems harmless to quickly pay.',
        isSafe: false,
        feedback: 'Watch out! The $1.98 is bait. Once you enter your credit card on the fake page, scammers steal your card number and charge thousands.',
        safetyTip: 'Legitimate parcel services never require payment via an SMS link to complete a standard home delivery.',
      },
    ],
    practicalTakeaway: 'Couriers never destroy packages within hours or demand credit card details through unsolicited SMS links. Verify tracking numbers on official portals.',
    confidenceFollowup: {
      question: 'Which telltale sign made you most suspicious?',
      options: [
        {
          id: 'opt-link',
          text: 'The weird URL domain (track-fee89.example)',
          habitInsight: 'Mastering domain reading is the #1 defense against phishing. Always look at the letters immediately preceding the top-level extension (.com, .org).',
        },
        {
          id: 'opt-urgency',
          text: 'The extreme 2-hour deadline',
          habitInsight: 'Whenever a message makes your heart race with urgency, pause for 60 seconds. Artificial panic is the hallmark of social engineering.',
        },
        {
          id: 'opt-fee',
          text: 'The demand for a surprise payment',
          habitInsight: 'Deliveries you already paid for should never demand unexpected toll or redelivery fees via text.',
        },
      ],
    },
  },
  {
    id: 'case-bank-freeze',
    caseNumber: 'CASE-101',
    title: 'The Immediate Account Freeze',
    subtitle: 'Bank Impersonation & 2FA Code Harvesting',
    channel: 'email',
    difficulty: 'Intermediate',
    senderInfo: {
      name: 'Horizon Federal Security Center',
      handleOrEmail: 'alerts@horizon-security-desk99.example',
    },
    messageContent: {
      subject: 'URGENT: Unauthorized login detected from Frankfurt, Germany',
      dateStr: 'Yesterday, 11:14 PM',
      segments: [
        { text: 'Horizon Federal Credit Union Security Alert:\n\n' },
        { text: 'We detected an unauthorized sign-in attempt on your savings account. ', clueId: undefined },
        { text: 'Your account will be suspended permanently within 15 minutes ', clueId: 'clue-bank-threat' },
        { text: 'unless you verify your identity.\n\n' },
        { text: 'From: alerts@horizon-security-desk99.example\n\n', clueId: 'clue-bank-sender' },
        { text: 'To cancel this unauthorized transaction, click here: ', clueId: undefined },
        { text: 'https://horizon-bank.login-verify-account.example/secure-auth\n\n', clueId: 'clue-bank-link' },
        { text: 'CRITICAL: You will receive a 6-digit one-time code on your mobile. Enter it immediately on the verification screen to unlock your funds.', clueId: 'clue-bank-otp' },
      ],
    },
    clues: [
      {
        id: 'clue-bank-sender',
        label: 'Mismatched External Sender Address',
        category: 'sender',
        textSnippet: 'alerts@horizon-security-desk99.example',
        explanation:
          'The display name says "Horizon Federal", but the actual sender domain is "horizon-security-desk99.example", a fraudulent lookalike domain not owned by the real financial institution.',
        skillBadge: 'Identity Verifier',
      },
      {
        id: 'clue-bank-threat',
        label: 'High-Pressure Threat of Suspension',
        category: 'urgency',
        textSnippet: 'Your account will be suspended permanently within 15 minutes',
        explanation:
          'Banks may freeze a suspicious card, but they never give a 15-minute countdown ultimatum to delete or permanently suspend your accounts via email.',
        skillBadge: 'Pressure-Proof',
      },
      {
        id: 'clue-bank-link',
        label: 'Deceptive Phishing Destination',
        category: 'link',
        textSnippet: 'https://horizon-bank.login-verify-account.example/secure-auth',
        explanation:
          'The link directs to "login-verify-account.example", a clone page built to record your online banking password and answers to security questions.',
        skillBadge: 'Link Inspector',
      },
      {
        id: 'clue-bank-otp',
        label: 'Two-Factor Authentication Code Harvesting',
        category: 'code_request',
        textSnippet: 'Enter it immediately on the verification screen to unlock your funds',
        explanation:
          'Scammers are actively triggering a password reset on your real account. If you enter the 6-digit SMS code on their fake page, they take over your bank account.',
        skillBadge: 'Code Guardian',
      },
    ],
    actionOptions: [
      {
        id: 'act-safe-bank-call',
        label: 'Call the number on the back of your debit card',
        description: 'Ignore all links in the email. Look at your physical card or bank statement and call their official fraud division directly.',
        isSafe: true,
        feedback: 'Master-level move! The phone number printed on the back of your physical card is 100% verified and cannot be spoofed by incoming emails.',
        safetyTip: 'Whenever a bank warns you about an urgent breach, never use contact details provided in the message. Always flip your card over and call that number.',
      },
      {
        id: 'act-safe-login-app',
        label: 'Open the official bank app directly from your phone',
        description: 'Launch your trusted banking app without touching the email link to see if any genuine security notifications exist.',
        isSafe: true,
        feedback: 'Excellent! If your account actually has an alert, your official mobile app will display it securely inside the verified app inbox.',
        safetyTip: 'Genuine account freezes appear within your banking dashboard after you log in securely.',
      },
      {
        id: 'act-unsafe-submit-code',
        label: 'Click the link and submit the 6-digit code to stop the fraud',
        description: 'You want to protect your savings immediately before the 15 minutes expire.',
        isSafe: false,
        feedback: 'Critical danger! Entering your 6-digit OTP gives the scammer the exact key they need to drain your funds or change your password.',
        safetyTip: 'Never share a one-time verification code with anyone or enter it on an email link.',
      },
    ],
    practicalTakeaway: 'Never enter a one-time code on a link from an email. If an alert sounds alarming, call the number printed on the back of your bank card.',
    confidenceFollowup: {
      question: 'What was the clearest red flag in this banking alert?',
      options: [
        {
          id: 'opt-otp',
          text: 'The request to enter my one-time verification code',
          habitInsight: 'One-time security codes are like the keys to your front door. No legitimate bank will ever ask you to hand them over to unfreeze an account.',
        },
        {
          id: 'opt-sender',
          text: 'The strange email domain (horizon-security-desk99.example)',
          habitInsight: 'Always expand the sender dropdown to inspect the real email address behind the friendly display name.',
        },
        {
          id: 'opt-time',
          text: 'The aggressive 15-minute countdown clock',
          habitInsight: 'Scammers use false urgency to override your natural caution. Taking a deep breath breaks their spell.',
        },
      ],
    },
  },
  {
    id: 'case-remote-job',
    caseNumber: 'CASE-102',
    title: 'The $45/hr Remote Chat Assistant',
    subtitle: 'Work-From-Home Scam & Advance Fee Fraud',
    channel: 'chat',
    difficulty: 'Intermediate',
    senderInfo: {
      name: 'Samantha (HR at TechPulse Global)',
      handleOrEmail: '@samantha_hr_careers_intl',
    },
    messageContent: {
      dateStr: 'Today, 10:05 AM',
      segments: [
        { text: 'Hello! I reviewed your profile and I am thrilled to offer you an immediate position as a Remote Data & Chat Coordinator at TechPulse Global!\n\n' },
        { text: 'Pay is $45.00/hour, flexible 15-20 hours a week, no interview or experience required. ', clueId: 'clue-job-too-good' },
        { text: 'You are hired on the spot!\n\n' },
        { text: 'Please contact our hiring manager on Telegram at @techpulse_hiring_now ', clueId: 'clue-job-offplatform' },
        { text: 'to receive your paperwork.\n\n' },
        { text: 'NOTE: To set up your home workstation, we will email you a check for $2,400. You must immediately Zelle $450 to our certified vendor for your encrypted laptop software pack.', clueId: 'clue-job-advance-fee' },
      ],
    },
    clues: [
      {
        id: 'clue-job-too-good',
        label: 'Unrealistic Pay Without Interview',
        category: 'too_good',
        textSnippet: 'Pay is $45.00/hour, flexible 15-20 hours a week, no interview or experience required',
        explanation:
          'High hourly pay for entry-level tasks without an interview, resume screening, or background check is an immediate red flag for fake job scams.',
        skillBadge: 'Offer Skeptic',
      },
      {
        id: 'clue-job-offplatform',
        label: 'Steering to Unmonitored Messaging Apps',
        category: 'sender',
        textSnippet: 'contact our hiring manager on Telegram at @techpulse_hiring_now',
        explanation:
          'Scammers steer victims away from reputable job boards and professional channels to encrypted or unmonitored chat apps like Telegram, Signal, or WhatsApp where accounts can be deleted easily.',
        skillBadge: 'Identity Verifier',
      },
      {
        id: 'clue-job-advance-fee',
        label: 'Fake Check & Upfront Equipment Fee',
        category: 'payment',
        textSnippet: 'we will email you a check for $2,400. You must immediately Zelle $450 to our certified vendor',
        explanation:
          'The classic "fake check" trick: the emailed check will initially show in your balance due to bank provisional credit rules, but will bounce a few days later. Any money you sent to the "vendor" is stolen from your personal funds.',
        skillBadge: 'Payment Pause',
      },
    ],
    actionOptions: [
      {
        id: 'act-safe-research-company',
        label: 'Research the company career page independently',
        description: 'Visit the real company website directly and look up their open roles or contact their HR department via their official domain.',
        isSafe: true,
        feedback: 'Smart sleuthing! Real companies post legitimate openings on their verified website domain and never hire people without an application or interview.',
        safetyTip: 'Legitimate employers provide equipment directly or reimburse expenses—they never ask you to wire money to third-party vendors.',
      },
      {
        id: 'act-safe-decline-report',
        label: 'Block the recruiter and report the conversation',
        description: 'End communication immediately and report the account to the platform.',
        isSafe: true,
        feedback: 'Spot on! Recognizing advance-fee job fraud saves you from bounced checks and stolen money.',
        safetyTip: 'No genuine employer asks job candidates to send funds via Zelle, Venmo, Wire, or gift cards.',
      },
      {
        id: 'act-unsafe-deposit-check',
        label: 'Deposit the check and send the $450 to secure the laptop',
        description: 'The check is for $2,400 so you think you will still have plenty of money left over.',
        isSafe: false,
        feedback: 'Trap sprung! The check is fraudulent and will bounce in 3 to 5 business days. You will be held responsible by your bank for the $450 you sent, plus overdraft fees.',
        safetyTip: 'Depositing an emailed picture of a check is not legal check deposit and guarantees you are dealing with a counterfeit.',
      },
    ],
    practicalTakeaway: 'Real employers never hire you without an interview, and they never ask you to buy equipment by sending funds back from a deposited check.',
    confidenceFollowup: {
      question: 'Which element revealed this job offer was fraudulent?',
      options: [
        {
          id: 'opt-check',
          text: 'The fake check and request to forward $450 back',
          habitInsight: 'Any job that requires you to receive money and forward part of it elsewhere is money laundering or advance-fee fraud.',
        },
        {
          id: 'opt-unrealistic',
          text: 'The $45/hr wage with zero interview or screening',
          habitInsight: 'If compensation seems disproportionate to the effort, scammers are relying on excitement to blind your skepticism.',
        },
        {
          id: 'opt-chat',
          text: 'Conducting formal hiring over Telegram chat',
          habitInsight: 'Legitimate corporate recruitment happens through company email addresses, verified job platforms, and formal video or in-person interviews.',
        },
      ],
    },
  },
  {
    id: 'case-marketplace-overpayment',
    caseNumber: 'CASE-103',
    title: 'The Courier Overpayment Scheme',
    subtitle: 'Marketplace Buyer Trap & Gift Card Demands',
    channel: 'marketplace',
    difficulty: 'Master',
    senderInfo: {
      name: 'Arthur P. (Buyer)',
      handleOrEmail: 'arthur_buyer_vintage82',
    },
    messageContent: {
      dateStr: '2 days ago',
      segments: [
        { text: 'Hi! I am very interested in buying your dining table listed for $300.\n\n' },
        { text: 'I am currently out of town on military duty, so I cannot meet in person. ', clueId: 'clue-market-excuse' },
        { text: 'A private courier service will come pick it up tomorrow.\n\n' },
        { text: 'I just transferred $550 via Western Express Pay ($300 for the table + $250 for the courier fee). ', clueId: 'clue-market-overpay' },
        { text: 'You will receive an email confirmation shortly.\n\n' },
        { text: 'Please go buy a $250 Apple or Steam gift card right now and send me the PIN code so the courier can be dispatched!', clueId: 'clue-market-giftcard' },
      ],
    },
    clues: [
      {
        id: 'clue-market-excuse',
        label: 'Inability to Meet or Inspect Item',
        category: 'sender',
        textSnippet: 'I am currently out of town on military duty, so I cannot meet in person',
        explanation:
          'Scammers frequently claim to be on remote military assignments, offshore oil rigs, or hospitalized to explain why they cannot inspect the item or pick it up in person.',
        skillBadge: 'Identity Verifier',
      },
      {
        id: 'clue-market-overpay',
        label: 'Unsolicited Overpayment & Third-Party Courier',
        category: 'payment',
        textSnippet: 'I just transferred $550 via Western Express Pay ($300 for the table + $250 for the courier fee)',
        explanation:
          'No genuine buyer pays $250 extra for shipping on a used furniture item and asks the seller to handle their courier logistics.',
        skillBadge: 'Payment Pause',
      },
      {
        id: 'clue-market-giftcard',
        label: 'Payment Demanded via Retail Gift Cards',
        category: 'payment',
        textSnippet: 'buy a $250 Apple or Steam gift card right now and send me the PIN code',
        explanation:
          'Gift cards are for gifts—NEVER for legitimate commercial courier services or refunds. Once you reveal the PIN code, the funds are instantly laundered and untraceable.',
        skillBadge: 'Payment Pause',
      },
    ],
    actionOptions: [
      {
        id: 'act-safe-cash-only',
        label: 'Decline and insist on in-person cash payment upon pickup',
        description: 'Tell the buyer you only accept cash or in-app payments upon physical inspection.',
        isSafe: true,
        feedback: 'Flawless strategy! Scammers will immediately vanish the moment you mention cash on collection in a public place.',
        safetyTip: 'For marketplace sales, prefer in-person handoffs in public places (like a police station parking lot) with cash or in-app payment.',
      },
      {
        id: 'act-safe-report-scam',
        label: 'Report buyer profile for overpayment fraud',
        description: 'Flag the conversation to the marketplace platform moderators and cease communication.',
        isSafe: true,
        feedback: 'Terrific! Reporting this buyer stops them from preying on other sellers selling items in your neighborhood.',
        safetyTip: 'Overpayment requests combined with third-party pickup agents are 100% scams.',
      },
      {
        id: 'act-unsafe-buy-card',
        label: 'Purchase the $250 gift card and send the code to keep the deal moving',
        description: 'The buyer promised they already sent $550 to cover it.',
        isSafe: false,
        feedback: 'Disaster! The buyer never sent any real money. The "payment confirmation email" was forged, and you just lost $250 of your own money on untraceable gift cards.',
        safetyTip: 'Gift cards are the currency of scammers. No legitimate business or courier takes gift card codes as payment.',
      },
    ],
    practicalTakeaway: 'Never accept overpayments, and never pay a third-party courier with gift cards. Stick to in-person cash transactions when selling locally.',
    confidenceFollowup: {
      question: 'Which clue made it crystal clear this was a scam?',
      options: [
        {
          id: 'opt-giftcard',
          text: 'The demand for Apple or Steam gift cards',
          habitInsight: 'Gift cards are non-refundable and untraceable. Anyone asking you to pay a debt, bill, or fee with retail gift cards is a scammer.',
        },
        {
          id: 'opt-overpay',
          text: 'The unexplained $250 overpayment',
          habitInsight: 'Overpayment scams rely on making you feel like you are holding someone else’s money. In reality, no money was ever sent.',
        },
        {
          id: 'opt-excuse',
          text: 'The elaborate excuse about being away',
          habitInsight: 'Stories about military deployments or urgent out-of-town trips are scripted to prevent direct contact.',
        },
      ],
    },
  },
  {
    id: 'case-family-emergency',
    caseNumber: 'CASE-104',
    title: 'The "Mom, My Phone Broke" Emergency',
    subtitle: 'Impersonation & Emotional Coercion',
    channel: 'sms',
    difficulty: 'Master',
    senderInfo: {
      name: 'Unknown Number',
      handleOrEmail: '+1 (555) 018-7721',
      displayPhone: '+1-555-018-7721',
    },
    messageContent: {
      dateStr: 'Today, 8:15 AM',
      segments: [
        { text: 'Hi Mom! My phone fell in the sink this morning and broke completely. ', clueId: 'clue-family-broken' },
        { text: 'I am using a friend’s temporary phone right now. You can save this number as my new one.\n\n' },
        { text: 'Please don’t call right now, the microphone is cracked and doesn’t work. ', clueId: 'clue-family-nocall' },
        { text: 'I am in a huge emergency though—my car was towed and I urgently need $350 for the impound lot before 9 AM or they will fine me extra.\n\n', clueId: 'clue-family-urgency' },
        { text: 'Can you please Zelle $350 to my friend’s account: quick-help-pay@fastfunds.example? Love you so much.', clueId: 'clue-family-stranger-pay' },
      ],
    },
    clues: [
      {
        id: 'clue-family-broken',
        label: 'Unsolicited New Number Claim',
        category: 'sender',
        textSnippet: 'My phone fell in the sink this morning and broke completely',
        explanation:
          'Scammers blast generic "Hi Mom" or "Hi Dad" messages hoping to land on parents who have children living away from home.',
        skillBadge: 'Identity Verifier',
      },
      {
        id: 'clue-family-nocall',
        label: 'Excuse to Prevent Voice Verification',
        category: 'sender',
        textSnippet: 'Please don’t call right now, the microphone is cracked and doesn’t work',
        explanation:
          'The scammer knows that if you call, their voice will give away the deception immediately. They invent microphone or speaker damage to force you to stay on text.',
        skillBadge: 'Pressure-Proof',
      },
      {
        id: 'clue-family-urgency',
        label: 'Emotional Panic & Sudden Crisis',
        category: 'urgency',
        textSnippet: 'urgently need $350 for the impound lot before 9 AM or they will fine me extra',
        explanation:
          'By leveraging parental love and an urgent financial crisis, scammers attempt to short-circuit logical skepticism.',
        skillBadge: 'Pressure-Proof',
      },
      {
        id: 'clue-family-stranger-pay',
        label: 'Payment to an Unfamiliar Third Party',
        category: 'payment',
        textSnippet: 'Zelle $350 to my friend’s account: quick-help-pay@fastfunds.example',
        explanation:
          'Instant peer-to-peer transfers to an unverified email or phone are irreversible once sent.',
        skillBadge: 'Payment Pause',
      },
    ],
    actionOptions: [
      {
        id: 'act-safe-call-real-number',
        label: 'Call your child on their actual known number or contact a mutual family member',
        description: 'Ring your child’s existing phone number or message their partner/roommate to verify.',
        isSafe: true,
        feedback: 'Heroic instincts! 99% of the time, your child answers their real phone laughing or confused, completely unaware someone is impersonating them.',
        safetyTip: 'Always establish an independent out-of-band communication channel (like a family secret safe word or calling their usual phone) before sending crisis money.',
      },
      {
        id: 'act-safe-ask-secret',
        label: 'Ask a personal question only your real child would know',
        description: 'Text back asking: "What was the name of our first rescue dog?" or similar private knowledge.',
        isSafe: true,
        feedback: 'Great verification technique! Scammers have no access to private childhood memories and will either dodge the question or stop replying.',
        safetyTip: 'A family "safe word" or shared memory question instantly neutralizes impersonation attempts.',
      },
      {
        id: 'act-unsafe-wire-now',
        label: 'Send the $350 immediately so your child does not get stranded',
        description: 'You are worried and want to make sure your child is safe.',
        isSafe: false,
        feedback: 'Heartbreaking trap! The sender is a stranger halfway across the world. Once Zelle funds are sent, they are gone forever.',
        safetyTip: 'Never send money to an unknown account based solely on an incoming text message.',
      },
    ],
    practicalTakeaway: 'If a "relative" texts from an unknown number demanding emergency funds, call their usual number or ask a private personal question only they could answer.',
    confidenceFollowup: {
      question: 'What made you doubt this message the most?',
      options: [
        {
          id: 'opt-nocall',
          text: 'The excuse not to answer phone calls',
          habitInsight: 'Any communication claiming an emergency while refusing to speak on the phone is virtually always an impersonation scam.',
        },
        {
          id: 'opt-stranger',
          text: 'Sending money to a random "friend\'s" email',
          habitInsight: 'Never route money to unfamiliar third-party handles without verbal confirmation.',
        },
        {
          id: 'opt-vague',
          text: 'The generic greeting ("Hi Mom") with no names used',
          habitInsight: 'Scammers send generic templates to thousands of phone numbers simultaneously, hoping someone will self-identify.',
        },
      ],
    },
  },
];

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CASES } from './src/data/cases.ts';
import { DetectiveCase } from './src/types/game.ts';
import { ADVENTURE_LEVELS } from './src/data/adventureLevels.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// In-Memory storage for extra generated cases
let casesDatabase: DetectiveCase[] = [...INITIAL_CASES];

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Scam Sleuth: The Message Detective',
    hasGeminiKey: Boolean(apiKey),
    caseCount: casesDatabase.length,
  });
});

// Get Cases
app.get('/api/cases', (req: Request, res: Response) => {
  res.json({
    success: true,
    cases: casesDatabase,
  });
});

// Get 3D Adventure Levels
app.get('/api/adventure-levels', (req: Request, res: Response) => {
  res.json({
    success: true,
    levels: ADVENTURE_LEVELS,
  });
});

// Generate Custom Case via Gemini 3.8 Flash
app.post('/api/ai/generate-case', async (req: Request, res: Response) => {
  try {
    const { topic = 'subscription renewal', channel = 'email' } = req.body;

    if (!aiClient) {
      // Deterministic fallback case when Gemini key is not configured
      const fallbackCase: DetectiveCase = {
        id: `case-gen-${Date.now()}`,
        caseNumber: `CASE-${Math.floor(200 + Math.random() * 800)}`,
        title: `The Fake ${topic} Warning`,
        subtitle: `${channel.toUpperCase()} Impersonation & Security Trap`,
        channel: channel,
        difficulty: 'Intermediate',
        senderInfo: {
          name: 'Global Stream Support',
          handleOrEmail: 'billing-alert@stream-service-verify42.example',
        },
        messageContent: {
          subject: 'Action Required: Your Membership is Expired',
          dateStr: 'Today, 11:20 AM',
          segments: [
            { text: 'Dear Subscriber,\n\nYour annual account renewal failed. ' },
            { text: 'Your streaming access and saved profile will be terminated in 6 hours ', clueId: 'clue-sub-urgency' },
            { text: 'unless you update your billing information.\n\nFrom: billing-alert@stream-service-verify42.example\n\n', clueId: 'clue-sub-sender' },
            { text: 'To update your card details, please visit: ' },
            { text: 'https://stream-global.renew-member-account.example/update', clueId: 'clue-sub-link' },
            { text: '\n\nThank you for choosing Global Stream.' },
          ],
        },
        clues: [
          {
            id: 'clue-sub-sender',
            label: 'Lookalike Sender Domain',
            category: 'sender',
            textSnippet: 'billing-alert@stream-service-verify42.example',
            explanation: 'The sender address does not come from the official streaming brand, but a third-party clone domain.',
            skillBadge: 'Identity Verifier',
          },
          {
            id: 'clue-sub-urgency',
            label: 'Artificial 6-Hour Termination Deadline',
            category: 'urgency',
            textSnippet: 'Your streaming access and saved profile will be terminated in 6 hours',
            explanation: 'Legitimate subscription services provide a multi-week grace period before closing accounts.',
            skillBadge: 'Pressure-Proof',
          },
          {
            id: 'clue-sub-link',
            label: 'Credential Harvester Link',
            category: 'link',
            textSnippet: 'https://stream-global.renew-member-account.example/update',
            explanation: 'The link leads to an unverified phishing site designed to steal credit card numbers.',
            skillBadge: 'Link Inspector',
          },
        ],
        actionOptions: [
          {
            id: 'act-safe-direct-login',
            label: 'Log into your account directly via the official app or bookmark',
            description: 'Navigate to the service independently and check your account billing status there.',
            isSafe: true,
            feedback: 'Spot on! Never update billing via email links. Always log in directly on the official app.',
            safetyTip: 'Official account settings will indicate if your payment actually failed.',
          },
          {
            id: 'act-safe-ignore',
            label: 'Mark as phishing spam and delete',
            description: 'Recognize the fake sender and delete without clicking.',
            isSafe: true,
            feedback: 'Great call! Deleting keeps your credentials safe.',
            safetyTip: 'Phishing emails should never be clicked or replied to.',
          },
          {
            id: 'act-unsafe-click-link',
            label: 'Click the link and submit your credit card so you do not lose your shows',
            description: 'You want to make sure your streaming service is not cancelled.',
            isSafe: false,
            feedback: 'Careful! Entering payment info gives your card directly to criminals.',
            safetyTip: 'Never enter credit card numbers on links received in unsolicited billing alert emails.',
          },
        ],
        practicalTakeaway: 'Always check subscription billing issues by opening the provider’s app or website directly—never by tapping email links.',
        confidenceFollowup: {
          question: 'What made you doubt this subscription warning?',
          options: [
            {
              id: 'opt-url',
              text: 'The suspicious link domain',
              habitInsight: 'Look at the root domain before clicking any link.',
            },
            {
              id: 'opt-timer',
              text: 'The sudden 6-hour account termination threat',
              habitInsight: 'Real streaming services do not delete accounts in six hours.',
            },
            {
              id: 'opt-from',
              text: 'The weird sender email address',
              habitInsight: 'Checking the true sender address immediately reveals impersonators.',
            },
          ],
        },
      };

      casesDatabase = [fallbackCase, ...casesDatabase];
      return res.json({ success: true, case: fallbackCase, isGeneratedByAI: false });
    }

    // Call Gemini 3.8 Flash to generate a safe educational scenario
    const prompt = `You are the lead game writer for "Scam Sleuth: The Message Detective", an educational cybersecurity game.
Create a realistic but 100% FICTIONAL scam message case for players to investigate.

THEME / TOPIC: "${topic}"
CHANNEL: "${channel}" (one of: sms, email, marketplace, chat)

SAFETY CONSTRAINTS (MANDATORY):
1. Must use fictional names and reserved example domains ONLY (e.g. *.example, example.com, example.org).
2. NEVER use real phone numbers (use fake formats like +1-555-019-XXXX).
3. NEVER include real scam links, credentials, or dangerous instructions.
4. The goal is to teach players practical defensive habits (pause, verify independently, never share codes).

Return ONLY valid JSON matching this schema:
{
  "title": "string (creative case title)",
  "subtitle": "string (subheading with scam type)",
  "channel": "${channel}",
  "difficulty": "Beginner" | "Intermediate" | "Master",
  "senderInfo": {
    "name": "string (fictional company or person)",
    "handleOrEmail": "string (suspicious lookalike address using .example)"
  },
  "messageContent": {
    "subject": "string or empty",
    "dateStr": "Today, 1:15 PM",
    "segments": [
      { "text": "safe opening text" },
      { "text": "suspicious text that contains a clue", "clueId": "clue-1" },
      { "text": "more text" },
      { "text": "second suspicious text that contains a clue", "clueId": "clue-2" }
    ]
  },
  "clues": [
    {
      "id": "clue-1",
      "label": "string (e.g. Artificial Urgency / Mismatched Sender / Fake Check)",
      "category": "urgency" | "sender" | "link" | "payment" | "code_request" | "too_good",
      "textSnippet": "exact matching text snippet from segment",
      "explanation": "educational explanation of why this is dangerous",
      "skillBadge": "Link Inspector" | "Pressure-Proof" | "Payment Pause" | "Code Guardian" | "Identity Verifier" | "Offer Skeptic"
    },
    {
      "id": "clue-2",
      "label": "string",
      "category": "urgency" | "sender" | "link" | "payment" | "code_request" | "too_good",
      "textSnippet": "exact matching text snippet from segment",
      "explanation": "educational explanation",
      "skillBadge": "Link Inspector" | "Pressure-Proof" | "Payment Pause" | "Code Guardian" | "Identity Verifier" | "Offer Skeptic"
    }
  ],
  "actionOptions": [
    {
      "id": "act-safe-1",
      "label": "Safe action description (e.g. check official app independently)",
      "description": "More context on why this is safe",
      "isSafe": true,
      "feedback": "Praise and clear explanation of safe habit",
      "safetyTip": "Short memorable rule to remember"
    },
    {
      "id": "act-unsafe-1",
      "label": "Risky action that falls for the trap",
      "description": "Why a player might tempt this",
      "isSafe": false,
      "feedback": "Gentle, non-shaming breakdown of what would go wrong",
      "safetyTip": "Rule to prevent this mistake"
    }
  ],
  "practicalTakeaway": "Single sentence practical habit to remember in daily life",
  "confidenceFollowup": {
    "question": "Which clue made you most suspicious?",
    "options": [
      { "id": "opt-1", "text": "First clue description", "habitInsight": "Practical takeaway about this clue" },
      { "id": "opt-2", "text": "Second clue description", "habitInsight": "Practical takeaway about this clue" }
    ]
  }
}`;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const newCase: DetectiveCase = {
        ...parsed,
        id: `case-ai-${Date.now()}`,
        caseNumber: `CASE-AI-${Math.floor(100 + Math.random() * 900)}`,
      };

      casesDatabase = [newCase, ...casesDatabase];
      return res.json({ success: true, case: newCase, isGeneratedByAI: true });
    } catch (genErr) {
      console.warn('Gemini generateContent temporary error, serving template fallback:', genErr);
      const fallbackCase: DetectiveCase = {
        id: `case-gen-${Date.now()}`,
        caseNumber: `CASE-${Math.floor(200 + Math.random() * 800)}`,
        title: `The Fake ${topic} Warning`,
        subtitle: `${channel.toUpperCase()} Impersonation & Security Trap`,
        channel: channel,
        difficulty: 'Intermediate',
        senderInfo: {
          name: 'Global Alert Desk',
          handleOrEmail: 'support-alert@verify-account-notice77.example',
        },
        messageContent: {
          subject: `Action Required: Your ${topic} notice`,
          dateStr: 'Today, 11:20 AM',
          segments: [
            { text: `Important notification regarding your ${topic}.\n\n` },
            { text: 'Urgent: Immediate action required within 3 hours or severe penalties will apply. ', clueId: 'clue-fb-urgency' },
            { text: 'From: support-alert@verify-account-notice77.example\n\n', clueId: 'clue-fb-sender' },
            { text: 'To review and resolve this matter immediately, navigate to: ' },
            { text: 'https://security-verify.official-case-portal88.example/login', clueId: 'clue-fb-link' },
          ],
        },
        clues: [
          {
            id: 'clue-fb-urgency',
            label: 'Artificial Emergency Deadline',
            category: 'urgency',
            textSnippet: 'Immediate action required within 3 hours or severe penalties will apply',
            explanation: 'Scammers invent arbitrary deadlines to force impulsive reactions.',
            skillBadge: 'Pressure-Proof',
          },
          {
            id: 'clue-fb-sender',
            label: 'Mismatched Lookalike Sender',
            category: 'sender',
            textSnippet: 'support-alert@verify-account-notice77.example',
            explanation: 'The sender is an unofficial third-party domain disguised to look legitimate.',
            skillBadge: 'Identity Verifier',
          },
          {
            id: 'clue-fb-link',
            label: 'Phishing Destination URL',
            category: 'link',
            textSnippet: 'https://security-verify.official-case-portal88.example/login',
            explanation: 'The URL leads to an unverified credential harvesting clone page.',
            skillBadge: 'Link Inspector',
          },
        ],
        actionOptions: [
          {
            id: 'act-fb-safe',
            label: 'Verify through the official organization app or website directly',
            description: 'Ignore all links in the message and look up the organization independently.',
            isSafe: true,
            feedback: 'Spot on! Never follow links sent in surprise notifications.',
            safetyTip: 'Always navigate to official portals independently.',
          },
          {
            id: 'act-fb-unsafe',
            label: 'Click the link and submit your information to clear the notice',
            description: 'You want to resolve the issue as quickly as possible.',
            isSafe: false,
            feedback: 'Trap sprung! Following the link gives your private data directly to scammers.',
            safetyTip: 'Never submit credentials on links sent via unexpected messages.',
          },
        ],
        practicalTakeaway: 'Always pause and verify unexpected alerts through independent channels you already trust.',
        confidenceFollowup: {
          question: 'What made you doubt this message?',
          options: [
            { id: 'opt-url', text: 'The suspicious link address', habitInsight: 'Inspect domain names before clicking.' },
            { id: 'opt-time', text: 'The 3-hour deadline threat', habitInsight: 'Artificial urgency is a red flag.' },
          ],
        },
      };

      casesDatabase = [fallbackCase, ...casesDatabase];
      return res.json({ success: true, case: fallbackCase, isGeneratedByAI: false });
    }
  } catch (err: any) {
    console.error('Error generating AI case:', err);
    res.status(500).json({ error: err.message || 'Failed to generate case' });
  }
});

// Detective's Message Analyzer Assistant (Inspector Watson)
app.post('/api/ai/inspect-message', async (req: Request, res: Response) => {
  try {
    const { messageText } = req.body;
    if (!messageText || typeof messageText !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    if (!aiClient) {
      // Deterministic inspection fallback
      const hasUrgency = /urgent|immediate|hours?|suspend|freeze|action required/i.test(messageText);
      const hasLink = /http|www|\.com|\.org|\.net|\.xyz|\.biz/i.test(messageText);
      const hasPayment = /fee|pay|gift card|zelle|crypto|deposit|\$|wire/i.test(messageText);
      const hasCode = /code|otp|verify|pin|password/i.test(messageText);

      return res.json({
        success: true,
        isLiveAI: false,
        analysis: {
          riskLevel: hasUrgency || hasPayment || hasCode ? 'HIGH' : 'MEDIUM',
          summary: 'Scam Sleuth heuristics flagged potential social engineering indicators.',
          detectedSignals: [
            hasUrgency ? 'Artificial urgency / countdown pressure detected' : null,
            hasLink ? 'Unverified link or web address present' : null,
            hasPayment ? 'Request for unexpected payment, deposit, or gift cards' : null,
            hasCode ? 'Potential one-time code or authentication request' : null,
          ].filter(Boolean),
          safeNextSteps: [
            'Do NOT click any links inside the message.',
            'Verify by contacting the organization through an app or phone number you find independently.',
            'Never share 2-factor codes or send money to unknown parties.',
          ],
          detectiveTip: 'Real organizations never mind when you hang up or pause to call them back through an official number.',
        },
      });
    }

    const prompt = `You are Chief Inspector Watson at Scam Sleuth, an educational cybersecurity detection desk.
Analyze this message for social engineering, phishing, smishing, or scam manipulation tactics.
NEVER ask the user for personal credentials. Provide respectful, educational, age-appropriate advice.

MESSAGE TO ANALYZE:
"""
${messageText.slice(0, 1000)}
"""

Respond in JSON conforming to:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "summary": "Short 1-2 sentence assessment of the message",
  "detectedSignals": ["array of specific red flag explanations found in the text"],
  "safeNextSteps": ["bullet points of safe actions the user should take"],
  "detectiveTip": "One memorable cybersecurity habit"
}`;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, isLiveAI: true, analysis: parsed });
    } catch (apiErr) {
      console.warn('Gemini temporary error, falling back to heuristic inspector:', apiErr);
      const hasUrgency = /urgent|immediate|hours?|suspend|freeze|action required/i.test(messageText);
      const hasLink = /http|www|\.com|\.org|\.net|\.xyz|\.biz|\.example/i.test(messageText);
      const hasPayment = /fee|pay|gift card|zelle|crypto|deposit|\$|wire/i.test(messageText);
      const hasCode = /code|otp|verify|pin|password/i.test(messageText);

      return res.json({
        success: true,
        isLiveAI: false,
        analysis: {
          riskLevel: hasUrgency || hasPayment || hasCode ? 'HIGH' : 'MEDIUM',
          summary: 'Scam Sleuth inspection engine identified key social engineering indicators.',
          detectedSignals: [
            hasUrgency ? 'High urgency or deadline countdown pressure detected' : null,
            hasLink ? 'External link or unverified URL detected' : null,
            hasPayment ? 'Demanding unexpected payment, deposit, or fee' : null,
            hasCode ? 'Attempting to extract one-time security codes or passwords' : null,
          ].filter(Boolean),
          safeNextSteps: [
            'Do NOT click links in unexpected incoming messages.',
            'Verify by contacting the organization through an app or phone number you find independently.',
            'Never share 2-factor codes or send money to unknown parties.',
          ],
          detectiveTip: 'Real organizations never mind when you pause to verify through a channel you already trust.',
        },
      });
    }
  } catch (err: any) {
    console.error('Inspector message analysis error:', err);
    res.status(500).json({ error: err.message || 'Inspection failed' });
  }
});

// Setup Vite Dev server or static files
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Scam Sleuth detective server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

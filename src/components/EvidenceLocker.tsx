import React from 'react';
import { PlayerProgress, BadgeType } from '../types/game.ts';
import {
  Award,
  Shield,
  Search,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Compass,
} from 'lucide-react';

interface EvidenceLockerProps {
  progress: PlayerProgress;
  onNavigateToCases: () => void;
}

interface BadgeDefinition {
  type: BadgeType;
  title: string;
  description: string;
  icon: string;
  criteria: string;
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    type: 'Link Inspector',
    title: 'Link Inspector',
    description: 'Expertise in dissecting spoofed root domains, tricky subdomains, and suspicious redirects.',
    icon: '🔍',
    criteria: 'Spot deceptive URLs in simulated package and bank alerts.',
  },
  {
    type: 'Pressure-Proof',
    title: 'Pressure-Proof',
    description: 'Immune to fake countdown clocks, artificial panic, and fabricated account suspension threats.',
    icon: '🛡️',
    criteria: 'Pause and resist urgent 15-minute or 2-hour ultimatums.',
  },
  {
    type: 'Payment Pause',
    title: 'Payment Pause',
    description: 'Refuses unexpected micro-fees, advance equipment deposits, and retail gift card demands.',
    icon: '⏸️',
    criteria: 'Halt requests for unverified payment processing or gift card refunds.',
  },
  {
    type: 'Code Guardian',
    title: 'Code Guardian',
    description: 'Protects two-factor authentication codes and one-time passcodes from being harvested.',
    icon: '🔑',
    criteria: 'Never submit 2FA or SMS verification codes on third-party links.',
  },
  {
    type: 'Identity Verifier',
    title: 'Identity Verifier',
    description: 'Always verifies sender email domains and contacts relatives through independent channels.',
    icon: '🕵️',
    criteria: 'Inspect sender dropdowns and establish out-of-band identity checks.',
  },
  {
    type: 'Offer Skeptic',
    title: 'Offer Skeptic',
    description: 'Recognizes that extravagant pay with zero screening or interviews is advance-fee bait.',
    icon: '⚖️',
    criteria: 'Identify unrealistic job compensation and off-platform messaging.',
  },
];

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({
  progress,
  onNavigateToCases,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10 text-[#F2F5FA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#39BDF7]/20">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F05A9D]" />
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#F2F5FA]">
              Detective Evidence Locker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#F2F5FA]/80 mt-1">
            Track your cyber defense badges, scam pattern mastery, and practical real-life instincts.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCases}
          className="self-start sm:self-auto px-4 py-2 bg-[#081426] hover:bg-[#0E223D] text-[#F2F5FA] text-xs font-semibold rounded-xl border border-[#39BDF7]/40 transition-colors cursor-pointer"
        >
          Back to Case Room
        </button>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[#F2F5FA]">
          Detective Mastery Badges ({progress.earnedBadges.length} / {BADGE_DEFINITIONS.length} Unlocked)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = progress.earnedBadges.includes(badge.type);

            return (
              <div
                key={badge.type}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-[#0B1A33] border-[#F05A9D]/50 shadow-sm'
                    : 'bg-[#081426]/80 border-[#39BDF7]/20 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{badge.icon}</span>
                    {isUnlocked ? (
                      <span className="text-[11px] font-mono text-[#F05A9D] bg-[#F05A9D]/15 border border-[#F05A9D]/40 px-2 py-0.5 rounded font-semibold">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[#F2F5FA]/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#F2F5FA] mb-1">
                    {badge.title}
                  </h3>

                  <p className="text-xs text-[#F2F5FA]/80 leading-relaxed mb-3">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#39BDF7]/20 text-[11px] font-mono text-[#F2F5FA]/60">
                  <strong className="text-[#39BDF7]">Unlock Path:</strong> {badge.criteria}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detective Handbook: 5 Universal Scam Rules */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1A33] border border-[#39BDF7]/25 space-y-4">
        <div className="flex items-center gap-2 text-[#39BDF7]">
          <Shield className="w-5 h-5 text-[#F05A9D]" />
          <h2 className="font-heading text-lg font-bold text-[#F2F5FA]">
            The Sleuth's Field Guide: 5 Universal Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#94A3B8] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#0B132B] border border-[#1E293B] space-y-1">
            <span className="font-bold text-white text-sm block">1. The 60-Second Pause</span>
            <p>
              Scammers manufacture synthetic emergency. Take a deep breath; no legitimate bank, tax agency, or hospital requires an immediate decision within minutes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B132B] border border-[#1E293B] space-y-1">
            <span className="font-bold text-white text-sm block">2. Flip the Card Over</span>
            <p>
              Never call numbers or click links sent in security alert texts. Flip your debit/credit card over and call the customer service number printed directly on the plastic.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B132B] border border-[#1E293B] space-y-1">
            <span className="font-bold text-white text-sm block">3. Read the Root Domain</span>
            <p>
              In URLs like <code>apex-parcel.track-fee89.com</code>, the actual website is <code>track-fee89.com</code>. Scammers prepend brand names to trick your eyes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B132B] border border-[#1E293B] space-y-1">
            <span className="font-bold text-white text-sm block">4. Gift Cards are Not Currency</span>
            <p>
              Anyone asking you to pay a fine, courier fee, or refund with Apple, Google, or Steam gift cards is 100% a scammer. No government or company accepts gift cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { DetectiveCase, ScamChannel } from '../types/game.ts';
import {
  Sparkles,
  Bot,
  Search,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface AiCaseLabProps {
  onCaseGenerated: (newCase: DetectiveCase) => void;
  onNavigateToCases: () => void;
}

export const AiCaseLab: React.FC<AiCaseLabProps> = ({
  onCaseGenerated,
  onNavigateToCases,
}) => {
  // Case Generator State
  const [topic, setTopic] = useState<string>('Tax Refund Overpayment');
  const [channel, setChannel] = useState<ScamChannel>('email');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Message Inspector State
  const [inspectText, setInspectText] = useState<string>(
    'ALERT: Your Netflix subscription failed! To avoid cancellation in 24 hours, click https://netflix-billing-renew88.example/login and update your card info immediately.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleGenerateCase = async () => {
    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch('/api/ai/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, channel }),
      });

      const data = await res.json();
      if (data.success && data.case) {
        onCaseGenerated(data.case);
      } else {
        throw new Error(data.error || 'Could not generate case');
      }
    } catch (err: any) {
      console.error('Case generation failed:', err);
      setGenError(err.message || 'Generation failed. Please try a different topic.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInspectMessage = async () => {
    if (!inspectText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/inspect-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: inspectText }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err: any) {
      console.error('Message inspection error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const presetTopics = [
    'Subscription Auto-Renewal Expiry',
    'IRS / Tax Authority Refund Smishing',
    'Free Crypto Token Airdrop Claim',
    'Tech Support Virus Lockout Pop-up',
    'Unclaimed Prize & Lottery Winner',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">
              Inspector's AI Lab
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Generate novel training cases on demand or inspect suspicious message patterns with our detective intelligence engine.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCases}
          className="self-start sm:self-auto px-4 py-2 bg-[#1C2541] hover:bg-[#233054] text-white text-xs font-semibold rounded-xl border border-[#3A506B]/50 transition-colors"
        >
          Return to Case Room
        </button>
      </div>

      {/* TOOL 1: AI Case Generator */}
      <div className="bg-[#131E3A] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 text-white">
          <Bot className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="font-heading text-lg font-bold">
            Generate a Custom Training Mission
          </h2>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Powered by Gemini 3.8 Flash. Generates safe, completely fictional scenarios complying with all safety guidelines (only <code>.example</code> domains, no real numbers, clear clue anatomy).
        </p>

        {/* Preset quick buttons */}
        <div>
          <span className="text-xs font-mono text-[#94A3B8] block mb-2">
            Select a Scenario Template or Type Below:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetTopics.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTopic(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  topic === p
                    ? 'bg-[#F59E0B] text-[#0B132B] font-bold shadow-xs'
                    : 'bg-[#1C2541] text-[#94A3B8] hover:text-white border border-[#3A506B]/40'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
              Custom Topic / Scam Motif:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Electricity Bill Disconnection Warning"
              className="w-full bg-[#0B132B] border border-[#3A506B]/60 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
              Target Communication Channel:
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as ScamChannel)}
              className="w-full bg-[#0B132B] border border-[#3A506B]/60 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="email">Email Phishing</option>
              <option value="sms">SMS Text (Smishing)</option>
              <option value="marketplace">Marketplace Buyer/Seller</option>
              <option value="chat">Chat / Direct Message</option>
            </select>
          </div>
        </div>

        {genError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{genError}</span>
          </div>
        )}

        <button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerateCase}
          className="min-h-[44px] px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.98] text-[#0B132B] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Weaving Fictional Case & Clues...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Case & Open Investigation Desk</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* TOOL 2: Inspector Watson Message Scanner */}
      <div className="bg-[#131E3A] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 text-white">
          <Terminal className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="font-heading text-lg font-bold">
            Chief Inspector Watson's Message Scanner
          </h2>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Test any simulated text, email snippet, or suspicious message to see an instant forensic breakdown of social engineering tactics and recommended safe habits.
        </p>

        <div>
          <textarea
            rows={4}
            value={inspectText}
            onChange={(e) => setInspectText(e.target.value)}
            placeholder="Paste text here to analyze for urgency, spoofed links, or code demands..."
            className="w-full bg-[#0B132B] border border-[#3A506B]/60 rounded-xl p-3.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-[#F59E0B]"
          />
        </div>

        <button
          type="button"
          disabled={isAnalyzing || !inspectText.trim()}
          onClick={handleInspectMessage}
          className="min-h-[42px] px-5 py-2.5 bg-[#1C2541] hover:bg-[#233054] text-white border border-[#3A506B]/50 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
              <span>Analyzing Manipulation Vectors...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-[#F59E0B]" />
              <span>Analyze Message Risk</span>
            </>
          )}
        </button>

        {analysisResult && (
          <div className="p-5 rounded-2xl bg-[#0B132B] border border-[#3A506B]/60 space-y-4 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <span className="font-heading font-bold text-white text-sm">
                Inspector Watson's Verdict:
              </span>
              <span
                className={`font-mono font-bold px-2.5 py-0.5 rounded text-xs ${
                  analysisResult.riskLevel === 'HIGH'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {analysisResult.riskLevel} RISK SUSPECTED
              </span>
            </div>

            <p className="text-white leading-relaxed">
              {analysisResult.summary}
            </p>

            {analysisResult.detectedSignals && analysisResult.detectedSignals.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-mono text-[#F59E0B] uppercase tracking-wider block">
                  Identified Red Flags:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#CBD5E1]">
                  {analysisResult.detectedSignals.map((sig: string, i: number) => (
                    <li key={i}>{sig}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.safeNextSteps && (
              <div className="space-y-1.5 pt-2 border-t border-[#1E293B]">
                <span className="font-mono text-[#10B981] uppercase tracking-wider block">
                  Recommended Safe Actions:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#94A3B8]">
                  {analysisResult.safeNextSteps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.detectiveTip && (
              <div className="p-3 rounded-xl bg-[#131E3A] border border-[#1E293B] text-amber-200 font-mono">
                💡 <strong>Habit:</strong> {analysisResult.detectiveTip}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

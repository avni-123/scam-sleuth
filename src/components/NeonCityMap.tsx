import React, { useState } from 'react';
import {
  DetectiveCase,
  PlayerProgress,
  CityDistrict,
} from '../types/game.ts';
import {
  NEON_DISTRICTS,
  DistrictInfo,
  enrichCaseWithNeonWorld,
  playAudioFx,
} from '../data/neonWorldData.ts';
import {
  Zap,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Sparkles,
  Package,
  Store,
  Briefcase,
  Gamepad2,
  Radio,
  SlidersHorizontal,
  Compass,
  AlertCircle,
  Award,
} from 'lucide-react';

interface NeonCityMapProps {
  cases: DetectiveCase[];
  progress: PlayerProgress;
  onSelectCase: (caseItem: DetectiveCase) => void;
  onQuickPlay: () => void;
  onSwitchToDeskView: () => void;
}

export const NeonCityMap: React.FC<NeonCityMapProps> = ({
  cases,
  progress,
  onSelectCase,
  onQuickPlay,
  onSwitchToDeskView,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<CityDistrict>('Delivery Dock');

  // Enrich cases with neon district and character data
  const enrichedCases = cases.map(enrichCaseWithNeonWorld);

  // Current active district
  const activeDistrict =
    NEON_DISTRICTS.find((d) => d.id === selectedDistrictId) || NEON_DISTRICTS[0];

  // Cases belonging to active district
  const districtCases = enrichedCases.filter((c) => c.district === activeDistrict.id);
  const activeCase = districtCases[0] || enrichedCases.find((c) => c.id === activeDistrict.defaultCaseId) || enrichedCases[0];

  const isCaseSolved = (caseId: string) => progress.solvedCaseIds.includes(caseId);

  const getDistrictIcon = (name: DistrictInfo['iconName'], className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Package':
        return <Package className={className} />;
      case 'Store':
        return <Store className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      default:
        return <MapPin className={className} />;
    }
  };

  const handleDistrictClick = (district: DistrictInfo) => {
    setSelectedDistrictId(district.id);
    playAudioFx('clue');
  };

  const handleEnterCase = (c: DetectiveCase) => {
    playAudioFx('clue');
    onSelectCase(c);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* City Hero & Quick Play HUD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1B38] via-[#131E3A] to-[#0A1128] border-2 border-[#1E293B] shadow-2xl p-6 sm:p-8">
        {/* Neon Cyber Glow Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>Cyber City Level Select</span>
              <span>·</span>
              <span className="text-[#94A3B8]">Neon Police Detective Network</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              Scam Sleuth: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#F59E0B] to-[#EC4899]">Neon Casefiles</span>
            </h1>

            <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              Every district hides a scam scenario. Select a neon sector on the city map to investigate phishing texts, fake job offers, and marketplace fraud.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8] pt-1">
              <span>{progress.solvedCaseIds.length} of {cases.length} Districts Cleared</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">{progress.xp} XP Accumulated</span>
            </div>
          </div>

          {/* Quick Play & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onQuickPlay}
              className="px-6 py-3.5 bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0284C7] hover:brightness-110 active:scale-[0.98] text-[#070D1E] font-heading font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              <span>⚡ QUICK PLAY DEMO</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onSwitchToDeskView}
              className="px-4 py-3.5 bg-[#1C2541] hover:bg-[#253358] text-[#E2E8F0] font-medium text-xs rounded-2xl border border-[#3A506B]/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#F59E0B]" />
              <span>Detective Desk List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & District Dossier Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Neon City Map Canvas Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>NEON CITY METROPOLITAN GRID</span>
            </span>
            <span>Tap any sector to view case dossier</span>
          </div>

          {/* Stylized Neon City Isometric Map Container */}
          <div className="relative aspect-[16/11] sm:aspect-[16/10] bg-[#070E22] rounded-3xl border-2 border-[#1E293B] overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col justify-between">
            {/* Background Grid Lines & Light Arcs */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15) 0%, transparent 70%), linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(to right, #1E293B 1px, transparent 1px)',
                backgroundSize: '100% 100%, 36px 36px, 36px 36px',
              }}
            />

            {/* Glowing Neon Cyber Highway Arcs (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 800 500"
              fill="none"
            >
              {/* Circuit highway arteries */}
              <path
                d="M120 400 L250 250 L420 250 L600 120 L720 180"
                stroke="#00F0FF"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M250 250 L320 420 L580 340 L650 180"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M420 250 L420 100 L600 120"
                stroke="#A855F7"
                strokeWidth="2"
              />
              {/* Rain shimmer / glow circles */}
              <circle cx="200" cy="180" r="80" fill="url(#cyanGlow)" />
              <circle cx="580" cy="320" r="90" fill="url(#amberGlow)" />
              <defs>
                <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Map District Hotspot Nodes */}
            <div className="relative w-full h-full">
              {NEON_DISTRICTS.map((district) => {
                const isSelected = district.id === selectedDistrictId;
                const districtCase = enrichedCases.find((c) => c.district === district.id);
                const solved = districtCase ? isCaseSolved(districtCase.id) : false;

                return (
                  <button
                    key={district.id}
                    type="button"
                    onClick={() => handleDistrictClick(district)}
                    style={{
                      left: `${district.coordinates.x}%`,
                      top: `${district.coordinates.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 cursor-pointer focus:outline-none z-20 ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    {/* Glowing Pulse Rings */}
                    <div
                      className={`absolute -inset-2 rounded-2xl blur-md transition-opacity duration-300 ${
                        isSelected ? 'opacity-80' : 'opacity-20 group-hover:opacity-50'
                      }`}
                      style={{ backgroundColor: district.accentColor }}
                    />

                    {/* District Node Box */}
                    <div
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all shadow-xl backdrop-blur-md ${
                        isSelected
                          ? 'bg-[#131E3A] border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                          : solved
                          ? 'bg-[#0F223D]/90 border-emerald-500/50'
                          : 'bg-[#0E172E]/90 border-[#3A506B]/60 hover:border-white/60'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: district.accentColor }}
                      >
                        {getDistrictIcon(district.iconName, 'w-3.5 h-3.5 text-[#070D1E]')}
                      </div>

                      <div className="text-left hidden sm:block pr-1">
                        <span className="font-heading text-xs font-bold text-white block leading-tight whitespace-nowrap">
                          {district.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#94A3B8] block leading-tight whitespace-nowrap">
                          {solved ? 'CLEARED ✓' : 'ACTIVE CASE'}
                        </span>
                      </div>

                      {solved && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#10B981]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Map Legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E293B]/80 text-[11px] font-mono text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Case Solved</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]" />
                  <span>Selected Sector</span>
                </span>
              </div>
              <span>Click a district node to view briefing</span>
            </div>
          </div>

          {/* Quick District Selector Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {NEON_DISTRICTS.map((d) => {
              const isSelected = d.id === selectedDistrictId;
              const dCase = enrichedCases.find((c) => c.district === d.id);
              const solved = dCase ? isCaseSolved(dCase.id) : false;

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistrictClick(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C2541] text-white border-2 border-[#00F0FF] shadow-xs'
                      : 'bg-[#101A36] text-[#94A3B8] hover:text-white border border-[#1E293B]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: d.accentColor }}
                  />
                  <span>{d.name}</span>
                  {solved && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected District Case Dossier HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
            <span>SECTOR DOSSIER BRIEFING</span>
            <span style={{ color: activeDistrict.accentColor }}>{activeDistrict.name.toUpperCase()}</span>
          </div>

          {/* Dossier Card Container */}
          <div
            className="rounded-3xl border-2 p-6 space-y-5 bg-[#101C38] relative overflow-hidden shadow-2xl transition-all"
            style={{ borderColor: activeDistrict.accentColor }}
          >
            {/* Top District Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-[#070D1E]"
                    style={{ backgroundColor: activeDistrict.accentColor }}
                  >
                    {activeDistrict.id}
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    {activeCase.caseNumber}
                  </span>
                </div>

                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                  {activeCase.title}
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  {activeCase.subtitle}
                </p>
              </div>

              {isCaseSolved(activeCase.id) ? (
                <div className="detective-stamp stamp-solved text-[10px] py-1 px-2 shrink-0">
                  SOLVED
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#1C2541] border border-[#3A506B]/50 flex items-center justify-center text-[#94A3B8] shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
              )}
            </div>

            {/* Landmark & District Atmospheric Description */}
            <div className="p-3.5 rounded-2xl bg-[#091126] border border-[#1E293B] space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#64748B] block">
                District Landmark: {activeDistrict.landmark}
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {activeDistrict.description}
              </p>
            </div>

            {/* Victim / Character Card */}
            {activeCase.character && (
              <div className="p-4 rounded-2xl bg-[#142347] border border-[#3A506B]/40 space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#070D1E] font-heading font-black text-sm shadow-md shrink-0"
                    style={{ backgroundColor: activeCase.character.avatarColor }}
                  >
                    {activeCase.character.initials}
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">
                      {activeCase.character.name}
                    </h4>
                    <span className="text-xs text-[#94A3B8] font-mono block">
                      {activeCase.character.role}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#CBD5E1] italic bg-[#0B132B]/60 p-2.5 rounded-xl border border-[#1E293B]">
                  &ldquo;{activeCase.character.reactionQuote}&rdquo;
                </p>
              </div>
            )}

            {/* Case Metrics & Rewards */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#0B132B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#64748B] uppercase block">Difficulty</span>
                <span className="font-bold text-white mt-0.5 block">
                  {activeCase.difficulty}
                </span>
              </div>
              <div className="p-3 bg-[#0B132B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#64748B] uppercase block">Reward</span>
                <span className="font-bold text-[#F59E0B] mt-0.5 block">
                  +100 XP & Badge
                </span>
              </div>
            </div>

            {/* Action Button: Enter Comic Scene */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleEnterCase(activeCase)}
                className="w-full min-h-[48px] px-6 py-3.5 bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0284C7] hover:brightness-110 active:scale-[0.98] text-[#070D1E] font-heading font-black text-sm rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>ENTER SCENE & INVESTIGATE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

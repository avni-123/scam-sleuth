import React, { useState } from 'react';
import {
  User,
  Users,
  Compass,
  Smartphone,
  Eye,
  X,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  Shield,
  Laptop,
  Maximize2,
  CheckCircle2,
  Palette,
  Camera,
} from 'lucide-react';

interface RealisticGameGraphicsDossierProps {
  onClose: () => void;
}

export const RealisticGameGraphicsDossier: React.FC<RealisticGameGraphicsDossierProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'protagonist' | 'supporting' | 'environments' | 'evidence'>('protagonist');
  const [selectedExpression, setSelectedExpression] = useState<'attentive' | 'concerned' | 'thinking' | 'relieved'>('attentive');
  const [selectedPose, setSelectedPose] = useState<'idle' | 'phone' | 'laptop' | 'walking' | 'discovery'>('phone');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'apartment' | 'campus' | 'cafe' | 'office'>('apartment');
  const [magnifierActive, setMagnifierActive] = useState<boolean>(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fade-in pointer-events-auto select-none">
      <div className="w-full max-w-6xl max-h-[92vh] bg-[#070D1E] border-2 border-white/15 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white">
        {/* Top Header Bar */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase tracking-widest">
                  PRODUCTION ASSET DOSSIER
                </span>
                <span className="text-[10px] font-mono bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
                  GROUNDED 3D REALISM
                </span>
              </div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white leading-tight">
                Scam Sleuth: Realistic Game Graphics & Art Direction
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Selector Strip */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#091124] border-b border-white/10 overflow-x-auto text-xs font-heading font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('protagonist')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'protagonist'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>01. Main Investigator Character</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supporting')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'supporting'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>02. Supporting Cast (5 Characters)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('environments')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'environments'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>03. 4 Explorable Locations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>04. Evidence & Fictional UI</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ===================================================================
              TAB 1: MAIN INVESTIGATOR CHARACTER (Protagonist Model & Expressions)
          =================================================================== */}
          {activeTab === 'protagonist' && (
            <div className="space-y-6 animate-fade-in">
              {/* Concept Overview Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#0C152B] border border-white/10 space-y-1">
                  <span className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider font-bold block">
                    Character Identity
                  </span>
                  <h3 className="font-heading font-black text-base text-white">The Cyber Investigator</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Relatable young adult digital safety researcher. Curious, observant, and calm. Expressive through posture and analytical gaze rather than exaggerated cartoon gestures.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0C152B] border border-white/10 space-y-1">
                  <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                    Wardrobe & Silhouette
                  </span>
                  <h3 className="font-heading font-black text-base text-white">Practical Contemporary Wear</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Charcoal durable utility overshirt, muted heather-grey crewneck knit, dark tailored chinos, neutral leather sneakers, minimal smartwatch, and compact crossbody tech sling.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0C152B] border border-white/10 space-y-1">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                    Art Consistency Rules
                  </span>
                  <h3 className="font-heading font-black text-base text-white">Photorealistic Fidelity</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Preserves identical facial proportions, natural hair textures, soft studio ambient rim light, and neutral color grading across all camera perspectives (1st-person & 3rd-person).
                  </p>
                </div>
              </div>

              {/* 3D Character Turnaround & Action Preview Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Interactive 3D Model Render Window */}
                <div className="lg:col-span-7 bg-[#050A16] border-2 border-white/15 rounded-3xl p-6 relative flex flex-col items-center justify-between min-h-[460px] shadow-2xl overflow-hidden">
                  {/* Subtle Studio Backdrop Lighting */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-[#070D1E] to-[#040812] pointer-events-none" />

                  {/* Character State Indicator */}
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 font-mono text-xs text-white/90">
                      View: 3/4 Perspective · Pose: {selectedPose.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      Mood: {selectedExpression.toUpperCase()}
                    </span>
                  </div>

                  {/* Character Anatomical Figure SVG Illustration (Realistic proportions, charcoal jacket, tech sling) */}
                  <div className="relative z-10 my-4 flex items-center justify-center">
                    <svg viewBox="0 0 320 460" className="w-64 sm:w-80 h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]">
                      {/* Ground Contact Shadow */}
                      <ellipse cx="160" cy="445" rx="90" ry="14" fill="rgba(0,0,0,0.6)" filter="blur(4px)" />

                      {/* Legs / Chinos */}
                      <path d="M135 240 L125 410 L145 415 L155 270 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                      <path d="M165 270 L175 415 L195 410 L185 240 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />

                      {/* Clean Neutral Sneakers */}
                      <path d="M115 410 C115 410, 120 428, 145 428 C155 428, 155 415, 145 415 Z" fill="#F1F5F9" />
                      <path d="M175 415 C165 415, 165 428, 175 428 C200 428, 205 410, 205 410 Z" fill="#F1F5F9" />
                      <line x1="120" y1="422" x2="148" y2="422" stroke="#CBD5E1" strokeWidth="2" />
                      <line x1="172" y1="422" x2="200" y2="422" stroke="#CBD5E1" strokeWidth="2" />

                      {/* Torso: Heather Crewneck base */}
                      <path d="M125 125 Q160 135 195 125 L195 245 Q160 252 125 245 Z" fill="#475569" />

                      {/* Charcoal Utility Overshirt / Jacket */}
                      <path d="M115 120 L135 250 L115 250 L100 135 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                      <path d="M205 120 L220 135 L205 250 L185 250 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

                      {/* Tech Sling Strap across chest */}
                      <path d="M115 120 L205 245 L195 252 L105 125 Z" fill="#090E17" opacity="0.95" />
                      <rect x="150" y="175" width="22" height="12" rx="3" fill="#64748B" />

                      {/* Left Arm & Posed Hand */}
                      {selectedPose === 'phone' ? (
                        <>
                          {/* Arm holding phone */}
                          <path d="M102 135 Q90 180 130 195 L145 185 Q115 170 118 135 Z" fill="#1E293B" />
                          <circle cx="148" cy="188" r="8" fill="#D4A373" />
                          {/* Smartphone with glowing display */}
                          <rect x="142" y="160" width="22" height="40" rx="4" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(-15 142 160)" />
                          <rect x="145" y="164" width="16" height="32" rx="2" fill="#00F0FF" opacity="0.85" transform="rotate(-15 142 160)" />
                        </>
                      ) : (
                        <path d="M102 135 Q85 190 98 250 L112 248 Q102 195 118 135 Z" fill="#1E293B" />
                      )}

                      {/* Right Arm */}
                      <path d="M218 135 Q235 190 222 250 L208 248 Q218 195 202 135 Z" fill="#1E293B" />
                      <circle cx="218" cy="254" r="7" fill="#D4A373" />

                      {/* Neck & Head */}
                      <path d="M150 115 L150 95 L170 95 L170 115 Z" fill="#D4A373" />

                      {/* Head Oval & Jaw */}
                      <ellipse cx="160" cy="75" rx="28" ry="34" fill="#D4A373" />

                      {/* Natural Hair - Dark contemporary crop with soft texture */}
                      <path d="M130 65 Q160 32 190 65 Q185 45 160 42 Q135 45 130 65 Z" fill="#1C1917" />
                      <path d="M130 65 Q128 90 134 95 Q136 75 140 68 Z" fill="#1C1917" />
                      <path d="M190 65 Q192 90 186 95 Q184 75 180 68 Z" fill="#1C1917" />

                      {/* Natural Facial Features tailored to selectedExpression */}
                      {/* Eyes & Brows */}
                      {selectedExpression === 'thinking' ? (
                        <>
                          <line x1="145" y1="68" x2="155" y2="67" stroke="#1C1917" strokeWidth="2.5" />
                          <line x1="165" y1="67" x2="175" y2="70" stroke="#1C1917" strokeWidth="2.5" />
                          <circle cx="150" cy="74" r="2.5" fill="#1C1917" />
                          <circle cx="170" cy="74" r="2.5" fill="#1C1917" />
                          <line x1="154" y1="92" x2="166" y2="90" stroke="#9A3412" strokeWidth="2" />
                        </>
                      ) : selectedExpression === 'concerned' ? (
                        <>
                          <line x1="145" y1="67" x2="155" y2="70" stroke="#1C1917" strokeWidth="2.5" />
                          <line x1="165" y1="70" x2="175" y2="67" stroke="#1C1917" strokeWidth="2.5" />
                          <circle cx="150" cy="74" r="3" fill="#1C1917" />
                          <circle cx="170" cy="74" r="3" fill="#1C1917" />
                          <ellipse cx="160" cy="93" rx="4" ry="3" fill="#9A3412" />
                        </>
                      ) : selectedExpression === 'relieved' ? (
                        <>
                          <line x1="145" y1="68" x2="155" y2="68" stroke="#1C1917" strokeWidth="2" />
                          <line x1="165" y1="68" x2="175" y2="68" stroke="#1C1917" strokeWidth="2" />
                          <circle cx="150" cy="73" r="2.5" fill="#1C1917" />
                          <circle cx="170" cy="73" r="2.5" fill="#1C1917" />
                          <path d="M152 90 Q160 96 168 90" stroke="#9A3412" strokeWidth="2" fill="none" />
                        </>
                      ) : (
                        <>
                          {/* Attentive / Focused */}
                          <line x1="145" y1="69" x2="155" y2="69" stroke="#1C1917" strokeWidth="2.5" />
                          <line x1="165" y1="69" x2="175" y2="69" stroke="#1C1917" strokeWidth="2.5" />
                          <circle cx="150" cy="74" r="2.8" fill="#1C1917" />
                          <circle cx="170" cy="74" r="2.8" fill="#1C1917" />
                          <line x1="154" y1="92" x2="166" y2="92" stroke="#9A3412" strokeWidth="2" />
                        </>
                      )}

                      {/* Nose */}
                      <path d="M160 76 L158 83 L163 83" stroke="#B45309" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>

                  {/* Character Model Scale & Stats Strip */}
                  <div className="relative z-10 w-full pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>Height: 178 cm · Proportions: 1:7.5 Natural Anatomical</span>
                    <span className="text-emerald-400">PBR Materials · Rigged for 3rd/1st Person</span>
                  </div>
                </div>

                {/* Right: Facial Expressions & Action Pose Selectors */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Expression Selector */}
                  <div className="p-4 rounded-2xl bg-[#0B152B] border border-white/10 space-y-3">
                    <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Facial Expression Matrix (Natural Emotions)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'attentive', label: 'Attentive', desc: 'Calm, focused, scanning digital clues' },
                        { id: 'concerned', label: 'Concerned', desc: 'Spotting suspicious urgency or panic flags' },
                        { id: 'thinking', label: 'Analytical', desc: 'Cross-referencing headers and domains' },
                        { id: 'relieved', label: 'Relieved', desc: 'Safe resolution confirmed, crisis averted' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedExpression(item.id as any)}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                            selectedExpression === item.id
                              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <span className="font-heading font-black block text-xs">{item.label}</span>
                          <span className="text-[10px] leading-tight block text-[#CBD5E1] mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gameplay Action Poses */}
                  <div className="p-4 rounded-2xl bg-[#0B152B] border border-white/10 space-y-3">
                    <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block">
                      Gameplay Investigation Poses
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'phone', label: 'Inspecting Phone', desc: 'One hand raised with AMOLED scanner' },
                        { id: 'laptop', label: 'Examining Laptop', desc: 'Leaning over desk, verifying portal' },
                        { id: 'walking', label: 'Walking Field Move', desc: 'Smooth, grounded locomotion gait' },
                        { id: 'discovery', label: 'Discovery Reveal', desc: 'Focusing on mismatched link flag' },
                      ].map((pose) => (
                        <button
                          key={pose.id}
                          type="button"
                          onClick={() => setSelectedPose(pose.id as any)}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                            selectedPose === pose.id
                              ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <span className="font-heading font-black block text-xs">{pose.label}</span>
                          <span className="text-[10px] leading-tight block text-[#CBD5E1] mt-0.5">{pose.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Character Model Lighting & Material Specs */}
                  <div className="p-4 rounded-2xl bg-[#081022] border border-white/10 text-xs space-y-2">
                    <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider block font-bold">
                      Material Calibration
                    </span>
                    <div className="space-y-1.5 text-[11px] font-mono text-[#CBD5E1]">
                      <div className="flex justify-between">
                        <span>Skin Shading:</span>
                        <span className="text-white">Subsurface scattering, diffuse satin</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jacket Fabric:</span>
                        <span className="text-white">Heavy cotton twill, rough 0.85, metal 0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color Grading:</span>
                        <span className="text-white">Cinematic ACES filmic, warm ambient key</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 2: SUPPORTING CAST (The 5 Everyday People)
          =================================================================== */}
          {activeTab === 'supporting' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-black text-lg text-white">The Five Key Supporting Characters</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Realistic everyday people the player meets across each case. Distinct silhouettes, relatable clothing, and authentic emotional reactions.
                  </p>
                </div>
                <span className="font-mono text-xs text-amber-400 font-bold self-start sm:self-auto">
                  Safe Scenarios · Scammers Off-Screen
                </span>
              </div>

              {/* Character Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Alex Rivera',
                    role: 'Delivery Recipient / Roommate',
                    age: '24 years old',
                    setting: 'Sunset Heights Apartment 4B',
                    clothing: 'Casual cobalt blue knit sweater, dark denim, slip-on shoes',
                    personality: 'Creative freelance illustrator, eager for art package, momentarily stressed by phantom customs fee.',
                    expression: 'Puzzled, holding phone toward detective asking for guidance.',
                    avatarColor: '#2563EB',
                    badge: 'Level 01',
                  },
                  {
                    name: 'Maya Lin',
                    role: 'University Student',
                    age: '20 years old',
                    setting: 'North Quad Study Commons',
                    clothing: 'Olive green hoodie, canvas backpack, wireframe glasses',
                    personality: 'Midterms student rushing between classes, alarmed by 24-hour campus account suspension threat.',
                    expression: 'Anxious, staring at laptop login screen before entering credentials.',
                    avatarColor: '#059669',
                    badge: 'Level 02',
                  },
                  {
                    name: 'Marcus Vance',
                    role: 'Marketplace Seller',
                    age: '32 years old',
                    setting: 'Little Seoul Urban Bistro & Café',
                    clothing: 'Caramel workwear jacket, dark henley, worn leather boots',
                    personality: 'Selling vintage camera equipment, received fake peer-to-peer payment screenshot claiming funds are in escrow.',
                    expression: 'Suspicious and hesitating to hand over goods before seeing real bank balance.',
                    avatarColor: '#D97706',
                    badge: 'Level 03',
                  },
                  {
                    name: 'Elena Rostova',
                    role: 'Job Seeker / Candidate',
                    age: '27 years old',
                    setting: 'Apex Tower Career Suite',
                    clothing: 'Navy tailored blazer, grey turtleneck, portfolio folder',
                    personality: 'Remote career applicant who received an offer with an advance check for office equipment.',
                    expression: 'Hopeful yet alert, scrutinizing check deposit terms.',
                    avatarColor: '#7C3AED',
                    badge: 'Level 04',
                  },
                  {
                    name: 'David Chen',
                    role: 'IT Security Liaison & Coworker',
                    age: '38 years old',
                    setting: 'Cybersecurity Operations Hub',
                    clothing: 'Charcoal polo shirt, company badge lanyard, smart tablet',
                    personality: 'Experienced internal security coordinator, assists with rapid incident logging and protocol verification.',
                    expression: 'Supportive, reassuring, and procedurally thorough.',
                    avatarColor: '#0891B2',
                    badge: 'Incident Support',
                  },
                ].map((npc, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-[#091329] border border-white/10 space-y-4 hover:border-amber-400/50 transition-all shadow-lg flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider font-bold">
                          {npc.badge} · {npc.age}
                        </span>
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-md"
                          style={{ backgroundColor: npc.avatarColor }}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-black text-lg text-white shadow-md border border-white/20"
                          style={{ backgroundColor: npc.avatarColor }}
                        >
                          {npc.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-heading font-black text-base text-white leading-tight">
                            {npc.name}
                          </h4>
                          <span className="text-xs text-[#94A3B8] font-medium block">
                            {npc.role}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs space-y-2 text-[#CBD5E1] pt-1">
                        <p><strong className="text-white">Wardrobe:</strong> {npc.clothing}</p>
                        <p><strong className="text-white">Context:</strong> {npc.personality}</p>
                        <p><strong className="text-amber-300">Key Expression:</strong> {npc.expression}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                      <span>Location:</span>
                      <span className="text-white font-semibold truncate max-w-[170px]">{npc.setting}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 3: GAME ENVIRONMENTS (The 4 Explorable Locations)
          =================================================================== */}
          {activeTab === 'environments' && (
            <div className="space-y-6 animate-fade-in">
              {/* Location Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'apartment', label: '1. Modest Apartment', sub: 'Sunset Heights 4B' },
                  { id: 'campus', label: '2. University Study Commons', sub: 'North Quad Library' },
                  { id: 'cafe', label: '3. Urban Bistro & Café', sub: 'Little Seoul Pacific' },
                  { id: 'office', label: '4. Small Office Suite', sub: 'Apex Career Towers' },
                ].map((env) => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => setSelectedEnvironment(env.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedEnvironment === env.id
                        ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : 'bg-[#091329] border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="font-heading font-black text-xs block">{env.label}</span>
                    <span className={`text-[10px] font-mono block mt-0.5 ${selectedEnvironment === env.id ? 'text-black/80 font-bold' : 'text-[#94A3B8]'}`}>
                      {env.sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Environment Detailed Architectural View */}
              {selectedEnvironment === 'apartment' && (
                <div className="p-6 rounded-3xl bg-[#081022] border-2 border-white/15 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="font-mono text-xs text-[#00F0FF] font-bold uppercase tracking-widest block">
                        LOCATION 01 · CASE: THE DELIVERY TEXT
                      </span>
                      <h3 className="font-heading font-black text-xl text-white">
                        Sunset Heights Apartment 4B (Modest Living Room)
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold">
                      Golden Hour Interior Lighting
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-[#CBD5E1]">
                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Architectural Space & Clutter</h4>
                      <p className="leading-relaxed">
                        A lived-in contemporary apartment featuring light European walnut flooring, off-white drywall, and a panoramic picture window looking out toward the Los Santos skyline.
                      </p>
                      <ul className="space-y-1.5 font-mono text-[11px] list-disc list-inside text-[#94A3B8]">
                        <li><strong className="text-white">Desk Area:</strong> Wooden workstation with art pencils, sketchpads, and Alex’s buzzing smartphone.</li>
                        <li><strong className="text-white">Seating:</strong> Slate-grey fabric sofa, brass floor lamp with warm 2700K diffusion.</li>
                        <li><strong className="text-white">Entryway:</strong> Solid four-panel apartment door with brass mail drop slot holding courier card.</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Cinematic Lighting & Color Palette</h4>
                      <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center">
                        <div className="p-2 rounded-xl bg-[#1E293B] border border-white/20 text-white font-bold">Charcoal #1E293B</div>
                        <div className="p-2 rounded-xl bg-[#4A2F1B] border border-white/20 text-amber-200 font-bold">Walnut #4A2F1B</div>
                        <div className="p-2 rounded-xl bg-[#F59E0B] text-black font-black">Sunset #F59E0B</div>
                        <div className="p-2 rounded-xl bg-[#00F0FF] text-black font-black">Scanner #00F0FF</div>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                        Low-angle golden sunlight streams through sheer curtains, casting soft directional shadows across the rug and highlighting dust motes in the air.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedEnvironment === 'campus' && (
                <div className="p-6 rounded-3xl bg-[#081022] border-2 border-white/15 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="font-mono text-xs text-[#00F0FF] font-bold uppercase tracking-widest block">
                        LOCATION 02 · CASE: CAMPUS ACCOUNT ALERT
                      </span>
                      <h3 className="font-heading font-black text-xl text-white">
                        North Quad University Study Commons
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-xs font-bold">
                      Diffused Daylight Atrium
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-[#CBD5E1]">
                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Academic Commons Layout</h4>
                      <p className="leading-relaxed">
                        A modern university study commons with polished light concrete floors, acoustic timber wall slats, open communal study tables, and high glass atrium ceilings.
                      </p>
                      <ul className="space-y-1.5 font-mono text-[11px] list-disc list-inside text-[#94A3B8]">
                        <li><strong className="text-white">Study Table:</strong> Open laptop displaying the fake student portal suspension alert.</li>
                        <li><strong className="text-white">Campus Notice Board:</strong> Cork board with legitimate IT helpdesk pamphlets and security advisories.</li>
                        <li><strong className="text-white">Background:</strong> Distant book stacks, study carrels, and student backpacks.</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Material & Light Calibration</h4>
                      <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center">
                        <div className="p-2 rounded-xl bg-[#64748B] border border-white/20 text-white font-bold">Concrete #64748B</div>
                        <div className="p-2 rounded-xl bg-[#854D0E] border border-white/20 text-amber-200 font-bold">Timber #854D0E</div>
                        <div className="p-2 rounded-xl bg-[#0284C7] text-white font-black">Daylight #0284C7</div>
                        <div className="p-2 rounded-xl bg-[#10B981] text-black font-black">Portal #10B981</div>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                        Crisp, cool 5500K daylight through north-facing skylights, balanced by subtle warm downlights over individual study booths.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedEnvironment === 'cafe' && (
                <div className="p-6 rounded-3xl bg-[#081022] border-2 border-white/15 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="font-mono text-xs text-[#00F0FF] font-bold uppercase tracking-widest block">
                        LOCATION 03 · CASE: MARKETPLACE ESCROW TRAP
                      </span>
                      <h3 className="font-heading font-black text-xl text-white">
                        Little Seoul Urban Bistro & Café
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold">
                      Warm Hospitality Mood
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-[#CBD5E1]">
                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Bistro Environment</h4>
                      <p className="leading-relaxed">
                        A cozy urban café featuring exposed red brick, dark espresso-stained wood counters, vintage Edison bulb fixtures, and leather seating booths.
                      </p>
                      <ul className="space-y-1.5 font-mono text-[11px] list-disc list-inside text-[#94A3B8]">
                        <li><strong className="text-white">Counter Table:</strong> Marcus Vance seated with camera equipment box and phone on the table.</li>
                        <li><strong className="text-white">Receipt & POS:</strong> Official café payment terminal and authentic paper slip dispenser.</li>
                        <li><strong className="text-white">Sidewalk View:</strong> Large storefront glass looking out at the lively pedestrian avenue.</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Color & Contrast Rig</h4>
                      <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center">
                        <div className="p-2 rounded-xl bg-[#7C2D12] text-white font-bold">Brick #7C2D12</div>
                        <div className="p-2 rounded-xl bg-[#1C1917] text-white font-bold">Espresso #1C1917</div>
                        <div className="p-2 rounded-xl bg-[#F59E0B] text-black font-black">Edison #F59E0B</div>
                        <div className="p-2 rounded-xl bg-[#38BDF8] text-black font-black">Bank App #38BDF8</div>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                        Rich, warm ambient glows with deep shadows, keeping dialogue and inspected phone screens crisp and readable without glare.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedEnvironment === 'office' && (
                <div className="p-6 rounded-3xl bg-[#081022] border-2 border-white/15 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="font-mono text-xs text-[#00F0FF] font-bold uppercase tracking-widest block">
                        LOCATION 04 · CASE: REMOTE JOB CHECK SCAM
                      </span>
                      <h3 className="font-heading font-black text-xl text-white">
                        Apex Tower Career Suite & Small Office
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold">
                      Corporate Contemporary
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-[#CBD5E1]">
                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Office Setting Features</h4>
                      <p className="leading-relaxed">
                        A clean glass-walled office with frosted privacy decals, modular birch desks, ergonomic task chairs, and a small interview lounge.
                      </p>
                      <ul className="space-y-1.5 font-mono text-[11px] list-disc list-inside text-[#94A3B8]">
                        <li><strong className="text-white">Interview Desk:</strong> Elena’s portfolio, offer letter document, and check photo envelope.</li>
                        <li><strong className="text-white">Whiteboard:</strong> Official company organization chart and verify-by-phone advisory.</li>
                        <li><strong className="text-white">Office Window:</strong> High-floor city vista overlooking the commercial financial district.</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">Palette & Material Calibration</h4>
                      <div className="grid grid-cols-4 gap-2 font-mono text-[10px] text-center">
                        <div className="p-2 rounded-xl bg-[#334155] text-white font-bold">Steel #334155</div>
                        <div className="p-2 rounded-xl bg-[#E2E8F0] text-black font-bold">Glass #E2E8F0</div>
                        <div className="p-2 rounded-xl bg-[#6366F1] text-white font-black">Indigo #6366F1</div>
                        <div className="p-2 rounded-xl bg-[#EF4444] text-white font-black">Overpay Flag</div>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                        High-contrast, professional neutral lighting that allows subtle physical document watermarks and domain errors to be spotted clearly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              TAB 4: CYBER EVIDENCE & FICTIONAL INTERFACE SCREENS
          =================================================================== */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-black text-lg text-white">Realistic Cyber Evidence & Device Simulation</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Fictional safe screens (e.g. `example.test`), realistic UI typography, and subtle visual scam discovery highlights.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMagnifierActive(!magnifierActive)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    magnifierActive
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{magnifierActive ? 'Inspection Magnifier: ON' : 'Inspection Magnifier: OFF'}</span>
                </button>
              </div>

              {/* Evidence Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Evidence Item 1: Delivery SMS Phone Screen */}
                <div className="p-5 rounded-3xl bg-[#0A1224] border-2 border-white/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#00F0FF] font-bold">
                      DEVICE 01: MOBILE SMS (CASE 1)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      Safe Simulated Link
                    </span>
                  </div>

                  {/* Simulated Realistic Phone Frame */}
                  <div className="max-w-[280px] mx-auto rounded-3xl bg-[#02050B] border-4 border-slate-700 p-3 shadow-2xl space-y-3 font-sans">
                    {/* Status bar */}
                    <div className="flex items-center justify-between text-[10px] text-white/80 px-2">
                      <span>14:14</span>
                      <div className="w-16 h-3.5 bg-black rounded-full" />
                      <span>5G 94%</span>
                    </div>

                    {/* Sender Header */}
                    <div className="text-center pb-2 border-b border-white/10">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs mx-auto flex items-center justify-center mb-1">
                        GP
                      </div>
                      <span className="text-xs text-white font-bold block">+1 (555) 019-3382</span>
                      <span className="text-[9px] text-[#94A3B8]">Unknown Carrier</span>
                    </div>

                    {/* Incoming SMS Bubble */}
                    <div className="p-3 rounded-2xl bg-[#1E293B] text-xs text-white space-y-2 relative">
                      <p className="leading-snug">
                        GLOBAL-POST: Parcel #GP-8831 is <strong className="text-amber-400">ON HOLD</strong> due to unpaid address correction fee ($2.85).
                      </p>

                      {/* Interactive Magnifier Callout Highlight */}
                      <div className={`p-2 rounded-xl transition-all ${magnifierActive ? 'bg-amber-500/20 border border-amber-400 text-amber-200' : 'bg-black/30'}`}>
                        <span className="text-[10px] font-mono text-[#00F0FF] block">
                          URL: http://globalpost-fee-pay.xyz/track
                        </span>
                        {magnifierActive && (
                          <span className="text-[9px] text-amber-400 font-bold block mt-1">
                            ★ Warning: Artificial urgency & unverified .xyz domain
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#94A3B8] text-center font-medium">
                    High contrast, legible text with subtle visual cueing when inspected.
                  </p>
                </div>

                {/* Evidence Item 2: University Laptop Browser Screen */}
                <div className="p-5 rounded-3xl bg-[#0A1224] border-2 border-white/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#38BDF8] font-bold">
                      DEVICE 02: LAPTOP PORTAL (CASE 2)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      Safe Sandbox Host
                    </span>
                  </div>

                  {/* Simulated Realistic Laptop Browser Frame */}
                  <div className="rounded-2xl bg-[#0F172A] border-2 border-slate-700 overflow-hidden shadow-2xl font-sans text-xs">
                    {/* Browser Tab Strip */}
                    <div className="px-3 py-2 bg-[#1E293B] flex items-center gap-2 border-b border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="px-3 py-1 rounded-md bg-[#0F172A] text-[10px] text-[#94A3B8] font-mono flex items-center gap-1">
                        <span>https://univ-security-portal.login-auth.example.test</span>
                      </div>
                    </div>

                    {/* Portal Page Body */}
                    <div className="p-4 space-y-3 bg-[#0B1329]">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <Shield className="w-4 h-4" />
                        <span>CAMPUS IDENTITY VERIFICATION REQUIRED</span>
                      </div>
                      <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                        Your university single-sign-on credentials expire in 24 hours due to server migration. Re-authenticate below to preserve course files.
                      </p>

                      {/* Highlighted Mismatched Domain */}
                      <div className={`p-2.5 rounded-xl transition-all ${magnifierActive ? 'bg-amber-500/20 border border-amber-400' : 'bg-white/5'}`}>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                          <span>Real domain: university.edu</span>
                          <span className="text-amber-400 font-bold">Mismatch: login-auth.example.test</span>
                        </div>
                      </div>

                      {/* Mock credentials fields */}
                      <div className="space-y-1.5 opacity-60">
                        <div className="h-6 rounded bg-slate-800 text-[10px] px-2 flex items-center text-slate-400 font-mono">
                          student_id@university.edu
                        </div>
                        <div className="h-6 rounded bg-slate-800 text-[10px] px-2 flex items-center text-slate-400 font-mono">
                          ••••••••••••••
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#94A3B8] text-center font-medium">
                    Clean, non-distracting layout leaving full space for player critical thinking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <footer className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cohesive 3D Narrative Art Direction · Neutral Palette · No Real Links or PII</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Return to Investigation
          </button>
        </footer>
      </div>
    </div>
  );
};

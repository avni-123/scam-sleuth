import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createHumanCharacter,
  HumanCharacterInstance,
  CharacterArchetypeId,
  CHARACTER_ARCHETYPE_CATALOG,
} from '../3d/HumanCharacterBuilder';
import {
  User,
  Users,
  Compass,
  Smartphone,
  X,
  Search,
  Shield,
  CheckCircle2,
  Camera,
} from 'lucide-react';

export type DossierAnimationPose =
  | 'phone'
  | 'idle'
  | 'walking'
  | 'turning'
  | 'listening'
  | 'speaking';

export type DossierViewAngle = 'front' | 'threeQuarter' | 'handCloseUp';

interface Character3DPreviewStageProps {
  archetype: CharacterArchetypeId;
  selectedPose: DossierAnimationPose;
  selectedExpression: 'attentive' | 'concerned' | 'thinking' | 'relieved';
  isInvestigator?: boolean;
  viewAngle?: DossierViewAngle;
}

const Character3DPreviewStage: React.FC<Character3DPreviewStageProps> = ({
  archetype,
  selectedPose,
  selectedExpression,
  isInvestigator = false,
  viewAngle = 'front',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef(selectedPose);
  const exprRef = useRef(selectedExpression);
  const viewAngleRef = useRef(viewAngle);
  const yawOffsetRef = useRef(viewAngle === 'threeQuarter' ? -0.34 : 0);
  const isDraggingRef = useRef(false);
  const userHasDraggedRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    poseRef.current = selectedPose;
  }, [selectedPose]);

  useEffect(() => {
    exprRef.current = selectedExpression;
  }, [selectedExpression]);

  useEffect(() => {
    viewAngleRef.current = viewAngle;
    userHasDraggedRef.current = false;
    yawOffsetRef.current = viewAngle === 'threeQuarter' ? -0.34 : 0;
  }, [viewAngle]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 20);
    const initialIsCloseUp = viewAngleRef.current === 'handCloseUp';
    camera.position.set(
      initialIsCloseUp ? -0.222 : 0,
      initialIsCloseUp ? 0.89 : 1.28,
      initialIsCloseUp ? 0.46 : 2.7
    );
    const currentCamLook = new THREE.Vector3(
      initialIsCloseUp ? -0.222 : 0,
      initialIsCloseUp ? 0.89 : 1.18,
      initialIsCloseUp ? 0.04 : 0
    );
    camera.lookAt(currentCamLook);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.18);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.9);
    keyLight.position.set(1.8, 3.2, 2.4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.88);
    rimLight.position.set(-2.2, 2.1, -1.8);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf59e0b, 0.58, 5);
    fillLight.position.set(-1.3, 1.2, 1.6);
    scene.add(fillLight);

    const floorGeo = new THREE.CircleGeometry(0.75, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b1324,
      roughness: 0.85,
      metalness: 0.15,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const ringGeo = new THREE.RingGeometry(0.68, 0.72, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.003;
    scene.add(ringMesh);

    const profile = CHARACTER_ARCHETYPE_CATALOG[archetype] || CHARACTER_ARCHETYPE_CATALOG.investigator;
    const characterRig: HumanCharacterInstance = createHumanCharacter({
      id: `dossier_${archetype}`,
      name: profile.displayName,
      role: profile.roleTitle,
      archetype,
      isNpc: !isInvestigator,
    });
    scene.add(characterRig.group);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const pose = poseRef.current;
      const expr = exprRef.current;

      const isWalking = pose === 'walking';
      const isPhone = pose === 'phone';
      const isTurning = pose === 'turning';
      const isListening = pose === 'listening';
      const isSpeaking = pose === 'speaking';

      const turnVel = isTurning
        ? Math.cos(elapsed * 1.65) * 1.45
        : !isDraggingRef.current && !userHasDraggedRef.current
        ? Math.cos(elapsed * 0.45) * 0.04
        : 0;

      if (!isDraggingRef.current && !userHasDraggedRef.current) {
        const baseYaw = viewAngleRef.current === 'threeQuarter' ? -0.34 : 0;
        if (isTurning) {
          yawOffsetRef.current = baseYaw + Math.sin(elapsed * 1.65) * 0.52;
        } else {
          yawOffsetRef.current = baseYaw + Math.sin(elapsed * 0.45) * 0.06;
        }
      }
      characterRig.group.rotation.y = yawOffsetRef.current;

      // Smooth camera transition between full-body and hand/phone close-up
      const isHandCloseUp = viewAngleRef.current === 'handCloseUp';
      const targetCamPos = isHandCloseUp
        ? new THREE.Vector3(-0.222, 0.89, 0.46)
        : new THREE.Vector3(0, 1.28, 2.7);
      const targetCamLook = isHandCloseUp
        ? new THREE.Vector3(-0.222, 0.89, 0.04)
        : new THREE.Vector3(0, 1.18, 0);

      camera.position.lerp(targetCamPos, 0.1);
      currentCamLook.lerp(targetCamLook, 0.1);
      camera.lookAt(currentCamLook);

      characterRig.update(dt, elapsed, {
        isWalking,
        isJogging: false,
        isInspectingPhone: isPhone,
        showPhoneInHand: isInvestigator || isPhone,
        cameraFacingMode: 'front',
        isSpeaking,
        isListening,
        turnVelocity: turnVel,
        speed: isWalking ? 2.8 : 0,
        expression: expr,
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 440;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [archetype, isInvestigator]);

  return (
    <div
      ref={mountRef}
      onPointerDown={(e) => {
        isDraggingRef.current = true;
        userHasDraggedRef.current = true;
        lastXRef.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        yawOffsetRef.current += dx * 0.012;
      }}
      onPointerUp={() => {
        isDraggingRef.current = false;
      }}
      onPointerLeave={() => {
        isDraggingRef.current = false;
      }}
      className="relative z-10 my-2 w-full h-[350px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      title="Drag horizontally to rotate the 3D character model 360°"
    />
  );
};

interface RealisticGameGraphicsDossierProps {
  onClose: () => void;
}

const SUPPORTING_CAST_PROFILES: Array<{
  archetype: CharacterArchetypeId;
  name: string;
  role: string;
  age: string;
  heightLabel: string;
  setting: string;
  clothing: string;
  personality: string;
  expression: string;
  avatarColor: string;
  badge: string;
}> = [
  {
    archetype: 'alex',
    name: 'Alex Rivera',
    role: 'Freelance Graphic Designer & Tenant',
    age: '24 years old',
    heightLabel: '176 cm',
    setting: 'Sunset Heights Apartment 4B',
    clothing: 'Cobalt textured knit sweater over ivory crew tee, dark indigo denim, slate slip-ons',
    personality:
      'Creative illustrator waiting on replacement studio equipment, momentarily rattled by a fake courier customs fee.',
    expression: 'Puzzled and earnest, holding phone messages for verification.',
    avatarColor: '#2563EB',
    badge: 'Cases 01 · 05 · 09 · 10',
  },
  {
    archetype: 'maya',
    name: 'Maya Chen',
    role: 'University Architecture Student',
    age: '20 years old',
    heightLabel: '165 cm',
    setting: 'North Quad Study Commons',
    clothing: 'Olive fleece pullover hoodie, wireframe glasses, canvas academic daypack, dark jeans',
    personality:
      'Sharp undergraduate juggling midterms and scholarship renewals, targeted by urgent portal and internship notices.',
    expression: 'Alert and inquisitive, cross-checking portal URLs before signing in.',
    avatarColor: '#059669',
    badge: 'Cases 02 · 06 · 10',
  },
  {
    archetype: 'marcus',
    name: 'Marcus Vance',
    role: 'Roastery Café Owner & Seller',
    age: '35 years old',
    heightLabel: '182 cm',
    setting: 'Roast & Bean Neighborhood Café',
    clothing: 'Caramel duck-canvas utility jacket with chest pockets, charcoal henley, dark work trousers',
    personality:
      'Grounded small-business owner selling vintage camera gear and managing supplier invoices under time pressure.',
    expression: 'Measured and skeptical, verifying bank clearance before releasing goods.',
    avatarColor: '#D97706',
    badge: 'Cases 03 · 07 · 10',
  },
  {
    archetype: 'priya',
    name: 'Priya Sharma',
    role: 'Senior Systems Engineer',
    age: '29 years old',
    heightLabel: '169 cm',
    setting: 'Veridian Glass Office Suite',
    clothing: 'Tailored navy wool blazer over heather-grey ribbed turtleneck, charcoal slacks, silver studs',
    personality:
      'Detail-oriented infrastructure lead auditing wire approvals, cloud MFA prompts, and vendor routing changes.',
    expression: 'Composed and analytical, comparing cryptographic headers and callback records.',
    avatarColor: '#7C3AED',
    badge: 'Cases 04 · 08 · 10',
  },
  {
    archetype: 'david',
    name: 'David Chen',
    role: 'IT Security Liaison & Coordinator',
    age: '38 years old',
    heightLabel: '177 cm',
    setting: 'Cybersecurity Operations Hub',
    clothing: 'Charcoal structured zip overshirt, half-rim glasses, cyan security ID badge lanyard',
    personality:
      'Veteran incident-response specialist assisting with domain takedowns, header forensics, and institutional advisories.',
    expression: 'Calm, supportive, and procedurally thorough.',
    avatarColor: '#0891B2',
    badge: 'Incident Support',
  },
];

export const RealisticGameGraphicsDossier: React.FC<RealisticGameGraphicsDossierProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'protagonist' | 'supporting' | 'environments' | 'evidence'>('protagonist');
  const [selectedExpression, setSelectedExpression] = useState<'attentive' | 'concerned' | 'thinking' | 'relieved'>('attentive');
  const [selectedPose, setSelectedPose] = useState<DossierAnimationPose>('phone');
  const [investigatorViewAngle, setInvestigatorViewAngle] = useState<DossierViewAngle>('front');
  const [selectedCastArchetype, setSelectedCastArchetype] = useState<CharacterArchetypeId>('alex');
  const [selectedCastPose, setSelectedCastPose] = useState<DossierAnimationPose>('listening');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'apartment' | 'campus' | 'cafe' | 'office'>('apartment');
  const [magnifierActive, setMagnifierActive] = useState<boolean>(true);

  const activeCastProfile =
    SUPPORTING_CAST_PROFILES.find((c) => c.archetype === selectedCastArchetype) ||
    SUPPORTING_CAST_PROFILES[0];

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
                  CINEMATIC 3D CRIME-DRAMA REALISM
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
                  <h3 className="font-heading font-black text-base text-white">Detective Rowan Vance</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Lead Cyber & Financial Fraud Investigator. Classic cinematic leading-man look: broad, refined facial contours, 90s textured curtain fringe cut with soft rounded volume on top, forward-flowing piecey feathered locks across the forehead, tapered sides in warm golden sandy dirty-blonde, clear light-blue eyes, expressive brows, and a confident, thoughtful gaze.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0C152B] border border-white/10 space-y-1">
                  <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                    Wardrobe & Silhouette
                  </span>
                  <h3 className="font-heading font-black text-base text-white">Tailored Field Trench & Knit</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Charcoal wool-blend field jacket with woven twill texture and natural drapery folds over a slate-taupe crewneck shirt, dark chinos, leather satchel, and field watch.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0C152B] border border-white/10 space-y-1">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                    Art Consistency Rules
                  </span>
                  <h3 className="font-heading font-black text-base text-white">Unified Across Gameplay & Dossier</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Uses the exact same 3D humanoid rig, facial bone sculpt, PBR skin subsurface sheen, and cloth fold geometry across active scenes, cutscenes, and dossier inspection.
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
                  <div className="relative z-10 w-full flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 font-mono text-xs text-white/90">
                      INVESTIGATOR LOADOUT · CASE PHONE
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInvestigatorViewAngle('front')}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                          investigatorViewAngle === 'front'
                            ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white'
                            : 'bg-black/50 border-white/15 text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        Front View
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvestigatorViewAngle('threeQuarter')}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                          investigatorViewAngle === 'threeQuarter'
                            ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white'
                            : 'bg-black/50 border-white/15 text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        3/4 View
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvestigatorViewAngle('handCloseUp')}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                          investigatorViewAngle === 'handCloseUp'
                            ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white'
                            : 'bg-black/50 border-white/15 text-[#94A3B8] hover:text-white'
                        }`}
                        title="Close-up inspection of the upright smartphone grip in right palm"
                      >
                        Grip Close-Up
                      </button>
                    </div>
                  </div>

                  {/* Live 3D Human Investigator Model Viewport */}
                  <Character3DPreviewStage
                    archetype="investigator"
                    selectedPose={selectedPose}
                    selectedExpression={selectedExpression}
                    isInvestigator={true}
                    viewAngle={investigatorViewAngle}
                  />

                  {/* Character Model Scale & Stats Strip */}
                  <div className="relative z-10 w-full pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>Height: 178 cm · Drag to Orbit 360°</span>
                    <span className="text-emerald-400">Mood: {selectedExpression.toUpperCase()} · Active 3D Rig</span>
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

                  {/* Gameplay Action & Animation Poses */}
                  <div className="p-4 rounded-2xl bg-[#0B152B] border border-white/10 space-y-3">
                    <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block">
                      Humanoid Skeleton Animations (6 States)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'phone', label: 'Phone Interaction', desc: 'Back of phone facing camera with screen facing investigator' },
                        { id: 'idle', label: 'Natural Idle', desc: 'Grounded breathing & subtle weight shift' },
                        { id: 'walking', label: 'Walking Gait', desc: 'Balanced stride with counter-arm swing' },
                        { id: 'turning', label: 'Turning & Scanning', desc: 'Torso banking & head lead rotation' },
                        { id: 'listening', label: 'Attentive Listening', desc: 'Subtle head nods & brow focus' },
                        { id: 'speaking', label: 'Speaking / Briefing', desc: 'Jaw morph lip-sync & hand cadence' },
                      ].map((pose) => (
                        <button
                          key={pose.id}
                          type="button"
                          onClick={() => setSelectedPose(pose.id as DossierAnimationPose)}
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
                      Material & Geometry Calibration
                    </span>
                    <div className="space-y-1.5 text-[11px] font-mono text-[#CBD5E1]">
                      <div className="flex justify-between">
                        <span>Skin Shading:</span>
                        <span className="text-white">Subsurface sheen, micro-pore detail</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Garment Drapery:</span>
                        <span className="text-white">3D cloth folds + woven twill normal map</span>
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
              TAB 2: SUPPORTING CAST (The 5 Everyday People + Live 3D Stage)
          =================================================================== */}
          {activeTab === 'supporting' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    Recurring Cast — Live 3D Crime-Drama Character Models
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Ordinary people from Scam Sleuth’s world with distinct facial structures, hairstyles, fabric textures, and animations preserved across every scene.
                  </p>
                </div>
                <span className="font-mono text-xs text-amber-400 font-bold self-start sm:self-auto">
                  Identical 3D Rigs in Gameplay, Dialogue & Dossier
                </span>
              </div>

              {/* Interactive 3D Supporting Character Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-[#050A16] border-2 border-white/15 rounded-3xl p-6 relative flex flex-col items-center justify-between min-h-[440px] shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-[#070D1E] to-[#040812] pointer-events-none" />

                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 font-mono text-xs text-white/90">
                      {activeCastProfile.name.toUpperCase()} · {activeCastProfile.badge.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-[#00F0FF] font-bold">
                      Animation: {selectedCastPose.toUpperCase()}
                    </span>
                  </div>

                  <Character3DPreviewStage
                    archetype={selectedCastArchetype}
                    selectedPose={selectedCastPose}
                    selectedExpression="attentive"
                    isInvestigator={false}
                  />

                  <div className="relative z-10 w-full pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>
                      Height: {activeCastProfile.heightLabel} · {activeCastProfile.age} · Drag to Orbit 360°
                    </span>
                    <span className="text-emerald-400">Active 3D Scene Model</span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  {/* Character Switcher */}
                  <div className="p-4 rounded-2xl bg-[#0B152B] border border-white/10 space-y-2.5">
                    <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Select Recurring Character to Inspect in 3D
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {SUPPORTING_CAST_PROFILES.map((npc) => {
                        const isSelected = npc.archetype === selectedCastArchetype;
                        return (
                          <button
                            key={npc.archetype}
                            type="button"
                            onClick={() => setSelectedCastArchetype(npc.archetype)}
                            className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                                : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: npc.avatarColor }}
                              />
                              <div>
                                <span className="font-heading font-black text-xs block text-white">
                                  {npc.name}
                                </span>
                                <span className="text-[10px] text-[#CBD5E1] block">{npc.role}</span>
                              </div>
                            </div>
                            <span className="font-mono text-[10px] text-[#00F0FF]">{npc.badge}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Supporting Cast Animation Selector */}
                  <div className="p-4 rounded-2xl bg-[#0B152B] border border-white/10 space-y-2.5">
                    <span className="font-mono text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block">
                      Preview Character Animation State
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'listening', label: 'Listening' },
                        { id: 'speaking', label: 'Speaking' },
                        { id: 'idle', label: 'Natural Idle' },
                        { id: 'walking', label: 'Walking' },
                        { id: 'turning', label: 'Turning' },
                        { id: 'phone', label: 'Phone Check' },
                      ].map((pose) => (
                        <button
                          key={pose.id}
                          type="button"
                          onClick={() => setSelectedCastPose(pose.id as DossierAnimationPose)}
                          className={`px-2.5 py-2 rounded-xl font-heading font-bold text-center border transition-all cursor-pointer ${
                            selectedCastPose === pose.id
                              ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white'
                              : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          {pose.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUPPORTING_CAST_PROFILES.map((npc) => (
                  <div
                    key={npc.archetype}
                    onClick={() => setSelectedCastArchetype(npc.archetype)}
                    className={`p-5 rounded-3xl bg-[#091329] border space-y-4 transition-all shadow-lg flex flex-col justify-between cursor-pointer ${
                      selectedCastArchetype === npc.archetype
                        ? 'border-amber-400 ring-1 ring-amber-400/40'
                        : 'border-white/10 hover:border-amber-400/50'
                    }`}
                  >
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

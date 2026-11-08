import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { ProceduralTextureGenerator } from '../../utils/proceduralTextures';

export type CharacterArchetypeId =
  | 'investigator'
  | 'alex'
  | 'maya'
  | 'marcus'
  | 'priya'
  | 'elena'
  | 'david';

export interface HumanCharacterConfig {
  id: string;
  name: string;
  archetype?: CharacterArchetypeId;
  skinTone?: 'fair' | 'warm' | 'tan' | 'deep';
  skinHex?: string;
  hairHex?: string;
  irisHex?: string;
  jacketHex?: string;
  innerShirtHex?: string;
  trousersHex?: string;
  shoesHex?: string;
  style?: 'casual_everyday' | 'investigator_coat';
  isNpc?: boolean;
  role?: string;
  hasBeard?: boolean;
}

export interface HumanCharacterUpdateOptions {
  playerPos?: THREE.Vector3;
  isSpeaking?: boolean;
  isListening?: boolean;
  isWalking?: boolean;
  isJogging?: boolean;
  isInspectingPhone?: boolean;
  showPhoneInHand?: boolean;
  cameraFacingMode?: 'front' | 'behind';
  turnVelocity?: number;
  speed?: number;
  lookAtPos?: THREE.Vector3;
  expression?: 'attentive' | 'concerned' | 'thinking' | 'relieved';
}

export interface CharacterArchetypeProfile {
  archetype: CharacterArchetypeId;
  displayName: string;
  roleTitle: string;
  ageLabel: string;
  heightCm: number;
  locationLabel: string;
  wardrobeSummary: string;
  personalitySummary: string;
  signatureExpression: string;
  badgeLabel: string;
  accentHex: string;
  bodyScale: [number, number, number];
  shoulderWidthScale: number;
  hemMinY: number;
  faceSculpt: {
    jawWidth: number;
    cheekboneWidth: number;
    chinDepth: number;
    browDepth: number;
    noseBridge: number;
  };
  skinHex: string;
  hairHex: string;
  irisHex: string;
  jacketHex: string;
  innerShirtHex: string;
  trousersHex: string;
  shoesHex: string;
  isDenimJacket?: boolean;
  hairstyle:
    | 'side_part_detective'
    | 'tousled_wavy_crop'
    | 'sleek_bun_bangs'
    | 'textured_crop_fade'
    | 'shoulder_length_waves'
    | 'neat_executive_part';
  facialHair: 'none' | 'short_boxed_beard' | 'full_craftsman_beard';
  eyewear: 'none' | 'wireframe_round' | 'rectangular_halfrim';
  garmentDetail:
    | 'investigator_coat'
    | 'illustrator_cardigan'
    | 'student_hoodie_backpack'
    | 'craftsman_chore_coat'
    | 'designer_blazer_turtleneck'
    | 'security_liaison_lanyard';
}

export interface HumanCharacterInstance {
  group: THREE.Group;
  config: HumanCharacterConfig;
  profile: CharacterArchetypeProfile;
  update: (
    delta: number,
    currentTime: number,
    options?: HumanCharacterUpdateOptions
  ) => void;
}

// ---------------------------------------------------------------------------
// CANONICAL CRIME-DRAMA CHARACTER ARCHETYPE REGISTRY
// Preserves each character's recognizable face, hairstyle, clothing, and
// adult proportions across active 3D scenes, cutscenes, dialogue, and dossier.
// ---------------------------------------------------------------------------
export const CHARACTER_ARCHETYPE_CATALOG: Record<
  CharacterArchetypeId,
  CharacterArchetypeProfile
> = {
  investigator: {
    archetype: 'investigator',
    displayName: 'Detective Rowan Vance',
    roleTitle: 'Lead Cyber-Crime Investigator',
    ageLabel: '33 years old',
    heightCm: 178,
    locationLabel: 'Field Operations · All Cases',
    wardrobeSummary:
      'Charcoal heavy cotton-twill utility field coat over a slate-taupe ribbed crewneck knit, dark tailored chinos, leather field boots, wristwatch, and leather case satchel.',
    personalitySummary:
      'Grounded, observant digital forensics investigator. Calm under pressure, analytical, and confident when cross-referencing social-engineering trails.',
    signatureExpression:
      'Confident, thoughtful expression with an attentive analytical gaze and expressive brows.',
    badgeLabel: 'Lead Investigator',
    accentHex: '#00F0FF',
    bodyScale: [1.0, 1.0, 1.0],
    shoulderWidthScale: 1.02,
    hemMinY: 0.89,
    faceSculpt: {
      jawWidth: 1.05,
      cheekboneWidth: 1.04,
      chinDepth: 1.04,
      browDepth: 1.02,
      noseBridge: 1.01,
    },
    skinHex: '#e4bca2',
    hairHex: '#4a3629',
    irisHex: '#70c4f8',
    jacketHex: '#232b38',
    innerShirtHex: '#64748b',
    trousersHex: '#141923',
    shoesHex: '#1c1815',
    isDenimJacket: true,
    hairstyle: 'side_part_detective',
    facialHair: 'none',
    eyewear: 'none',
    garmentDetail: 'investigator_coat',
  },
  alex: {
    archetype: 'alex',
    displayName: 'Alex Rivera',
    roleTitle: 'Neighbor & Digital Illustrator',
    ageLabel: '24 years old',
    heightCm: 174,
    locationLabel: 'Sunset Heights Apartment 4B',
    wardrobeSummary:
      'Cobalt-blue textured knit cardigan overshirt over a crisp warm-white cotton crew tee, dark indigo selvedge denim jeans, and slate everyday sneakers.',
    personalitySummary:
      'Creative freelance illustrator awaiting an art-supply parcel, momentarily rattled by a late-night phantom customs fee text.',
    signatureExpression:
      'Earnest and inquisitive, leaning in attentively while discussing the suspicious delivery alert.',
    badgeLabel: 'Cases 01 · 02 · 10',
    accentHex: '#2563EB',
    bodyScale: [0.975, 0.98, 0.975],
    shoulderWidthScale: 0.98,
    hemMinY: 0.99,
    faceSculpt: {
      jawWidth: 0.96,
      cheekboneWidth: 1.01,
      chinDepth: 0.98,
      browDepth: 0.98,
      noseBridge: 0.99,
    },
    skinHex: '#dca888',
    hairHex: '#261811',
    irisHex: '#4a2c18',
    jacketHex: '#2563eb',
    innerShirtHex: '#f1f5f9',
    trousersHex: '#1e293b',
    shoesHex: '#334155',
    isDenimJacket: false,
    hairstyle: 'tousled_wavy_crop',
    facialHair: 'none',
    eyewear: 'none',
    garmentDetail: 'illustrator_cardigan',
  },
  maya: {
    archetype: 'maya',
    displayName: 'Maya Chen',
    roleTitle: 'University Computer Science Student',
    ageLabel: '20 years old',
    heightCm: 165,
    locationLabel: 'North Quad Study Commons',
    wardrobeSummary:
      'Olive-emerald fleece zip hoodie with draped hood over a heather-grey jersey tee, dark slim study trousers, wireframe eyeglasses, and canvas student backpack.',
    personalitySummary:
      'Sharp undergraduate rushing between midterms, alarmed by an urgent 24-hour campus portal suspension warning.',
    signatureExpression:
      'Alert and thoughtful behind thin wireframe glasses, weighing every domain clue carefully.',
    badgeLabel: 'Cases 03 · 08 · 10',
    accentHex: '#059669',
    bodyScale: [0.925, 0.935, 0.925],
    shoulderWidthScale: 0.88,
    hemMinY: 0.995,
    faceSculpt: {
      jawWidth: 0.87,
      cheekboneWidth: 0.97,
      chinDepth: 0.94,
      browDepth: 0.93,
      noseBridge: 0.95,
    },
    skinHex: '#eac5ab',
    hairHex: '#141215',
    irisHex: '#231710',
    jacketHex: '#059669',
    innerShirtHex: '#e2e8f0',
    trousersHex: '#1e293b',
    shoesHex: '#334155',
    isDenimJacket: false,
    hairstyle: 'sleek_bun_bangs',
    facialHair: 'none',
    eyewear: 'wireframe_round',
    garmentDetail: 'student_hoodie_backpack',
  },
  marcus: {
    archetype: 'marcus',
    displayName: 'Marcus Vance',
    roleTitle: 'Artisan Woodworker & Marketplace Seller',
    ageLabel: '32 years old',
    heightCm: 182,
    locationLabel: 'Little Seoul Urban Bistro & Café',
    wardrobeSummary:
      'Caramel-amber heavy duck-canvas workwear chore coat with utility pockets over a charcoal ribbed henley, raw-denim work trousers, and worn espresso leather boots.',
    personalitySummary:
      'Practical furniture craftsman selling vintage gear, skeptical of a buyer pushing a fake escrow receipt and courier overpayment.',
    signatureExpression:
      'Measured, grounded skepticism with a steady gaze and composed posture.',
    badgeLabel: 'Cases 04 · 07 · 10',
    accentHex: '#D97706',
    bodyScale: [1.035, 1.02, 1.035],
    shoulderWidthScale: 1.06,
    hemMinY: 0.98,
    faceSculpt: {
      jawWidth: 1.07,
      cheekboneWidth: 1.04,
      chinDepth: 1.05,
      browDepth: 1.06,
      noseBridge: 1.04,
    },
    skinHex: '#c68b63',
    hairHex: '#1c130e',
    irisHex: '#5c3a1e',
    jacketHex: '#b45309',
    innerShirtHex: '#1f2937',
    trousersHex: '#0f172a',
    shoesHex: '#291d16',
    isDenimJacket: true,
    hairstyle: 'textured_crop_fade',
    facialHair: 'full_craftsman_beard',
    eyewear: 'none',
    garmentDetail: 'craftsman_chore_coat',
  },
  priya: {
    archetype: 'priya',
    displayName: 'Priya Sharma',
    roleTitle: 'Senior UX Designer & Remote Candidate',
    ageLabel: '27 years old',
    heightCm: 168,
    locationLabel: 'Apex Tower Career Suite',
    wardrobeSummary:
      'Tailored plum-indigo architectural blazer over a fine-ribbed dove-grey turtleneck, charcoal tailored slacks, stud earrings, and sleek dark ankle boots.',
    personalitySummary:
      'Poised digital product designer scrutinizing an unsolicited remote job offer and equipment check deposit.',
    signatureExpression:
      'Poised, observant, and perceptive, spotting subtle inconsistencies in corporate documents.',
    badgeLabel: 'Cases 05 · 06 · 09',
    accentHex: '#7C3AED',
    bodyScale: [0.94, 0.955, 0.94],
    shoulderWidthScale: 0.9,
    hemMinY: 0.985,
    faceSculpt: {
      jawWidth: 0.89,
      cheekboneWidth: 0.98,
      chinDepth: 0.95,
      browDepth: 0.94,
      noseBridge: 0.96,
    },
    skinHex: '#d49b78',
    hairHex: '#1a1210',
    irisHex: '#3b2314',
    jacketHex: '#6d28d9',
    innerShirtHex: '#cbd5e1',
    trousersHex: '#18181b',
    shoesHex: '#1c1917',
    isDenimJacket: false,
    hairstyle: 'shoulder_length_waves',
    facialHair: 'none',
    eyewear: 'none',
    garmentDetail: 'designer_blazer_turtleneck',
  },
  elena: {
    archetype: 'elena',
    displayName: 'Elena Rostova',
    roleTitle: 'Product Strategist & Career Candidate',
    ageLabel: '27 years old',
    heightCm: 169,
    locationLabel: 'Apex Tower Career Suite',
    wardrobeSummary:
      'Deep navy tailored blazer over a heather-pearl ribbed turtleneck, charcoal tailored trousers, and portfolio case folder.',
    personalitySummary:
      'Methodical remote career applicant verifying an advance equipment check before depositing.',
    signatureExpression:
      'Hopeful yet analytically guarded, cross-checking every corporate header.',
    badgeLabel: 'Career Suite Case',
    accentHex: '#6366F1',
    bodyScale: [0.945, 0.96, 0.945],
    shoulderWidthScale: 0.9,
    hemMinY: 0.985,
    faceSculpt: {
      jawWidth: 0.89,
      cheekboneWidth: 0.99,
      chinDepth: 0.95,
      browDepth: 0.94,
      noseBridge: 0.97,
    },
    skinHex: '#ecc8b0',
    hairHex: '#3b2216',
    irisHex: '#3b4d5e',
    jacketHex: '#312e81',
    innerShirtHex: '#cbd5e1',
    trousersHex: '#18181b',
    shoesHex: '#1c1917',
    isDenimJacket: false,
    hairstyle: 'shoulder_length_waves',
    facialHair: 'none',
    eyewear: 'none',
    garmentDetail: 'designer_blazer_turtleneck',
  },
  david: {
    archetype: 'david',
    displayName: 'David Chen',
    roleTitle: 'IT Security Liaison & Incident Coordinator',
    ageLabel: '38 years old',
    heightCm: 176,
    locationLabel: 'Cybersecurity Operations Hub',
    wardrobeSummary:
      'Deep slate-teal structured overshirt over a charcoal collared shirt, dark slate chinos, titanium half-rim glasses, and security operations ID lanyard.',
    personalitySummary:
      'Experienced internal security coordinator who assists with rapid out-of-band verification and incident logging.',
    signatureExpression:
      'Calm, reassuring, and procedurally thorough.',
    badgeLabel: 'Incident Support',
    accentHex: '#0891B2',
    bodyScale: [0.99, 0.995, 0.99],
    shoulderWidthScale: 1.0,
    hemMinY: 0.99,
    faceSculpt: {
      jawWidth: 1.01,
      cheekboneWidth: 1.02,
      chinDepth: 1.0,
      browDepth: 1.02,
      noseBridge: 1.0,
    },
    skinHex: '#e0b494',
    hairHex: '#1e1c1a',
    irisHex: '#291b12',
    jacketHex: '#0891b2',
    innerShirtHex: '#1e293b',
    trousersHex: '#0f172a',
    shoesHex: '#18181b',
    isDenimJacket: true,
    hairstyle: 'neat_executive_part',
    facialHair: 'none',
    eyewear: 'rectangular_halfrim',
    garmentDetail: 'security_liaison_lanyard',
  },
};

export function resolveCharacterArchetype(
  config: HumanCharacterConfig
): CharacterArchetypeProfile {
  if (config.archetype && CHARACTER_ARCHETYPE_CATALOG[config.archetype]) {
    return CHARACTER_ARCHETYPE_CATALOG[config.archetype];
  }
  const key = `${config.id} ${config.name} ${config.role || ''}`.toLowerCase();
  if (!config.isNpc || config.style === 'investigator_coat' || /rowan|detective|investigator|player/.test(key)) {
    return CHARACTER_ARCHETYPE_CATALOG.investigator;
  }
  if (/maya/.test(key)) return CHARACTER_ARCHETYPE_CATALOG.maya;
  if (/marcus/.test(key)) return CHARACTER_ARCHETYPE_CATALOG.marcus;
  if (/elena/.test(key)) return CHARACTER_ARCHETYPE_CATALOG.elena;
  if (/priya/.test(key)) return CHARACTER_ARCHETYPE_CATALOG.priya;
  if (/david/.test(key)) return CHARACTER_ARCHETYPE_CATALOG.david;
  return CHARACTER_ARCHETYPE_CATALOG.alex;
}

// ---------------------------------------------------------------------------
// CACHED TEXTURES & GLTF HUMANOID RIG LOADER
// ---------------------------------------------------------------------------
const MODEL_URL = '/models/readyplayer.me.glb';
let cachedGltfScene: THREE.Group | null = null;
let loadPromise: Promise<THREE.Group> | null = null;

const fabricTextureCache = new Map<string, THREE.CanvasTexture>();
const hairTextureCache = new Map<string, THREE.CanvasTexture>();
const irisTextureCache = new Map<string, THREE.CanvasTexture>();
let cachedContactShadowTex: THREE.CanvasTexture | null = null;

function getCachedFabricTexture(hex: string, isDenim = false): THREE.CanvasTexture {
  const key = `${hex}_${isDenim ? 'twill' : 'knit'}`;
  if (!fabricTextureCache.has(key)) {
    fabricTextureCache.set(
      key,
      ProceduralTextureGenerator.createFabricClothTexture(hex, isDenim)
    );
  }
  return fabricTextureCache.get(key)!;
}

function getCachedHairTexture(hex: string): THREE.CanvasTexture {
  if (!hairTextureCache.has(hex)) {
    hairTextureCache.set(hex, ProceduralTextureGenerator.createHairStrandTexture(hex));
  }
  return hairTextureCache.get(hex)!;
}

function getCachedIrisTexture(hex: string): THREE.CanvasTexture {
  if (!irisTextureCache.has(hex)) {
    irisTextureCache.set(hex, ProceduralTextureGenerator.createRealisticIrisTexture(hex));
  }
  return irisTextureCache.get(hex)!;
}

function getCachedContactShadowTexture(): THREE.CanvasTexture {
  if (!cachedContactShadowTex) {
    cachedContactShadowTex = ProceduralTextureGenerator.createContactShadowTexture();
  }
  return cachedContactShadowTex;
}

// Pre-allocated math helpers to avoid per-frame GC allocations
const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();
const _targetQuat = new THREE.Quaternion();

function preloadHumanModel(): Promise<THREE.Group> {
  if (cachedGltfScene) return Promise.resolve(cachedGltfScene);
  if (loadPromise) return loadPromise;

  const loader = new GLTFLoader();
  loadPromise = new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      MODEL_URL,
      (gltf) => {
        cachedGltfScene = gltf.scene;
        resolve(gltf.scene);
      },
      undefined,
      (error) => {
        console.warn('Failed to load human GLTF model:', error);
        reject(error);
      }
    );
  });

  return loadPromise;
}

if (typeof window !== 'undefined') {
  preloadHumanModel().catch(() => {});
}

// ---------------------------------------------------------------------------
// GEOMETRY DECOMPOSITION & ANATOMICAL SCULPTING HELPERS
// ---------------------------------------------------------------------------

/**
 * Splits Wolf3D_Outfit_Top into two distinct SkinnedMesh geometries:
 * 1) outerJacketGeo: Jacket torso, sleeves, lapels, and sleeve buttons, with the
 *    wedding tuxedo coattails tailored into a modern hip/field-coat hem and subtle
 *    3D fabric fold creases.
 * 2) innerShirtGeo: Inner crewneck/henley/turtleneck shirt front, collar, and cuffs.
 * Completely removes the wedding bow tie and wedding boutonniere lapel flower.
 */
function decomposeAndTailorOutfitTop(
  sourceGeo: THREE.BufferGeometry,
  profile: CharacterArchetypeProfile
): {
  outerJacketGeo: THREE.BufferGeometry;
  innerShirtGeo: THREE.BufferGeometry;
} {
  const pos = sourceGeo.attributes.position;
  const idxAttr = sourceGeo.index;
  if (!idxAttr) {
    return {
      outerJacketGeo: sourceGeo.clone(),
      innerShirtGeo: sourceGeo.clone(),
    };
  }

  const idx = idxAttr.array;
  const nVerts = pos.count;
  const parent = Array.from({ length: nVerts }, (_, i) => i);
  const find = (x: number): number => {
    let cur = x;
    while (parent[cur] !== cur) {
      parent[cur] = parent[parent[cur]];
      cur = parent[cur];
    }
    return cur;
  };

  for (let i = 0; i < idx.length; i += 3) {
    const a = find(idx[i]);
    const b = find(idx[i + 1]);
    const c = find(idx[i + 2]);
    parent[a] = b;
    parent[b] = c;
  }

  const comps = new Map<
    number,
    { min: [number, number, number]; max: [number, number, number] }
  >();
  for (let v = 0; v < nVerts; v++) {
    const r = find(v);
    let comp = comps.get(r);
    if (!comp) {
      comp = { min: [99, 99, 99], max: [-99, -99, -99] };
      comps.set(r, comp);
    }
    const x = pos.getX(v);
    const y = pos.getY(v);
    const z = pos.getZ(v);
    if (x < comp.min[0]) comp.min[0] = x;
    if (x > comp.max[0]) comp.max[0] = x;
    if (y < comp.min[1]) comp.min[1] = y;
    if (y > comp.max[1]) comp.max[1] = y;
    if (z < comp.min[2]) comp.min[2] = z;
    if (z > comp.max[2]) comp.max[2] = z;
  }

  const compRole = new Map<number, 'BOWTIE' | 'FLOWER' | 'INNER' | 'OUTER'>();
  comps.forEach((c, r) => {
    const isBowtie =
      c.min[1] > 1.5 &&
      c.max[1] < 1.576 &&
      c.min[2] > 0.055 &&
      c.min[0] > -0.06 &&
      c.max[0] < 0.065;
    const isFlower =
      c.min[0] < -0.085 &&
      c.max[0] < -0.085 &&
      c.min[1] > 1.355 &&
      c.max[1] < 1.475 &&
      c.min[2] > 0.045;
    const isInner =
      !isBowtie &&
      !isFlower &&
      ((c.min[1] > 1.5 && c.max[1] > 1.565) ||
        (c.min[1] > 1.02 &&
          c.max[1] < 1.135 &&
          (c.max[0] < -0.38 || c.min[0] > 0.38)) ||
        (c.min[2] > 0.01 &&
          c.max[0] <= 0.1 &&
          c.min[0] >= -0.1 &&
          c.max[1] < 1.55));

    compRole.set(
      r,
      isBowtie ? 'BOWTIE' : isFlower ? 'FLOWER' : isInner ? 'INNER' : 'OUTER'
    );
  });

  const outerIndices: number[] = [];
  const innerIndices: number[] = [];
  for (let i = 0; i < idx.length; i += 3) {
    const role = compRole.get(find(idx[i]));
    if (role === 'OUTER') {
      outerIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    } else if (role === 'INNER') {
      innerIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    }
  }

  const outerJacketGeo = sourceGeo.clone();
  outerJacketGeo.setIndex(outerIndices);

  const innerShirtGeo = sourceGeo.clone();
  innerShirtGeo.setIndex(innerIndices);

  // Tailor the outer jacket:
  // 1) Eliminate tuxedo coattails (vertices with y < hemMinY) so it sits cleanly as a modern jacket/coat
  // 2) Apply shoulder/torso width proportioning & subtle organic sleeve/torso drapery folds
  const outPos = outerJacketGeo.attributes.position;
  const outNorm = outerJacketGeo.attributes.normal;
  const hemMinY = profile.hemMinY;
  const shoulderScale = profile.shoulderWidthScale;

  for (let v = 0; v < outPos.count; v++) {
    let x = outPos.getX(v);
    let y = outPos.getY(v);
    let z = outPos.getZ(v);
    const nx = outNorm ? outNorm.getX(v) : 0;
    const nz = outNorm ? outNorm.getZ(v) : 0;

    // Smoothly tailor long rear tuxedo tails into a clean hip-length or mid-thigh jacket hem
    if (y < hemMinY) {
      const excess = hemMinY - y;
      y = hemMinY - excess * 0.08;
      if (z < 0) {
        // Pull flared rear tail inward toward the trousers
        z += Math.min(0.032, excess * 0.085);
      }
    }

    // Apply character-specific shoulder & upper-torso silhouette scaling
    if (y > 1.15 && Math.abs(x) < 0.24) {
      const t = Math.min(1, (y - 1.15) / 0.35);
      x *= 1 + (shoulderScale - 1) * t;
    }

    // Add subtle, realistic fabric fold relief along sleeves and torso
    const foldWave =
      Math.sin(y * 38.0 + x * 12.0) * 0.0018 +
      Math.cos(y * 62.0 - z * 18.0) * 0.0011;
    x += nx * foldWave;
    z += nz * foldWave;

    outPos.setXYZ(v, x, y, z);
  }
  outPos.needsUpdate = true;

  // Also apply shoulder proportion scaling to the inner shirt collar/chest so it stays flush
  const inPos = innerShirtGeo.attributes.position;
  for (let v = 0; v < inPos.count; v++) {
    let x = inPos.getX(v);
    const y = inPos.getY(v);
    const z = inPos.getZ(v);
    if (y > 1.15 && Math.abs(x) < 0.22) {
      const t = Math.min(1, (y - 1.15) / 0.35);
      x *= 1 + (shoulderScale - 1) * t;
    }
    inPos.setXYZ(v, x, y, z);
  }
  inPos.needsUpdate = true;

  return { outerJacketGeo, innerShirtGeo };
}

/**
 * Filters Wolf3D_Headwear to remove the bowler/cowboy hat (components with y >= 1.748)
 * while retaining the sculpted side/temple/nape hair locks (Component 0).
 */
function stripHatFromHeadwearGeometry(
  sourceGeo: THREE.BufferGeometry
): THREE.BufferGeometry {
  const pos = sourceGeo.attributes.position;
  const idxAttr = sourceGeo.index;
  if (!idxAttr) return sourceGeo.clone();

  const idx = idxAttr.array;
  const nVerts = pos.count;
  const parent = Array.from({ length: nVerts }, (_, i) => i);
  const find = (x: number): number => {
    let cur = x;
    while (parent[cur] !== cur) {
      parent[cur] = parent[parent[cur]];
      cur = parent[cur];
    }
    return cur;
  };

  for (let i = 0; i < idx.length; i += 3) {
    const a = find(idx[i]);
    const b = find(idx[i + 1]);
    const c = find(idx[i + 2]);
    parent[a] = b;
    parent[b] = c;
  }

  const compMinY = new Map<number, number>();
  for (let v = 0; v < nVerts; v++) {
    const r = find(v);
    const y = pos.getY(v);
    const prev = compMinY.get(r);
    if (prev === undefined || y < prev) {
      compMinY.set(r, y);
    }
  }

  const hairIndices: number[] = [];
  for (let i = 0; i < idx.length; i += 3) {
    const minY = compMinY.get(find(idx[i])) ?? 99;
    // Component 0 (natural side/back hair) has minY = 1.624; hat parts all have minY >= 1.753
    if (minY < 1.72) {
      hairIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    }
  }

  const cleanHairGeo = sourceGeo.clone();
  cleanHairGeo.setIndex(hairIndices);

  // Gently tuck the side hair locks closer to the temples so they blend into our crown hair sculpt
  const hPos = cleanHairGeo.attributes.position;
  for (let v = 0; v < hPos.count; v++) {
    let x = hPos.getX(v);
    const y = hPos.getY(v);
    let z = hPos.getZ(v);
    if (Math.abs(x) > 0.095) {
      x *= 0.86;
    }
    if (z < -0.1) {
      z *= 0.92;
    }
    hPos.setXYZ(v, x, y, z);
  }
  hPos.needsUpdate = true;

  return cleanHairGeo;
}

/**
 * Applies subtle, recognizable adult facial bone-structure sculpting to Wolf3D_Head
 * while keeping morph targets (mouthOpen, mouthSmile) and eye sockets 100% aligned.
 */
function sculptCharacterFaceGeometry(
  sourceHeadGeo: THREE.BufferGeometry,
  profile: CharacterArchetypeProfile
): THREE.BufferGeometry {
  const headGeo = sourceHeadGeo.clone();
  const pos = headGeo.attributes.position;
  const { jawWidth, cheekboneWidth, chinDepth, browDepth, noseBridge } =
    profile.faceSculpt;

  for (let v = 0; v < pos.count; v++) {
    let x = pos.getX(v);
    const y = pos.getY(v);
    let z = pos.getZ(v);

    // Local Y relative to head center (~1.6385)
    const ly = y - 1.6385;
    const lz = z - 0.0076;

    // 1. Jawline & Lower Cheek Width (ly in [-0.045, 0.045], avoid neck below -0.055)
    if (ly > -0.048 && ly < 0.048 && lz > -0.02) {
      const jawWeight =
        Math.max(0, 1 - Math.abs(ly + 0.008) / 0.045) *
        Math.min(1, (lz + 0.02) / 0.08);
      x *= 1 + (jawWidth - 1) * jawWeight;
    }

    // 2. Cheekbone Definition (ly in [0.03, 0.085], lz > 0.03)
    if (ly > 0.025 && ly < 0.088 && lz > 0.025 && Math.abs(x) > 0.028) {
      const cheekWeight = Math.max(0, 1 - Math.abs(ly - 0.056) / 0.032);
      x *= 1 + (cheekboneWidth - 1) * cheekWeight;
    }

    // 3. Chin Projection (ly in [-0.042, -0.008], lz > 0.08)
    if (ly > -0.042 && ly < -0.006 && lz > 0.08 && Math.abs(x) < 0.038) {
      const chinWeight = Math.max(0, 1 - Math.abs(ly + 0.024) / 0.02);
      z += (chinDepth - 1) * 0.065 * chinWeight;
    }

    // 4. Brow Ridge (ly in [0.102, 0.132], lz > 0.075 — above eyes at ly=0.088)
    if (ly > 0.102 && ly < 0.134 && lz > 0.075) {
      const browWeight = Math.max(0, 1 - Math.abs(ly - 0.116) / 0.016);
      z += (browDepth - 1) * 0.055 * browWeight;
    }

    // 5. Nose Bridge Contour (ly in [0.038, 0.082], |x| < 0.022, lz > 0.095)
    if (ly > 0.038 && ly < 0.082 && Math.abs(x) < 0.022 && lz > 0.095) {
      z += (noseBridge - 1) * 0.045;
    }

    pos.setXYZ(v, x, y, z);
  }
  pos.needsUpdate = true;
  return headGeo;
}

/**
 * Extracts an anatomical SkinnedMesh scalp cap and optional short boxed beard
 * directly from the sculpted Wolf3D_Head topology so hair and facial hair match
 * the skull and jaw contours and move naturally with speech morph targets.
 */
function buildAnatomicalScalpAndBeardGeometries(
  sculptedHeadGeo: THREE.BufferGeometry,
  profile: CharacterArchetypeProfile
): {
  scalpGeo: THREE.BufferGeometry;
  beardGeo: THREE.BufferGeometry | null;
} {
  const pos = sculptedHeadGeo.attributes.position;
  const norm = sculptedHeadGeo.attributes.normal;
  const idxAttr = sculptedHeadGeo.index!;
  const idx = idxAttr.array;

  const scalpIndices: number[] = [];
  const beardIndices: number[] = [];
  const wantsBeard = profile.facialHair !== 'none';

  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i];
    const b = idx[i + 1];
    const c = idx[i + 2];

    const cx = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3;
    const cy = (pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3 - 1.6385;
    const cz = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3 - 0.0076;

    // Exclude ear pinna
    const isEar =
      Math.abs(cx) > 0.079 && cy < 0.098 && cz > -0.028 && cz < 0.038;

    // Anatomical scalp cap covering top crown cranium, temporal bone, and nape (behind natural hairline)
    const isScalp =
      !isEar &&
      (cy > 0.168 ||
        (cy > 0.152 && cz < 0.082) ||
        (cy > 0.095 && cz < 0.045) ||
        (cy > 0.012 && cz < -0.010));
    if (isScalp) {
      scalpIndices.push(a, b, c);
    }

    if (wantsBeard && !isEar) {
      // Exclude lips & mouth interior so lips remain clean and expressive
      const isLips =
        Math.abs(cx) < 0.028 && cy > -0.003 && cy < 0.018 && cz > 0.094;
      const isMustache =
        Math.abs(cx) < 0.031 && cy >= 0.016 && cy <= 0.029 && cz > 0.096;
      const isJawBeard =
        !isLips &&
        cy >= -0.036 &&
        cy <= 0.036 &&
        cz > 0.028 &&
        (cy < 0.001 || Math.abs(cx) > 0.026);
      if (isMustache || isJawBeard) {
        beardIndices.push(a, b, c);
      }
    }
  }

  // 1. Displace scalp geometry outward along normals with organic hair-strand wave relief
  const scalpGeo = sculptedHeadGeo.clone();
  scalpGeo.setIndex(scalpIndices);
  const sPos = scalpGeo.attributes.position;
  for (let v = 0; v < sPos.count; v++) {
    const x = sPos.getX(v);
    const y = sPos.getY(v);
    const z = sPos.getZ(v);
    const nx = norm ? norm.getX(v) : 0;
    const ny = norm ? norm.getY(v) : 1;
    const nz = norm ? norm.getZ(v) : 0;

    const ly = y - 1.6385;
    const angle = Math.atan2(x, z - 0.0076);
    const crownLift = Math.max(0, (ly - 0.06) * 0.055);
    const strandWave = Math.sin(angle * 22 + ly * 45) * 0.0022;
    const offset = 0.0065 + crownLift + strandWave;

    sPos.setXYZ(v, x + nx * offset, y + ny * (offset * 1.25), z + nz * offset);
  }
  sPos.needsUpdate = true;

  // 2. Displace anatomical beard geometry outward along jaw/chin/philtrum normals
  let beardGeo: THREE.BufferGeometry | null = null;
  if (wantsBeard && beardIndices.length > 0) {
    beardGeo = sculptedHeadGeo.clone();
    beardGeo.setIndex(beardIndices);
    const bPos = beardGeo.attributes.position;
    const isFullBeard = profile.facialHair === 'full_craftsman_beard';
    const baseThickness = isFullBeard ? 0.0044 : 0.0024;

    for (let v = 0; v < bPos.count; v++) {
      const x = bPos.getX(v);
      const y = bPos.getY(v);
      const z = bPos.getZ(v);
      const nx = norm ? norm.getX(v) : 0;
      const ny = norm ? norm.getY(v) : 0;
      const nz = norm ? norm.getZ(v) : 1;

      const ly = y - 1.6385;
      const chinExtra = ly < -0.01 ? (isFullBeard ? 0.0032 : 0.0014) : 0;
      const follicleGrain = Math.sin(x * 180 + y * 160) * 0.0005;
      const d = baseThickness + chinExtra + follicleGrain;

      bPos.setXYZ(
        v,
        x + nx * d,
        y + ny * d - (ly < -0.015 && isFullBeard ? 0.0025 : 0),
        z + nz * d
      );
    }
    bPos.needsUpdate = true;
  }

  return { scalpGeo, beardGeo };
}

/**
 * Builds distinct, multi-part 3D hairstyles, animated eyebrows, and eyewear attached
 * to the character's Head bone (where Head local origin is at world [0, 1.6385, 0.0076]).
 */
function attachHeadFeaturesAndHair(
  headBone: THREE.Bone,
  profile: CharacterArchetypeProfile,
  hairMat: THREE.MeshStandardMaterial
): {
  leftBrow: THREE.Mesh;
  rightBrow: THREE.Mesh;
} {
  const headFeatureGroup = new THREE.Group();
  headFeatureGroup.name = 'sculptedHeadFeatures';

  // 1. Articulated 3D Eyebrows above Left & Right Eyes (Head local y = 0.109, z = 0.104)
  const browMat = hairMat.clone();
  browMat.roughness = 0.82;
  const isLeadingMan = profile.archetype === 'investigator';
  if (isLeadingMan) {
    // Natural defined warm dark-brown eyebrows harmonizing with the dark-brown side-parted hairstyle
    browMat.color.set('#4a3629');
  }

  const browGeo = new THREE.BoxGeometry(
    isLeadingMan ? 0.034 : 0.032,
    isLeadingMan ? 0.0052 : 0.0058,
    0.009
  );
  const leftBrow = new THREE.Mesh(browGeo, browMat);
  leftBrow.position.set(0.031, 0.109, 0.104);
  leftBrow.rotation.set(0.08, 0.16, -0.04);

  const rightBrow = new THREE.Mesh(browGeo, browMat);
  rightBrow.position.set(-0.031, 0.109, 0.104);
  rightBrow.rotation.set(0.08, -0.16, 0.04);

  headFeatureGroup.add(leftBrow, rightBrow);

  // 2. Character-Specific Multi-Part 3D Hair Volume & Locks on the Crown/Forehead/Sides
  const hairGroup = new THREE.Group();
  hairGroup.name = `hairstyle_${profile.hairstyle}`;

  if (profile.hairstyle === 'side_part_detective') {
    // Investigator Rowan Vance: Fuller, stylish dark-brown (#4a3629) layered cut
    // featuring a softly rounded crown with natural 3D volume, gently tapered sides around ears,
    // and textured front layers swept loosely to one side (forehead and eyes 100% clear and visible).

    // Helper to add a smooth curved 3D hair strand tube with generous volume and strand texture
    const addStrand = (pts: [number, number, number][], radius = 0.0058, tubeSegments = 24) => {
      const vectors = pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
      const curve = new THREE.CatmullRomCurve3(vectors);
      const geo = new THREE.TubeGeometry(curve, tubeSegments, radius, 8, false);
      const mesh = new THREE.Mesh(geo, hairMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      hairGroup.add(mesh);
    };

    // 1. Scalp Volume Foundation Strands (dense, overlapping volume strands covering top, temples, crown & nape)
    const baseVolumeStrands: [number, number, number][][] = [
      // Left side scalp volume locks
      [[-0.024, 0.178, 0.076], [-0.054, 0.165, 0.056], [-0.080, 0.130, 0.035]],
      [[-0.024, 0.178, 0.046], [-0.058, 0.166, 0.028], [-0.082, 0.126, 0.010]],
      [[-0.024, 0.176, 0.015], [-0.060, 0.165, -0.002], [-0.084, 0.124, -0.018]],
      [[-0.024, 0.175, -0.015], [-0.056, 0.162, -0.030], [-0.080, 0.122, -0.042]],

      // Right side scalp volume locks
      [[-0.024, 0.178, 0.076], [0.020, 0.180, 0.066], [0.070, 0.158, 0.042]],
      [[-0.024, 0.178, 0.046], [0.024, 0.182, 0.036], [0.074, 0.160, 0.018]],
      [[-0.024, 0.176, 0.015], [0.026, 0.181, 0.005], [0.076, 0.156, -0.012]],
      [[-0.024, 0.175, -0.015], [0.024, 0.179, -0.025], [0.072, 0.152, -0.038]],

      // Rear crown & nape volume locks
      [[0.000, 0.180, -0.035], [0.000, 0.150, -0.062], [0.000, 0.092, -0.068]],
      [[-0.030, 0.178, -0.032], [-0.035, 0.147, -0.058], [-0.033, 0.090, -0.064]],
      [[0.030, 0.178, -0.032], [0.035, 0.147, -0.058], [0.033, 0.090, -0.064]],
    ];
    baseVolumeStrands.forEach((pts) => addStrand(pts, 0.0060));

    // 2. Defined Side Part (originating cleanly at X = -0.024m) & Loosely Swept Textured Fringe
    // Sweeps gently across upper forehead, keeping forehead, eyebrows (y = 0.109m), and eyes (y = 0.088m) 100% clear
    const frontSweptStrands: [number, number, number][][] = [
      // Left side part taper strands (sweeping leftward toward left temple)
      [[-0.024, 0.182, 0.082], [-0.050, 0.162, 0.094], [-0.074, 0.130, 0.068]],
      [[-0.028, 0.184, 0.084], [-0.054, 0.164, 0.096], [-0.077, 0.132, 0.064]],
      [[-0.022, 0.180, 0.080], [-0.046, 0.160, 0.092], [-0.070, 0.128, 0.072]],
      [[-0.031, 0.186, 0.085], [-0.058, 0.166, 0.097], [-0.080, 0.134, 0.060]],

      // Main rightward loose front sweep (flowing softly across upper forehead)
      [[-0.024, 0.182, 0.082], [0.010, 0.166, 0.098], [0.042, 0.146, 0.092]],
      [[-0.020, 0.184, 0.084], [0.016, 0.168, 0.100], [0.046, 0.148, 0.090]],
      [[-0.014, 0.186, 0.086], [0.022, 0.169, 0.101], [0.050, 0.149, 0.088]],
      [[-0.008, 0.187, 0.087], [0.028, 0.170, 0.100], [0.054, 0.150, 0.085]],
      [[-0.023, 0.181, 0.080], [0.006, 0.164, 0.096], [0.038, 0.144, 0.093]],
      [[-0.017, 0.185, 0.085], [0.018, 0.167, 0.100], [0.048, 0.147, 0.089]],
      [[-0.002, 0.188, 0.087], [0.032, 0.171, 0.099], [0.058, 0.149, 0.083]],
    ];
    frontSweptStrands.forEach((pts) => addStrand(pts, 0.0056));

    // 3. Stylish Rounded Crown Volume (convex top dome peaking at Y = 0.208..0.216m following natural head silhouette)
    const crownStrands: [number, number, number][][] = [
      // Left crown layers
      [[-0.024, 0.186, -0.015], [-0.050, 0.208, 0.010], [-0.076, 0.170, 0.040]],
      [[-0.028, 0.188, 0.005], [-0.054, 0.210, 0.022], [-0.080, 0.166, 0.048]],
      [[-0.022, 0.184, -0.030], [-0.046, 0.206, -0.005], [-0.072, 0.170, 0.028]],

      // Right crown layers
      [[-0.024, 0.186, -0.015], [0.012, 0.210, 0.008], [0.060, 0.186, 0.044]],
      [[-0.020, 0.188, 0.000], [0.020, 0.212, 0.018], [0.066, 0.184, 0.048]],
      [[-0.016, 0.189, 0.015], [0.026, 0.210, 0.028], [0.070, 0.180, 0.050]],
      [[-0.012, 0.190, 0.030], [0.032, 0.208, 0.038], [0.074, 0.176, 0.052]],

      // Top peak volume dome layers
      [[-0.005, 0.192, -0.010], [0.000, 0.216, 0.012], [0.048, 0.192, 0.042]],
      [[-0.015, 0.190, -0.020], [-0.010, 0.214, 0.000], [0.038, 0.190, 0.035]],

      // Upper right side transition layers
      [[0.005, 0.188, -0.020], [0.038, 0.206, 0.010], [0.076, 0.170, 0.040]],
      [[0.014, 0.186, -0.008], [0.046, 0.204, 0.018], [0.080, 0.166, 0.046]],
    ];
    crownStrands.forEach((pts) => addStrand(pts, 0.0058));

    // 4. Gently Tapered Side Layers (fitted neatly close to temples and upper ears)
    const sideStrands: [number, number, number][][] = [
      // Left side tapered layers
      [[-0.048, 0.176, 0.038], [-0.078, 0.140, 0.028], [-0.084, 0.094, 0.020]],
      [[-0.054, 0.172, 0.016], [-0.082, 0.136, 0.010], [-0.086, 0.091, 0.006]],
      [[-0.060, 0.168, -0.010], [-0.084, 0.132, -0.014], [-0.088, 0.088, -0.016]],

      // Right side tapered layers
      [[0.048, 0.176, 0.038], [0.078, 0.140, 0.028], [0.084, 0.094, 0.020]],
      [[0.054, 0.172, 0.016], [0.082, 0.136, 0.010], [0.086, 0.091, 0.006]],
      [[0.060, 0.168, -0.010], [0.084, 0.132, -0.014], [0.088, 0.088, -0.016]],
    ];
    sideStrands.forEach((pts) => addStrand(pts, 0.0054));

    // 5. Soft Nape & Rear Taper Strands
    const rearStrands: [number, number, number][][] = [
      [[0.0, 0.180, -0.038], [0.0, 0.140, -0.066], [0.0, 0.086, -0.070]],
      [[-0.022, 0.178, -0.035], [-0.025, 0.138, -0.064], [-0.022, 0.086, -0.068]],
      [[0.022, 0.178, -0.035], [0.025, 0.138, -0.064], [0.022, 0.086, -0.068]],
    ];
    rearStrands.forEach((pts) => addStrand(pts, 0.0054));

  } else if (profile.hairstyle === 'tousled_wavy_crop') {
    // Alex Rivera: Warm chestnut tousled creative waves across the crown and forehead
    const crownBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 24, 18),
      hairMat
    );
    crownBase.scale.set(1.02, 0.58, 1.1);
    crownBase.position.set(0, 0.164, 0.0);

    const curlOffsets: [number, number, number, number, number][] = [
      [-0.032, 0.164, 0.082, 0.036, -0.25],
      [0.0, 0.168, 0.088, 0.038, 0.1],
      [0.034, 0.162, 0.08, 0.035, 0.28],
      [-0.056, 0.155, 0.052, 0.034, -0.4],
      [0.056, 0.155, 0.052, 0.034, 0.4],
      [0.0, 0.182, 0.035, 0.048, 0.05],
    ];
    curlOffsets.forEach(([cx, cy, cz, rad, rotZ]) => {
      const lock = new THREE.Mesh(
        new THREE.SphereGeometry(rad, 14, 12),
        hairMat
      );
      lock.scale.set(1.15, 0.72, 1.25);
      lock.position.set(cx, cy, cz);
      lock.rotation.set(0.32, 0, rotZ);
      hairGroup.add(lock);
    });
    hairGroup.add(crownBase);
  } else if (profile.hairstyle === 'sleek_bun_bangs') {
    // Maya Chen: Sleek jet-black hair with side-swept bangs and a tied rear hair bun
    const sleekCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.097, 24, 18),
      hairMat
    );
    sleekCrown.scale.set(0.98, 0.62, 1.09);
    sleekCrown.position.set(0, 0.156, -0.006);

    // Side-swept front bangs framing the forehead above her wireframe glasses
    const leftBangs = new THREE.Mesh(
      new THREE.SphereGeometry(0.062, 18, 14),
      hairMat
    );
    leftBangs.scale.set(1.12, 0.48, 0.62);
    leftBangs.position.set(0.022, 0.152, 0.076);
    leftBangs.rotation.set(0.28, -0.22, -0.28);

    const rightBangs = new THREE.Mesh(
      new THREE.SphereGeometry(0.054, 18, 14),
      hairMat
    );
    rightBangs.scale.set(1.05, 0.44, 0.58);
    rightBangs.position.set(-0.028, 0.154, 0.074);
    rightBangs.rotation.set(0.28, 0.22, 0.26);

    // Soft temple framing locks past ears
    for (const side of [-1, 1]) {
      const templeLock = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.015, 0.075, 8, 12),
        hairMat
      );
      templeLock.position.set(side * 0.084, 0.068, 0.032);
      templeLock.rotation.set(0.18, 0, side * 0.08);
      hairGroup.add(templeLock);
    }

    // Sculpted rear hair bun + emerald-teal fabric hair scrunchie
    const rearBun = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 18, 16),
      hairMat
    );
    rearBun.scale.set(1.0, 0.95, 1.08);
    rearBun.position.set(0, 0.118, -0.118);

    const hairTie = new THREE.Mesh(
      new THREE.TorusGeometry(0.032, 0.007, 10, 20),
      new THREE.MeshStandardMaterial({
        color: 0x059669,
        roughness: 0.65,
        metalness: 0.05,
      })
    );
    hairTie.position.set(0, 0.118, -0.092);

    hairGroup.add(sleekCrown, leftBangs, rightBangs, rearBun, hairTie);
  } else if (profile.hairstyle === 'textured_crop_fade') {
    // Marcus Vance: Closely cropped textured craftsman fade on top of the crown
    const cropTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 24, 16),
      hairMat
    );
    cropTop.scale.set(0.96, 0.48, 1.05);
    cropTop.position.set(0, 0.16, 0.002);

    const frontLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.115, 0.022, 0.045),
      hairMat
    );
    frontLine.position.set(0, 0.162, 0.074);
    frontLine.rotation.x = 0.18;

    hairGroup.add(cropTop, frontLine);
  } else if (profile.hairstyle === 'shoulder_length_waves') {
    // Priya Sharma & Elena Rostova: Voluminous shoulder-length wavy hair framing the face & collarbones
    const waveCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 24, 18),
      hairMat
    );
    waveCrown.scale.set(1.02, 0.62, 1.1);
    waveCrown.position.set(0, 0.158, -0.005);

    // Side-parted sweeping front wave
    const frontSweep = new THREE.Mesh(
      new THREE.SphereGeometry(0.066, 18, 14),
      hairMat
    );
    frontSweep.scale.set(1.18, 0.46, 0.65);
    frontSweep.position.set(0.018, 0.158, 0.074);
    frontSweep.rotation.set(0.24, -0.18, -0.22);

    // Left & right cascading shoulder waves framing the jawline down to y = -0.085
    for (const side of [-1, 1]) {
      const upperWave = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.028, 0.12, 10, 14),
        hairMat
      );
      upperWave.scale.set(0.78, 1.0, 1.15);
      upperWave.position.set(side * 0.088, 0.055, 0.008);
      upperWave.rotation.set(0.12, 0, side * -0.08);

      const lowerWave = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.025, 0.11, 10, 14),
        hairMat
      );
      lowerWave.scale.set(0.82, 1.0, 1.1);
      lowerWave.position.set(side * 0.092, -0.032, 0.022);
      lowerWave.rotation.set(0.22, side * 0.15, side * 0.12);

      // Subtle metallic stud earring on each earlobe
      const earring = new THREE.Mesh(
        new THREE.SphereGeometry(0.0048, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0xfde68a,
          roughness: 0.18,
          metalness: 0.92,
        })
      );
      earring.position.set(side * 0.093, 0.048, 0.012);

      hairGroup.add(upperWave, lowerWave, earring);
    }

    // Full back hair drape covering the nape
    const backDrape = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.068, 0.14, 12, 16),
      hairMat
    );
    backDrape.scale.set(1.15, 1.0, 0.55);
    backDrape.position.set(0, 0.025, -0.068);
    backDrape.rotation.x = 0.12;

    hairGroup.add(waveCrown, frontSweep, backDrape);
  } else {
    // David Chen ('neat_executive_part'): Clean side-parted hair with neat temple taper
    const execCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.096, 24, 18),
      hairMat
    );
    execCrown.scale.set(0.98, 0.52, 1.06);
    execCrown.position.set(0, 0.16, 0);

    const execSweep = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 18, 14),
      hairMat
    );
    execSweep.scale.set(1.15, 0.36, 0.66);
    execSweep.position.set(0.015, 0.166, 0.072);
    execSweep.rotation.set(0.18, -0.15, -0.14);

    hairGroup.add(execCrown, execSweep);
  }

  headFeatureGroup.add(hairGroup);

  // 3. Eyewear (Wireframe Round Glasses for Maya Chen, Rectangular Titanium for David Chen)
  if (profile.eyewear !== 'none') {
    const glassesGroup = new THREE.Group();
    glassesGroup.name = `eyewear_${profile.eyewear}`;
    const frameMat = new THREE.MeshStandardMaterial({
      color: profile.eyewear === 'wireframe_round' ? 0xcbd5e1 : 0x334155,
      roughness: 0.22,
      metalness: 0.88,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.18,
      roughness: 0.08,
      metalness: 0.1,
    });

    for (const side of [-1, 1]) {
      const lx = side * 0.032;
      const ly = 0.088;
      const lz = 0.111;

      if (profile.eyewear === 'wireframe_round') {
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(0.019, 0.0018, 10, 24),
          frameMat
        );
        rim.position.set(lx, ly, lz);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.018, 20), lensMat);
        lens.position.set(lx, ly, lz + 0.0005);
        glassesGroup.add(rim, lens);
      } else {
        const topBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.038, 0.0028, 0.0028),
          frameMat
        );
        topBar.position.set(lx, ly + 0.012, lz);
        const bottomRim = new THREE.Mesh(
          new THREE.BoxGeometry(0.036, 0.0014, 0.002),
          frameMat
        );
        bottomRim.position.set(lx, ly - 0.011, lz);
        const lens = new THREE.Mesh(
          new THREE.PlaneGeometry(0.035, 0.022),
          lensMat
        );
        lens.position.set(lx, ly, lz + 0.0005);
        glassesGroup.add(topBar, bottomRim, lens);
      }

      // Temple arm back to ear
      const templeArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.0022, 0.0026, 0.088),
        frameMat
      );
      templeArm.position.set(side * 0.052, ly + 0.004, lz - 0.042);
      templeArm.rotation.y = side * -0.08;
      glassesGroup.add(templeArm);
    }

    // Nose bridge bar
    const bridge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0016, 0.0016, 0.016, 8),
      frameMat
    );
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.091, 0.112);
    glassesGroup.add(bridge);

    headFeatureGroup.add(glassesGroup);
  }

  headBone.add(headFeatureGroup);
  return { leftBrow, rightBrow };
}

/**
 * Attaches character-specific 3D wardrobe details (hoodie hood & backpack for Maya,
 * ribbed turtleneck for Priya/Elena, security ID badge lanyard for David, chest pockets
 * for Marcus, field satchel & watch for Investigator) to the humanoid skeleton bones.
 */
function attachCharacterWardrobeDetails(
  bones: {
    spine1: THREE.Bone | null;
    spine2: THREE.Bone | null;
    neck: THREE.Bone | null;
    hips: THREE.Bone | null;
    leftForeArm: THREE.Bone | null;
  },
  profile: CharacterArchetypeProfile,
  jacketMat: THREE.MeshStandardMaterial,
  innerShirtMat: THREE.MeshStandardMaterial
) {
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x1c1613,
    roughness: 0.64,
    metalness: 0.08,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xb4833e,
    roughness: 0.32,
    metalness: 0.8,
  });

  if (profile.garmentDetail === 'investigator_coat') {
    // Tailored field trench coat: Keep clean lines with no bulky hip satchel or wrist accessories
    // ensuring the investigator's left hand and hips remain completely clean with no duplicate props.
  } else if (profile.garmentDetail === 'student_hoodie_backpack') {
    // Maya Chen: Sculpted fleece hoodie hood resting behind neck + canvas student backpack
    if (bones.spine2) {
      const hoodieGroup = new THREE.Group();
      const hoodRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.034, 12, 24, Math.PI * 1.35),
        jacketMat
      );
      hoodRing.rotation.set(Math.PI / 2 + 0.28, 0, Math.PI * 0.82);
      hoodRing.position.set(0, 0.21, -0.025);

      // Canvas student backpack on upper back
      const canvasPackMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.86,
        metalness: 0.04,
      });
      const packBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.31, 0.11),
        canvasPackMat
      );
      packBody.position.set(0, 0.05, -0.155);
      packBody.castShadow = true;

      const packPocket = new THREE.Mesh(
        new THREE.BoxGeometry(0.19, 0.14, 0.035),
        leatherMat
      );
      packPocket.position.set(0, -0.01, -0.215);

      hoodieGroup.add(hoodRing, packBody, packPocket);
      bones.spine2.add(hoodieGroup);
    }
  } else if (profile.garmentDetail === 'designer_blazer_turtleneck') {
    // Priya Sharma & Elena Rostova: High ribbed turtleneck collar around neck
    if (bones.neck) {
      const turtleneck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.058, 0.066, 0.068, 20),
        innerShirtMat
      );
      turtleneck.position.set(0, 0.028, 0.006);
      bones.neck.add(turtleneck);
    }
  } else if (profile.garmentDetail === 'security_liaison_lanyard') {
    // David Chen: Cybersecurity Operations ID Badge & Lanyard on chest
    if (bones.spine2) {
      const lanyardGroup = new THREE.Group();
      const strapMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.6,
      });
      for (const side of [-1, 1]) {
        const ribbon = new THREE.Mesh(
          new THREE.BoxGeometry(0.008, 0.19, 0.004),
          strapMat
        );
        ribbon.position.set(side * 0.026, 0.11, 0.138);
        ribbon.rotation.z = side * 0.14;
        ribbon.rotation.x = -0.12;
        lanyardGroup.add(ribbon);
      }
      const badgeHolder = new THREE.Mesh(
        new THREE.BoxGeometry(0.052, 0.074, 0.006),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.25,
          metalness: 0.1,
        })
      );
      badgeHolder.position.set(0, -0.01, 0.148);
      const badgeHeader = new THREE.Mesh(
        new THREE.BoxGeometry(0.046, 0.016, 0.007),
        strapMat
      );
      badgeHeader.position.set(0, 0.016, 0.149);
      lanyardGroup.add(badgeHolder, badgeHeader);
      bones.spine2.add(lanyardGroup);
    }
  } else if (profile.garmentDetail === 'craftsman_chore_coat') {
    // Marcus Vance: Stitched workwear utility pockets on chest
    if (bones.spine2) {
      const pocketGroup = new THREE.Group();
      for (const side of [-1, 1]) {
        const pocket = new THREE.Mesh(
          new THREE.BoxGeometry(0.068, 0.078, 0.012),
          jacketMat
        );
        pocket.position.set(side * 0.088, 0.055, 0.136);
        const button = new THREE.Mesh(
          new THREE.CylinderGeometry(0.005, 0.005, 0.004, 10),
          brassMat
        );
        button.rotation.x = Math.PI / 2;
        button.position.set(side * 0.088, 0.078, 0.143);
        pocketGroup.add(pocket, button);
      }
      bones.spine2.add(pocketGroup);
    }
  }
}

/**
 * Creates a detailed 3D handheld smartphone prop attached to the character's RightHand bone.
 * In the Investigator's two-handed lowered grip:
 * - The +Z face of phoneGroup points outward toward the front viewer, showing the BACK of the phone
 *   (frosted midnight-slate rear glass, raised camera island, metallic triple camera rings, LED flash, and emblem).
 * - The -Z face of phoneGroup points inward toward the character, displaying the lit AMOLED delivery-scam message screen.
 */
function createHandHeldPhoneProp(): {
  phoneGroup: THREE.Group;
  screenGlowLight: THREE.PointLight;
} {
  const phoneGroup = new THREE.Group();
  phoneGroup.name = 'investigatorHeldPhone';

  const phoneW = 0.076;
  const phoneH = 0.156;
  const phoneD = 0.01;

  // 1. Slim Dark Anodized Aluminum & Brushed Titanium Frame
  const chassisGeo = new THREE.BoxGeometry(phoneW, phoneH, phoneD);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.28,
    metalness: 0.84,
  });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  chassis.frustumCulled = false;
  phoneGroup.add(chassis);

  // Metallic outer chamfer rim so the phone silhouette and edges catch light clearly with razor-sharp contrast against dark jacket
  const rimGeo = new THREE.BoxGeometry(
    phoneW + 0.0036,
    phoneH + 0.0036,
    phoneD - 0.0018
  );
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.14,
    metalness: 0.96,
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.frustumCulled = false;
  phoneGroup.add(rimMesh);

  // Side tactile power & volume buttons along the frame edges
  const buttonMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.16,
    metalness: 0.94,
  });
  const powerBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.0028, 0.018, 0.004),
    buttonMat
  );
  powerBtn.position.set(phoneW / 2 + 0.0018, 0.024, 0);
  powerBtn.frustumCulled = false;

  const volUpBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.0028, 0.016, 0.004),
    buttonMat
  );
  volUpBtn.position.set(-phoneW / 2 - 0.0018, 0.032, 0);
  volUpBtn.frustumCulled = false;

  const volDownBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.0028, 0.016, 0.004),
    buttonMat
  );
  volDownBtn.position.set(-phoneW / 2 - 0.0018, 0.01, 0);
  volDownBtn.frustumCulled = false;
  phoneGroup.add(powerBtn, volUpBtn, volDownBtn);

  // 2. BACK OF THE PHONE (+Z outward face — clearly visible from front / Dossier view)
  const backGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(phoneW - 0.002, phoneH - 0.002),
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.22,
      metalness: 0.65,
    })
  );
  backGlass.position.z = phoneD / 2 + 0.0006;
  backGlass.frustumCulled = false;
  phoneGroup.add(backGlass);

  const backSheen = new THREE.Mesh(
    new THREE.PlaneGeometry(phoneW - 0.005, phoneH - 0.005),
    new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.12,
    })
  );
  backSheen.position.z = phoneD / 2 + 0.0008;
  backSheen.frustumCulled = false;
  phoneGroup.add(backSheen);

  // Raised Camera Island (Upper-left of the back of the phone)
  const islandW = 0.033;
  const islandH = 0.047;
  const islandX = -phoneW / 2 + islandW / 2 + 0.006;
  const islandY = phoneH / 2 - islandH / 2 - 0.006;

  const camIslandBezel = new THREE.Mesh(
    new THREE.BoxGeometry(islandW + 0.0025, islandH + 0.0025, 0.0026),
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.95,
    })
  );
  camIslandBezel.position.set(islandX, islandY, phoneD / 2 + 0.0013);
  camIslandBezel.frustumCulled = false;
  phoneGroup.add(camIslandBezel);

  const camIsland = new THREE.Mesh(
    new THREE.BoxGeometry(islandW, islandH, 0.0034),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.12,
      metalness: 0.88,
    })
  );
  camIsland.position.set(islandX, islandY, phoneD / 2 + 0.0018);
  camIsland.frustumCulled = false;
  phoneGroup.add(camIsland);

  // Three Pro Camera Lenses (Bright Metallic Outer Rings + Deep Sapphire Optics)
  const ringCylinderGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.0044, 20);
  ringCylinderGeo.rotateX(Math.PI / 2);
  const ringCylinderMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.12,
    metalness: 0.98,
  });

  const opticCylinderGeo = new THREE.CylinderGeometry(0.0049, 0.0049, 0.0048, 20);
  opticCylinderGeo.rotateX(Math.PI / 2);
  const opticCylinderMat = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.06,
    metalness: 0.98,
  });

  const lensPositions: [number, number][] = [
    [islandX - 0.007, islandY + 0.012],
    [islandX - 0.007, islandY - 0.012],
    [islandX + 0.0075, islandY],
  ];

  lensPositions.forEach(([lx, ly]) => {
    const ring = new THREE.Mesh(ringCylinderGeo, ringCylinderMat);
    ring.position.set(lx, ly, phoneD / 2 + 0.0023);
    ring.frustumCulled = false;

    const optic = new THREE.Mesh(opticCylinderGeo, opticCylinderMat);
    optic.position.set(lx, ly, phoneD / 2 + 0.0025);
    optic.frustumCulled = false;

    phoneGroup.add(ring, optic);
  });

  // LED Flash & LiDAR Sensor on Camera Island
  const flashGeo = new THREE.CylinderGeometry(0.0033, 0.0033, 0.0044, 16);
  flashGeo.rotateX(Math.PI / 2);
  const flashMesh = new THREE.Mesh(
    flashGeo,
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  flashMesh.position.set(islandX + 0.0075, islandY + 0.013, phoneD / 2 + 0.0024);
  flashMesh.frustumCulled = false;

  const lidarMesh = new THREE.Mesh(
    flashGeo,
    new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.18,
      metalness: 0.85,
    })
  );
  lidarMesh.position.set(islandX + 0.0075, islandY - 0.013, phoneD / 2 + 0.0023);
  lidarMesh.frustumCulled = false;
  phoneGroup.add(flashMesh, lidarMesh);

  // Subtle Metallic Emblem Circle on Center Back of Phone
  const emblemGeo = new THREE.RingGeometry(0.0055, 0.0088, 24);
  const emblemMesh = new THREE.Mesh(
    emblemGeo,
    new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide })
  );
  emblemMesh.position.set(0, -0.006, phoneD / 2 + 0.0009);
  emblemMesh.frustumCulled = false;
  phoneGroup.add(emblemMesh);

  // 3. LIT FRONT SCREEN (-Z inward face — facing palm and investigator)
  const screenTex =
    ProceduralTextureGenerator.createCaseDeliveryMessageScreenTexture();
  const screenGeo = new THREE.PlaneGeometry(phoneW - 0.006, phoneH - 0.008);
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTex,
  });
  const frontScreen = new THREE.Mesh(screenGeo, screenMat);
  frontScreen.rotation.y = Math.PI;
  frontScreen.position.z = -phoneD / 2 - 0.0006;
  frontScreen.frustumCulled = false;
  phoneGroup.add(frontScreen);

  const screenGlowLight = new THREE.PointLight(0xfffbeb, 0.12, 0.45, 2.0);
  screenGlowLight.position.set(0, 0.02, -0.05);
  phoneGroup.add(screenGlowLight);

  // 4. One-Handed Grip Transform in RightHand Local Space:
  // Positioned in portrait orientation centered in right palm (Y = 0.078m), top edge angled slightly toward floor, back facing camera (+Z)
  phoneGroup.position.set(0.012, 0.078, 0.024);
  phoneGroup.rotation.set(-1.86, -0.16, -1.52);

  return { phoneGroup, screenGlowLight };
}

/**
 * Creates a complete, articulated 3D human character from Scam Sleuth's crime-drama world
 * with believable adult proportions, expressive sculpted facial features, detailed skin and
 * multi-part 3D hair, natural layered clothing with visible fabric weave and folds, and
 * full animations for idle, walking, turning, listening, speaking, and phone interaction.
 */
export function createHumanCharacter(
  config: HumanCharacterConfig
): HumanCharacterInstance {
  const profile = resolveCharacterArchetype(config);
  const rootGroup = new THREE.Group();
  rootGroup.name = `human_character_${config.id}`;

  const skinHex = config.skinHex || profile.skinHex;
  const hairHex = config.hairHex || profile.hairHex;
  const irisHex = config.irisHex || profile.irisHex;
  const jacketHex = config.jacketHex || profile.jacketHex;
  const innerShirtHex = config.innerShirtHex || profile.innerShirtHex;
  const trousersHex = config.trousersHex || profile.trousersHex;
  const shoesHex = config.shoesHex || profile.shoesHex;

  // 1. Ground Contact Shadow under shoes
  const shadowMat = new THREE.MeshBasicMaterial({
    map: getCachedContactShadowTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0.72,
  });
  const groundShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.88, 0.68),
    shadowMat
  );
  groundShadow.rotateX(-Math.PI / 2);
  groundShadow.position.set(0, 0.003, 0);
  groundShadow.name = 'contactGroundShadow';
  rootGroup.add(groundShadow);

  // 2. Grounded Environmental Character Lighting (ensures faces, hair, and cloth folds read clearly)
  if (config.isNpc) {
    const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(profile.accentHex),
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      opacity: 0.25,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.position.y = 0.005;
    floorRing.name = 'targetHighlightRing';
    rootGroup.add(floorRing);

    const npcKeyLight = new THREE.PointLight(0xfff3e0, 1.15, 4.2, 1.8);
    npcKeyLight.position.set(0.28, 2.02, 0.78);
    const npcRimLight = new THREE.PointLight(0x93c5fd, 0.55, 3.0, 1.9);
    npcRimLight.position.set(-0.32, 1.85, -0.65);
    rootGroup.add(npcKeyLight, npcRimLight);
  } else {
    const invKeyLight = new THREE.PointLight(0xfde68a, 0.9, 3.4, 1.9);
    invKeyLight.position.set(-0.35, 1.95, 0.58);
    const invRimLight = new THREE.PointLight(0x93c5fd, 0.68, 3.0, 1.9);
    invRimLight.position.set(0.32, 1.85, -0.65);
    rootGroup.add(invKeyLight, invRimLight);
  }

  // 3. Humanoid Skeleton & Mesh State
  let characterModel: THREE.Group | null = null;
  let heldPhoneGroup: THREE.Group | null = null;
  let heldPhoneLight: THREE.PointLight | null = null;
  let leftBrowMesh: THREE.Mesh | null = null;
  let rightBrowMesh: THREE.Mesh | null = null;

  const bones = {
    hips: null as THREE.Bone | null,
    spine: null as THREE.Bone | null,
    spine1: null as THREE.Bone | null,
    spine2: null as THREE.Bone | null,
    neck: null as THREE.Bone | null,
    head: null as THREE.Bone | null,
    leftEye: null as THREE.Bone | null,
    rightEye: null as THREE.Bone | null,
    leftShoulder: null as THREE.Bone | null,
    leftArm: null as THREE.Bone | null,
    leftForeArm: null as THREE.Bone | null,
    leftHand: null as THREE.Bone | null,
    rightShoulder: null as THREE.Bone | null,
    rightArm: null as THREE.Bone | null,
    rightForeArm: null as THREE.Bone | null,
    rightHand: null as THREE.Bone | null,
    leftUpLeg: null as THREE.Bone | null,
    leftLeg: null as THREE.Bone | null,
    leftFoot: null as THREE.Bone | null,
    rightUpLeg: null as THREE.Bone | null,
    rightLeg: null as THREE.Bone | null,
    rightFoot: null as THREE.Bone | null,
  };

  const rightGripFingers: {
    j1: THREE.Bone | null;
    j2: THREE.Bone | null;
    j3: THREE.Bone | null;
  }[] = [];

  const rightThumbBones = {
    t1: null as THREE.Bone | null,
    t2: null as THREE.Bone | null,
    t3: null as THREE.Bone | null,
  };

  const leftGripFingers: {
    j1: THREE.Bone | null;
    j2: THREE.Bone | null;
    j3: THREE.Bone | null;
  }[] = [];

  const leftThumbBones = {
    t1: null as THREE.Bone | null,
    t2: null as THREE.Bone | null,
    t3: null as THREE.Bone | null,
  };

  const baseQuaternions = new Map<THREE.Bone, THREE.Quaternion>();
  const basePositions = new Map<THREE.Bone, THREE.Vector3>();
  const morphMeshes: {
    mesh: THREE.SkinnedMesh;
    mouthOpenIndex?: number;
    mouthSmileIndex?: number;
  }[] = [];

  let animTimeAcc = config.isNpc ? Math.random() * 18 : 0;
  let walkCyclePhase = 0;

  function attachModel(sourceScene: THREE.Group) {
    const cloned = SkeletonUtils.clone(sourceScene) as THREE.Group;
    characterModel = cloned;
    cloned.position.set(0, 0, 0);
    cloned.rotation.set(0, 0, 0);
    cloned.scale.set(...profile.bodyScale);

    // Prepare calibrated PBR materials with procedural fabric weave & hair strand maps
    const hairStrandTex = getCachedHairTexture(hairHex);
    const hairMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hairHex),
      map: hairStrandTex,
      roughness: 0.78,
      metalness: 0.03,
    });

    const jacketClothTex = getCachedFabricTexture(
      jacketHex,
      Boolean(profile.isDenimJacket)
    );
    const innerShirtClothTex = getCachedFabricTexture(innerShirtHex, false);
    const trousersClothTex = getCachedFabricTexture(trousersHex, true);
    const irisTex = getCachedIrisTexture(irisHex);

    let topSkinnedMesh: THREE.SkinnedMesh | null = null;
    let headSkinnedMesh: THREE.SkinnedMesh | null = null;
    let headwearSkinnedMesh: THREE.SkinnedMesh | null = null;
    let outerJacketMatRef: THREE.MeshStandardMaterial | null = null;
    let innerShirtMatRef: THREE.MeshStandardMaterial | null = null;

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;

        const origMat = mesh.material as THREE.MeshStandardMaterial;
        const mat = origMat ? origMat.clone() : new THREE.MeshStandardMaterial();
        mesh.material = mat;
        const matName = mat.name || '';

        if (mesh.name === 'Wolf3D_Beard' || matName === 'Wolf3D_Beard') {
          // Hide the legacy Victorian handlebar mustache completely; we replace it below
          // with an anatomical short boxed beard extracted from the character's jaw/chin!
          mesh.visible = false;
        } else if (
          mesh.name === 'Wolf3D_Outfit_Top' ||
          matName === 'Wolf3D_Outfit_Top'
        ) {
          topSkinnedMesh = mesh;
        } else if (
          mesh.name === 'Wolf3D_Outfit_Bottom' ||
          matName === 'Wolf3D_Outfit_Bottom'
        ) {
          // Tailored trousers / chinos / denim with preserved normal crease maps + fabric weave
          mat.map = trousersClothTex;
          mat.color.set(0xffffff);
          mat.roughness = 0.84;
          mat.metalness = 0.02;
          if (mat.normalScale) mat.normalScale.set(1.25, 1.25);
        } else if (
          mesh.name === 'Wolf3D_Outfit_Footwear' ||
          matName === 'Wolf3D_Outfit_Footwear'
        ) {
          mat.color.set(shoesHex);
        } else if (
          mesh.name === 'Wolf3D_Headwear' ||
          mesh.name === 'Mesh' ||
          matName === 'Wolf3D_Headwear'
        ) {
          headwearSkinnedMesh = mesh;
          if (profile.archetype === 'investigator') {
            mesh.visible = false;
          }
        } else if (
          mesh.name === 'EyeLeft' ||
          mesh.name === 'EyeRight' ||
          matName === 'Wolf3D_Eye'
        ) {
          mat.map = irisTex;
          mat.color.set(0xffffff);
          mat.roughness = 0.12;
          mat.metalness = 0.05;
        } else if (
          mesh.name === 'Wolf3D_Head' ||
          mesh.name === 'Wolf3D_Body' ||
          matName === 'Wolf3D_Skin' ||
          matName === 'Wolf3D_Body'
        ) {
          // Preserve baked photographic skin pore/facial detail texture while tinting to the character's complexion
          mat.color.set(skinHex).lerp(new THREE.Color(0xffffff), 0.58);
          mat.roughness = 0.62;
          mat.metalness = 0.01;
          if (mesh.name === 'Wolf3D_Head') {
            headSkinnedMesh = mesh;
          }
        }

        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          const dict = mesh.morphTargetDictionary;
          if (
            dict['mouthOpen'] !== undefined ||
            dict['mouthSmile'] !== undefined
          ) {
            morphMeshes.push({
              mesh,
              mouthOpenIndex: dict['mouthOpen'],
              mouthSmileIndex: dict['mouthSmile'],
            });
          }
        }
      }
    });

    // 1) Hide the legacy bowler/cowboy hat mesh (Wolf3D_Headwear) for the investigator
    // so no flat-topped hat brim or block-shaped cutouts appear on his head.
    if (headwearSkinnedMesh) {
      const hwMesh = headwearSkinnedMesh as THREE.SkinnedMesh;
      if (profile.archetype === 'investigator') {
        hwMesh.visible = false;
        if (hwMesh.parent) {
          hwMesh.parent.remove(hwMesh);
        }
      } else {
        hwMesh.geometry = stripHatFromHeadwearGeometry(hwMesh.geometry);
        hwMesh.material = hairMat;
        hwMesh.visible = true;
      }
    }

    // 2) Decompose Wolf3D_Outfit_Top into OuterJacketSkinnedMesh + InnerShirtSkinnedMesh
    //    (removing the wedding bow tie, lapel flower, and tuxedo coattails)
    if (topSkinnedMesh) {
      const tMesh = topSkinnedMesh as THREE.SkinnedMesh;
      const baseTopMat = tMesh.material as THREE.MeshStandardMaterial;
      const { outerJacketGeo, innerShirtGeo } = decomposeAndTailorOutfitTop(
        tMesh.geometry,
        profile
      );

      const outerMat = baseTopMat.clone();
      outerMat.map = jacketClothTex;
      outerMat.color.set(0xffffff);
      outerMat.roughness = profile.isDenimJacket ? 0.78 : 0.84;
      outerMat.metalness = 0.03;
      if (outerMat.normalScale) outerMat.normalScale.set(1.35, 1.35);
      outerJacketMatRef = outerMat;

      tMesh.geometry = outerJacketGeo;
      tMesh.material = outerMat;

      const innerMat = baseTopMat.clone();
      innerMat.map = innerShirtClothTex;
      innerMat.color.set(0xffffff);
      innerMat.roughness = 0.88;
      innerMat.metalness = 0.01;
      innerShirtMatRef = innerMat;

      const innerShirtMesh = new THREE.SkinnedMesh(innerShirtGeo, innerMat);
      innerShirtMesh.name = 'Wolf3D_Inner_Shirt';
      innerShirtMesh.castShadow = true;
      innerShirtMesh.receiveShadow = true;
      innerShirtMesh.frustumCulled = false;
      innerShirtMesh.bind(tMesh.skeleton, tMesh.bindMatrix);
      if (tMesh.parent) {
        tMesh.parent.add(innerShirtMesh);
      }
    }

    // 3) Sculpt character-specific facial bone proportions on Wolf3D_Head and extract
    //    anatomical ScalpHairSkinnedMesh & FacialHairSkinnedMesh (short boxed beard)
    if (headSkinnedMesh) {
      const hMesh = headSkinnedMesh as THREE.SkinnedMesh;
      const sculptedHeadGeo = sculptCharacterFaceGeometry(
        hMesh.geometry,
        profile
      );
      hMesh.geometry = sculptedHeadGeo;

      const { scalpGeo, beardGeo } = buildAnatomicalScalpAndBeardGeometries(
        sculptedHeadGeo,
        profile
      );

      const scalpMesh = new THREE.SkinnedMesh(scalpGeo, hairMat);
      scalpMesh.name = 'Anatomical_Scalp_Hair';
      scalpMesh.castShadow = true;
      scalpMesh.receiveShadow = true;
      scalpMesh.frustumCulled = false;
      scalpMesh.bind(hMesh.skeleton, hMesh.bindMatrix);
      scalpMesh.visible = true;
      if (hMesh.parent) {
        hMesh.parent.add(scalpMesh);
      }

      if (beardGeo) {
        const beardMat = hairMat.clone();
        beardMat.roughness = 0.88;
        const beardSkinnedMesh = new THREE.SkinnedMesh(beardGeo, beardMat);
        beardSkinnedMesh.name = 'Anatomical_Short_Boxed_Beard';
        beardSkinnedMesh.castShadow = true;
        beardSkinnedMesh.receiveShadow = true;
        beardSkinnedMesh.frustumCulled = false;
        beardSkinnedMesh.morphTargetDictionary = hMesh.morphTargetDictionary
          ? { ...hMesh.morphTargetDictionary }
          : undefined;
        beardSkinnedMesh.morphTargetInfluences = hMesh.morphTargetInfluences
          ? [...hMesh.morphTargetInfluences]
          : undefined;
        beardSkinnedMesh.bind(hMesh.skeleton, hMesh.bindMatrix);
        if (hMesh.parent) {
          hMesh.parent.add(beardSkinnedMesh);
        }
        if (beardSkinnedMesh.morphTargetDictionary) {
          morphMeshes.push({
            mesh: beardSkinnedMesh,
            mouthOpenIndex: beardSkinnedMesh.morphTargetDictionary['mouthOpen'],
            mouthSmileIndex:
              beardSkinnedMesh.morphTargetDictionary['mouthSmile'],
          });
        }
      }
    }

    // Map Humanoid Skeleton Bones
    bones.hips = cloned.getObjectByName('Hips') as THREE.Bone | null;
    bones.spine = cloned.getObjectByName('Spine') as THREE.Bone | null;
    bones.spine1 = cloned.getObjectByName('Spine1') as THREE.Bone | null;
    bones.spine2 = cloned.getObjectByName('Spine2') as THREE.Bone | null;
    bones.neck = cloned.getObjectByName('Neck') as THREE.Bone | null;
    bones.head = cloned.getObjectByName('Head') as THREE.Bone | null;
    bones.leftEye = cloned.getObjectByName('LeftEye') as THREE.Bone | null;
    bones.rightEye = cloned.getObjectByName('RightEye') as THREE.Bone | null;
    bones.leftShoulder = cloned.getObjectByName(
      'LeftShoulder'
    ) as THREE.Bone | null;
    bones.leftArm = cloned.getObjectByName('LeftArm') as THREE.Bone | null;
    bones.leftForeArm = cloned.getObjectByName(
      'LeftForeArm'
    ) as THREE.Bone | null;
    bones.leftHand = cloned.getObjectByName('LeftHand') as THREE.Bone | null;
    bones.rightShoulder = cloned.getObjectByName(
      'RightShoulder'
    ) as THREE.Bone | null;
    bones.rightArm = cloned.getObjectByName('RightArm') as THREE.Bone | null;
    bones.rightForeArm = cloned.getObjectByName(
      'RightForeArm'
    ) as THREE.Bone | null;
    bones.rightHand = cloned.getObjectByName('RightHand') as THREE.Bone | null;
    bones.leftUpLeg = cloned.getObjectByName('LeftUpLeg') as THREE.Bone | null;
    bones.leftLeg = cloned.getObjectByName('LeftLeg') as THREE.Bone | null;
    bones.leftFoot = cloned.getObjectByName('LeftFoot') as THREE.Bone | null;
    bones.rightUpLeg = cloned.getObjectByName(
      'RightUpLeg'
    ) as THREE.Bone | null;
    bones.rightLeg = cloned.getObjectByName('RightLeg') as THREE.Bone | null;
    bones.rightFoot = cloned.getObjectByName('RightFoot') as THREE.Bone | null;

    // Collect articulated 3-joint finger chains for wrapping BOTH hands around the phone's edges
    ['Index', 'Middle', 'Ring', 'Pinky'].forEach((finger) => {
      const r1 = cloned.getObjectByName(
        `RightHand${finger}1`
      ) as THREE.Bone | null;
      const r2 = cloned.getObjectByName(
        `RightHand${finger}2`
      ) as THREE.Bone | null;
      const r3 = cloned.getObjectByName(
        `RightHand${finger}3`
      ) as THREE.Bone | null;
      rightGripFingers.push({ j1: r1, j2: r2, j3: r3 });
      [r1, r2, r3].forEach((b) => {
        if (b) baseQuaternions.set(b, b.quaternion.clone());
      });

      const l1 = cloned.getObjectByName(
        `LeftHand${finger}1`
      ) as THREE.Bone | null;
      const l2 = cloned.getObjectByName(
        `LeftHand${finger}2`
      ) as THREE.Bone | null;
      const l3 = cloned.getObjectByName(
        `LeftHand${finger}3`
      ) as THREE.Bone | null;
      leftGripFingers.push({ j1: l1, j2: l2, j3: l3 });
      [l1, l2, l3].forEach((b) => {
        if (b) baseQuaternions.set(b, b.quaternion.clone());
      });
    });

    // Collect thumb joints for both hands
    rightThumbBones.t1 = cloned.getObjectByName(
      'RightHandThumb1'
    ) as THREE.Bone | null;
    rightThumbBones.t2 = cloned.getObjectByName(
      'RightHandThumb2'
    ) as THREE.Bone | null;
    rightThumbBones.t3 = cloned.getObjectByName(
      'RightHandThumb3'
    ) as THREE.Bone | null;
    [rightThumbBones.t1, rightThumbBones.t2, rightThumbBones.t3].forEach(
      (b) => {
        if (b) baseQuaternions.set(b, b.quaternion.clone());
      }
    );

    leftThumbBones.t1 = cloned.getObjectByName(
      'LeftHandThumb1'
    ) as THREE.Bone | null;
    leftThumbBones.t2 = cloned.getObjectByName(
      'LeftHandThumb2'
    ) as THREE.Bone | null;
    leftThumbBones.t3 = cloned.getObjectByName(
      'LeftHandThumb3'
    ) as THREE.Bone | null;
    [leftThumbBones.t1, leftThumbBones.t2, leftThumbBones.t3].forEach((b) => {
      if (b) baseQuaternions.set(b, b.quaternion.clone());
    });

    // Store bind-pose quaternions and positions for gimbal-free skeletal animation
    Object.values(bones).forEach((b) => {
      if (b) {
        baseQuaternions.set(b, b.quaternion.clone());
        basePositions.set(b, b.position.clone());
      }
    });

    // Attach 3D Hairstyle, Eyebrows & Eyewear to Head bone
    if (bones.head) {
      const { leftBrow, rightBrow } = attachHeadFeaturesAndHair(
        bones.head,
        profile,
        hairMat
      );
      leftBrowMesh = leftBrow;
      rightBrowMesh = rightBrow;
    }

    // Attach 3D smartphone to RightHand bone (character's anatomical right hand, on left side of image when facing camera)
    if (bones.rightHand) {
      const { phoneGroup, screenGlowLight } = createHandHeldPhoneProp();
      phoneGroup.visible = !config.isNpc;
      bones.rightHand.add(phoneGroup);
      heldPhoneGroup = phoneGroup;
      heldPhoneLight = screenGlowLight;
    }

    // Attach character-specific wardrobe details (hoodie hood, backpack, turtleneck, lanyard, pockets, satchel, watch)
    attachCharacterWardrobeDetails(
      {
        spine1: bones.spine1,
        spine2: bones.spine2,
        neck: bones.neck,
        hips: bones.hips,
        leftForeArm: bones.leftForeArm,
      },
      profile,
      outerJacketMatRef ||
        new THREE.MeshStandardMaterial({ color: jacketHex, roughness: 0.8 }),
      innerShirtMatRef ||
        new THREE.MeshStandardMaterial({ color: innerShirtHex, roughness: 0.85 })
    );

    rootGroup.add(cloned);

    // Apply initial stance immediately
    applySkeletalPose(0.2, 0, {
      isInspectingPhone: !config.isNpc,
      showPhoneInHand: !config.isNpc,
      cameraFacingMode: 'front',
    });
  }

  if (cachedGltfScene) {
    attachModel(cachedGltfScene);
  } else {
    preloadHumanModel().then((scene) => {
      if (!characterModel) {
        attachModel(scene);
      }
    });
  }

  /**
   * Applies local Euler offset (rx, ry, rz) relative to a bone's bind quaternion
   * and smoothly slerps toward it.
   */
  function slerpBoneOffset(
    bone: THREE.Bone | null,
    rx: number,
    ry: number,
    rz: number,
    alpha: number
  ) {
    if (!bone) return;
    const baseQ = baseQuaternions.get(bone);
    if (!baseQ) return;
    _euler.set(rx, ry, rz, 'XYZ');
    _quat.setFromEuler(_euler);
    _targetQuat.copy(baseQ).multiply(_quat);
    bone.quaternion.slerp(_targetQuat, alpha);
  }

  function applySkeletalPose(
    delta: number,
    _currentTime: number,
    options?: HumanCharacterUpdateOptions
  ) {
    if (!characterModel) return;

    const blendAlpha = Math.min(1, delta * 10);
    const isWalking = Boolean(options?.isWalking);
    const isJogging = Boolean(options?.isJogging);
    const isSpeaking = Boolean(options?.isSpeaking);
    const isListening = Boolean(options?.isListening);
    const isInspectingPhone = Boolean(options?.isInspectingPhone);
    const hasPhoneInHand =
      (!config.isNpc && options?.showPhoneInHand !== false) ||
      Boolean(config.isNpc && (options?.showPhoneInHand || isInspectingPhone));
    const turnVel = THREE.MathUtils.clamp(options?.turnVelocity || 0, -3.5, 3.5);

    if (heldPhoneGroup) {
      heldPhoneGroup.visible = hasPhoneInHand;
    }
    if (heldPhoneLight) {
      heldPhoneLight.intensity = hasPhoneInHand
        ? isInspectingPhone
          ? 0.16
          : 0.1
        : 0;
    }

    // 1. Subtle Idle Breathing & Weight Shift (Grounded Crime-Drama Human Presence)
    const breath = Math.sin(animTimeAcc * 1.65);
    const slowSway = Math.sin(animTimeAcc * 0.55);

    // Lowered, level shoulders (prevents hunched shoulders while keeping collarbones balanced)
    const shoulderRelaxX = 0.06 + breath * 0.004;
    slerpBoneOffset(bones.leftShoulder, shoulderRelaxX, 0, 0, blendAlpha);
    slerpBoneOffset(bones.rightShoulder, shoulderRelaxX, 0, 0, blendAlpha);

    // Comfortably straight back & open chest, counter-balancing the subtle contrapposto hip shift
    // so the upper torso and shoulders stay centered and level
    const listenLean = isListening ? 0.018 : 0;
    const walkLean = isWalking ? 0.032 : 0;
    slerpBoneOffset(
      bones.spine,
      -0.01 + breath * 0.008 + walkLean + listenLean * 0.5,
      -0.005 - turnVel * 0.03,
      (isWalking ? 0 : -0.006) + slowSway * 0.005,
      blendAlpha
    );
    slerpBoneOffset(
      bones.spine1,
      -0.016 + breath * 0.01 + listenLean * 0.5,
      -0.005 - turnVel * 0.035,
      isWalking ? 0 : 0.012,
      blendAlpha
    );
    slerpBoneOffset(
      bones.spine2,
      -0.012 + breath * 0.008,
      isWalking ? Math.sin(walkCyclePhase) * 0.025 : 0,
      (isWalking ? 0 : 0.016) + (isListening ? 0.012 : 0),
      blendAlpha
    );

    // 2. Head & Neck: Balanced upright and looking straight ahead (eye-level gaze directly facing viewer/camera)
    let neckPitch = 0.045 + breath * 0.004;
    let headPitch = 0.105 + breath * 0.005;
    let headYawOffset = slowSway * 0.012 - turnVel * 0.075;
    let headRollOffset = 0;

    if (isListening) {
      // Attentive listening: subtle head tilt and periodic affirmative nod
      headPitch += Math.sin(animTimeAcc * 2.3) * 0.032 + 0.015;
      headRollOffset += 0.038;
      headYawOffset += Math.sin(animTimeAcc * 0.9) * 0.018;
    }

    if (options?.expression === 'thinking') {
      headPitch += 0.025;
      headRollOffset -= 0.025;
    } else if (options?.expression === 'concerned') {
      headPitch += 0.015;
      headYawOffset += Math.sin(animTimeAcc * 2.2) * 0.025;
    }

    // Smooth NPC head & body tracking toward player within 4.8m
    if (options?.playerPos && config.isNpc) {
      const dist = rootGroup.position.distanceTo(options.playerPos);
      if (dist < 4.8) {
        const dx = options.playerPos.x - rootGroup.position.x;
        const dz = options.playerPos.z - rootGroup.position.z;
        const targetWorldYaw = Math.atan2(dx, dz);

        let yawDiff = targetWorldYaw - rootGroup.rotation.y;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        rootGroup.rotation.y += yawDiff * Math.min(1, 3.8 * delta);

        const dy = options.playerPos.y + 1.62 - (rootGroup.position.y + 1.64);
        const horizDist = Math.max(0.1, Math.hypot(dx, dz));
        const targetPitch = THREE.MathUtils.clamp(
          Math.atan2(dy, horizDist),
          -0.24,
          0.24
        );
        headPitch += -targetPitch * 0.65;
      }
    }

    if (isSpeaking) {
      // Conversational head nods and subtle emphasis
      headPitch += Math.sin(animTimeAcc * 6.2) * 0.028;
      headYawOffset += Math.cos(animTimeAcc * 3.4) * 0.025;
      headRollOffset += Math.sin(animTimeAcc * 2.8) * 0.016;
    }

    slerpBoneOffset(
      bones.neck,
      neckPitch,
      headYawOffset * 0.35,
      headRollOffset * 0.3,
      blendAlpha
    );
    slerpBoneOffset(
      bones.head,
      headPitch,
      headYawOffset * 0.65,
      headRollOffset * 0.7,
      blendAlpha
    );

    // Subtle eye micro-saccades looking straight forward
    const eyeDartX = Math.sin(animTimeAcc * 0.9) * 0.008;
    slerpBoneOffset(bones.leftEye, 0, eyeDartX, 0, blendAlpha);
    slerpBoneOffset(bones.rightEye, 0, eyeDartX, 0, blendAlpha);

    // 3. Expressive 3D Eyebrow Articulation & Facial Morph Targets
    if (leftBrowMesh && rightBrowMesh) {
      let browLift = 0;
      let browTilt = 0.04;
      if (options?.expression === 'concerned') {
        browLift = 0.003;
        browTilt = 0.16; // Inner brows raised in concern
      } else if (options?.expression === 'thinking') {
        browLift = -0.0012;
        browTilt = -0.08; // Analytical focus
      } else if (options?.expression === 'relieved') {
        browLift = 0.0025;
        browTilt = 0.03;
      } else if (isSpeaking) {
        browLift = Math.sin(animTimeAcc * 5.2) * 0.0022 + 0.001;
      } else if (isListening) {
        browLift = 0.002;
      }
      leftBrowMesh.position.y = THREE.MathUtils.lerp(
        leftBrowMesh.position.y,
        0.109 + browLift,
        blendAlpha
      );
      rightBrowMesh.position.y = THREE.MathUtils.lerp(
        rightBrowMesh.position.y,
        0.109 + browLift,
        blendAlpha
      );
      leftBrowMesh.rotation.z = THREE.MathUtils.lerp(
        leftBrowMesh.rotation.z,
        -browTilt,
        blendAlpha
      );
      rightBrowMesh.rotation.z = THREE.MathUtils.lerp(
        rightBrowMesh.rotation.z,
        browTilt,
        blendAlpha
      );
    }

    let targetMouthOpen = 0;
    let targetMouthSmile =
      options?.expression === 'relieved'
        ? 0.44
        : isListening
        ? 0.12
        : 0.06;

    if (isSpeaking) {
      const syllableWave =
        Math.sin(animTimeAcc * 13.5) * 0.45 +
        Math.sin(animTimeAcc * 21.0) * 0.3 +
        0.22;
      targetMouthOpen = THREE.MathUtils.clamp(syllableWave, 0.04, 0.68);
      targetMouthSmile = 0.14 + Math.sin(animTimeAcc * 4.0) * 0.08;
    }

    morphMeshes.forEach(({ mesh, mouthOpenIndex, mouthSmileIndex }) => {
      if (!mesh.morphTargetInfluences) return;
      if (mouthOpenIndex !== undefined) {
        mesh.morphTargetInfluences[mouthOpenIndex] = THREE.MathUtils.lerp(
          mesh.morphTargetInfluences[mouthOpenIndex],
          targetMouthOpen,
          Math.min(1, delta * 14)
        );
      }
      if (mouthSmileIndex !== undefined) {
        mesh.morphTargetInfluences[mouthSmileIndex] = THREE.MathUtils.lerp(
          mesh.morphTargetInfluences[mouthSmileIndex],
          targetMouthSmile,
          Math.min(1, delta * 8)
        );
      }
    });

    // 4. Lower Body: Walking / Turning / Relaxed Contrapposto Standing Pose
    if (isWalking || Math.abs(turnVel) > 0.25) {
      const strideFreq = isJogging ? 10.5 : isWalking ? 7.2 : 5.0;
      walkCyclePhase += delta * strideFreq;

      const strideAmp = isJogging
        ? 0.54
        : isWalking
        ? 0.38
        : Math.min(0.18, Math.abs(turnVel) * 0.12);
      const leftPhase = Math.sin(walkCyclePhase);
      const rightPhase = Math.sin(walkCyclePhase + Math.PI);

      slerpBoneOffset(bones.leftUpLeg, leftPhase * strideAmp, 0, 0.02, blendAlpha);
      slerpBoneOffset(
        bones.rightUpLeg,
        rightPhase * strideAmp,
        0,
        -0.02,
        blendAlpha
      );

      const leftKneeBend =
        -Math.max(0, -Math.cos(walkCyclePhase) * 0.65 + 0.22) *
        (strideAmp / 0.38);
      const rightKneeBend =
        -Math.max(0, -Math.cos(walkCyclePhase + Math.PI) * 0.65 + 0.22) *
        (strideAmp / 0.38);
      slerpBoneOffset(bones.leftLeg, leftKneeBend, 0, 0, blendAlpha);
      slerpBoneOffset(bones.rightLeg, rightKneeBend, 0, 0, blendAlpha);

      const leftAnkle = Math.cos(walkCyclePhase) * 0.18 * (strideAmp / 0.38);
      const rightAnkle =
        Math.cos(walkCyclePhase + Math.PI) * 0.18 * (strideAmp / 0.38);
      slerpBoneOffset(bones.leftFoot, leftAnkle, 0, 0, blendAlpha);
      slerpBoneOffset(bones.rightFoot, rightAnkle, 0, 0, blendAlpha);

      if (bones.hips && basePositions.has(bones.hips)) {
        const baseHipPos = basePositions.get(bones.hips)!;
        const bounce =
          Math.abs(Math.sin(walkCyclePhase)) * (isJogging ? 0.032 : 0.018);
        bones.hips.position.x = THREE.MathUtils.lerp(
          bones.hips.position.x,
          baseHipPos.x,
          blendAlpha
        );
        bones.hips.position.y = THREE.MathUtils.lerp(
          bones.hips.position.y,
          baseHipPos.y + bounce,
          blendAlpha
        );
      }
      slerpBoneOffset(
        bones.hips,
        0,
        Math.sin(walkCyclePhase) * 0.045,
        Math.cos(walkCyclePhase) * 0.025,
        blendAlpha
      );
    } else {
      // Relaxed, natural standing contrapposto pose:
      // - Weight resting slightly more on the right leg (Hips shifted -0.010m toward right leg)
      // - Feet about shoulder-width apart (LeftUpLeg rz = +0.048, RightUpLeg rz = -0.015)
      // - Both knees relaxed and unlocked (RightLeg rx = -0.06, LeftLeg rx = -0.115)
      // - Feet planted flat on the floor with counter-balanced ankle angles
      slerpBoneOffset(bones.rightUpLeg, 0.032, -0.015, -0.015, blendAlpha);
      slerpBoneOffset(bones.rightLeg, -0.06, 0, 0, blendAlpha);
      slerpBoneOffset(bones.rightFoot, 0.028, 0, 0.035, blendAlpha);

      slerpBoneOffset(bones.leftUpLeg, 0.068, 0.03, 0.048, blendAlpha);
      slerpBoneOffset(bones.leftLeg, -0.115, 0, 0, blendAlpha);
      slerpBoneOffset(bones.leftFoot, 0.048, 0, -0.025, blendAlpha);

      if (bones.hips && basePositions.has(bones.hips)) {
        const baseHipPos = basePositions.get(bones.hips)!;
        bones.hips.position.x = THREE.MathUtils.lerp(
          bones.hips.position.x,
          baseHipPos.x - 0.01 + slowSway * 0.003,
          blendAlpha
        );
        bones.hips.position.y = THREE.MathUtils.lerp(
          bones.hips.position.y,
          baseHipPos.y - 0.005,
          blendAlpha
        );
      }
      slerpBoneOffset(
        bones.hips,
        -0.008 + breath * 0.004,
        0.01 + slowSway * 0.008,
        -0.022 + slowSway * 0.006,
        blendAlpha
      );
    }

    // 5. Upper Limbs: Comfortable, Straight-Wrist Smartphone Grip OR Natural NPC Gestures
    const armRelaxX = 0.36;

    if (hasPhoneInHand) {
      // RIGHT-HANDED SMARTPHONE HOLD: Character's anatomical right hand holds phone vertically beside right thigh/hip
      // (appears on the left side of the image when facing camera). Both arms hang naturally and straight at his sides.

      // Right hand: Fingers wrapped around outer edge of phone centered in palm, thumb gripping inner edge, wrist clear below:
      rightGripFingers.forEach(({ j1, j2, j3 }) => {
        slerpBoneOffset(j1, 0.32, 0.04, 0, blendAlpha);
        slerpBoneOffset(j2, 0.38, 0, 0, blendAlpha);
        slerpBoneOffset(j3, 0.22, 0, 0, blendAlpha);
      });
      slerpBoneOffset(rightThumbBones.t1, 0.28, 0.10, -0.04, blendAlpha);
      slerpBoneOffset(rightThumbBones.t2, 0.18, 0.03, 0.01, blendAlpha);
      slerpBoneOffset(rightThumbBones.t3, 0.10, 0, 0.01, blendAlpha);

      // Left hand: Completely relaxed, hanging straight down alongside left hip/thigh (empty hand, no props):
      leftGripFingers.forEach(({ j1, j2, j3 }) => {
        slerpBoneOffset(j1, 0.08, 0, 0, blendAlpha);
        slerpBoneOffset(j2, 0.12, 0, 0, blendAlpha);
        slerpBoneOffset(j3, 0.08, 0, 0, blendAlpha);
      });
      slerpBoneOffset(leftThumbBones.t1, 0.06, 0, 0, blendAlpha);
      slerpBoneOffset(leftThumbBones.t2, 0.04, 0, 0, blendAlpha);
      slerpBoneOffset(leftThumbBones.t3, 0.04, 0, 0, blendAlpha);

      const syncBreath = Math.sin(animTimeAcc * 1.65) * 0.005;

      if (isWalking) {
        const armSwingAmp = isJogging ? 0.34 : 0.22;
        const rightArmSwingZ = Math.sin(walkCyclePhase) * (armSwingAmp * 0.5);
        const leftArmSwingZ = Math.sin(walkCyclePhase + Math.PI) * armSwingAmp;

        // Right arm walk swing holding phone
        slerpBoneOffset(
          bones.rightArm,
          0.36 + syncBreath,
          -0.05,
          -0.06 + rightArmSwingZ,
          blendAlpha
        );
        slerpBoneOffset(bones.rightForeArm, 0.06, 0, 0, blendAlpha);
        slerpBoneOffset(bones.rightHand, -0.04, -0.12, 0.08, blendAlpha);

        // Left arm natural walk swing
        slerpBoneOffset(
          bones.leftArm,
          0.36 + syncBreath,
          0.05,
          0.06 + leftArmSwingZ,
          blendAlpha
        );
        slerpBoneOffset(bones.leftForeArm, 0.06, 0, 0, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0, 0, 0, blendAlpha);
      } else {
        // Standing pose: BOTH arms hang naturally and straight at his sides
        // Right arm relaxed straight down alongside right thigh, holding phone in palm with top edge angled toward floor:
        slerpBoneOffset(
          bones.rightArm,
          0.36 + syncBreath,
          -0.05,
          -0.06 - slowSway * 0.008,
          blendAlpha
        );
        slerpBoneOffset(bones.rightForeArm, 0.06, 0, 0, blendAlpha);
        slerpBoneOffset(bones.rightHand, -0.06, -0.14, 0.06, blendAlpha);

        // Left arm relaxed straight down alongside left hip (empty hand):
        slerpBoneOffset(
          bones.leftArm,
          0.36 + syncBreath,
          0.05,
          0.06 + slowSway * 0.006,
          blendAlpha
        );
        slerpBoneOffset(bones.leftForeArm, 0.06, 0, 0, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0, 0, 0, blendAlpha);
      }
    } else {
      // NPCs (when not holding phone): natural relaxed fingers and expressive arm postures
      rightGripFingers.forEach(({ j1, j2, j3 }) => {
        slerpBoneOffset(j1, 0.12, 0, 0, blendAlpha);
        slerpBoneOffset(j2, 0.18, 0, 0, blendAlpha);
        slerpBoneOffset(j3, 0.12, 0, 0, blendAlpha);
      });
      leftGripFingers.forEach(({ j1, j2, j3 }) => {
        slerpBoneOffset(j1, 0.12, 0, 0, blendAlpha);
        slerpBoneOffset(j2, 0.18, 0, 0, blendAlpha);
        slerpBoneOffset(j3, 0.12, 0, 0, blendAlpha);
      });
      slerpBoneOffset(rightThumbBones.t1, 0.06, 0, 0, blendAlpha);
      slerpBoneOffset(rightThumbBones.t2, 0.06, 0, 0, blendAlpha);
      slerpBoneOffset(rightThumbBones.t3, 0.06, 0, 0, blendAlpha);
      slerpBoneOffset(leftThumbBones.t1, 0.06, 0, 0, blendAlpha);
      slerpBoneOffset(leftThumbBones.t2, 0.06, 0, 0, blendAlpha);
      slerpBoneOffset(leftThumbBones.t3, 0.06, 0, 0, blendAlpha);

      if (isWalking) {
        const armSwingAmp = isJogging ? 0.36 : 0.24;
        const leftArmSwingZ = Math.sin(walkCyclePhase + Math.PI) * armSwingAmp;
        const leftElbowBendZ =
          0.18 + Math.max(0, Math.sin(walkCyclePhase + Math.PI)) * 0.22;
        slerpBoneOffset(bones.leftArm, armRelaxX, 0, leftArmSwingZ, blendAlpha);
        slerpBoneOffset(bones.leftForeArm, 0.08, 0, leftElbowBendZ, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0, 0, 0, blendAlpha);

        const rightArmSwingZ = -Math.sin(walkCyclePhase) * armSwingAmp;
        const rightElbowBendZ =
          -0.18 - Math.max(0, Math.sin(walkCyclePhase)) * 0.22;
        slerpBoneOffset(
          bones.rightArm,
          armRelaxX,
          0,
          rightArmSwingZ,
          blendAlpha
        );
        slerpBoneOffset(
          bones.rightForeArm,
          0.08,
          0,
          rightElbowBendZ,
          blendAlpha
        );
        slerpBoneOffset(bones.rightHand, 0, 0, 0, blendAlpha);
      } else if (isSpeaking) {
        const gestureWaveL = Math.sin(animTimeAcc * 3.1);
        const gestureWaveR = Math.cos(animTimeAcc * 3.4);
        slerpBoneOffset(
          bones.leftArm,
          armRelaxX - 0.06,
          0.08,
          -0.16 + gestureWaveL * 0.06,
          blendAlpha
        );
        slerpBoneOffset(
          bones.leftForeArm,
          0.22,
          0.18,
          0.48 + Math.cos(animTimeAcc * 2.6) * 0.1,
          blendAlpha
        );
        slerpBoneOffset(bones.leftHand, 0, 0.12, gestureWaveL * 0.08, blendAlpha);

        slerpBoneOffset(
          bones.rightArm,
          armRelaxX - 0.08,
          -0.1,
          -0.2 + gestureWaveR * 0.07,
          blendAlpha
        );
        slerpBoneOffset(
          bones.rightForeArm,
          0.24,
          -0.18,
          -0.52 + Math.sin(animTimeAcc * 2.8) * 0.1,
          blendAlpha
        );
        slerpBoneOffset(
          bones.rightHand,
          0,
          -0.1,
          gestureWaveR * 0.08,
          blendAlpha
        );
      } else if (isListening) {
        // Attentive listening posture: hands clasped/poised comfortably near mid-torso
        const listenBreath = breath * 0.015;
        slerpBoneOffset(
          bones.leftArm,
          0.34 + listenBreath,
          -0.16,
          0.04,
          blendAlpha
        );
        slerpBoneOffset(bones.leftForeArm, 0.52, 0.42, 0.38, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0.1, 0.08, 0, blendAlpha);

        slerpBoneOffset(
          bones.rightArm,
          0.34 + listenBreath,
          0.16,
          -0.04,
          blendAlpha
        );
        slerpBoneOffset(bones.rightForeArm, 0.52, -0.42, -0.38, blendAlpha);
        slerpBoneOffset(bones.rightHand, 0.1, -0.08, 0, blendAlpha);
      } else {
        // Grounded natural idle stance
        slerpBoneOffset(
          bones.leftArm,
          armRelaxX + breath * 0.012,
          -0.04,
          0.06 + slowSway * 0.015,
          blendAlpha
        );
        slerpBoneOffset(bones.leftForeArm, 0.12, 0.08, 0.18, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0, 0, 0, blendAlpha);

        slerpBoneOffset(
          bones.rightArm,
          armRelaxX + breath * 0.012,
          0.04,
          -0.06 - slowSway * 0.015,
          blendAlpha
        );
        slerpBoneOffset(bones.rightForeArm, 0.12, -0.08, -0.18, blendAlpha);
        slerpBoneOffset(bones.rightHand, 0, 0, 0, blendAlpha);
      }
    }
  }

  const update = (
    delta: number,
    currentTime: number,
    options?: HumanCharacterUpdateOptions
  ) => {
    animTimeAcc += delta;
    applySkeletalPose(delta, currentTime, options);
  };

  return {
    group: rootGroup,
    config,
    profile,
    update,
  };
}

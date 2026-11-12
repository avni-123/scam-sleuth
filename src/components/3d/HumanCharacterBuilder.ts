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
      'Long tailored tan gabardine trench coat with belted waist and storm flaps over a charcoal-gray buttoned waistcoat, crisp white dress shirt, deep red silk tie, dark gray tailored trousers, polished dark leather shoes, and a muted gray-brown wool flat cap.',
    personalitySummary:
      'Grounded, observant digital forensics investigator. Calm under pressure, analytical, and confident when cross-referencing social-engineering trails.',
    signatureExpression:
      'Confident, thoughtful expression with an attentive analytical gaze and expressive brows.',
    badgeLabel: 'Lead Investigator',
    accentHex: '#00F0FF',
    bodyScale: [1.0, 1.0, 1.0],
    shoulderWidthScale: 1.025,
    hemMinY: 0.46,
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
    jacketHex: '#bfa074',
    innerShirtHex: '#f8fafc',
    trousersHex: '#2c313a',
    shoesHex: '#12100e',
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

interface CachedOutfitGeometries {
  outerJacketGeo: THREE.BufferGeometry;
  innerShirtGeo: THREE.BufferGeometry;
  waistcoatGeo?: THREE.BufferGeometry;
  tieGeo?: THREE.BufferGeometry;
  buttonsGeo?: THREE.BufferGeometry;
  buckleGeo?: THREE.BufferGeometry;
}

interface CachedHeadGeometries {
  sculptedHeadGeo: THREE.BufferGeometry;
  scalpGeo: THREE.BufferGeometry;
  beardGeo: THREE.BufferGeometry | null;
}

interface CachedPosedRightHandData {
  handGeo: THREE.BufferGeometry;
  palmBackingGeo: THREE.BufferGeometry;
  wristBridgeGeo: THREE.BufferGeometry;
  thenarCradleGeo: THREE.BufferGeometry;
  fullBodyIndex: THREE.BufferAttribute;
  bodyWithoutRightHandIndex: THREE.BufferAttribute;
}

const outfitGeometryCache = new Map<CharacterArchetypeId, CachedOutfitGeometries>();
const headGeometryCache = new Map<CharacterArchetypeId, CachedHeadGeometries>();
let cachedStrippedHeadwearGeo: THREE.BufferGeometry | null = null;
let cachedInvestigatorTrousersGeo: THREE.BufferGeometry | null = null;
let cachedDetectiveHairGeo: THREE.BufferGeometry | null = null;
let cachedFlatCapMainGeo: THREE.BufferGeometry | null = null;
let cachedFlatCapBandGeo: THREE.BufferGeometry | null = null;
let cachedPosedRightHandData: CachedPosedRightHandData | null = null;
let cachedCaseScreenTex: THREE.CanvasTexture | null = null;

function markSharedGeometry(geo?: THREE.BufferGeometry | null) {
  if (geo) {
    geo.userData.isSharedCached = true;
  }
}

function mergeStaticGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];

  for (const g of geometries) {
    if (!g.attributes.normal) {
      g.computeVertexNormals();
    }
    const pAttr = g.attributes.position as THREE.BufferAttribute;
    const nAttr = g.attributes.normal as THREE.BufferAttribute | undefined;
    const uvAttr = g.attributes.uv as THREE.BufferAttribute | undefined;
    const idxAttr = g.index;
    const baseOffset = pos.length / 3;

    for (let i = 0; i < pAttr.count; i++) {
      pos.push(pAttr.getX(i), pAttr.getY(i), pAttr.getZ(i));
      norm.push(
        nAttr ? nAttr.getX(i) : 0,
        nAttr ? nAttr.getY(i) : 1,
        nAttr ? nAttr.getZ(i) : 0
      );
      uv.push(uvAttr ? uvAttr.getX(i) : 0.5, uvAttr ? uvAttr.getY(i) : 0.5);
    }

    if (idxAttr) {
      const idxArr = idxAttr.array;
      for (let i = 0; i < idxArr.length; i++) {
        indices.push(baseOffset + idxArr[i]);
      }
    } else {
      for (let i = 0; i < pAttr.count; i++) {
        indices.push(baseOffset + i);
      }
    }
    g.dispose();
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  merged.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  merged.setIndex(indices);
  markSharedGeometry(merged);
  return merged;
}

/**
 * Disposes non-cached geometries, materials, and non-cached textures in a scene or group
 * when leaving a level or unmounting a 3D preview stage.
 */
export function disposeSceneResources(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry && !mesh.geometry.userData?.isSharedCached) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) {
        if (!mat) continue;
        const stdMat = mat as THREE.MeshStandardMaterial;
        const maps = [
          stdMat.map,
          stdMat.roughnessMap,
          stdMat.metalnessMap,
          stdMat.normalMap,
          stdMat.emissiveMap,
          stdMat.alphaMap,
        ];
        for (const tex of maps) {
          if (tex && !tex.userData?.isSharedCached) {
            tex.dispose();
          }
        }
        mat.dispose();
      }
    }
  });
}

// Pre-allocated math helpers to avoid per-frame GC allocations
const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();
const _targetQuat = new THREE.Quaternion();
const _rootWorldQuat = new THREE.Quaternion();
const _handWorldQuat = new THREE.Quaternion();
const _phoneTargetWorldQuat = new THREE.Quaternion();
const _phoneLocalToRootEuler = new THREE.Euler();
const _phoneUprightWorldQuat = new THREE.Quaternion(); // Identity: upright portrait orientation (cameras at top pointing +Y, back panel facing +Z to viewer, screen facing -Z to palm)

function preloadHumanModel(): Promise<THREE.Group> {
  if (cachedGltfScene) return Promise.resolve(cachedGltfScene);
  if (loadPromise) return loadPromise;

  const loader = new GLTFLoader();
  loadPromise = new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      MODEL_URL,
      (gltf) => {
        gltf.scene.traverse((child) => {
          const mesh = child as THREE.SkinnedMesh;
          if (mesh.isMesh && mesh.geometry) {
            mesh.geometry.userData.isSharedCached = true;
            // Prune 60+ unused blendshape morph attributes down to only mouthOpen and mouthSmile
            const dict = mesh.morphTargetDictionary;
            if (dict && mesh.morphTargetInfluences) {
              const keepNames = ['mouthOpen', 'mouthSmile'];
              const newDict: Record<string, number> = {};
              const newPosMorphs: THREE.BufferAttribute[] = [];
              const newNormMorphs: THREE.BufferAttribute[] = [];
              const origPosMorphs = mesh.geometry.morphAttributes.position;
              const origNormMorphs = mesh.geometry.morphAttributes.normal;
              for (const name of keepNames) {
                const oldIdx = dict[name];
                if (oldIdx !== undefined && origPosMorphs && origPosMorphs[oldIdx]) {
                  const newIdx = newPosMorphs.length;
                  newDict[name] = newIdx;
                  newPosMorphs.push(origPosMorphs[oldIdx] as THREE.BufferAttribute);
                  if (origNormMorphs && origNormMorphs[oldIdx]) {
                    newNormMorphs.push(origNormMorphs[oldIdx] as THREE.BufferAttribute);
                  }
                }
              }
              mesh.morphTargetDictionary = newDict;
              mesh.morphTargetInfluences = new Array(newPosMorphs.length).fill(0);
              if (newPosMorphs.length > 0) {
                mesh.geometry.morphAttributes.position = newPosMorphs;
                if (newNormMorphs.length === newPosMorphs.length) {
                  mesh.geometry.morphAttributes.normal = newNormMorphs;
                } else {
                  delete mesh.geometry.morphAttributes.normal;
                }
              } else {
                mesh.geometry.morphAttributes = {};
              }
            }
          }
        });
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
  preloadHumanModel()
    .then(() => {
      const scheduleIdle =
        (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
          .requestIdleCallback || ((cb: () => void) => setTimeout(cb, 80));
      scheduleIdle(() => {
        try {
          if (!outfitGeometryCache.has('investigator')) {
            const warmInv = createHumanCharacter({
              id: 'warmup_inv',
              name: 'Rowan Vance',
              archetype: 'investigator',
              style: 'investigator_coat',
              isNpc: false,
            });
            disposeSceneResources(warmInv.group);
          }
        } catch {
          // Ignore warmup errors
        }
      });
    })
    .catch(() => {});
}

// ---------------------------------------------------------------------------
// GEOMETRY DECOMPOSITION & ANATOMICAL SCULPTING HELPERS
// ---------------------------------------------------------------------------

/**
 * Appends a procedural BufferGeometry to an accumulating skinned vertex buffer,
 * transferring skinIndex and skinWeight from the nearest bind-pose vertex in
 * topGeo (for y >= 1.03) or bottomGeo (for y < 1.03) so all tailored garments
 * deform 100% seamlessly with the character's humanoid skeleton.
 */
interface SpatialSkinningBuckets {
  minY: number;
  invStepY: number;
  bucketCount: number;
  buckets: Int32Array[];
  xs: Float32Array;
  ys: Float32Array;
  zs: Float32Array;
}

const spatialSkinningCache = new WeakMap<THREE.BufferAttribute, SpatialSkinningBuckets>();

function getSpatialSkinningBuckets(posAttr: THREE.BufferAttribute): SpatialSkinningBuckets {
  let cached = spatialSkinningCache.get(posAttr);
  if (cached) return cached;

  const count = posAttr.count;
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  const zs = new Float32Array(count);

  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    xs[i] = x;
    ys[i] = y;
    zs[i] = z;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const bucketCount = 32;
  const spanY = Math.max(0.01, maxY - minY);
  const invStepY = bucketCount / spanY;
  const tempBuckets: number[][] = Array.from({ length: bucketCount }, () => []);

  for (let i = 0; i < count; i++) {
    const bIdx = Math.min(
      bucketCount - 1,
      Math.max(0, Math.floor((ys[i] - minY) * invStepY))
    );
    tempBuckets[bIdx].push(i);
  }

  cached = {
    minY,
    invStepY,
    bucketCount,
    buckets: tempBuckets.map((arr) => new Int32Array(arr)),
    xs,
    ys,
    zs,
  };
  spatialSkinningCache.set(posAttr, cached);
  return cached;
}

function appendSkinnedPartGeometry(
  partGeo: THREE.BufferGeometry,
  targetPos: number[],
  targetNorm: number[],
  targetUv: number[],
  targetSkinIdx: number[],
  targetSkinWgt: number[],
  targetIndices: number[],
  topPos: THREE.BufferAttribute,
  topSkinIdx: THREE.BufferAttribute,
  topSkinWgt: THREE.BufferAttribute,
  botPos?: THREE.BufferAttribute,
  botSkinIdx?: THREE.BufferAttribute,
  botSkinWgt?: THREE.BufferAttribute
) {
  partGeo.computeVertexNormals();
  const pPos = partGeo.attributes.position;
  const pNorm = partGeo.attributes.normal;
  const pUv = partGeo.attributes.uv;
  const pIdx = partGeo.index;
  const baseVertOffset = targetPos.length / 3;

  const topSpatial = getSpatialSkinningBuckets(topPos);
  const botSpatial = botPos ? getSpatialSkinningBuckets(botPos) : null;

  for (let v = 0; v < pPos.count; v++) {
    const vx = pPos.getX(v);
    const vy = pPos.getY(v);
    const vz = pPos.getZ(v);

    targetPos.push(vx, vy, vz);
    targetNorm.push(
      pNorm ? pNorm.getX(v) : 0,
      pNorm ? pNorm.getY(v) : 1,
      pNorm ? pNorm.getZ(v) : 0
    );
    targetUv.push(pUv ? pUv.getX(v) : vx * 2.5 + 0.5, pUv ? pUv.getY(v) : vy * 1.5);

    const useBottom = Boolean(botSpatial && botSkinIdx && botSkinWgt && vy < 1.025);
    const spatial = useBottom ? botSpatial! : topSpatial;
    const refSi = useBottom ? botSkinIdx! : topSkinIdx;
    const refSw = useBottom ? botSkinWgt! : topSkinWgt;
    const { xs, ys, zs, buckets, bucketCount, minY, invStepY } = spatial;

    const centerB = Math.min(
      bucketCount - 1,
      Math.max(0, Math.floor((vy - minY) * invStepY))
    );
    const bStart = Math.max(0, centerB - 3);
    const bEnd = Math.min(bucketCount - 1, centerB + 3);

    let bestIdx = -1;
    let bestDistSq = Infinity;
    for (let b = bStart; b <= bEnd; b++) {
      const bucket = buckets[b];
      for (let k = 0; k < bucket.length; k++) {
        const j = bucket[k];
        const dx = xs[j] - vx;
        const dy = (ys[j] - vy) * 1.6;
        const dz = zs[j] - vz;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestIdx = j;
        }
      }
    }

    if (bestIdx === -1) {
      bestIdx = 0;
      for (let j = 0; j < xs.length; j++) {
        const dx = xs[j] - vx;
        const dy = (ys[j] - vy) * 1.6;
        const dz = zs[j] - vz;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestIdx = j;
        }
      }
    }

    targetSkinIdx.push(
      refSi.getX(bestIdx),
      refSi.getY(bestIdx),
      refSi.getZ(bestIdx),
      refSi.getW(bestIdx)
    );
    targetSkinWgt.push(
      refSw.getX(bestIdx),
      refSw.getY(bestIdx),
      refSw.getZ(bestIdx),
      refSw.getW(bestIdx)
    );
  }

  if (pIdx) {
    const arr = pIdx.array;
    for (let i = 0; i < arr.length; i++) {
      targetIndices.push(baseVertOffset + arr[i]);
    }
  } else {
    for (let i = 0; i < pPos.count; i++) {
      targetIndices.push(baseVertOffset + i);
    }
  }
}

function buildSkinnedBufferGeometry(
  pos: number[],
  norm: number[],
  uv: number[],
  skinIdx: number[],
  skinWgt: number[],
  indices: number[]
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIdx, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWgt, 4));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Splits Wolf3D_Outfit_Top into distinct SkinnedMesh geometries.
 * For the investigator ('investigator'), decomposes and tailors:
 * - outerJacketGeo: Long tailored tan trench coat with wide lapels, storm flaps, shoulder epaulets,
 *   belted waist, slanted side pockets, sleeve straps, and a full below-the-knee pleated skirt.
 * - innerShirtGeo: Crisp white dress shirt collar, upper chest bib, and wrist cuffs.
 * - waistcoatGeo: Tailored charcoal-gray waistcoat worn over the crisp white shirt.
 * - tieGeo: Deep red silk tie (Windsor knot at collar + tapered blade tucking into waistcoat V-neck).
 * - buttonsGeo: Dark horn buttons on the waistcoat, trench coat front panels, epaulets, and cuffs.
 * - buckleGeo: Rectangular gunmetal/aged-brass belt buckle and center prong at the front waist.
 */
function decomposeAndTailorOutfitTop(
  sourceGeo: THREE.BufferGeometry,
  profile: CharacterArchetypeProfile,
  bottomGeo?: THREE.BufferGeometry
): CachedOutfitGeometries {
  const cached = outfitGeometryCache.get(profile.archetype);
  if (cached) {
    return cached;
  }
  const pos = sourceGeo.attributes.position as THREE.BufferAttribute;
  const normAttr = sourceGeo.attributes.normal as THREE.BufferAttribute | undefined;
  const uvAttr = sourceGeo.attributes.uv as THREE.BufferAttribute | undefined;
  const skinIdxAttr = sourceGeo.attributes.skinIndex as THREE.BufferAttribute;
  const skinWgtAttr = sourceGeo.attributes.skinWeight as THREE.BufferAttribute;
  const idxAttr = sourceGeo.index;
  if (!idxAttr) {
    const fallback = {
      outerJacketGeo: sourceGeo.clone(),
      innerShirtGeo: sourceGeo.clone(),
    };
    markSharedGeometry(fallback.outerJacketGeo);
    markSharedGeometry(fallback.innerShirtGeo);
    outfitGeometryCache.set(profile.archetype, fallback);
    return fallback;
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

  const isInvestigator = profile.archetype === 'investigator';

  type CompRole =
    | 'BOWTIE'
    | 'TIE_KNOT'
    | 'FLOWER'
    | 'SHIRT'
    | 'WAISTCOAT'
    | 'BUTTONS'
    | 'OUTER';

  const compRole = new Map<number, CompRole>();
  comps.forEach((c, r) => {
    const isTieKnot =
      isInvestigator &&
      c.min[1] > 1.515 &&
      c.max[1] < 1.568 &&
      c.min[2] > 0.055 &&
      c.min[0] > -0.015 &&
      c.max[0] < 0.02;

    const isBowtie =
      !isTieKnot &&
      c.min[1] > 1.5 &&
      c.max[1] < 1.576 &&
      c.min[2] > 0.055 &&
      c.min[0] > -0.06 &&
      c.max[0] < 0.065;

    const isFlower =
      c.max[0] < -0.085 &&
      c.min[1] > 1.355 &&
      c.max[1] < 1.475 &&
      c.min[2] > 0.045;

    const isButton =
      isInvestigator &&
      !isBowtie &&
      !isFlower &&
      ((c.min[0] > -0.015 &&
        c.max[0] < 0.015 &&
        c.min[1] > 1.1 &&
        c.max[1] < 1.35 &&
        c.min[2] > 0.14) ||
        (Math.abs(c.min[0]) > 0.34 &&
          c.max[0] - c.min[0] < 0.03 &&
          c.min[1] > 1.08 &&
          c.max[1] < 1.19));

    // Upper dress shirt chest bib (Roots 382 & 533: X[-0.10, 0.10] Y[1.339, 1.588] Z[-0.071, 0.135])
    const isShirtChestBib =
      isInvestigator &&
      c.min[0] >= -0.105 &&
      c.max[0] <= 0.105 &&
      c.min[1] > 1.33 &&
      c.max[1] < 1.595 &&
      c.min[2] < -0.05;

    // Collar & wrist cuffs
    const isCollarOrCuffs =
      (c.min[1] > 1.5 && c.max[1] > 1.565) ||
      (c.min[1] > 1.02 &&
        c.max[1] < 1.135 &&
        (c.max[0] < -0.38 || c.min[0] > 0.38));

    // Waistcoat front panels (Roots 696, 681, 314, 465: X[-0.10, 0.10] Y[1.045, 1.55] Z[0.01, 0.16])
    const isWaistcoatPanel =
      !isBowtie &&
      !isFlower &&
      !isButton &&
      c.min[2] > 0.01 &&
      c.max[0] <= 0.102 &&
      c.min[0] >= -0.102 &&
      c.max[1] < 1.55;

    if (isTieKnot) {
      compRole.set(r, 'TIE_KNOT');
    } else if (isBowtie) {
      compRole.set(r, 'BOWTIE');
    } else if (isFlower) {
      compRole.set(r, 'FLOWER');
    } else if (isButton) {
      compRole.set(r, 'BUTTONS');
    } else if (isInvestigator && isWaistcoatPanel) {
      compRole.set(r, 'WAISTCOAT');
    } else if (isCollarOrCuffs || isShirtChestBib || (!isInvestigator && isWaistcoatPanel)) {
      compRole.set(r, 'SHIRT');
    } else {
      compRole.set(r, 'OUTER');
    }
  });

  const outerIndices: number[] = [];
  const innerIndices: number[] = [];
  const waistcoatIndices: number[] = [];
  const tieIndices: number[] = [];
  const buttonIndices: number[] = [];

  for (let i = 0; i < idx.length; i += 3) {
    const role = compRole.get(find(idx[i]));
    if (role === 'OUTER') {
      outerIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    } else if (role === 'SHIRT') {
      innerIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    } else if (role === 'WAISTCOAT') {
      waistcoatIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    } else if (role === 'TIE_KNOT') {
      tieIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    } else if (role === 'BUTTONS') {
      buttonIndices.push(idx[i], idx[i + 1], idx[i + 2]);
    }
  }

  const outerJacketGeo = sourceGeo.clone();
  outerJacketGeo.setIndex(outerIndices);

  const innerShirtGeo = sourceGeo.clone();
  innerShirtGeo.setIndex(innerIndices);

  const outPos = outerJacketGeo.attributes.position as THREE.BufferAttribute;
  const outNorm = outerJacketGeo.attributes.normal as THREE.BufferAttribute | undefined;
  const hemMinY = profile.hemMinY;
  const shoulderScale = profile.shoulderWidthScale;

  for (let v = 0; v < outPos.count; v++) {
    let x = outPos.getX(v);
    let y = outPos.getY(v);
    let z = outPos.getZ(v);
    const nx = outNorm ? outNorm.getX(v) : 0;
    const nz = outNorm ? outNorm.getZ(v) : 0;

    // 1) Clamp legacy cutaway tuxedo tails cleanly at waist level (y = 1.068 for investigator
    // where the belted long trench coat skirt takes over seamlessly, or hemMinY for NPCs)
    const targetHemY = isInvestigator ? 1.068 : Math.max(1.045, hemMinY);
    if (Math.abs(x) < 0.24 && y < targetHemY) {
      y = targetHemY;
      x *= isInvestigator ? 0.96 : 0.93;
      z *= isInvestigator ? 0.95 : 0.92;
    }

    // 2) For the investigator's tailored trench coat, widen the notched front lapels & collar slightly
    if (isInvestigator) {
      if (y > 1.16 && y < 1.55 && z > 0.06 && Math.abs(x) < 0.16) {
        z += 0.005;
        x *= 1.05;
      }
      if (y >= 1.52 && Math.abs(x) < 0.12) {
        x += Math.sign(x || 1) * 0.004;
        z += z < 0 ? -0.005 : 0.003;
      }
    }

    // Apply character-specific shoulder & upper-torso silhouette scaling
    if (y > 1.15 && Math.abs(x) < 0.24) {
      const t = Math.min(1, (y - 1.15) / 0.35);
      x *= 1 + (shoulderScale - 1) * t;
    }

    // Add realistic fabric fold relief along sleeves and torso
    const foldAmp = isInvestigator ? 0.0024 : 0.0018;
    const foldWave =
      Math.sin(y * 38.0 + x * 12.0) * foldAmp +
      Math.cos(y * 62.0 - z * 18.0) * (foldAmp * 0.65);
    x += nx * foldWave;
    z += nz * foldWave;

    outPos.setXYZ(v, x, y, z);
  }
  outPos.needsUpdate = true;

  // Apply shoulder proportion scaling to the inner shirt
  const inPos = innerShirtGeo.attributes.position as THREE.BufferAttribute;
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

  if (!isInvestigator) {
    markSharedGeometry(outerJacketGeo);
    markSharedGeometry(innerShirtGeo);
    const result: CachedOutfitGeometries = { outerJacketGeo, innerShirtGeo };
    outfitGeometryCache.set(profile.archetype, result);
    return result;
  }

  // -------------------------------------------------------------------------
  // INVESTIGATOR BESPOKE LAYERED OUTFIT GEOMETRIES (100% Skinned to Skeleton)
  // -------------------------------------------------------------------------
  const botPos = bottomGeo?.attributes.position as THREE.BufferAttribute | undefined;
  const botSkinIdx = bottomGeo?.attributes.skinIndex as THREE.BufferAttribute | undefined;
  const botSkinWgt = bottomGeo?.attributes.skinWeight as THREE.BufferAttribute | undefined;

  // 1. CHARCOAL-GRAY WAISTCOAT (Roots 696, 681, 314, 465)
  const waistcoatGeo = sourceGeo.clone();
  waistcoatGeo.setIndex(waistcoatIndices);
  const wPos = waistcoatGeo.attributes.position as THREE.BufferAttribute;
  for (let v = 0; v < wPos.count; v++) {
    let x = wPos.getX(v);
    const y = wPos.getY(v);
    let z = wPos.getZ(v);
    if (y > 1.03 && y < 1.56 && Math.abs(x) < 0.12 && z > 0) {
      // Subtle tailored waist suppression & vertical dart seam relief
      const dart = Math.exp(-Math.pow((Math.abs(x) - 0.048) / 0.012, 2)) * 0.0018;
      z += 0.0018 + dart;
    }
    wPos.setXYZ(v, x, y, z);
  }
  wPos.needsUpdate = true;
  waistcoatGeo.computeVertexNormals();

  // 2. DEEP RED SILK TIE (Windsor Knot + Tapered Silk Blade tucking into Waistcoat V-neck)
  const tiePos: number[] = [];
  const tieNorm: number[] = [];
  const tieUv: number[] = [];
  const tieSkinIdx: number[] = [];
  const tieSkinWgt: number[] = [];
  const tieOutIndices: number[] = [];

  // Copy Windsor knot vertices from Root 1895 and bring slightly forward between collar points
  const knotRemap = new Map<number, number>();
  for (let i = 0; i < tieIndices.length; i++) {
    const origV = tieIndices[i];
    if (!knotRemap.has(origV)) {
      const newV = tiePos.length / 3;
      knotRemap.set(origV, newV);
      const kx = pos.getX(origV) * 1.18;
      const ky = pos.getY(origV);
      const kz = pos.getZ(origV) + 0.0055;
      tiePos.push(kx, ky, kz);
      tieNorm.push(
        normAttr ? normAttr.getX(origV) : 0,
        normAttr ? normAttr.getY(origV) : 0,
        normAttr ? normAttr.getZ(origV) : 1
      );
      tieUv.push(uvAttr ? uvAttr.getX(origV) : 0.5, uvAttr ? uvAttr.getY(origV) : 0.5);
      tieSkinIdx.push(
        skinIdxAttr.getX(origV),
        skinIdxAttr.getY(origV),
        skinIdxAttr.getZ(origV),
        skinIdxAttr.getW(origV)
      );
      tieSkinWgt.push(
        skinWgtAttr.getX(origV),
        skinWgtAttr.getY(origV),
        skinWgtAttr.getZ(origV),
        skinWgtAttr.getW(origV)
      );
    }
    tieOutIndices.push(knotRemap.get(origV)!);
  }

  // Sculpted 3D Tie Blade (draping down the crisp white shirt chest from y=1.530 to y=1.328)
  const tieSpine: Array<{ y: number; z: number; halfW: number; thick: number }> = [
    { y: 1.532, z: 0.071, halfW: 0.011, thick: 0.0045 },
    { y: 1.512, z: 0.074, halfW: 0.014, thick: 0.0042 },
    { y: 1.482, z: 0.091, halfW: 0.018, thick: 0.0040 },
    { y: 1.445, z: 0.109, halfW: 0.021, thick: 0.0038 },
    { y: 1.405, z: 0.125, halfW: 0.023, thick: 0.0036 },
    { y: 1.368, z: 0.139, halfW: 0.023, thick: 0.0032 },
    { y: 1.332, z: 0.141, halfW: 0.014, thick: 0.0025 },
  ];
  const bladeGeo = new THREE.BufferGeometry();
  const bPosArr: number[] = [];
  const bIdxArr: number[] = [];
  for (let r = 0; r < tieSpine.length; r++) {
    const { y, z, halfW, thick } = tieSpine[r];
    // 5 vertices across each row: back-left, front-left, front-center-ridge, front-right, back-right
    bPosArr.push(-halfW, y, z - thick * 0.5);
    bPosArr.push(-halfW * 0.85, y, z + thick * 0.65);
    bPosArr.push(0.002, y, z + thick);
    bPosArr.push(halfW * 0.85, y, z + thick * 0.65);
    bPosArr.push(halfW, y, z - thick * 0.5);
    if (r < tieSpine.length - 1) {
      const r0 = r * 5;
      const r1 = (r + 1) * 5;
      for (let c = 0; c < 4; c++) {
        bIdxArr.push(r0 + c, r1 + c, r0 + c + 1);
        bIdxArr.push(r0 + c + 1, r1 + c, r1 + c + 1);
      }
    }
  }
  bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(bPosArr, 3));
  bladeGeo.setIndex(bIdxArr);
  appendSkinnedPartGeometry(
    bladeGeo,
    tiePos,
    tieNorm,
    tieUv,
    tieSkinIdx,
    tieSkinWgt,
    tieOutIndices,
    pos,
    skinIdxAttr,
    skinWgtAttr
  );
  const tieGeo = buildSkinnedBufferGeometry(
    tiePos,
    tieNorm,
    tieUv,
    tieSkinIdx,
    tieSkinWgt,
    tieOutIndices
  );

  // 3. LONG TAILORED TAN TRENCH COAT SKIRT, BELT, STORM FLAPS, EPAULETS & SLEEVE STRAPS
  // Seed outer coat buffers with the tailored upper coat (outerJacketGeo)
  const coatPos: number[] = [];
  const coatNorm: number[] = [];
  const coatUv: number[] = [];
  const coatSkinIdx: number[] = [];
  const coatSkinWgt: number[] = [];
  const coatIndices: number[] = [];

  const upperCoatRemap = new Map<number, number>();
  for (let i = 0; i < outerIndices.length; i++) {
    const origV = outerIndices[i];
    if (!upperCoatRemap.has(origV)) {
      const newV = coatPos.length / 3;
      upperCoatRemap.set(origV, newV);
      coatPos.push(outPos.getX(origV), outPos.getY(origV), outPos.getZ(origV));
      coatNorm.push(
        outNorm ? outNorm.getX(origV) : 0,
        outNorm ? outNorm.getY(origV) : 1,
        outNorm ? outNorm.getZ(origV) : 0
      );
      coatUv.push(
        uvAttr ? uvAttr.getX(origV) : 0.5,
        uvAttr ? uvAttr.getY(origV) : 0.5
      );
      coatSkinIdx.push(
        skinIdxAttr.getX(origV),
        skinIdxAttr.getY(origV),
        skinIdxAttr.getZ(origV),
        skinIdxAttr.getW(origV)
      );
      coatSkinWgt.push(
        skinWgtAttr.getX(origV),
        skinWgtAttr.getY(origV),
        skinWgtAttr.getZ(origV),
        skinWgtAttr.getW(origV)
      );
    }
    coatIndices.push(upperCoatRemap.get(origV)!);
  }

  // 3A. Build the Long Tailored Trench Coat Skirt (y = 1.090 down to y = 0.460, below the knees)
  // Double-sided with thick turned front lapels/plackets, vertical drapery pleats, side welt pockets,
  // and guaranteed clearance around the trousers and the lowered right-hand smartphone grip.
  const nRings = 24;
  const nCols = 56;
  const yTop = 1.090;
  const yBot = 0.460;
  const coatThick = 0.0045;

  const skirtGeo = new THREE.BufferGeometry();
  const sPosArr: number[] = [];
  const sUvArr: number[] = [];
  const sIdxArr: number[] = [];

  // Pre-filter trouser vertices in the skirt Y range [0.41, 1.14] once so per-ring clearance is O(1)
  const skirtBotVerts: { bx: number; by: number; bz: number }[] = [];
  if (botPos) {
    for (let b = 0; b < botPos.count; b++) {
      const by = botPos.getY(b);
      if (by >= 0.41 && by <= 1.14) {
        skirtBotVerts.push({
          bx: botPos.getX(b),
          by,
          bz: botPos.getZ(b),
        });
      }
    }
  }

  for (let r = 0; r < nRings; r++) {
    const tDown = r / (nRings - 1);
    const y = THREE.MathUtils.lerp(yTop, yBot, tDown);

    // Center-front open split widens gracefully from the belted waist down to the hem
    const thetaOpen = 0.25 + 0.11 * tDown;
    const totalArc = (Math.PI - thetaOpen) * 2;

    // A-line trench coat flare from waist to below-the-knee hem
    const rxBase = 0.162 + 0.044 * Math.pow(tDown, 0.88);
    const rzFrontBase = 0.156 + 0.014 * tDown;
    const rzBackBase = 0.126 + 0.036 * tDown;
    const zCenter = 0.012 - 0.016 * tDown;

    // Precompute polar (bTheta, rHoriz) only for trouser vertices within 4.2cm of this ring's Y
    const ringTrouserSamples: { bTheta: number; rHoriz: number }[] = [];
    for (let k = 0; k < skirtBotVerts.length; k++) {
      const tv = skirtBotVerts[k];
      if (Math.abs(tv.by - y) < 0.042) {
        const dz = tv.bz - zCenter;
        ringTrouserSamples.push({
          bTheta: Math.atan2(tv.bx, dz),
          rHoriz: Math.hypot(tv.bx, dz),
        });
      }
    }

    for (let c = 0; c < nCols; c++) {
      const u = c / (nCols - 1);
      // u=0 is front-left (+X, +Z), u=0.5 is center-back (-Z), u=1 is front-right (-X, +Z)
      const angleFromLeftFront = u * totalArc;
      const rawTheta = thetaOpen + angleFromLeftFront;
      const theta = rawTheta <= Math.PI ? rawTheta : rawTheta - Math.PI * 2;

      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      let rx = rxBase;
      const rz = cosT >= 0 ? rzFrontBase : rzBackBase;

      let x = sinT * rx;
      let z = zCenter + cosT * rz;

      // Smooth leg-column contour so the coat drapes naturally over both thighs and knees
      const legCenter = 0.096 + 0.038 * tDown;
      const legBulge =
        Math.exp(-Math.pow((Math.abs(x) - legCenter) / 0.068, 2)) *
        (0.012 + 0.014 * tDown);
      z += (cosT >= 0 ? 1 : -0.85) * legBulge;

      // Ensure 9mm radial clearance outside any underlying trouser vertex at this (y, theta)
      if (ringTrouserSamples.length > 0) {
        let maxTrouserR = 0;
        for (let b = 0; b < ringTrouserSamples.length; b++) {
          const sample = ringTrouserSamples[b];
          let dTheta = Math.abs(sample.bTheta - theta);
          if (dTheta > Math.PI) dTheta = Math.PI * 2 - dTheta;
          if (dTheta < 0.16 && sample.rHoriz > maxTrouserR) {
            maxTrouserR = sample.rHoriz;
          }
        }
        const curR = Math.hypot(x, z - zCenter);
        if (maxTrouserR > 0 && curR < maxTrouserR + 0.009) {
          const scale = (maxTrouserR + 0.009) / Math.max(0.05, curR);
          x *= scale;
          z = zCenter + (z - zCenter) * scale;
        }
      }

      // Realistic 3D vertical drapery folds, waist gathers below belt, and back vent crease
      const isRightHandZone = x < -0.11 && y >= 0.72 && y <= 1.01 && z > -0.01;
      const pleatEnv = isRightHandZone ? 0.15 : 1.0;
      const verticalPleat =
        (Math.sin(theta * 7.0) * 0.0046 +
          Math.cos(theta * 11.0 + y * 8.0) * 0.0022) *
        (0.22 + 0.78 * tDown) *
        pleatEnv;
      const beltGather =
        Math.sin(theta * 18.0) *
        0.0024 *
        Math.exp(-Math.pow((y - 1.052) / 0.042, 2)) *
        pleatEnv;
      const frontPlacketEdge =
        u < 0.035 || u > 0.965 ? 0.0022 : 0;
      const backVentOverlap =
        Math.abs(u - 0.5) < 0.025 && y < 0.74 ? 0.003 : 0;

      const totalRadialOffset =
        verticalPleat + beltGather + frontPlacketEdge + backVentOverlap;
      x += sinT * totalRadialOffset;
      z += cosT * totalRadialOffset;

      // Ensure zero clipping with the lowered right hand & smartphone (world X in [-0.251, -0.161], Z in [0.044, 0.103])
      if (x < 0 && y >= 0.75 && y <= 0.99 && z >= 0.035) {
        x = Math.max(x, -0.156);
      }

      const radLen = Math.max(0.001, Math.hypot(sinT, cosT));
      const nx = sinT / radLen;
      const nz = cosT / radLen;

      // Outer cloth vertex + inner cloth lining vertex
      sPosArr.push(x, y, z);
      sUvArr.push(u * 2.0, (1 - tDown) * 2.0);

      sPosArr.push(x - nx * coatThick, y, z - nz * coatThick);
      sUvArr.push(u * 2.0, (1 - tDown) * 2.0);
    }
  }

  const stride = nCols * 2;
  for (let r = 0; r < nRings - 1; r++) {
    const row0 = r * stride;
    const row1 = (r + 1) * stride;
    for (let c = 0; c < nCols - 1; c++) {
      const o00 = row0 + c * 2;
      const o01 = row0 + (c + 1) * 2;
      const o10 = row1 + c * 2;
      const o11 = row1 + (c + 1) * 2;
      // Outer surface
      sIdxArr.push(o00, o10, o01);
      sIdxArr.push(o01, o10, o11);

      // Inner lining surface (reversed winding)
      const i00 = o00 + 1;
      const i01 = o01 + 1;
      const i10 = o10 + 1;
      const i11 = o11 + 1;
      sIdxArr.push(i00, i01, i10);
      sIdxArr.push(i01, i11, i10);
    }

    // Left front placket edge cap (c = 0)
    sIdxArr.push(row0, row0 + 1, row1);
    sIdxArr.push(row0 + 1, row1 + 1, row1);

    // Right front placket edge cap (c = nCols - 1)
    const lastCol = (nCols - 1) * 2;
    sIdxArr.push(row0 + lastCol, row1 + lastCol, row0 + lastCol + 1);
    sIdxArr.push(row0 + lastCol + 1, row1 + lastCol, row1 + lastCol + 1);
  }

  // Bottom hem edge cap (r = nRings - 1)
  const botRow = (nRings - 1) * stride;
  for (let c = 0; c < nCols - 1; c++) {
    const o0 = botRow + c * 2;
    const i0 = o0 + 1;
    const o1 = botRow + (c + 1) * 2;
    const i1 = o1 + 1;
    sIdxArr.push(o0, i0, o1);
    sIdxArr.push(i0, i1, o1);
  }

  skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPosArr, 3));
  skirtGeo.setAttribute('uv', new THREE.Float32BufferAttribute(sUvArr, 2));
  skirtGeo.setIndex(sIdxArr);

  appendSkinnedPartGeometry(
    skirtGeo,
    coatPos,
    coatNorm,
    coatUv,
    coatSkinIdx,
    coatSkinWgt,
    coatIndices,
    pos,
    skinIdxAttr,
    skinWgtAttr,
    botPos,
    botSkinIdx,
    botSkinWgt
  );

  // 3B. Tailored Trench Coat Waist Belt (y = 1.074), Belt Keeper Loops, Hanging Belt End,
  //     Chest Storm Flaps, Shoulder Epaulets, Side Pocket Welts & Sleeve Cuff Straps
  const addCoatDetailBox = (
    w: number,
    h: number,
    d: number,
    tx: number,
    ty: number,
    tz: number,
    rx = 0,
    ry = 0,
    rz = 0
  ) => {
    const g = new THREE.BoxGeometry(w, h, d, 4, 2, 2);
    const m = new THREE.Matrix4()
      .makeRotationFromEuler(new THREE.Euler(rx, ry, rz, 'XYZ'))
      .setPosition(tx, ty, tz);
    g.applyMatrix4(m);
    appendSkinnedPartGeometry(
      g,
      coatPos,
      coatNorm,
      coatUv,
      coatSkinIdx,
      coatSkinWgt,
      coatIndices,
      pos,
      skinIdxAttr,
      skinWgtAttr,
      botPos,
      botSkinIdx,
      botSkinWgt
    );
  };

  // Contoured 360-degree Trench Coat Waist Belt at y = 1.074
  const beltSegs = 40;
  const beltRows = 4;
  const beltH = 0.044;
  const beltThick = 0.0085;
  const beltGeo = new THREE.BufferGeometry();
  const beltPosArr: number[] = [];
  const beltIdxArr: number[] = [];
  for (let r = 0; r < beltRows; r++) {
    const ty = 1.074 + (0.5 - r / (beltRows - 1)) * beltH;
    const edgeBevel = r === 0 || r === beltRows - 1 ? -0.0015 : 0.001;
    for (let s = 0; s <= beltSegs; s++) {
      const th = (s / beltSegs) * Math.PI * 2;
      const sinT = Math.sin(th);
      const cosT = Math.cos(th);
      const brx = 0.164 + beltThick + edgeBevel;
      const brz = (cosT >= 0 ? 0.156 : 0.124) + beltThick + edgeBevel;
      beltPosArr.push(sinT * brx, ty, 0.012 + cosT * brz);
    }
  }
  for (let r = 0; r < beltRows - 1; r++) {
    const r0 = r * (beltSegs + 1);
    const r1 = (r + 1) * (beltSegs + 1);
    for (let s = 0; s < beltSegs; s++) {
      beltIdxArr.push(r0 + s, r1 + s, r0 + s + 1);
      beltIdxArr.push(r0 + s + 1, r1 + s, r1 + s + 1);
    }
  }
  beltGeo.setAttribute('position', new THREE.Float32BufferAttribute(beltPosArr, 3));
  beltGeo.setIndex(beltIdxArr);
  appendSkinnedPartGeometry(
    beltGeo,
    coatPos,
    coatNorm,
    coatUv,
    coatSkinIdx,
    coatSkinWgt,
    coatIndices,
    pos,
    skinIdxAttr,
    skinWgtAttr
  );

  // Two vertical belt keeper loops & tucked belt tongue on front waist
  addCoatDetailBox(0.012, 0.052, 0.012, -0.048, 1.074, 0.165, 0, -0.18, 0);
  addCoatDetailBox(0.012, 0.052, 0.012, 0.048, 1.074, 0.165, 0, 0.18, 0);
  addCoatDetailBox(0.068, 0.038, 0.008, 0.056, 1.064, 0.166, 0.05, 0.22, -0.16);

  // Left & Right Chest Storm Flaps (Gun Flaps) & Shoulder Epaulets
  for (const side of [-1, 1]) {
    // Chest storm flap
    addCoatDetailBox(
      0.082,
      0.115,
      0.008,
      side * 0.102,
      1.395,
      0.126,
      -0.16,
      side * 0.26,
      side * -0.12
    );
    // Shoulder epaulet strap
    addCoatDetailBox(
      0.088,
      0.010,
      0.028,
      side * 0.145,
      1.522,
      -0.022,
      0.06,
      side * -0.08,
      side * -0.18
    );
    // Slanted front-hip welt pocket flap
    addCoatDetailBox(
      0.010,
      0.108,
      0.032,
      side * 0.126,
      0.955,
      0.140,
      0.18,
      side * 0.58,
      side * -0.10
    );
  }

  const finalOuterCoatGeo = buildSkinnedBufferGeometry(
    coatPos,
    coatNorm,
    coatUv,
    coatSkinIdx,
    coatSkinWgt,
    coatIndices
  );

  // 4. DARK HORN BUTTONS (Waistcoat center buttons + Double-Breasted Trench Coat buttons + Epaulet/Storm-flap buttons)
  const btnPos: number[] = [];
  const btnNorm: number[] = [];
  const btnUv: number[] = [];
  const btnSkinIdx: number[] = [];
  const btnSkinWgt: number[] = [];
  const btnOutIndices: number[] = [];

  const btnRemap = new Map<number, number>();
  for (let i = 0; i < buttonIndices.length; i++) {
    const origV = buttonIndices[i];
    if (!btnRemap.has(origV)) {
      const newV = btnPos.length / 3;
      btnRemap.set(origV, newV);
      btnPos.push(pos.getX(origV), pos.getY(origV), pos.getZ(origV) + 0.002);
      btnNorm.push(
        normAttr ? normAttr.getX(origV) : 0,
        normAttr ? normAttr.getY(origV) : 0,
        normAttr ? normAttr.getZ(origV) : 1
      );
      btnUv.push(0.5, 0.5);
      btnSkinIdx.push(
        skinIdxAttr.getX(origV),
        skinIdxAttr.getY(origV),
        skinIdxAttr.getZ(origV),
        skinIdxAttr.getW(origV)
      );
      btnSkinWgt.push(
        skinWgtAttr.getX(origV),
        skinWgtAttr.getY(origV),
        skinWgtAttr.getZ(origV),
        skinWgtAttr.getW(origV)
      );
    }
    btnOutIndices.push(btnRemap.get(origV)!);
  }

  const addHornButton = (
    bx: number,
    by: number,
    bz: number,
    radius = 0.0085,
    rx = Math.PI / 2,
    ry = 0,
    rz = 0
  ) => {
    const cyl = new THREE.CylinderGeometry(radius, radius, 0.0045, 14);
    const m = new THREE.Matrix4()
      .makeRotationFromEuler(new THREE.Euler(rx, ry, rz, 'XYZ'))
      .setPosition(bx, by, bz);
    cyl.applyMatrix4(m);
    appendSkinnedPartGeometry(
      cyl,
      btnPos,
      btnNorm,
      btnUv,
      btnSkinIdx,
      btnSkinWgt,
      btnOutIndices,
      pos,
      skinIdxAttr,
      skinWgtAttr,
      botPos,
      botSkinIdx,
      botSkinWgt
    );
  };

  // Double-breasted trench coat buttons on left & right front panels
  for (const side of [-1, 1]) {
    addHornButton(side * 0.092, 1.345, 0.145, 0.009, Math.PI / 2, 0, side * -0.22);
    addHornButton(side * 0.088, 1.240, 0.154, 0.009, Math.PI / 2, 0, side * -0.2);
    addHornButton(side * 0.086, 1.145, 0.159, 0.009, Math.PI / 2, 0, side * -0.18);
    addHornButton(side * 0.088, 0.965, 0.156, 0.009, Math.PI / 2, 0, side * -0.18);
    // Epaulet button
    addHornButton(side * 0.112, 1.528, -0.02, 0.0065, 0.1, 0, side * -0.18);
  }

  const buttonsGeo = buildSkinnedBufferGeometry(
    btnPos,
    btnNorm,
    btnUv,
    btnSkinIdx,
    btnSkinWgt,
    btnOutIndices
  );

  // 5. AGED-BRASS / GUNMETAL TRENCH COAT BELT BUCKLE (at front center waist y = 1.074, z = 0.168)
  const bklPos: number[] = [];
  const bklNorm: number[] = [];
  const bklUv: number[] = [];
  const bklSkinIdx: number[] = [];
  const bklSkinWgt: number[] = [];
  const bklIndices: number[] = [];

  const addBuckleBar = (w: number, h: number, d: number, bx: number, by: number, bz: number) => {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(bx, by, bz);
    appendSkinnedPartGeometry(
      g,
      bklPos,
      bklNorm,
      bklUv,
      bklSkinIdx,
      bklSkinWgt,
      bklIndices,
      pos,
      skinIdxAttr,
      skinWgtAttr
    );
  };
  // Rectangular frame buckle (top, bottom, left, right bars + center prong)
  addBuckleBar(0.044, 0.007, 0.011, 0, 1.098, 0.168);
  addBuckleBar(0.044, 0.007, 0.011, 0, 1.050, 0.168);
  addBuckleBar(0.007, 0.055, 0.011, -0.019, 1.074, 0.168);
  addBuckleBar(0.007, 0.055, 0.011, 0.019, 1.074, 0.168);
  addBuckleBar(0.004, 0.052, 0.012, 0.0, 1.074, 0.169);
  addBuckleBar(0.022, 0.005, 0.013, -0.009, 1.074, 0.171);

  const buckleGeo = buildSkinnedBufferGeometry(
    bklPos,
    bklNorm,
    bklUv,
    bklSkinIdx,
    bklSkinWgt,
    bklIndices
  );

  const result: CachedOutfitGeometries = {
    outerJacketGeo: finalOuterCoatGeo,
    innerShirtGeo,
    waistcoatGeo,
    tieGeo,
    buttonsGeo,
    buckleGeo,
  };
  markSharedGeometry(result.outerJacketGeo);
  markSharedGeometry(result.innerShirtGeo);
  markSharedGeometry(result.waistcoatGeo);
  markSharedGeometry(result.tieGeo);
  markSharedGeometry(result.buttonsGeo);
  markSharedGeometry(result.buckleGeo);
  outfitGeometryCache.set(profile.archetype, result);
  return result;
}

/**
 * Filters Wolf3D_Headwear to remove the bowler/cowboy hat (components with y >= 1.748)
 * while retaining the sculpted side/temple/nape hair locks (Component 0).
 */
function stripHatFromHeadwearGeometry(
  sourceGeo: THREE.BufferGeometry
): THREE.BufferGeometry {
  if (cachedStrippedHeadwearGeo) {
    return cachedStrippedHeadwearGeo;
  }
  const pos = sourceGeo.attributes.position;
  const idxAttr = sourceGeo.index;
  if (!idxAttr) {
    cachedStrippedHeadwearGeo = sourceGeo.clone();
    markSharedGeometry(cachedStrippedHeadwearGeo);
    return cachedStrippedHeadwearGeo;
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
  markSharedGeometry(cleanHairGeo);
  cachedStrippedHeadwearGeo = cleanHairGeo;
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

  // 1. Displace scalp geometry outward along normals with organic hair-strand wave relief (no morph targets needed on cranium)
  const scalpGeo = sculptedHeadGeo.clone();
  scalpGeo.morphAttributes = {};
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
    const crownLift = Math.max(0, (ly - 0.04) * 0.088);
    const strandWave = Math.sin(angle * 22 + ly * 45) * 0.0024;
    const offset = 0.0095 + crownLift + strandWave;

    sPos.setXYZ(v, x + nx * offset, y + ny * (offset * 1.35), z + nz * offset);
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
    // Investigator Rowan Vance: Neat, fuller dark-brown (#4a3629) side-parted layered cut
    // merged into a single cached BufferGeometry for 1-draw-call rendering.
    if (!cachedDetectiveHairGeo) {
      const strandGeos: THREE.BufferGeometry[] = [];
      const addStrand = (pts: [number, number, number][], radius = 0.0064, tubeSegments = 18) => {
        const vectors = pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
        const curve = new THREE.CatmullRomCurve3(vectors);
        const geo = new THREE.TubeGeometry(curve, tubeSegments, radius, 6, false);
        const hPos = geo.attributes.position as THREE.BufferAttribute;
        for (let v = 0; v < hPos.count; v++) {
          let hx = hPos.getX(v);
          let hy = hPos.getY(v);
          let hz = hPos.getZ(v);
          if (hy > 0.158) {
            hy = 0.158 + (hy - 0.158) * 0.35;
            hx *= 0.94;
            if (hz < 0.065) hz *= 0.94;
          }
          hPos.setXYZ(v, hx, hy, hz);
        }
        strandGeos.push(geo);
      };

      const baseVolumeStrands: [number, number, number][][] = [
        [[-0.024, 0.178, 0.076], [-0.054, 0.165, 0.056], [-0.080, 0.130, 0.035]],
        [[-0.024, 0.178, 0.046], [-0.058, 0.166, 0.028], [-0.082, 0.126, 0.010]],
        [[-0.024, 0.176, 0.015], [-0.060, 0.165, -0.002], [-0.084, 0.124, -0.018]],
        [[-0.024, 0.175, -0.015], [-0.056, 0.162, -0.030], [-0.080, 0.122, -0.042]],
        [[-0.024, 0.178, 0.076], [0.020, 0.180, 0.066], [0.070, 0.158, 0.042]],
        [[-0.024, 0.178, 0.046], [0.024, 0.182, 0.036], [0.074, 0.160, 0.018]],
        [[-0.024, 0.176, 0.015], [0.026, 0.181, 0.005], [0.076, 0.156, -0.012]],
        [[-0.024, 0.175, -0.015], [0.024, 0.179, -0.025], [0.072, 0.152, -0.038]],
        [[0.000, 0.180, -0.035], [0.000, 0.150, -0.062], [0.000, 0.092, -0.068]],
        [[-0.030, 0.178, -0.032], [-0.035, 0.147, -0.058], [-0.033, 0.090, -0.064]],
        [[0.030, 0.178, -0.032], [0.035, 0.147, -0.058], [0.033, 0.090, -0.064]],
      ];
      baseVolumeStrands.forEach((pts) => addStrand(pts, 0.0068));

      const frontSweptStrands: [number, number, number][][] = [
        [[-0.024, 0.182, 0.082], [-0.050, 0.162, 0.094], [-0.074, 0.130, 0.068]],
        [[-0.028, 0.184, 0.084], [-0.054, 0.164, 0.096], [-0.077, 0.132, 0.064]],
        [[-0.022, 0.180, 0.080], [-0.046, 0.160, 0.092], [-0.070, 0.128, 0.072]],
        [[-0.031, 0.186, 0.085], [-0.058, 0.166, 0.097], [-0.080, 0.134, 0.060]],
        [[-0.024, 0.182, 0.082], [0.010, 0.166, 0.098], [0.042, 0.146, 0.092]],
        [[-0.020, 0.184, 0.084], [0.016, 0.168, 0.100], [0.046, 0.148, 0.090]],
        [[-0.014, 0.186, 0.086], [0.022, 0.169, 0.101], [0.050, 0.149, 0.088]],
        [[-0.008, 0.187, 0.087], [0.028, 0.170, 0.100], [0.054, 0.150, 0.085]],
        [[-0.023, 0.181, 0.080], [0.006, 0.164, 0.096], [0.038, 0.144, 0.093]],
        [[-0.017, 0.185, 0.085], [0.018, 0.167, 0.100], [0.048, 0.147, 0.089]],
        [[-0.002, 0.188, 0.087], [0.032, 0.171, 0.099], [0.058, 0.149, 0.083]],
      ];
      frontSweptStrands.forEach((pts) => addStrand(pts, 0.0062));

      const crownStrands: [number, number, number][][] = [
        [[-0.024, 0.186, -0.015], [-0.050, 0.208, 0.010], [-0.076, 0.170, 0.040]],
        [[-0.028, 0.188, 0.005], [-0.054, 0.210, 0.022], [-0.080, 0.166, 0.048]],
        [[-0.022, 0.184, -0.030], [-0.046, 0.206, -0.005], [-0.072, 0.170, 0.028]],
        [[-0.024, 0.186, -0.015], [0.012, 0.210, 0.008], [0.060, 0.186, 0.044]],
        [[-0.020, 0.188, 0.000], [0.020, 0.212, 0.018], [0.066, 0.184, 0.048]],
        [[-0.016, 0.189, 0.015], [0.026, 0.210, 0.028], [0.070, 0.180, 0.050]],
        [[-0.012, 0.190, 0.030], [0.032, 0.208, 0.038], [0.074, 0.176, 0.052]],
        [[-0.005, 0.192, -0.010], [0.000, 0.218, 0.012], [0.048, 0.194, 0.042]],
        [[-0.015, 0.190, -0.020], [-0.010, 0.216, 0.000], [0.038, 0.192, 0.035]],
        [[0.005, 0.188, -0.020], [0.038, 0.208, 0.010], [0.076, 0.172, 0.040]],
        [[0.014, 0.186, -0.008], [0.046, 0.206, 0.018], [0.080, 0.168, 0.046]],
      ];
      crownStrands.forEach((pts) => addStrand(pts, 0.0065));

      const sideStrands: [number, number, number][][] = [
        [[-0.048, 0.176, 0.038], [-0.078, 0.140, 0.028], [-0.084, 0.094, 0.020]],
        [[-0.054, 0.172, 0.016], [-0.082, 0.136, 0.010], [-0.086, 0.091, 0.006]],
        [[-0.060, 0.168, -0.010], [-0.084, 0.132, -0.014], [-0.088, 0.088, -0.016]],
        [[0.048, 0.176, 0.038], [0.078, 0.140, 0.028], [0.084, 0.094, 0.020]],
        [[0.054, 0.172, 0.016], [0.082, 0.136, 0.010], [0.086, 0.091, 0.006]],
        [[0.060, 0.168, -0.010], [0.084, 0.132, -0.014], [0.088, 0.088, -0.016]],
      ];
      sideStrands.forEach((pts) => addStrand(pts, 0.0060));

      const rearStrands: [number, number, number][][] = [
        [[0.0, 0.180, -0.038], [0.0, 0.140, -0.066], [0.0, 0.086, -0.070]],
        [[-0.022, 0.178, -0.035], [-0.025, 0.138, -0.064], [-0.022, 0.086, -0.068]],
        [[0.022, 0.178, -0.035], [0.025, 0.138, -0.064], [0.022, 0.086, -0.068]],
      ];
      rearStrands.forEach((pts) => addStrand(pts, 0.0060));

      cachedDetectiveHairGeo = mergeStaticGeometries(strandGeos);
    }

    const mergedHairMesh = new THREE.Mesh(cachedDetectiveHairGeo, hairMat);
    mergedHairMesh.castShadow = false;
    mergedHairMesh.receiveShadow = true;
    hairGroup.add(mergedHairMesh);

    // 6. Tailored Muted Gray-Brown Wool Flat Cap ('#6e6257') resting naturally over the crown
    const flatCapGroup = new THREE.Group();
    flatCapGroup.name = 'investigator_flat_cap';

    const capHex = '#6e6257';
    const capClothTex = getCachedFabricTexture(capHex, true);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: capClothTex,
      roughness: 0.82,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    capMat.userData.baseHex = capHex;

    const seamMat = new THREE.MeshStandardMaterial({
      color: 0x453d36,
      roughness: 0.85,
      metalness: 0.03,
    });
    seamMat.userData.baseHex = '#453d36';

    if (!cachedFlatCapMainGeo || !cachedFlatCapBandGeo) {
      const capRings = 20;
      const capSegs = 36;
      const capCrownGeo = new THREE.BufferGeometry();
      const capPosArr: number[] = [];
      const capUvArr: number[] = [];
      const capIdxArr: number[] = [];

      for (let r = 0; r <= capRings; r++) {
        const v = r / capRings;
        const sinV = Math.sin((v * Math.PI) / 2);
        const cosV = Math.cos((v * Math.PI) / 2);

        for (let s = 0; s <= capSegs; s++) {
          const u = s / capSegs;
          const theta = u * Math.PI * 2;
          const sinT = Math.sin(theta);
          const cosT = Math.cos(theta);

          const widthR = (0.097 + 0.010 * Math.sin(v * Math.PI)) * cosV;
          const lengthFront = 0.118;
          const lengthBack = 0.106;
          const zRadius = (cosT >= 0 ? lengthFront : lengthBack) * cosV;

          const zCenterShift = 0.008 + 0.014 * sinV;
          const x = sinT * widthR;
          const z = zCenterShift + cosT * zRadius;

          const rimY = 0.146 + 0.006 * cosT;
          const topProfileY = 0.218 - 0.015 * cosT + 0.006 * (1 - Math.abs(sinT));
          const panelSeam = Math.cos(theta * 6.0) * 0.0014 * sinV;
          const y = THREE.MathUtils.lerp(rimY, topProfileY, Math.pow(sinV, 0.75)) + panelSeam;

          capPosArr.push(x, y, z);
          capUvArr.push(u * 2.0, v * 2.0);
        }
      }

      for (let r = 0; r < capRings; r++) {
        const r0 = r * (capSegs + 1);
        const r1 = (r + 1) * (capSegs + 1);
        for (let s = 0; s < capSegs; s++) {
          capIdxArr.push(r0 + s, r0 + s + 1, r1 + s);
          capIdxArr.push(r0 + s + 1, r1 + s + 1, r1 + s);
        }
      }
      capCrownGeo.setAttribute('position', new THREE.Float32BufferAttribute(capPosArr, 3));
      capCrownGeo.setAttribute('uv', new THREE.Float32BufferAttribute(capUvArr, 2));
      capCrownGeo.setIndex(capIdxArr);
      capCrownGeo.computeVertexNormals();

      const visorRows = 8;
      const visorCols = 24;
      const visorGeo = new THREE.BufferGeometry();
      const vPosArr: number[] = [];
      const vUvArr: number[] = [];
      const vIdxArr: number[] = [];

      for (let r = 0; r <= visorRows; r++) {
        const tFwd = r / visorRows;
        for (let c = 0; c <= visorCols; c++) {
          const u = c / visorCols;
          const sNorm = (u - 0.5) * 2;
          const maxHalfW = THREE.MathUtils.lerp(0.086, 0.064, Math.pow(tFwd, 1.35));
          const vx = sNorm * maxHalfW;
          const archCurve = (1 - sNorm * sNorm) * 0.011;
          const vz =
            THREE.MathUtils.lerp(0.086, 0.150, tFwd) *
            (1 - 0.16 * sNorm * sNorm);
          const vy =
            0.146 - tFwd * 0.011 + archCurve - Math.abs(sNorm) * 0.004;

          vPosArr.push(vx, vy + 0.0024, vz);
          vUvArr.push(u, tFwd);
          vPosArr.push(vx, vy - 0.0022, vz);
          vUvArr.push(u, tFwd);
        }
      }
      const vStride = (visorCols + 1) * 2;
      for (let r = 0; r < visorRows; r++) {
        const r0 = r * vStride;
        const r1 = (r + 1) * vStride;
        for (let c = 0; c < visorCols; c++) {
          const t00 = r0 + c * 2;
          const t01 = r0 + (c + 1) * 2;
          const t10 = r1 + c * 2;
          const t11 = r1 + (c + 1) * 2;
          vIdxArr.push(t00, t10, t01);
          vIdxArr.push(t01, t10, t11);

          const b00 = t00 + 1;
          const b01 = t01 + 1;
          const b10 = t10 + 1;
          const b11 = t11 + 1;
          vIdxArr.push(b00, b01, b10);
          vIdxArr.push(b01, b11, b10);
        }
      }
      const frontRow = visorRows * vStride;
      for (let c = 0; c < visorCols; c++) {
        const t0 = frontRow + c * 2;
        const b0 = t0 + 1;
        const t1 = frontRow + (c + 1) * 2;
        const b1 = t1 + 1;
        vIdxArr.push(t0, b0, t1);
        vIdxArr.push(b0, b1, t1);
      }
      visorGeo.setAttribute('position', new THREE.Float32BufferAttribute(vPosArr, 3));
      visorGeo.setAttribute('uv', new THREE.Float32BufferAttribute(vUvArr, 2));
      visorGeo.setIndex(vIdxArr);
      visorGeo.computeVertexNormals();

      cachedFlatCapMainGeo = mergeStaticGeometries([capCrownGeo, visorGeo]);

      const bandPoints: THREE.Vector3[] = [];
      for (let s = 0; s <= 36; s++) {
        const th = (s / 36) * Math.PI * 2;
        const bx = Math.sin(th) * 0.0955;
        const bz = 0.008 + Math.cos(th) * (Math.cos(th) >= 0 ? 0.116 : 0.104);
        const by = 0.144 + 0.006 * Math.cos(th);
        bandPoints.push(new THREE.Vector3(bx, by, bz));
      }
      const bandCurve = new THREE.CatmullRomCurve3(bandPoints, true);
      cachedFlatCapBandGeo = new THREE.TubeGeometry(bandCurve, 36, 0.0032, 6, true);
      markSharedGeometry(cachedFlatCapBandGeo);
    }

    const capMainMesh = new THREE.Mesh(cachedFlatCapMainGeo, capMat);
    capMainMesh.castShadow = true;
    capMainMesh.receiveShadow = true;
    flatCapGroup.add(capMainMesh);

    const bandMesh = new THREE.Mesh(cachedFlatCapBandGeo, seamMat);
    flatCapGroup.add(bandMesh);

    headFeatureGroup.add(flatCapGroup);
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
 * Creates a dedicated, anatomically unified 3D Hand-Holding-Smartphone asset:
 * - Upright smartphone with lit AMOLED scam alert screen on -Z (pressed flat into palm).
 * - Full broad back panel facing +Z toward viewer with metallic triple camera lenses at the top.
 * - Palm supporting the phone screen from behind.
 * - Wrist situated below the phone, seamlessly meeting the jacket sleeve cuff.
 * - Four fingers (Index, Middle, Ring, Pinky) curling tightly around the outer long edge (-X),
 *   with knuckles and distal pads visibly wrapping around the edge.
 * - Opposing thumb gripping the inner long edge (+X).
 * - Zero gaps, zero clipping, zero edge-on distortion.
 */
/**
 * Creates the investigator's smartphone prop with realistic chassis, metallic rim,
 * triple camera cluster, glass sheen, AMOLED screen, and screen glow light.
 * Attaches directly to the character rig's RightHand palm bone socket.
 */
function createInvestigatorSmartphoneProp(): {
  phoneGroup: THREE.Group;
  screenGlowLight: THREE.PointLight | null;
} {
  const phoneW = 0.076;
  const phoneH = 0.156;
  const phoneD = 0.009;

  const phoneGroup = new THREE.Group();
  phoneGroup.name = 'investigatorPhoneProp';

  // The smartphone is held upright (rotated 180 degrees in the hand so the rear camera cluster is at the TOP):
  // - Its rear camera cluster sits at the top (+Y, pointing toward his elbow)
  // - Its bottom edge (-Y) points toward the floor
  // - Its back panel (+Z) faces the viewer directly
  const deviceMeshGroup = new THREE.Group();
  deviceMeshGroup.name = 'uprightSmartphoneDevice';
  phoneGroup.add(deviceMeshGroup);

  // Slim anodized chassis centered at (0, 0, 0)
  const chassisGeo = new THREE.BoxGeometry(phoneW, phoneH, phoneD);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.36,
    metalness: 0.16,
  });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(0, 0, 0);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  deviceMeshGroup.add(chassis);

  // Precision brushed-titanium bevel rim around the perimeter
  const rimGeo = new THREE.BoxGeometry(
    phoneW + 0.0028,
    phoneH + 0.0028,
    phoneD - 0.002
  );
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.32,
    metalness: 0.16,
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.position.set(0, 0, 0);
  deviceMeshGroup.add(rimMesh);

  // Tactile side buttons on the side rails
  const buttonMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.28,
    metalness: 0.16,
  });
  const powerBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.0024, 0.018, 0.0035),
    buttonMat
  );
  powerBtn.position.set(phoneW / 2 + 0.0014, 0.028, 0);

  const volUpBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.0024, 0.015, 0.0035),
    buttonMat
  );
  volUpBtn.position.set(-phoneW / 2 - 0.0014, 0.034, 0);

  const volDownBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.0024, 0.015, 0.0035),
    buttonMat
  );
  volDownBtn.position.set(-phoneW / 2 - 0.0014, 0.014, 0);
  deviceMeshGroup.add(powerBtn, volUpBtn, volDownBtn);

  // Broad rear back panel (+Z outward face facing viewer)
  // Lighter brushed silver-slate titanium finish so the dark rear camera cluster at the top (+Y) has unmistakable contrast
  const backGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(phoneW - 0.002, phoneH - 0.002),
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      emissive: 0x1e293b,
      emissiveIntensity: 0.32,
      roughness: 0.34,
      metalness: 0.12,
      side: THREE.DoubleSide,
    })
  );
  backGlass.position.set(0, 0, phoneD / 2 + 0.0006);
  deviceMeshGroup.add(backGlass);

  // Rear Camera Cluster at the TOP of the phone (+Y, pointing toward his elbow!)
  const islandW = 0.038;
  const islandH = 0.050;
  const islandX = -phoneW / 2 + islandW / 2 + 0.0055;
  const islandY = phoneH / 2 - islandH / 2 - 0.0055;
  const islandZ = phoneD / 2;

  const islandBezel = new THREE.Mesh(
    new THREE.BoxGeometry(islandW + 0.0032, islandH + 0.0032, 0.0028),
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.28,
      metalness: 0.14,
    })
  );
  islandBezel.position.set(islandX, islandY, islandZ + 0.0014);
  deviceMeshGroup.add(islandBezel);

  const island = new THREE.Mesh(
    new THREE.BoxGeometry(islandW, islandH, 0.0036),
    new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.22,
      metalness: 0.1,
    })
  );
  island.position.set(islandX, islandY, islandZ + 0.002);
  deviceMeshGroup.add(island);

  // Triple Pro Camera Lenses inside the top camera cluster (+Y, pointing toward his elbow)
  const lensRingGeo = new THREE.CylinderGeometry(0.0076, 0.0076, 0.0044, 24);
  lensRingGeo.rotateX(Math.PI / 2);
  const lensRingMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.12,
  });

  const opticGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.0048, 24);
  opticGeo.rotateX(Math.PI / 2);
  const opticMat = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.14,
    metalness: 0.1,
  });

  const innerApertureGeo = new THREE.RingGeometry(0.0018, 0.0032, 20);
  const innerApertureMat = new THREE.MeshBasicMaterial({
    color: 0x0ea5e9,
    side: THREE.DoubleSide,
  });

  [
    [islandX - 0.008, islandY + 0.013],
    [islandX - 0.008, islandY - 0.013],
    [islandX + 0.0085, islandY],
  ].forEach(([lx, ly]) => {
    const ring = new THREE.Mesh(lensRingGeo, lensRingMat);
    ring.position.set(lx, ly, islandZ + 0.0024);
    const optic = new THREE.Mesh(opticGeo, opticMat);
    optic.position.set(lx, ly, islandZ + 0.0026);
    const aperture = new THREE.Mesh(innerApertureGeo, innerApertureMat);
    aperture.position.set(lx, ly, islandZ + 0.0051);
    deviceMeshGroup.add(ring, optic, aperture);
  });

  // LED Flash & LiDAR sensor inside the top camera cluster at +Y
  const flashGeo = new THREE.CylinderGeometry(0.0036, 0.0036, 0.0044, 16);
  flashGeo.rotateX(Math.PI / 2);
  const flash = new THREE.Mesh(
    flashGeo,
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  flash.position.set(islandX + 0.0085, islandY + 0.014, islandZ + 0.0026);
  deviceMeshGroup.add(flash);

  const lidar = new THREE.Mesh(
    flashGeo,
    new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.25,
      metalness: 0.15,
    })
  );
  lidar.position.set(islandX + 0.0085, islandY - 0.014, islandZ + 0.0025);
  deviceMeshGroup.add(lidar);

  // Lit AMOLED front screen (-Z face pressed against palm)
  if (!cachedCaseScreenTex) {
    cachedCaseScreenTex =
      ProceduralTextureGenerator.createCaseDeliveryMessageScreenTexture();
  }
  const screenGeo = new THREE.PlaneGeometry(phoneW - 0.006, phoneH - 0.008);
  const screenMat = new THREE.MeshBasicMaterial({
    map: cachedCaseScreenTex,
    side: THREE.DoubleSide,
  });
  const frontScreen = new THREE.Mesh(screenGeo, screenMat);
  frontScreen.rotation.y = Math.PI;
  frontScreen.position.set(0, 0, -phoneD / 2 - 0.0006);
  deviceMeshGroup.add(frontScreen);

  // Disable frustum culling on all child meshes; only main chassis casts shadow
  phoneGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      m.frustumCulled = false;
      m.castShadow = m === chassis;
      m.receiveShadow = true;
    }
  });

  return { phoneGroup, screenGlowLight: null };
}

/**
 * Extracts the 431-vertex organic sculpted right hand component (Root 552) from Wolf3D_Body,
 * deforms it via Linear Blend Skinning (LBS) into a complete, pre-posed "holding smartphone"
 * hand pose in Phone Space:
 * - Palm supporting the screen (-Z) from behind
 * - Four articulated fingers (Index, Middle, Ring, Pinky) curled around the lower-middle outer long edge (-X)
 * - Opposing thumb curled around the lower-middle inner long edge (+X)
 * - Top end of the phone (+Y, pointing toward his elbow) and its rear camera cluster 100% unobstructed above the grip
 * - Bottom edge of the phone (-Y) pointing toward the floor
 * Also returns index buffers to exclude the open right hand from Wolf3D_Body when holding the phone.
 */
function buildPrePosedRightHandAndFilterBody(
  bodySkinnedMesh: THREE.SkinnedMesh,
  clonedRoot: THREE.Group,
  rightHandBone: THREE.Bone,
  jacketMat: THREE.Material,
  innerShirtMat: THREE.Material
): {
  posedRightHandGroup: THREE.Group;
  fullBodyIndex: THREE.BufferAttribute;
  bodyWithoutRightHandIndex: THREE.BufferAttribute;
} | null {
  if (!cachedPosedRightHandData) {
    const sourceGeo = bodySkinnedMesh.geometry;
    const posAttr = sourceGeo.attributes.position;
    const uvAttr = sourceGeo.attributes.uv;
    const skinIndexAttr = sourceGeo.attributes.skinIndex;
    const skinWeightAttr = sourceGeo.attributes.skinWeight;
    const idxAttr = sourceGeo.index;
    if (!posAttr || !skinIndexAttr || !skinWeightAttr || !idxAttr) {
      return null;
    }

    const idxArray = idxAttr.array;
    const nVerts = posAttr.count;

    // Save original bind quaternions of right-hand finger/thumb bones
    const savedFingerQuats: Array<{ bone: THREE.Bone; quat: THREE.Quaternion }> = [];
    const applyTempOffset = (boneName: string, rx: number, ry: number, rz: number) => {
      const b = clonedRoot.getObjectByName(boneName) as THREE.Bone | null;
      if (!b) return;
      savedFingerQuats.push({ bone: b, quat: b.quaternion.clone() });
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, 'XYZ'));
      b.quaternion.multiply(q);
    };

    applyTempOffset('RightHandIndex1', 1.15, -0.25, 0.16);
    applyTempOffset('RightHandIndex2', 1.52, 0.0, 0.0);
    applyTempOffset('RightHandIndex3', 0.48, 0.0, 0.0);

    applyTempOffset('RightHandMiddle1', 1.18, -0.25, 0.04);
    applyTempOffset('RightHandMiddle2', 1.55, 0.0, 0.0);
    applyTempOffset('RightHandMiddle3', 0.48, 0.0, 0.0);

    applyTempOffset('RightHandRing1', 1.08, -0.28, -0.08);
    applyTempOffset('RightHandRing2', 1.62, 0.0, 0.0);
    applyTempOffset('RightHandRing3', 0.52, 0.0, 0.0);

    applyTempOffset('RightHandPinky1', 0.92, -0.35, -0.18);
    applyTempOffset('RightHandPinky2', 1.68, 0.0, 0.0);
    applyTempOffset('RightHandPinky3', 0.55, 0.0, 0.0);

    applyTempOffset('RightHandThumb1', 0.12, -0.58, -1.52);
    applyTempOffset('RightHandThumb2', 0.92, 0.22, 0.52);
    applyTempOffset('RightHandThumb3', 0.62, 0.12, 0.38);

    clonedRoot.updateMatrixWorld(true);

    const skeleton = bodySkinnedMesh.skeleton;
    const jointMatrices = skeleton.bones.map((bone, i) => {
      const m = new THREE.Matrix4();
      m.multiplyMatrices(bone.matrixWorld, skeleton.boneInverses[i]);
      return m;
    });

    const rhInv = rightHandBone.matrixWorld.clone().invert();
    const rotMat = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(0.06, 0.14, 1.58, 'XYZ')
    );
    const scaleMat = new THREE.Matrix4().makeScale(0.75, 0.96, 0.58);
    const transMat = new THREE.Matrix4().makeTranslation(0.038, -0.016, -0.011);
    const handToPhone = new THREE.Matrix4()
      .multiplyMatrices(transMat, scaleMat)
      .multiply(rotMat);

    savedFingerQuats.forEach(({ bone, quat }) => {
      bone.quaternion.copy(quat);
    });
    clonedRoot.updateMatrixWorld(true);

    const vertRemap = new Int32Array(nVerts).fill(-1);
    const handPositions: number[] = [];
    const handUVs: number[] = [];
    let nextHandVertIdx = 0;

    const pBind = new THREE.Vector3();
    const pSkinned = new THREE.Vector3();
    const pTemp = new THREE.Vector3();

    for (let v = 0; v < nVerts; v++) {
      if (posAttr.getX(v) > -0.38) continue;

      pBind.set(posAttr.getX(v), posAttr.getY(v), posAttr.getZ(v));
      pSkinned.set(0, 0, 0);

      const j0 = skinIndexAttr.getX(v);
      const j1 = skinIndexAttr.getY(v);
      const j2 = skinIndexAttr.getZ(v);
      const j3 = skinIndexAttr.getW(v);
      const w0 = skinWeightAttr.getX(v);
      const w1 = skinWeightAttr.getY(v);
      const w2 = skinWeightAttr.getZ(v);
      const w3 = skinWeightAttr.getW(v);

      const js = [j0, j1, j2, j3];
      const ws = [w0, w1, w2, w3];

      let wForearm = 0;
      let wHand = 0;
      let wThumb1 = 0;
      let wThumbDistal = 0;
      let wFinger1 = 0;
      let wFinger2 = 0;
      let wFinger3 = 0;

      for (let k = 0; k < 4; k++) {
        const w = ws[k];
        if (w > 0) {
          const j = js[k];
          const bName = skeleton.bones[j]?.name || '';
          if (bName === 'RightForeArm') wForearm += w;
          if (bName === 'RightHand') wHand += w;
          if (bName === 'RightHandThumb1') wThumb1 += w;
          if (bName === 'RightHandThumb2' || bName === 'RightHandThumb3') {
            wThumbDistal += w;
          }
          if (/(Index|Middle|Ring|Pinky)1/.test(bName)) wFinger1 += w;
          if (/(Index|Middle|Ring|Pinky)2/.test(bName)) wFinger2 += w;
          if (/(Index|Middle|Ring|Pinky)3/.test(bName)) wFinger3 += w;
          pTemp.copy(pBind).applyMatrix4(jointMatrices[j]);
          pSkinned.addScaledVector(pTemp, w);
        }
      }

      pSkinned.applyMatrix4(rhInv).applyMatrix4(handToPhone);

      const isThumbDistal = wThumbDistal > 0.22;
      const isThumbBase = !isThumbDistal && wThumb1 > 0.2;
      const isDistalFinger = wFinger2 + wFinger3 > 0.2;
      const isProxFinger = !isDistalFinger && wFinger1 > 0.22;
      const isWrist = wForearm > 0.04 || (wHand > 0.5 && pBind.x > -0.442);
      const isPalm = !isThumbDistal && !isDistalFinger && !isWrist;

      if (isWrist) {
        const tW = Math.min(1, Math.max(0, (pBind.x - -0.448) / 0.038));
        const wristX = THREE.MathUtils.clamp(
          (pBind.z - -0.012) * 0.72,
          -0.02,
          0.02
        );
        const targetY = -0.042 - 0.008 * tW;
        pSkinned.x = THREE.MathUtils.lerp(
          pSkinned.x - 0.016,
          wristX,
          0.85 + 0.15 * tW
        );
        pSkinned.y = THREE.MathUtils.lerp(pSkinned.y, targetY, 0.82 + 0.18 * tW);
        pSkinned.y = THREE.MathUtils.clamp(pSkinned.y, -0.068, 0.068);
        pSkinned.z = Math.min(
          Math.max(pSkinned.z, -0.013),
          -0.005 - 0.003 * tW
        );
      }

      if (isPalm) {
        if (isThumbBase) {
          pSkinned.y -= 0.016;
          pSkinned.x = Math.min(0.041, Math.max(0.035, pSkinned.x));
        }
        pSkinned.y = THREE.MathUtils.clamp(pSkinned.y, -0.068, 0.068);
        pSkinned.x = THREE.MathUtils.clamp(pSkinned.x, -0.041, 0.041);

        const atOuterEdge = Math.abs(pSkinned.x) > 0.0375;
        if (atOuterEdge && pSkinned.y < 0.016) {
          pSkinned.z = Math.min(Math.max(pSkinned.z, -0.008), 0.0015);
        } else {
          pSkinned.z = Math.min(Math.max(pSkinned.z, -0.0125), -0.0046);
        }
      }

      if (isDistalFinger || isProxFinger) {
        pSkinned.y = THREE.MathUtils.clamp(pSkinned.y, -0.058, 0.016);
        if (pSkinned.x < -0.0425) {
          pSkinned.x = -0.0425 + (pSkinned.x + 0.0425) * 0.12;
        }
        if (isDistalFinger && pSkinned.z > -0.002) {
          const tCurl = Math.min(
            1,
            Math.max(0, wFinger3 * 1.15 + wFinger2 * 0.35)
          );
          const baseEdgeX = -0.0405 + tCurl * 0.0235;
          pSkinned.x = THREE.MathUtils.lerp(pSkinned.x, baseEdgeX, 0.65);
          pSkinned.x = THREE.MathUtils.clamp(pSkinned.x, -0.042, -0.0155);
          pSkinned.z = 0.0054 + Math.min(0.0055, Math.max(0, pSkinned.z) * 0.3);
        } else if (pSkinned.x > -0.0375 && pSkinned.z < 0.002) {
          pSkinned.z = Math.min(pSkinned.z, -0.0046);
        }
      }

      if (isThumbDistal) {
        pSkinned.y -= 0.018;
        pSkinned.y = THREE.MathUtils.clamp(pSkinned.y, -0.032, 0.016);
        if (pSkinned.x > 0.0425) {
          pSkinned.x = 0.0425 + (pSkinned.x - 0.0425) * 0.12;
        }
        if (pSkinned.z > -0.001) {
          const reach = Math.max(0, 0.04 - pSkinned.x);
          pSkinned.x = THREE.MathUtils.clamp(0.04 - reach * 0.85, 0.02, 0.042);
          pSkinned.z = 0.0054 + Math.min(0.0055, Math.max(0, pSkinned.z) * 0.28);
        } else if (pSkinned.x < 0.0375) {
          pSkinned.z = Math.min(pSkinned.z, -0.0046);
        }
      }

      vertRemap[v] = nextHandVertIdx++;
      handPositions.push(pSkinned.x, pSkinned.y, pSkinned.z);
      if (uvAttr) {
        handUVs.push(uvAttr.getX(v), uvAttr.getY(v));
      } else {
        handUVs.push(0, 0);
      }
    }

    const handIndices: number[] = [];
    const bodyWithoutRightHand: number[] = [];
    const fullBody: number[] = [];

    for (let i = 0; i < idxArray.length; i += 3) {
      const a = idxArray[i];
      const b = idxArray[i + 1];
      const c = idxArray[i + 2];
      fullBody.push(a, b, c);

      const ra = vertRemap[a];
      const rb = vertRemap[b];
      const rc = vertRemap[c];
      if (ra !== -1 && rb !== -1 && rc !== -1) {
        handIndices.push(ra, rb, rc);
      }

      const isRightHandTri =
        posAttr.getX(a) < -0.38 ||
        posAttr.getX(b) < -0.38 ||
        posAttr.getX(c) < -0.38;
      if (!isRightHandTri) {
        bodyWithoutRightHand.push(a, b, c);
      }
    }

    const handGeo = new THREE.BufferGeometry();
    handGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(handPositions, 3)
    );
    handGeo.setAttribute('uv', new THREE.Float32BufferAttribute(handUVs, 2));
    handGeo.setIndex(handIndices);
    handGeo.computeVertexNormals();
    markSharedGeometry(handGeo);

    const palmBackingGeo = new THREE.BoxGeometry(0.072, 0.142, 0.006);
    const wristBridgeGeo = new THREE.CylinderGeometry(0.024, 0.026, 0.04, 16);
    const thenarCradleGeo = new THREE.CylinderGeometry(0.0042, 0.0048, 0.048, 12);
    markSharedGeometry(palmBackingGeo);
    markSharedGeometry(wristBridgeGeo);
    markSharedGeometry(thenarCradleGeo);

    cachedPosedRightHandData = {
      handGeo,
      palmBackingGeo,
      wristBridgeGeo,
      thenarCradleGeo,
      fullBodyIndex: new THREE.Uint16BufferAttribute(fullBody, 1),
      bodyWithoutRightHandIndex: new THREE.Uint16BufferAttribute(
        bodyWithoutRightHand,
        1
      ),
    };
  }

  const {
    handGeo,
    palmBackingGeo,
    wristBridgeGeo,
    thenarCradleGeo,
    fullBodyIndex,
    bodyWithoutRightHandIndex,
  } = cachedPosedRightHandData;

  const handMat = (bodySkinnedMesh.material as THREE.MeshStandardMaterial).clone();
  handMat.side = THREE.DoubleSide;
  const posedHandMesh = new THREE.Mesh(handGeo, handMat);
  posedHandMesh.name = 'PrePosed_RightHand_Grip';
  posedHandMesh.castShadow = true;
  posedHandMesh.receiveShadow = true;
  posedHandMesh.frustumCulled = false;

  const posedRightHandGroup = new THREE.Group();
  posedRightHandGroup.name = 'PrePosed_RightHand_Group';
  posedRightHandGroup.add(posedHandMesh);

  const supportSkinMat = handMat.clone();
  supportSkinMat.map = null;

  const palmBackingMesh = new THREE.Mesh(palmBackingGeo, supportSkinMat);
  palmBackingMesh.position.set(0.0, -0.002, -0.0076);

  const wristCuffBridge = new THREE.Mesh(wristBridgeGeo, supportSkinMat);
  wristCuffBridge.scale.set(1.06, 1.0, 0.76);
  wristCuffBridge.rotation.x = 0.28;
  wristCuffBridge.position.set(0.003, 0.084, -0.016);

  const thenarCradle = new THREE.Mesh(thenarCradleGeo, supportSkinMat);
  thenarCradle.scale.set(1.0, 1.0, 1.35);
  thenarCradle.position.set(0.0375, -0.012, -0.0042);

  posedRightHandGroup.add(palmBackingMesh, wristCuffBridge, thenarCradle);

  void jacketMat;
  void innerShirtMat;

  return {
    posedRightHandGroup,
    fullBodyIndex,
    bodyWithoutRightHandIndex,
  };
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

  // 2. Grounded Environmental Target Ring for NPCs (no per-character PointLights to keep fragment shader fast)
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
  }

  // 3. Humanoid Skeleton & Mesh State
  let characterModel: THREE.Group | null = null;
  let heldPhoneGroup: THREE.Group | null = null;
  let heldPhoneLight: THREE.PointLight | null = null;
  let phoneSocketGroup: THREE.Group | null = null;
  let bodyMeshRef: THREE.SkinnedMesh | null = null;
  let fullBodyIndexRef: THREE.BufferAttribute | null = null;
  let bodyWithoutRightHandIndexRef: THREE.BufferAttribute | null = null;
  let isRightHandFiltered = false;
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
    let bottomSkinnedMesh: THREE.SkinnedMesh | null = null;
    let headSkinnedMesh: THREE.SkinnedMesh | null = null;
    let headwearSkinnedMesh: THREE.SkinnedMesh | null = null;
    let outerJacketMatRef: THREE.MeshStandardMaterial | null = null;
    let innerShirtMatRef: THREE.MeshStandardMaterial | null = null;

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh;
        const isPrimaryShadowCaster =
          mesh.name === 'Wolf3D_Body' ||
          mesh.name === 'Wolf3D_Head' ||
          mesh.name === 'Wolf3D_Outfit_Top' ||
          mesh.name === 'Wolf3D_Outfit_Bottom' ||
          mesh.name === 'Wolf3D_Outfit_Footwear';
        mesh.castShadow = isPrimaryShadowCaster;
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
          bottomSkinnedMesh = mesh;
          // Tailored dark-gray wool trousers / chinos with preserved normal crease maps + fabric weave
          mat.map = trousersClothTex;
          mat.color.set(0xffffff);
          mat.userData.baseHex = trousersHex;
          mat.roughness = profile.archetype === 'investigator' ? 0.78 : 0.84;
          mat.metalness = 0.02;
          if (mat.normalScale) mat.normalScale.set(1.3, 1.3);

          if (profile.archetype === 'investigator') {
            // Sculpt subtle vertical pressed dress-trouser creases along the front & back of each leg
            // and tuck the upper hip/thigh cleanly inside the long tailored trench coat skirt (cached)
            if (!cachedInvestigatorTrousersGeo) {
              const bGeo = mesh.geometry.clone();
              const bPos = bGeo.attributes.position as THREE.BufferAttribute;
              for (let v = 0; v < bPos.count; v++) {
                let bx = bPos.getX(v);
                const by = bPos.getY(v);
                let bz = bPos.getZ(v);
                if (by > 0.50 && by < 1.04) {
                  bx *= 0.94;
                  bz *= 0.94;
                }
                if (by > 0.12 && by < 0.88) {
                  const legCenter = bx >= 0 ? 0.115 : -0.115;
                  const crease =
                    Math.exp(-Math.pow((bx - legCenter) / 0.016, 2)) * 0.0032;
                  bz += bz >= 0 ? crease : -crease * 0.8;
                }
                bPos.setXYZ(v, bx, by, bz);
              }
              bPos.needsUpdate = true;
              bGeo.computeVertexNormals();
              markSharedGeometry(bGeo);
              cachedInvestigatorTrousersGeo = bGeo;
            }
            mesh.geometry = cachedInvestigatorTrousersGeo;
          }
        } else if (
          mesh.name === 'Wolf3D_Outfit_Footwear' ||
          matName === 'Wolf3D_Outfit_Footwear'
        ) {
          mat.color.set(shoesHex);
          mat.userData.baseHex = shoesHex;
          if (profile.archetype === 'investigator') {
            // Polished dark leather Oxford shoes
            mat.roughness = 0.22;
            mat.metalness = 0.14;
          }
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
          mat.userData.baseHex = irisHex;
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
          mat.userData.baseHex = skinHex;
          mat.roughness = 0.62;
          mat.metalness = 0.01;
          if (mesh.name === 'Wolf3D_Head') {
            headSkinnedMesh = mesh;
          } else if (mesh.name === 'Wolf3D_Body') {
            if (!config.isNpc) {
              mesh.geometry = mesh.geometry.clone();
            }
            bodyMeshRef = mesh;
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

    // 2) Decompose Wolf3D_Outfit_Top into Outer Trench Coat, Crisp White Shirt,
    //    Charcoal-Gray Waistcoat, Deep Red Tie, Horn Buttons, and Belt Buckle
    if (topSkinnedMesh) {
      const tMesh = topSkinnedMesh as THREE.SkinnedMesh;
      const bMesh = bottomSkinnedMesh as THREE.SkinnedMesh | null;
      const baseTopMat = tMesh.material as THREE.MeshStandardMaterial;
      const {
        outerJacketGeo,
        innerShirtGeo,
        waistcoatGeo,
        tieGeo,
        buttonsGeo,
        buckleGeo,
      } = decomposeAndTailorOutfitTop(
        tMesh.geometry,
        profile,
        bMesh?.geometry
      );

      const outerMat = baseTopMat.clone();
      outerMat.map = jacketClothTex;
      outerMat.color.set(0xffffff);
      outerMat.userData.baseHex = jacketHex;
      outerMat.roughness = profile.isDenimJacket ? 0.76 : 0.84;
      outerMat.metalness = 0.03;
      outerMat.side = THREE.DoubleSide;
      if (outerMat.normalScale) outerMat.normalScale.set(1.35, 1.35);
      outerJacketMatRef = outerMat;

      tMesh.geometry = outerJacketGeo;
      tMesh.material = outerMat;

      const innerMat = baseTopMat.clone();
      innerMat.map = innerShirtClothTex;
      innerMat.color.set(0xffffff);
      innerMat.userData.baseHex = innerShirtHex;
      innerMat.roughness = 0.82;
      innerMat.metalness = 0.01;
      innerShirtMatRef = innerMat;

      const addBoundGarmentLayer = (
        name: string,
        geo: THREE.BufferGeometry,
        mat: THREE.Material
      ) => {
        const layerMesh = new THREE.SkinnedMesh(geo, mat);
        layerMesh.name = name;
        layerMesh.castShadow = false;
        layerMesh.receiveShadow = true;
        layerMesh.frustumCulled = false;
        layerMesh.bind(tMesh.skeleton, tMesh.bindMatrix);
        if (tMesh.parent) {
          tMesh.parent.add(layerMesh);
        }
      };

      addBoundGarmentLayer('Wolf3D_Inner_Shirt', innerShirtGeo, innerMat);

      if (waistcoatGeo) {
        const waistcoatHex = '#3a414d';
        const waistcoatMat = baseTopMat.clone();
        waistcoatMat.map = getCachedFabricTexture(waistcoatHex, true);
        waistcoatMat.color.set(0xffffff);
        waistcoatMat.userData.baseHex = waistcoatHex;
        waistcoatMat.roughness = 0.78;
        waistcoatMat.metalness = 0.03;
        addBoundGarmentLayer('Wolf3D_Waistcoat', waistcoatGeo, waistcoatMat);
      }

      if (tieGeo) {
        const tieHex = '#881322';
        const tieMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: getCachedFabricTexture(tieHex, true),
          roughness: 0.48,
          metalness: 0.06,
          side: THREE.DoubleSide,
        });
        tieMat.userData.baseHex = tieHex;
        addBoundGarmentLayer('Wolf3D_Silk_Tie', tieGeo, tieMat);
      }

      if (buttonsGeo) {
        const buttonHex = '#18120e';
        const buttonMat = new THREE.MeshStandardMaterial({
          color: buttonHex,
          roughness: 0.28,
          metalness: 0.16,
        });
        buttonMat.userData.baseHex = buttonHex;
        addBoundGarmentLayer('Wolf3D_Coat_Buttons', buttonsGeo, buttonMat);
      }

      if (buckleGeo) {
        const buckleHex = '#6e5d49';
        const buckleMat = new THREE.MeshStandardMaterial({
          color: buckleHex,
          roughness: 0.30,
          metalness: 0.68,
        });
        buckleMat.userData.baseHex = buckleHex;
        addBoundGarmentLayer('Wolf3D_Belt_Buckle', buckleGeo, buckleMat);
      }
    }

    // 3) Sculpt character-specific facial bone proportions on Wolf3D_Head and extract
    //    anatomical ScalpHairSkinnedMesh & FacialHairSkinnedMesh (short boxed beard) (cached per archetype)
    if (headSkinnedMesh) {
      const hMesh = headSkinnedMesh as THREE.SkinnedMesh;
      let cachedHead = headGeometryCache.get(profile.archetype);
      if (!cachedHead) {
        const sculptedHeadGeo = sculptCharacterFaceGeometry(
          hMesh.geometry,
          profile
        );
        const { scalpGeo, beardGeo } = buildAnatomicalScalpAndBeardGeometries(
          sculptedHeadGeo,
          profile
        );
        markSharedGeometry(sculptedHeadGeo);
        markSharedGeometry(scalpGeo);
        markSharedGeometry(beardGeo);
        cachedHead = { sculptedHeadGeo, scalpGeo, beardGeo };
        headGeometryCache.set(profile.archetype, cachedHead);
      }
      const { sculptedHeadGeo, scalpGeo, beardGeo } = cachedHead;
      hMesh.geometry = sculptedHeadGeo;

      const scalpMesh = new THREE.SkinnedMesh(scalpGeo, hairMat);
      scalpMesh.name = 'Anatomical_Scalp_Hair';
      scalpMesh.castShadow = false;
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
        beardSkinnedMesh.castShadow = false;
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

    // Attach combined pre-posed "holding smartphone" hand-and-phone model directly to RightHand bone socket (Investigator only)
    if (bones.rightHand && !config.isNpc) {
      const socket = new THREE.Group();
      socket.name = 'rightHandPhoneSocket';
      socket.position.set(0.02298, 0.10409, -0.01144);
      socket.quaternion.set(0.77553, 0.0435, 0.62865, -0.03824);
      socket.scale.set(1, 1, 1);
      bones.rightHand.add(socket);
      phoneSocketGroup = socket;

      const { phoneGroup, screenGlowLight } =
        createInvestigatorSmartphoneProp();

      if (bodyMeshRef) {
        const fallbackJacketMat =
          outerJacketMatRef ||
          new THREE.MeshStandardMaterial({ color: jacketHex, roughness: 0.8 });
        const fallbackInnerMat =
          innerShirtMatRef ||
          new THREE.MeshStandardMaterial({
            color: innerShirtHex,
            roughness: 0.85,
          });
        const handResult = buildPrePosedRightHandAndFilterBody(
          bodyMeshRef,
          cloned,
          bones.rightHand,
          fallbackJacketMat,
          fallbackInnerMat
        );
        if (handResult) {
          phoneGroup.add(handResult.posedRightHandGroup);
          fullBodyIndexRef = handResult.fullBodyIndex;
          bodyWithoutRightHandIndexRef = handResult.bodyWithoutRightHandIndex;
          bodyMeshRef.geometry.setIndex(handResult.bodyWithoutRightHandIndex);
          isRightHandFiltered = true;
        }
      }

      phoneGroup.visible = true;
      socket.add(phoneGroup);

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
    const isInvestigator =
      config.archetype === 'investigator' ||
      !config.isNpc ||
      /rowan|detective|investigator|player/.test(config.id);
    const hasPhoneInHand =
      (isInvestigator && options?.showPhoneInHand !== false) ||
      Boolean(options?.showPhoneInHand || isInspectingPhone);
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
      if (
        bodyMeshRef &&
        bodyWithoutRightHandIndexRef &&
        !isRightHandFiltered
      ) {
        bodyMeshRef.geometry.setIndex(bodyWithoutRightHandIndexRef);
        isRightHandFiltered = true;
      }
      if (bones.rightHand) {
        bones.rightHand.scale.set(1, 1, 1);
      }
      if (heldPhoneGroup) {
        heldPhoneGroup.visible = true;
      }

      // Left hand: Completely relaxed beside left thigh with natural, slightly curved fingers:
      leftGripFingers.forEach(({ j1, j2, j3 }) => {
        slerpBoneOffset(j1, 0.18, 0, 0, blendAlpha);
        slerpBoneOffset(j2, 0.28, 0, 0, blendAlpha);
        slerpBoneOffset(j3, 0.18, 0, 0, blendAlpha);
      });
      leftThumbBones.t1 && slerpBoneOffset(leftThumbBones.t1, 0.10, 0, 0, blendAlpha);
      leftThumbBones.t2 && slerpBoneOffset(leftThumbBones.t2, 0.08, 0, 0, blendAlpha);
      leftThumbBones.t3 && slerpBoneOffset(leftThumbBones.t3, 0.06, 0, 0, blendAlpha);

      const syncBreath = Math.sin(animTimeAcc * 1.65) * 0.005;

      if (isWalking) {
        const armSwingAmp = isJogging ? 0.34 : 0.22;
        const rightArmSwingX = Math.sin(walkCyclePhase) * (armSwingAmp * 0.4);
        const leftArmSwingX = Math.sin(walkCyclePhase + Math.PI) * armSwingAmp;

        // Right arm walk swing holding upright phone in palm beside thigh, wrist below phone
        slerpBoneOffset(
          bones.rightArm,
          0.36 + syncBreath + rightArmSwingX,
          -0.06,
          -0.14,
          blendAlpha
        );
        slerpBoneOffset(bones.rightForeArm, 0.15, 0.0, 0.32, blendAlpha);
        slerpBoneOffset(bones.rightHand, 0.04, 0.0, 0.0, blendAlpha);

        // Left arm natural walk swing
        slerpBoneOffset(
          bones.leftArm,
          0.35 + syncBreath + leftArmSwingX,
          0.06,
          0.14,
          blendAlpha
        );
        slerpBoneOffset(bones.leftForeArm, 0.15, 0.0, -0.32, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0.04, 0, 0, blendAlpha);
      } else {
        // Standing pose: BOTH arms hang naturally and relaxed straight down at his sides
        // Right arm lowered beside right thigh, wrist below phone, holding upright phone enclosed by palm and fingers:
        slerpBoneOffset(
          bones.rightArm,
          0.36 + syncBreath,
          -0.06,
          -0.14 - slowSway * 0.006,
          blendAlpha
        );
        slerpBoneOffset(bones.rightForeArm, 0.15, 0.0, 0.32, blendAlpha);
        slerpBoneOffset(bones.rightHand, 0.04, 0.0, 0.0, blendAlpha);

        // Left arm relaxed straight down alongside left hip/thigh (empty hand), elbow nearly straight:
        slerpBoneOffset(
          bones.leftArm,
          0.35 + syncBreath,
          0.06,
          0.14 + slowSway * 0.006,
          blendAlpha
        );
        slerpBoneOffset(bones.leftForeArm, 0.15, 0.0, -0.32, blendAlpha);
        slerpBoneOffset(bones.leftHand, 0.04, 0, 0, blendAlpha);
      }
    } else {
      if (bodyMeshRef && fullBodyIndexRef && isRightHandFiltered) {
        bodyMeshRef.geometry.setIndex(fullBodyIndexRef);
        isRightHandFiltered = false;
      }
      if (bones.rightHand) {
        bones.rightHand.scale.set(1, 1, 1);
      }
      if (heldPhoneGroup) {
        heldPhoneGroup.visible = false;
      }
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

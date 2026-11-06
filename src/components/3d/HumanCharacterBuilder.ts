import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { ProceduralTextureGenerator } from '../../utils/proceduralTextures';

export interface HumanCharacterConfig {
  id: string;
  name: string;
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
}

export interface HumanCharacterInstance {
  group: THREE.Group;
  config: HumanCharacterConfig;
  update: (
    delta: number,
    currentTime: number,
    options?: {
      playerPos?: THREE.Vector3;
      isSpeaking?: boolean;
      isWalking?: boolean;
      isJogging?: boolean;
      speed?: number;
      lookAtPos?: THREE.Vector3;
    }
  ) => void;
}

// ---------------------------------------------------------------------------
// CACHED GLTF HUMAN RIG LOADER
// ---------------------------------------------------------------------------
const MODEL_URL = '/models/readyplayer.me.glb';
let cachedGltfScene: THREE.Group | null = null;
let loadPromise: Promise<THREE.Group> | null = null;

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

// Trigger preload immediately on module execution
if (typeof window !== 'undefined') {
  preloadHumanModel().catch(() => {});
}

/**
 * Creates an authentic, fully rigged 3D human character model with detailed facial features,
 * realistic everyday clothing, articulated skeleton, facial speech morph targets, and natural animations.
 */
export function createHumanCharacter(config: HumanCharacterConfig): HumanCharacterInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = `human_character_${config.id}`;

  // 1. Ambient Contact Shadow underneath feet
  const shadowMat = new THREE.MeshBasicMaterial({
    map: ProceduralTextureGenerator.createContactShadowTexture(),
    transparent: true,
    opacity: 0.72,
  });
  const groundShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.65), shadowMat);
  groundShadow.rotateX(-Math.PI / 2);
  groundShadow.position.set(0, 0.002, 0);
  groundShadow.name = 'contactGroundShadow';
  rootGroup.add(groundShadow);

  // 2. Proximity Highlight Floor Ring for NPCs (glows when in interaction proximity)
  if (config.isNpc) {
    const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.position.y = 0.005;
    floorRing.name = 'targetHighlightRing';
    rootGroup.add(floorRing);

    // Warm key light so Alex's face, eyes, and expressions are clearly lit
    const keyLight = new THREE.PointLight(0xfff5ea, 1.4, 4.5, 1.8);
    keyLight.position.set(0, 2.25, 0.65);
    rootGroup.add(keyLight);
  }

  // 3. Humanoid Rig & Animation Controller State
  let characterModel: THREE.Group | null = null;
  const bones = {
    hips: null as THREE.Bone | null,
    spine: null as THREE.Bone | null,
    spine1: null as THREE.Bone | null,
    spine2: null as THREE.Bone | null,
    neck: null as THREE.Bone | null,
    head: null as THREE.Bone | null,
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

  // Base rotation storage for clean additive skeletal animation without axis twisting
  const baseRotations = new Map<THREE.Object3D, THREE.Euler>();

  // Facial speech morph target meshes (head, teeth, beard)
  const morphMeshes: { mesh: THREE.SkinnedMesh; mouthOpenIndex: number }[] = [];

  function attachModel(sourceScene: THREE.Group) {
    const cloned = SkeletonUtils.clone(sourceScene) as THREE.Group;
    characterModel = cloned;
    cloned.position.set(0, 0, 0);

    // Setup Shadows, Materials, and Colors
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Customize materials and clothing based on character role
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;

          if (mesh.name === 'Wolf3D_Outfit_Top') {
            // Casual jacket / overshirt
            if (config.jacketHex) {
              mat.color.set(config.jacketHex);
            }
            mat.roughness = 0.75;
            mat.metalness = 0.05;
          } else if (mesh.name === 'Wolf3D_Outfit_Bottom') {
            // Trousers / Jeans
            if (config.trousersHex) {
              mat.color.set(config.trousersHex);
            }
            mat.roughness = 0.85;
            mat.metalness = 0.02;
          } else if (mesh.name === 'Wolf3D_Outfit_Footwear') {
            // Shoes / Sneakers
            if (config.shoesHex) {
              mat.color.set(config.shoesHex);
            }
            mat.roughness = 0.45;
          } else if (mesh.name === 'Wolf3D_Headwear') {
            // Hair
            if (config.hairHex) {
              mat.color.set(config.hairHex);
            }
            mat.roughness = 0.8;
          } else if (mesh.name === 'Wolf3D_Skin' || mesh.name === 'Wolf3D_Head') {
            // Skin
            if (config.skinHex) {
              mat.color.set(config.skinHex);
            }
            mat.roughness = 0.62;
          }
        }

        // Detect mouthOpen morph target for real-time speech lip-sync
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          const dict = mesh.morphTargetDictionary;
          if (dict['mouthOpen'] !== undefined) {
            morphMeshes.push({ mesh, mouthOpenIndex: dict['mouthOpen'] });
          }
        }
      }
    });

    // Map Humanoid Bones
    bones.hips = cloned.getObjectByName('Hips') as THREE.Bone | null;
    bones.spine = cloned.getObjectByName('Spine') as THREE.Bone | null;
    bones.spine1 = cloned.getObjectByName('Spine1') as THREE.Bone | null;
    bones.spine2 = cloned.getObjectByName('Spine2') as THREE.Bone | null;
    bones.neck = cloned.getObjectByName('Neck') as THREE.Bone | null;
    bones.head = cloned.getObjectByName('Head') as THREE.Bone | null;
    bones.leftShoulder = cloned.getObjectByName('LeftShoulder') as THREE.Bone | null;
    bones.leftArm = cloned.getObjectByName('LeftArm') as THREE.Bone | null;
    bones.leftForeArm = cloned.getObjectByName('LeftForeArm') as THREE.Bone | null;
    bones.leftHand = cloned.getObjectByName('LeftHand') as THREE.Bone | null;
    bones.rightShoulder = cloned.getObjectByName('RightShoulder') as THREE.Bone | null;
    bones.rightArm = cloned.getObjectByName('RightArm') as THREE.Bone | null;
    bones.rightForeArm = cloned.getObjectByName('RightForeArm') as THREE.Bone | null;
    bones.rightHand = cloned.getObjectByName('RightHand') as THREE.Bone | null;
    bones.leftUpLeg = cloned.getObjectByName('LeftUpLeg') as THREE.Bone | null;
    bones.leftLeg = cloned.getObjectByName('LeftLeg') as THREE.Bone | null;
    bones.leftFoot = cloned.getObjectByName('LeftFoot') as THREE.Bone | null;
    bones.rightUpLeg = cloned.getObjectByName('RightUpLeg') as THREE.Bone | null;
    bones.rightLeg = cloned.getObjectByName('RightLeg') as THREE.Bone | null;
    bones.rightFoot = cloned.getObjectByName('RightFoot') as THREE.Bone | null;

    // Cache original bind rotations
    Object.values(bones).forEach((b) => {
      if (b) {
        baseRotations.set(b, b.rotation.clone());
      }
    });

    // Default natural posture
    if (config.isNpc && bones.rightArm && bones.rightForeArm) {
      // Gentle conversational hand gesture
      const baseArmR = baseRotations.get(bones.rightArm);
      if (baseArmR) bones.rightArm.rotation.x = baseArmR.x - 0.22;
      const baseForeArmR = baseRotations.get(bones.rightForeArm);
      if (baseForeArmR) bones.rightForeArm.rotation.z = baseForeArmR.z + 0.35;
    }

    rootGroup.add(cloned);
  }

  // If already preloaded, attach immediately; otherwise attach upon promise completion
  if (cachedGltfScene) {
    attachModel(cachedGltfScene);
  } else {
    preloadHumanModel().then((scene) => {
      if (!characterModel) {
        attachModel(scene);
      }
    });
  }

  let animTimeAcc = Math.random() * 50;

  // 4. Update Loop for Natural Human Living Presence & Locomotion
  const update = (
    delta: number,
    currentTime: number,
    options?: {
      playerPos?: THREE.Vector3;
      isSpeaking?: boolean;
      isWalking?: boolean;
      isJogging?: boolean;
      speed?: number;
      lookAtPos?: THREE.Vector3;
    }
  ) => {
    animTimeAcc += delta;

    if (!characterModel) return;

    // A. Idle Respiration & Subtle Weight Shifting (Authentic Grounded Indie Feel)
    const breath = Math.sin(animTimeAcc * 1.6);
    if (bones.spine2) {
      bones.spine2.scale.set(1 + breath * 0.012, 1 + breath * 0.006, 1 + breath * 0.015);
    }

    // Weight shift sway between left and right foot
    const weightShift = Math.sin(animTimeAcc * 0.2);
    if (bones.hips && baseRotations.has(bones.hips)) {
      const baseHips = baseRotations.get(bones.hips)!;
      bones.hips.rotation.z = baseHips.z + weightShift * 0.022;
      bones.hips.rotation.x = baseHips.x + breath * 0.008;
    }

    // B. Smooth 3D Head Tracking & Looking Toward the Player (within 4.8m)
    if (options?.playerPos && config.isNpc && bones.head && baseRotations.has(bones.head)) {
      const baseHead = baseRotations.get(bones.head)!;
      const dist = rootGroup.position.distanceTo(options.playerPos);

      if (dist < 4.8) {
        const dx = options.playerPos.x - rootGroup.position.x;
        const dz = options.playerPos.z - rootGroup.position.z;
        const targetWorldYaw = Math.atan2(dx, dz);

        // Smoothly rotate character body towards player
        rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetWorldYaw, 3.8 * delta);

        // Tilt head pitch up/down toward player camera height (eye-level 1.62m)
        const dy = options.playerPos.y + 1.62 - (rootGroup.position.y + 1.65);
        const horizDist = Math.max(0.1, Math.hypot(dx, dz));
        const targetPitch = THREE.MathUtils.clamp(Math.atan2(dy, horizDist), -0.32, 0.32);

        bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, baseHead.x - targetPitch, 4.5 * delta);
        bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, baseHead.y + Math.sin(animTimeAcc * 0.6) * 0.02, 3 * delta);
      } else {
        bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, baseHead.x, 2.5 * delta);
        bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, baseHead.y, 2.5 * delta);
      }
    }

    // C. Articulated Speech & Facial Lip-Sync Animation
    if (options?.isSpeaking) {
      // Dynamic speech syllable envelope
      const speechCadence = Math.sin(animTimeAcc * 14) * 0.5 + Math.sin(animTimeAcc * 22) * 0.3;
      const jawOpen = THREE.MathUtils.clamp(speechCadence, 0, 0.75);

      morphMeshes.forEach(({ mesh, mouthOpenIndex }) => {
        mesh.morphTargetInfluences![mouthOpenIndex] = jawOpen;
      });

      // Conversational head nods on speech emphasis
      if (bones.head && baseRotations.has(bones.head)) {
        bones.head.rotation.x += Math.sin(animTimeAcc * 7) * 0.015;
      }

      // Conversational gesturing with right arm towards desk evidence
      if (bones.rightArm && baseRotations.has(bones.rightArm)) {
        const baseArmR = baseRotations.get(bones.rightArm)!;
        bones.rightArm.rotation.x = baseArmR.x - 0.35 + Math.sin(animTimeAcc * 3.5) * 0.05;
      }
      if (bones.rightForeArm && baseRotations.has(bones.rightForeArm)) {
        const baseForeArmR = baseRotations.get(bones.rightForeArm)!;
        bones.rightForeArm.rotation.z = baseForeArmR.z + 0.45 + Math.cos(animTimeAcc * 2.5) * 0.04;
      }
    } else {
      // Return mouth to closed resting position
      morphMeshes.forEach(({ mesh, mouthOpenIndex }) => {
        mesh.morphTargetInfluences![mouthOpenIndex] = THREE.MathUtils.lerp(
          mesh.morphTargetInfluences![mouthOpenIndex],
          0,
          10 * delta
        );
      });

      // Return arms smoothly to resting posture
      if (config.isNpc) {
        if (bones.rightArm && baseRotations.has(bones.rightArm)) {
          const baseArmR = baseRotations.get(bones.rightArm)!;
          bones.rightArm.rotation.x = THREE.MathUtils.lerp(bones.rightArm.rotation.x, baseArmR.x - 0.22, 6 * delta);
        }
        if (bones.rightForeArm && baseRotations.has(bones.rightForeArm)) {
          const baseForeArmR = baseRotations.get(bones.rightForeArm)!;
          bones.rightForeArm.rotation.z = THREE.MathUtils.lerp(bones.rightForeArm.rotation.z, baseForeArmR.z + 0.35, 6 * delta);
        }
      }
    }

    // D. Walking & Locomotion Animation (Leg Swings, Knee Flexion, and Arm Counter-Rotation)
    if (options?.isWalking) {
      const walkFreq = options.isJogging ? 11 : 7.5;
      const walkPhase = animTimeAcc * walkFreq;
      const legAmplitude = options.isJogging ? 0.65 : 0.45;

      // Leg swings
      if (bones.leftUpLeg && baseRotations.has(bones.leftUpLeg)) {
        const baseL = baseRotations.get(bones.leftUpLeg)!;
        bones.leftUpLeg.rotation.x = baseL.x + Math.sin(walkPhase) * legAmplitude;
      }
      if (bones.rightUpLeg && baseRotations.has(bones.rightUpLeg)) {
        const baseR = baseRotations.get(bones.rightUpLeg)!;
        bones.rightUpLeg.rotation.x = baseR.x - Math.sin(walkPhase) * legAmplitude;
      }

      // Knee bending on backswing
      if (bones.leftLeg && baseRotations.has(bones.leftLeg)) {
        const baseKneeL = baseRotations.get(bones.leftLeg)!;
        const kneeFlexL = Math.max(0, -Math.sin(walkPhase) * (legAmplitude * 1.3));
        bones.leftLeg.rotation.x = baseKneeL.x + kneeFlexL;
      }
      if (bones.rightLeg && baseRotations.has(bones.rightLeg)) {
        const baseKneeR = baseRotations.get(bones.rightLeg)!;
        const kneeFlexR = Math.max(0, Math.sin(walkPhase) * (legAmplitude * 1.3));
        bones.rightLeg.rotation.x = baseKneeR.x + kneeFlexR;
      }

      // Synchronized arm swing
      const armAmplitude = options.isJogging ? 0.5 : 0.32;
      if (bones.leftArm && baseRotations.has(bones.leftArm)) {
        const baseArmL = baseRotations.get(bones.leftArm)!;
        bones.leftArm.rotation.x = baseArmL.x - Math.sin(walkPhase) * armAmplitude;
      }
      if (bones.rightArm && baseRotations.has(bones.rightArm)) {
        const baseArmR = baseRotations.get(bones.rightArm)!;
        bones.rightArm.rotation.x = baseArmR.x + Math.sin(walkPhase) * armAmplitude;
      }

      // Vertical pelvic bounce
      if (bones.hips && baseRotations.has(bones.hips)) {
        const baseHips = baseRotations.get(bones.hips)!;
        bones.hips.position.y = 1.019 + Math.abs(Math.sin(walkPhase)) * 0.025;
      }
    } else {
      // Smooth return to resting idle pose
      if (bones.leftUpLeg && baseRotations.has(bones.leftUpLeg)) {
        const baseL = baseRotations.get(bones.leftUpLeg)!;
        bones.leftUpLeg.rotation.x = THREE.MathUtils.lerp(bones.leftUpLeg.rotation.x, baseL.x, 8 * delta);
      }
      if (bones.rightUpLeg && baseRotations.has(bones.rightUpLeg)) {
        const baseR = baseRotations.get(bones.rightUpLeg)!;
        bones.rightUpLeg.rotation.x = THREE.MathUtils.lerp(bones.rightUpLeg.rotation.x, baseR.x, 8 * delta);
      }
      if (bones.leftLeg && baseRotations.has(bones.leftLeg)) {
        const baseKneeL = baseRotations.get(bones.leftLeg)!;
        bones.leftLeg.rotation.x = THREE.MathUtils.lerp(bones.leftLeg.rotation.x, baseKneeL.x, 8 * delta);
      }
      if (bones.rightLeg && baseRotations.has(bones.rightLeg)) {
        const baseKneeR = baseRotations.get(bones.rightLeg)!;
        bones.rightLeg.rotation.x = THREE.MathUtils.lerp(bones.rightLeg.rotation.x, baseKneeR.x, 8 * delta);
      }
      if (bones.leftArm && baseRotations.has(bones.leftArm)) {
        const baseArmL = baseRotations.get(bones.leftArm)!;
        bones.leftArm.rotation.x = THREE.MathUtils.lerp(bones.leftArm.rotation.x, baseArmL.x, 8 * delta);
      }
      if (bones.hips && baseRotations.has(bones.hips)) {
        bones.hips.position.y = THREE.MathUtils.lerp(bones.hips.position.y, 1.019, 8 * delta);
      }
    }
  };

  return {
    group: rootGroup,
    config,
    update,
  };
}

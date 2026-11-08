import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AdventureLevel, WorldObjectDef, NpcDef, GameSettings } from '../../types/adventure';
import { ProceduralTextureGenerator } from '../../utils/proceduralTextures';
import { soundEngine } from '../../utils/proceduralAudio';
import { createHumanCharacter, HumanCharacterInstance } from './HumanCharacterBuilder';
import { CutsceneCameraShot } from '../../data/levelIntroCutscenes';

export interface NearbyTarget {
  type: 'npc' | 'object';
  id: string;
  name: string;
  interactionLabel: string;
}

interface ProjectedWorldMarker {
  id: string;
  type: 'npc' | 'object';
  objectType?: string;
  name: string;
  interactionLabel: string;
  previewSender?: string;
  previewContent?: string;
  screenX: number;
  screenY: number;
  planarDist: number;
  isCollected?: boolean;
  isVisible: boolean;
}

function formatCleanPromptAction(type: 'npc' | 'object', name: string, rawLabel: string): string {
  if (type === 'npc') {
    return `Talk to ${name}`;
  }
  return rawLabel
    .replace(/^Inspect Optional Clue:\s*/i, 'Inspect ')
    .replace(/^Inspect Clue:\s*/i, 'Inspect ')
    .replace(/^Inspect Message:\s*/i, 'Inspect ');
}

interface AdventureWorldProps {
  level: AdventureLevel;
  settings: GameSettings;
  collectedClueIds: string[];
  onInteract: (target: NearbyTarget) => void;
  onNearbyChange?: (target: NearbyTarget | null) => void;
  onEscapePress?: () => void;
  // External mobile control inputs
  mobileMoveVector?: { x: number; y: number };
  mobileLookDelta?: { dx: number; dy: number };
  isMobileJogging?: boolean;
  isModalOpen?: boolean;
  activeDialogueNpcId?: string | null;
  introCameraShot?: CutsceneCameraShot | null;
  isIntroNpcSpeaking?: boolean;
}

export const AdventureWorld: React.FC<AdventureWorldProps> = ({
  level,
  settings,
  collectedClueIds,
  onInteract,
  onNearbyChange,
  onEscapePress,
  mobileMoveVector,
  mobileLookDelta,
  isMobileJogging,
  isModalOpen = false,
  activeDialogueNpcId = null,
  introCameraShot = null,
  isIntroNpcSpeaking = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nearbyRef = useRef<NearbyTarget | null>(null);
  const [activeNearby, setActiveNearby] = useState<NearbyTarget | null>(null);
  const [worldMarkers, setWorldMarkers] = useState<ProjectedWorldMarker[]>([]);
  const lastMarkerUpdateRef = useRef<number>(0);

  // Brief camera focus state when player presses E before opening dialogue/evidence
  const focusAnimRef = useRef<{
    target: NearbyTarget;
    focusWorldPos: THREE.Vector3;
    startTime: number;
    durationMs: number;
  } | null>(null);
  const onInteractRef = useRef(onInteract);
  const settingsRef = useRef<GameSettings>(settings);
  const collectedClueIdsRef = useRef<string[]>(collectedClueIds);
  const activeDialogueNpcIdRef = useRef<string | null>(activeDialogueNpcId);
  const introCameraShotRef = useRef<CutsceneCameraShot | null>(introCameraShot);
  const isIntroNpcSpeakingRef = useRef<boolean>(isIntroNpcSpeaking);
  const cutsceneLookTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.4, 0));

  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    collectedClueIdsRef.current = collectedClueIds;
  }, [collectedClueIds]);

  useEffect(() => {
    activeDialogueNpcIdRef.current = activeDialogueNpcId;
  }, [activeDialogueNpcId]);

  useEffect(() => {
    introCameraShotRef.current = introCameraShot;
  }, [introCameraShot]);

  useEffect(() => {
    isIntroNpcSpeakingRef.current = isIntroNpcSpeaking;
  }, [isIntroNpcSpeaking]);

  // References for render loop state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerGroupRef = useRef<THREE.Group | null>(null);
  const humanPlayerInstanceRef = useRef<HumanCharacterInstance | null>(null);
  const npcGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const humanNpcInstancesRef = useRef<Map<string, HumanCharacterInstance>>(new Map());
  const objectMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const phoneViewmodelRef = useRef<THREE.Group | null>(null);
  const lastTelemetryTime = useRef<number>(0);

  // Input states
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const cameraAngles = useRef<{ yaw: number; pitch: number }>({ yaw: Math.PI, pitch: -0.03 });
  const isPointerDown = useRef<boolean>(false);
  const hasMouseOrigin = useRef<boolean>(false);
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseEdgeNormalized = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isModalOpenRef = useRef<boolean>(isModalOpen);
  const intentionalUnlockRef = useRef<boolean>(false);
  const onEscapePressRef = useRef<(() => void) | undefined>(onEscapePress);
  const playerPos = useRef<THREE.Vector3>(new THREE.Vector3(...level.playerSpawn));
  const playerFacing = useRef<number>(level.playerSpawnRotationY);
  const animTime = useRef<number>(0);
  const lastFootstepTime = useRef<number>(0);

  useEffect(() => {
    onEscapePressRef.current = onEscapePress;
  }, [onEscapePress]);

  // Reset player spawn position and camera facing on level start/change
  useEffect(() => {
    playerPos.current.set(level.playerSpawn[0], level.playerSpawn[1], level.playerSpawn[2]);
    playerFacing.current = level.playerSpawnRotationY;
    cameraAngles.current = { yaw: level.playerSpawnRotationY, pitch: -0.05 };
  }, [level.id, level.playerSpawn, level.playerSpawnRotationY]);

  // Helper to get 3D focus coordinates for a target (frames face nicely above subtitle zone)
  const getTargetFocusWorldPos = (target: NearbyTarget): THREE.Vector3 => {
    if (target.type === 'npc') {
      const npc = level.npcs.find((n) => n.id === target.id);
      if (npc) return new THREE.Vector3(npc.position[0], npc.position[1] + 1.48, npc.position[2]);
    } else {
      const obj = level.objects.find((o) => o.id === target.id);
      if (obj) return new THREE.Vector3(obj.position[0], obj.position[1] + 0.18, obj.position[2]);
    }
    return playerPos.current.clone();
  };

  // Trigger brief camera focus on target, then open dialogue/inspection card
  const triggerFocusedInteraction = (target: NearbyTarget) => {
    if (target.type === 'object' && document.pointerLockElement) {
      intentionalUnlockRef.current = true;
      document.exitPointerLock?.();
    }

    if (settings.reducedMotion) {
      onInteractRef.current(target);
      return;
    }

    focusAnimRef.current = {
      target,
      focusWorldPos: getTargetFocusWorldPos(target),
      startTime: performance.now(),
      durationMs: 220,
    };
  };

  // Reset spawn position and camera framing whenever the level changes so Alex & evidence are centered
  useEffect(() => {
    playerPos.current.set(...level.playerSpawn);
    playerFacing.current = level.playerSpawnRotationY;
    cameraAngles.current = { yaw: level.playerSpawnRotationY || Math.PI, pitch: -0.03 };
    focusAnimRef.current = null;
  }, [level.id, level.playerSpawn, level.playerSpawnRotationY]);

  // Update nearby state
  const updateNearbyTarget = (target: NearbyTarget | null) => {
    if (nearbyRef.current?.id !== target?.id) {
      nearbyRef.current = target;
      setActiveNearby(target);
      onNearbyChange?.(target);
      if (target) {
        soundEngine.playDialogueBlip();
      }
    }
  };

  // Helper to request pointer lock safely and resume automatic mouse-look + keyboard focus without needing a click
  const requestGameplayLookLock = () => {
    hasMouseOrigin.current = false;
    mouseEdgeNormalized.current = { x: 0, y: 0 };
    try {
      window.focus();
      if (document.activeElement instanceof HTMLElement && document.activeElement !== containerRef.current) {
        document.activeElement.blur();
      }
      containerRef.current?.focus({ preventScroll: true });
    } catch {
      // Ignore focus errors
    }

    const lockTarget = containerRef.current || document.body;
    if (lockTarget && lockTarget.requestPointerLock && !document.pointerLockElement && !isModalOpenRef.current) {
      try {
        const lockPromise = lockTarget.requestPointerLock() as unknown as Promise<void> | undefined;
        if (lockPromise && typeof lockPromise.catch === 'function') {
          lockPromise.catch(() => {
            // Free-mouse look + cursor-none CSS is already active even if browser defers pointer lock
          });
        }
      } catch {
        // Ignore
      }
    }
  };

  // Sync modal state: release pointer lock when modal opens, and immediately hide cursor + resume look when modal closes
  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
    if (isModalOpen) {
      hasMouseOrigin.current = false;
      mouseEdgeNormalized.current = { x: 0, y: 0 };
      if (document.pointerLockElement) {
        intentionalUnlockRef.current = true;
        document.exitPointerLock?.();
      }
    } else {
      requestGameplayLookLock();
    }
  }, [isModalOpen]);

  // Also immediately focus & activate look when introCameraShot ends (story line finishes)
  useEffect(() => {
    if (!introCameraShot && !isModalOpenRef.current) {
      requestGameplayLookLock();
    }
  }, [introCameraShot]);

  // Listen for synchronous resume-look event fired inside modal/cutscene close handlers
  useEffect(() => {
    const handleResumeLook = () => {
      isModalOpenRef.current = false;
      requestGameplayLookLock();
    };
    window.addEventListener('sleuth-resume-look', handleResumeLook);
    return () => window.removeEventListener('sleuth-resume-look', handleResumeLook);
  }, []);

  // Detect browser Esc from Pointer Lock so pressing Esc ALWAYS opens Settings immediately
  useEffect(() => {
    const handlePointerLockChange = () => {
      if (!document.pointerLockElement) {
        if (intentionalUnlockRef.current) {
          intentionalUnlockRef.current = false;
          return;
        }
        if (!isModalOpenRef.current) {
          onEscapePressRef.current?.();
        }
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (isModalOpenRef.current) return;
      keysPressed.current[e.code] = true;
      keysPressed.current[e.key.toLowerCase()] = true;

      if (!document.pointerLockElement && !introCameraShotRef.current) {
        requestGameplayLookLock();
      }

      // 'E' exclusively for interacting with objects/clues
      if (e.code === 'KeyE' && nearbyRef.current?.type === 'object' && !focusAnimRef.current) {
        e.preventDefault();
        triggerFocusedInteraction(nearbyRef.current);
      }

      // 'T' exclusively for talking to a person
      if (e.code === 'KeyT' && nearbyRef.current?.type === 'npc' && !focusAnimRef.current) {
        e.preventDefault();
        e.stopPropagation();
        triggerFocusedInteraction(nearbyRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract]);

  // Mobile look delta processing
  useEffect(() => {
    if (!mobileLookDelta) return;
    const sens = 0.004 * settings.mouseSensitivity;
    cameraAngles.current.yaw -= mobileLookDelta.dx * sens;
    cameraAngles.current.pitch = Math.max(
      -0.75,
      Math.min(0.75, cameraAngles.current.pitch - mobileLookDelta.dy * sens)
    );
  }, [mobileLookDelta, settings.mouseSensitivity]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(
      level.setting === 'campus'
        ? 0x82b4dc
        : level.setting === 'cafe'
        ? 0x0c121e
        : 0x090f1d
    );
    scene.fog = new THREE.FogExp2(
      level.setting === 'campus' ? 0x82b4dc : 0x0c121e,
      level.setting === 'campus' ? 0.022 : 0.035
    );

    // Camera
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.08,
      90
    );
    cameraRef.current = camera;

    // Attach First-Person In-Hand Smartphone Viewmodel showing readable fictional message evidence
    const primaryPhoneObj = level.objects.find((o) => o.type === 'phone') || level.objects[0];
    const phoneViewmodel = createInHandPhoneViewmodel(
      primaryPhoneObj?.inspection.senderOrSource,
      primaryPhoneObj?.inspection.content
    );
    camera.add(phoneViewmodel);
    scene.add(camera);
    phoneViewmodelRef.current = phoneViewmodel;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = level.setting === 'campus' ? 1.02 : 0.96;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // -----------------------------------------------------------------------
    // ATMOSPHERIC INDIE-ADVENTURE LIGHTING RIG (Cinematic, Restrained, Moody)
    // -----------------------------------------------------------------------
    // Subtle cool night/room ambient fill
    const ambientColor =
      level.setting === 'campus'
        ? 0x64748b
        : level.setting === 'cafe'
        ? 0x1e293b
        : level.setting === 'office'
        ? 0x334155
        : 0x1e2538;
    const ambientLight = new THREE.AmbientLight(
      ambientColor,
      level.setting === 'campus' ? 0.65 : 0.45
    );
    scene.add(ambientLight);

    // Directional Key Light (Night window moonlight or streetlamp bounce)
    const keyLightColor =
      level.setting === 'campus'
        ? 0x93c5fd
        : level.setting === 'apartment'
        ? 0xa5b4fc
        : 0xfde68a;
    const sunLight = new THREE.DirectionalLight(keyLightColor, level.setting === 'campus' ? 1.6 : 1.35);
    sunLight.position.set(5.5, 8.0, 6.5);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.normalBias = 0.02;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 35;
    sunLight.shadow.camera.left = -9;
    sunLight.shadow.camera.right = 9;
    sunLight.shadow.camera.top = 9;
    sunLight.shadow.camera.bottom = -9;
    scene.add(sunLight);

    // Subtle soft fill bounce
    const fillBounceLight = new THREE.DirectionalLight(0x38bdf8, 0.25);
    fillBounceLight.position.set(-4, 3, -4);
    scene.add(fillBounceLight);

    // Warm Interior Sconce / Lamp Light with natural inverse-square physical falloff
    const lampColor = level.setting === 'campus' ? 0x67e8f9 : 0xfbbf24;
    const lampLight = new THREE.PointLight(lampColor, 1.8, 8, 2);
    lampLight.position.set(-3.2, 1.9, -3.2);
    lampLight.castShadow = !isSoftwareGl;
    lampLight.shadow.mapSize.width = 1024;
    lampLight.shadow.mapSize.height = 1024;
    lampLight.shadow.bias = -0.0005;
    scene.add(lampLight);

    // Overhead Downlight Fixture (Subtle focus on evidence table)
    const ceilingSpot = new THREE.SpotLight(0xfffbeb, 1.2, 9, Math.PI / 4.5, 0.5, 2);
    ceilingSpot.position.set(1.5, 3.4, 0.5);
    ceilingSpot.target.position.set(1.5, 0.4, 0.5);
    scene.add(ceilingSpot);
    scene.add(ceilingSpot.target);

    // -----------------------------------------------------------------------
    // -----------------------------------------------------------------------
    // BUILD HIGH-FIDELITY ENVIRONMENT
    // -----------------------------------------------------------------------
    buildPhotorealisticEnvironment(scene, level.setting);

    // -----------------------------------------------------------------------
    // BUILD 3D PLAYER MODEL (Hidden during First-Person POV)
    // -----------------------------------------------------------------------
    const playerInstance = createPlayerCharacter();
    const playerGroup = playerInstance.group;
    playerGroup.position.copy(playerPos.current);
    playerGroup.rotation.y = playerFacing.current;
    scene.add(playerGroup);
    playerGroupRef.current = playerGroup;
    humanPlayerInstanceRef.current = playerInstance;

    // -----------------------------------------------------------------------
    // BUILD NPC 3D CHARACTERS (Including Recurring Cast in Finale Coalition)
    // -----------------------------------------------------------------------
    npcGroupsRef.current.clear();
    humanNpcInstancesRef.current.clear();
    level.npcs.forEach((npc) => {
      const npcInstance = createNpcCharacter(npc);
      const npcGroup = npcInstance.group;
      npcGroup.position.set(...npc.position);
      npcGroup.rotation.y = npc.rotationY;
      scene.add(npcGroup);
      npcGroupsRef.current.set(npc.id, npcGroup);
      humanNpcInstancesRef.current.set(npc.id, npcInstance);

      // In Level 10 ("Community Safety Coalition"), also place recurring cast members in the scene
      if (npc.id === 'npc-alex-l10' || level.id === 'finale-coalition') {
        const coalitionCompanions: Array<{
          id: string;
          name: string;
          role: string;
          pos: [number, number, number];
          rotY: number;
        }> = [
          {
            id: 'npc-maya-coalition',
            name: 'Maya Chen',
            role: 'University Student & Digital Safety Peer',
            pos: [-2.15, 0, -1.55],
            rotY: 0.42,
          },
          {
            id: 'npc-marcus-coalition',
            name: 'Marcus Vance',
            role: 'Local Cafe Owner & Seller',
            pos: [2.15, 0, -1.55],
            rotY: -0.42,
          },
          {
            id: 'npc-priya-coalition',
            name: 'Priya Sharma',
            role: 'Senior Systems Engineer',
            pos: [1.35, 0, -2.15],
            rotY: -0.24,
          },
        ];

        coalitionCompanions.forEach((comp) => {
          const compInstance = createHumanCharacter({
            id: comp.id,
            name: comp.name,
            role: comp.role,
            isNpc: true,
          });
          compInstance.group.position.set(...comp.pos);
          compInstance.group.rotation.y = comp.rotY;
          scene.add(compInstance.group);
          npcGroupsRef.current.set(comp.id, compInstance.group);
          humanNpcInstancesRef.current.set(comp.id, compInstance);
        });
      }
    });

    // -----------------------------------------------------------------------
    // BUILD HIGH-DETAIL INTERACTIVE OBJECTS (Phones, Laptops, Documents)
    // -----------------------------------------------------------------------
    objectMeshesRef.current.clear();
    level.objects.forEach((obj) => {
      const prop = createPhotorealisticWorldObjectProp(obj, collectedClueIds.includes(obj.inspection.clueId));
      prop.position.set(...obj.position);
      if (obj.rotationY) prop.rotation.y = obj.rotationY;
      scene.add(prop);
      objectMeshesRef.current.set(obj.id, prop);
    });

    // -----------------------------------------------------------------------
    // AUTOMATIC IMMEDIATE MOUSE LOOK (No click required + full Pointer Lock support)
    // -----------------------------------------------------------------------
    // Attempt automatic pointer lock on entering the level if browser permits
    if (!isModalOpenRef.current && container.requestPointerLock) {
      try {
        const lockPromise = container.requestPointerLock() as unknown as Promise<void> | undefined;
        if (lockPromise && typeof lockPromise.catch === 'function') {
          lockPromise.catch(() => {
            // Browser requires direct canvas click for pointer lock; free-mouse look is already active
          });
        }
      } catch {
        // Ignore if not supported
      }
    }

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (isModalOpenRef.current) {
        if (document.pointerLockElement) {
          intentionalUnlockRef.current = true;
          document.exitPointerLock?.();
        }
        return;
      }
      isPointerDown.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPointerPos.current = { x: clientX, y: clientY };
      hasMouseOrigin.current = true;

      if (!('touches' in e) && container.requestPointerLock && !document.pointerLockElement) {
        try {
          const lockPromise = container.requestPointerLock() as unknown as Promise<void> | undefined;
          if (lockPromise && typeof lockPromise.catch === 'function') {
            lockPromise.catch(() => {});
          }
        } catch {
          // Ignore
        }
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isModalOpenRef.current || introCameraShotRef.current) {
        hasMouseOrigin.current = false;
        mouseEdgeNormalized.current = { x: 0, y: 0 };
        return;
      }

      const isLocked = Boolean(document.pointerLockElement);
      let dx = 0;
      let dy = 0;

      if (isLocked && 'movementX' in e) {
        dx = (e as MouseEvent).movementX;
        dy = (e as MouseEvent).movementY;
        mouseEdgeNormalized.current = { x: 0, y: 0 };
      } else if ('touches' in e) {
        if (!isPointerDown.current) return;
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        dx = clientX - lastPointerPos.current.x;
        dy = clientY - lastPointerPos.current.y;
        lastPointerPos.current = { x: clientX, y: clientY };
      } else {
        // Desktop free-look: automatically rotate camera on ANY mouse movement immediately upon entering!
        const mouseEvt = e as MouseEvent;
        const clientX = mouseEvt.clientX;
        const clientY = mouseEvt.clientY;

        if (!hasMouseOrigin.current) {
          lastPointerPos.current = { x: clientX, y: clientY };
          hasMouseOrigin.current = true;
          if (Math.abs(mouseEvt.movementX) < 100 && Math.abs(mouseEvt.movementY) < 100) {
            dx = mouseEvt.movementX;
            dy = mouseEvt.movementY;
          }
        } else {
          dx = clientX - lastPointerPos.current.x;
          dy = clientY - lastPointerPos.current.y;
          if (dx === 0 && dy === 0 && (mouseEvt.movementX !== 0 || mouseEvt.movementY !== 0)) {
            dx = mouseEvt.movementX;
            dy = mouseEvt.movementY;
          }
          lastPointerPos.current = { x: clientX, y: clientY };
        }

        // Track screen-edge proximity so player can keep turning 360° smoothly even before clicking
        const w = window.innerWidth || 1;
        const edgeZone = 0.14;
        const normX = clientX / w;
        if (normX < edgeZone) {
          mouseEdgeNormalized.current.x = -((edgeZone - normX) / edgeZone);
        } else if (normX > 1 - edgeZone) {
          mouseEdgeNormalized.current.x = (normX - (1 - edgeZone)) / edgeZone;
        } else {
          mouseEdgeNormalized.current.x = 0;
        }
      }

      const sens = 0.0035 * settingsRef.current.mouseSensitivity;
      cameraAngles.current.yaw -= dx * sens;
      cameraAngles.current.pitch = Math.max(
        -0.75,
        Math.min(0.75, cameraAngles.current.pitch - dy * sens)
      );
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // -----------------------------------------------------------------------
    // ANIMATION & PHYSICS GAME LOOP
    // -----------------------------------------------------------------------
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      animTime.current += delta;

      const curSettings = settingsRef.current;
      const curCollectedClueIds = collectedClueIdsRef.current;

      // Smooth continuous yaw rotation when mouse is held near screen edges in free-look mode
      if (
        !isModalOpenRef.current &&
        !document.pointerLockElement &&
        Math.abs(mouseEdgeNormalized.current.x) > 0.01
      ) {
        cameraAngles.current.yaw -=
          mouseEdgeNormalized.current.x * 1.65 * curSettings.mouseSensitivity * delta;
      }

      // ---------------------------------------------------------------------
      // CALCULATE CAMERA-ALIGNED MOVEMENT (W: Forward, S: Backward, D: Right, A: Left)
      // ---------------------------------------------------------------------
      const currentYaw = cameraAngles.current.yaw;
      // Planar forward direction (where camera is looking on the XZ ground plane)
      const forwardDir = new THREE.Vector3(Math.sin(currentYaw), 0, Math.cos(currentYaw));
      // Planar right direction (strictly 90 degrees clockwise to the right of camera gaze)
      const rightDir = new THREE.Vector3(-Math.cos(currentYaw), 0, Math.sin(currentYaw));

      const moveVec = new THREE.Vector3(0, 0, 0);

      // W / ArrowUp: Forward
      if (
        keysPressed.current['KeyW'] ||
        keysPressed.current['ArrowUp'] ||
        keysPressed.current['w'] ||
        keysPressed.current['W']
      ) {
        moveVec.add(forwardDir);
      }

      // S / ArrowDown: Backward
      if (
        keysPressed.current['KeyS'] ||
        keysPressed.current['ArrowDown'] ||
        keysPressed.current['s'] ||
        keysPressed.current['S']
      ) {
        moveVec.sub(forwardDir);
      }

      // D / ArrowRight: Right
      if (
        keysPressed.current['KeyD'] ||
        keysPressed.current['ArrowRight'] ||
        keysPressed.current['d'] ||
        keysPressed.current['D']
      ) {
        moveVec.add(rightDir);
      }

      // A / ArrowLeft: Left
      if (
        keysPressed.current['KeyA'] ||
        keysPressed.current['ArrowLeft'] ||
        keysPressed.current['a'] ||
        keysPressed.current['A']
      ) {
        moveVec.sub(rightDir);
      }

      // Mobile touch virtual joystick
      if (mobileMoveVector && (Math.abs(mobileMoveVector.x) > 0.08 || Math.abs(mobileMoveVector.y) > 0.08)) {
        // Dragging stick UP (dy < 0) moves forward; dragging stick RIGHT (dx > 0) moves right
        moveVec.addScaledVector(forwardDir, -mobileMoveVector.y);
        moveVec.addScaledVector(rightDir, mobileMoveVector.x);
      }

      const isJogging =
        keysPressed.current['ShiftLeft'] ||
        keysPressed.current['ShiftRight'] ||
        keysPressed.current['shift'] ||
        isMobileJogging;

      const speed = isJogging ? 4.8 : 2.5;
      const isMoving =
        !introCameraShotRef.current &&
        !activeDialogueNpcIdRef.current &&
        !isModalOpenRef.current &&
        moveVec.lengthSq() > 0.001;

      const prevFacing = playerFacing.current;

      if (isMoving && playerGroup) {
        moveVec.normalize();
        const nextPos = playerPos.current.clone().add(moveVec.clone().multiplyScalar(speed * delta));

        // Soft room boundary collision clamp (-3.9 to 3.9 in x and z so camera never clips walls)
        nextPos.x = Math.max(-3.9, Math.min(3.9, nextPos.x));
        nextPos.z = Math.max(-3.9, Math.min(3.9, nextPos.z));
        playerPos.current.copy(nextPos);
        playerGroup.position.copy(playerPos.current);

        // Smoothly face movement direction (model front is +Z, so atan2(dx, dz) faces movement vector)
        const targetRotation = Math.atan2(moveVec.x, moveVec.z);
        let diff = targetRotation - playerFacing.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        playerFacing.current += diff * Math.min(1, 10 * delta);
        playerGroup.rotation.y = playerFacing.current;

        // Footstep audio trigger
        const footstepCadence = isJogging ? 0.28 : 0.42;
        if (currentTime - lastFootstepTime.current > footstepCadence * 1000) {
          soundEngine.playFootstep();
          lastFootstepTime.current = currentTime;
        }
      } else if (playerGroup) {
        // When standing still: face speaking NPC during dialogue, or smoothly align with camera gaze
        let desiredIdleYaw = cameraAngles.current.yaw;
        if (activeDialogueNpcIdRef.current) {
          const speakingNpc =
            level.npcs.find((n) => n.id === activeDialogueNpcIdRef.current) || level.npcs[0];
          if (speakingNpc) {
            desiredIdleYaw = Math.atan2(
              speakingNpc.position[0] - playerPos.current.x,
              speakingNpc.position[2] - playerPos.current.z
            );
          }
        } else if (introCameraShotRef.current === 'investigator_arrival' && level.npcs[0]) {
          desiredIdleYaw = Math.atan2(
            level.npcs[0].position[0] - playerPos.current.x,
            level.npcs[0].position[2] - playerPos.current.z
          );
        }

        let diff = desiredIdleYaw - playerFacing.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        if (Math.abs(diff) > 0.01) {
          playerFacing.current += diff * Math.min(1, 7.5 * delta);
          playerGroup.rotation.y = playerFacing.current;
        }
      }

      let turnDelta = playerFacing.current - prevFacing;
      while (turnDelta < -Math.PI) turnDelta += Math.PI * 2;
      while (turnDelta > Math.PI) turnDelta -= Math.PI * 2;
      const turnVelocity = turnDelta / Math.max(0.001, delta);

      // ---------------------------------------------------------------------
      // UPDATE 3D HUMAN CHARACTERS (ANATOMICAL HUMANOID SKELETON ANIMATIONS)
      // ---------------------------------------------------------------------
      const activeIntroShot = introCameraShotRef.current;
      const isNpcCurrentlySpeaking =
        Boolean(isIntroNpcSpeakingRef.current) ||
        Boolean(activeDialogueNpcIdRef.current && Math.sin(animTime.current * 0.9) <= 0.25);
      const isPlayerSpeaking =
        (activeIntroShot === 'investigator_arrival' && !isIntroNpcSpeakingRef.current) ||
        Boolean(activeDialogueNpcIdRef.current && Math.sin(animTime.current * 0.9) > 0.25);
      const isPlayerListening =
        !isPlayerSpeaking &&
        (Boolean(activeDialogueNpcIdRef.current) || Boolean(isIntroNpcSpeakingRef.current));

      const isPlayerInspectingPhone =
        curSettings.showPhoneInHand !== false &&
        !isMoving &&
        !activeDialogueNpcIdRef.current &&
        (!activeIntroShot || activeIntroShot === 'investigator_arrival');

      if (humanPlayerInstanceRef.current) {
        humanPlayerInstanceRef.current.update(delta, currentTime, {
          isWalking: isMoving,
          isJogging,
          isInspectingPhone: isPlayerInspectingPhone,
          showPhoneInHand: curSettings.showPhoneInHand !== false,
          cameraFacingMode: activeIntroShot === 'investigator_arrival' ? 'front' : 'behind',
          isSpeaking: isPlayerSpeaking,
          isListening: isPlayerListening && isNpcCurrentlySpeaking,
          turnVelocity,
          speed,
          expression: activeDialogueNpcIdRef.current ? 'thinking' : 'attentive',
        });
      }

      humanNpcInstancesRef.current.forEach((npcInstance, npcId) => {
        const isPrimaryDialogueNpc = activeDialogueNpcIdRef.current === npcId;
        const isSpeaking =
          (isPrimaryDialogueNpc && !isPlayerSpeaking) ||
          (Boolean(isIntroNpcSpeakingRef.current) && npcId === level.npcs[0]?.id);
        const npcGroupObj = npcGroupsRef.current.get(npcId);
        const distToPlayer = npcGroupObj
          ? Math.hypot(
              npcGroupObj.position.x - playerPos.current.x,
              npcGroupObj.position.z - playerPos.current.z
            )
          : 99;
        const isListening =
          !isSpeaking &&
          (isPrimaryDialogueNpc ||
            Boolean(activeDialogueNpcIdRef.current) ||
            activeIntroShot === 'investigator_arrival' ||
            distToPlayer < 2.2);

        npcInstance.update(delta, currentTime, {
          playerPos: playerPos.current,
          isSpeaking,
          isListening,
          expression: isSpeaking ? 'concerned' : isListening ? 'attentive' : 'thinking',
        });
      });

      // ---------------------------------------------------------------------
      // PRE-INVESTIGATION OPENING STORY, DIALOGUE & GAMEPLAY CAMERA CHOREOGRAPHY
      // ---------------------------------------------------------------------
      if (activeIntroShot) {
        // Show the 3D Investigator in the scene during Beat 4 ('investigator_arrival')
        if (playerGroup) {
          playerGroup.visible = activeIntroShot === 'investigator_arrival';
        }

        const npc = level.npcs[0];
        const npcX = npc ? npc.position[0] : 0;
        const npcY = npc ? npc.position[1] : 0;
        const npcZ = npc ? npc.position[2] : -2.2;

        const obj0 = level.objects[0];
        const obj1 = level.objects[1] || obj0;
        const obj0X = obj0 ? obj0.position[0] : 0.8;
        const obj0Y = obj0 ? obj0.position[1] : 0.9;
        const obj0Z = obj0 ? obj0.position[2] : -2.0;

        const obj1X = obj1 ? obj1.position[0] : -1.2;
        const obj1Y = obj1 ? obj1.position[1] : 0.9;
        const obj1Z = obj1 ? obj1.position[2] : -2.0;

        const driftX = curSettings.reducedMotion ? 0 : Math.sin(animTime.current * 0.55) * 0.14;
        const driftY = curSettings.reducedMotion ? 0 : Math.cos(animTime.current * 0.45) * 0.03;

        const desiredCamPos = new THREE.Vector3();
        const desiredLookAt = new THREE.Vector3();
        let desiredFov = 58;

        if (activeIntroShot === 'character_medium') {
          desiredCamPos.set(npcX * 0.45 + driftX, npcY + 1.54 + driftY, npcZ + 1.65);
          desiredLookAt.set(npcX, npcY + 1.44, npcZ);
          desiredFov = 54;
        } else if (activeIntroShot === 'device_closeup') {
          desiredCamPos.set(
            obj0X * 0.55 + driftX * 0.6,
            Math.max(1.22, obj0Y + 0.52) + driftY,
            obj0Z + 1.25
          );
          desiredLookAt.set(obj0X * 0.68 + npcX * 0.32, Math.max(0.95, obj0Y + 0.22), obj0Z);
          desiredFov = 48;
        } else if (activeIntroShot === 'character_and_clue') {
          desiredCamPos.set(driftX * 1.1, 1.66 + driftY, 1.95);
          desiredLookAt.set((npcX + obj1X) * 0.42, Math.max(1.18, obj1Y + 0.35), (npcZ + obj1Z) * 0.45);
          desiredFov = 58;
        } else {
          // 'investigator_arrival' — frames the 3D Investigator arriving in the scene looking toward the witness
          desiredCamPos.set(
            playerPos.current.x + 0.42 + driftX * 0.4,
            playerPos.current.y + 1.56,
            Math.min(4.2, playerPos.current.z + 1.55)
          );
          desiredLookAt.set(
            playerPos.current.x * 0.55 + npcX * 0.45,
            playerPos.current.y + 1.36,
            playerPos.current.z * 0.4 + npcZ * 0.6
          );
          desiredFov = 58;
        }

        // Strict room clamping so camera never clips into walls
        desiredCamPos.x = THREE.MathUtils.clamp(desiredCamPos.x, -4.1, 4.1);
        desiredCamPos.z = THREE.MathUtils.clamp(desiredCamPos.z, -4.1, 4.2);
        desiredCamPos.y = THREE.MathUtils.clamp(desiredCamPos.y, 0.85, 2.8);

        if (curSettings.reducedMotion) {
          camera.position.copy(desiredCamPos);
          cutsceneLookTargetRef.current.copy(desiredLookAt);
          camera.fov = desiredFov;
        } else {
          const lerpSpeed = activeIntroShot === 'investigator_arrival' ? 4.2 : 2.6;
          camera.position.lerp(desiredCamPos, Math.min(1, delta * lerpSpeed));
          cutsceneLookTargetRef.current.lerp(desiredLookAt, Math.min(1, delta * (lerpSpeed + 0.8)));
          camera.fov = THREE.MathUtils.lerp(camera.fov, desiredFov, Math.min(1, delta * 3.5));
        }
        camera.updateProjectionMatrix();
        camera.lookAt(cutsceneLookTargetRef.current);

        // Keep player cameraAngles synced with cutscene look direction so gameplay handoff is seamless
        const handoffDir = cutsceneLookTargetRef.current.clone().sub(camera.position).normalize();
        cameraAngles.current.yaw = Math.atan2(handoffDir.x, handoffDir.z);
        cameraAngles.current.pitch = THREE.MathUtils.clamp(Math.asin(handoffDir.y), -0.35, 0.35);
      } else if (activeDialogueNpcIdRef.current) {
        // DIALOGUE TWO-SHOT / OVER-THE-SHOULDER FRAMING: Both the 3D Investigator and 3D NPC remain visibly present
        if (playerGroup) playerGroup.visible = true;
        const dialogueNpc =
          level.npcs.find((n) => n.id === activeDialogueNpcIdRef.current) || level.npcs[0];
        const npcWorldPos = dialogueNpc
          ? new THREE.Vector3(dialogueNpc.position[0], dialogueNpc.position[1], dialogueNpc.position[2])
          : new THREE.Vector3(0, 0, -2.0);

        const toNpc = npcWorldPos.clone().sub(playerPos.current);
        toNpc.y = 0;
        if (toNpc.lengthSq() < 0.01) toNpc.set(0, 0, -1);
        toNpc.normalize();
        const rightOfLine = new THREE.Vector3(-toNpc.z, 0, toNpc.x);

        const desiredDialogueCam = playerPos.current
          .clone()
          .sub(toNpc.clone().multiplyScalar(1.35))
          .add(rightOfLine.clone().multiplyScalar(0.58));
        desiredDialogueCam.y = playerPos.current.y + 1.54;
        desiredDialogueCam.x = THREE.MathUtils.clamp(desiredDialogueCam.x, -4.2, 4.2);
        desiredDialogueCam.z = THREE.MathUtils.clamp(desiredDialogueCam.z, -4.2, 4.2);

        const dialogueLookTarget = playerPos.current
          .clone()
          .lerp(npcWorldPos, 0.65)
          .add(new THREE.Vector3(0, 1.44, 0));

        camera.position.lerp(desiredDialogueCam, Math.min(1, 8 * delta));
        camera.lookAt(dialogueLookTarget);
      } else if (curSettings.isFirstPerson) {
        // Optional First-Person POV (Toggled via V key)
        if (playerGroup) playerGroup.visible = false;

        const bobFrequency = isJogging ? 13 : 8.5;
        const bobIntensityY = isJogging ? 0.038 : 0.022;
        const bobIntensityX = isJogging ? 0.018 : 0.01;

        const headBobY = isMoving
          ? Math.sin(animTime.current * bobFrequency) * bobIntensityY
          : Math.sin(animTime.current * 1.5) * 0.005;
        const headBobX = isMoving
          ? Math.cos(animTime.current * (bobFrequency * 0.5)) * bobIntensityX
          : 0;

        const clampedCamX = THREE.MathUtils.clamp(playerPos.current.x + headBobX, -4.3, 4.3);
        const clampedCamZ = THREE.MathUtils.clamp(playerPos.current.z, -4.3, 4.3);
        camera.position.set(
          clampedCamX,
          playerPos.current.y + 1.62 + headBobY,
          clampedCamZ
        );

        const lookDir = new THREE.Vector3(
          Math.sin(cameraAngles.current.yaw) * Math.cos(cameraAngles.current.pitch),
          Math.sin(cameraAngles.current.pitch),
          Math.cos(cameraAngles.current.yaw) * Math.cos(cameraAngles.current.pitch)
        ).normalize();

        camera.lookAt(camera.position.clone().add(lookDir));
      } else {
        // DEFAULT GROUNDED THIRD-PERSON INVESTIGATOR VIEW:
        // Shows the fully modeled 3D human investigator in the active playable scene
        if (playerGroup) playerGroup.visible = true;
        const camDist = 1.65;
        const shoulderOffset = 0.38;
        const camHeight = 1.48;

        const forwardCam = new THREE.Vector3(
          Math.sin(cameraAngles.current.yaw),
          0,
          Math.cos(cameraAngles.current.yaw)
        );
        const rightCam = new THREE.Vector3(
          -Math.cos(cameraAngles.current.yaw),
          0,
          Math.sin(cameraAngles.current.yaw)
        );

        const lookAheadPoint = playerPos.current
          .clone()
          .add(forwardCam.clone().multiplyScalar(1.35))
          .add(rightCam.clone().multiplyScalar(shoulderOffset * 0.35))
          .add(new THREE.Vector3(0, camHeight + Math.sin(cameraAngles.current.pitch) * 1.1, 0));

        const camPos = playerPos.current
          .clone()
          .sub(forwardCam.clone().multiplyScalar(camDist * Math.cos(cameraAngles.current.pitch)))
          .add(rightCam.clone().multiplyScalar(shoulderOffset));
        camPos.y = playerPos.current.y + camHeight - Math.sin(cameraAngles.current.pitch) * 0.75 + 0.12;

        // Room boundary clamping with minimum clearance from player mesh so it never clips the character
        camPos.x = THREE.MathUtils.clamp(camPos.x, -4.35, 4.35);
        camPos.z = THREE.MathUtils.clamp(camPos.z, -4.35, 4.35);
        camPos.y = THREE.MathUtils.clamp(camPos.y, 0.75, 3.1);

        const planarCamDist = Math.hypot(
          camPos.x - playerPos.current.x,
          camPos.z - playerPos.current.z
        );
        if (planarCamDist < 0.75) {
          camPos.addScaledVector(rightCam, 0.75 - planarCamDist);
        }

        camera.position.lerp(camPos, Math.min(1, 14 * delta));
        camera.lookAt(lookAheadPoint);
      }

      // ---------------------------------------------------------------------
      // BRIEF CAMERA FOCUS ANIMATION WHEN PRESSING 'E'
      // ---------------------------------------------------------------------
      if (!activeIntroShot && focusAnimRef.current) {
        const anim = focusAnimRef.current;
        const elapsed = currentTime - anim.startTime;
        const toFocus = anim.focusWorldPos.clone().sub(camera.position);
        const horizDist = Math.max(0.01, Math.hypot(toFocus.x, toFocus.z));
        const desiredYaw = Math.atan2(toFocus.x, toFocus.z);
        const desiredPitch = THREE.MathUtils.clamp(Math.atan2(toFocus.y, horizDist), -0.65, 0.65);

        let yawDiff = desiredYaw - cameraAngles.current.yaw;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;

        cameraAngles.current.yaw += yawDiff * Math.min(1, 14 * delta);
        cameraAngles.current.pitch = THREE.MathUtils.lerp(
          cameraAngles.current.pitch,
          desiredPitch,
          Math.min(1, 14 * delta)
        );
        camera.fov = THREE.MathUtils.lerp(camera.fov, 53, Math.min(1, 12 * delta));
        camera.updateProjectionMatrix();

        if (elapsed >= anim.durationMs) {
          const completedTarget = anim.target;
          focusAnimRef.current = null;
          onInteractRef.current(completedTarget);
        }
      } else if (!activeIntroShot && !isModalOpenRef.current && Math.abs(camera.fov - 65) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 65, Math.min(1, 10 * delta));
        camera.updateProjectionMatrix();
      }

      // ---------------------------------------------------------------------
      // PROXIMITY & GAZE-CONE TARGET DETECTION
      // (Phone pops up specifically when very near the phone)
      // ---------------------------------------------------------------------
      let closestTarget: NearbyTarget | null = null;
      let highestTargetScore = 0;

      const currentLookDir = new THREE.Vector3(
        Math.sin(cameraAngles.current.yaw) * Math.cos(cameraAngles.current.pitch),
        Math.sin(cameraAngles.current.pitch),
        Math.cos(cameraAngles.current.yaw) * Math.cos(cameraAngles.current.pitch)
      ).normalize();

      // Check NPCs (Proximity range: approx 30cm from character boundary: planarDist <= 1.05m)
      level.npcs.forEach((npc) => {
        const dx = npc.position[0] - playerPos.current.x;
        const dz = npc.position[2] - playerPos.current.z;
        const planarDist = Math.hypot(dx, dz);
        const npcPos = new THREE.Vector3(npc.position[0], npc.position[1] + 1.4, npc.position[2]);
        const toTarget = npcPos.clone().sub(camera.position).normalize();
        const alignment = currentLookDir.dot(toTarget);
        const planarAlignment =
          planarDist > 0.05 ? (forwardDir.x * dx + forwardDir.z * dz) / planarDist : 1;

        // Pop when within approx 30cm of person and looking toward them
        if (planarDist <= 1.05 && (alignment > 0.18 || planarAlignment > 0.22)) {
          const score = (Math.max(alignment, planarAlignment) + 1.6) / (planarDist + 0.1);
          if (score > highestTargetScore) {
            highestTargetScore = score;
            closestTarget = {
              type: 'npc',
              id: npc.id,
              name: npc.name,
              interactionLabel: formatCleanPromptAction('npc', npc.name, `Talk to ${npc.name}`),
            };
          }
        }
      });

      // Check World Evidence Objects (Approx 30cm from item/table edge: planarDist <= 1.05m)
      level.objects.forEach((obj) => {
        const dx = obj.position[0] - playerPos.current.x;
        const dz = obj.position[2] - playerPos.current.z;
        const planarDist = Math.hypot(dx, dz);
        const objPos = new THREE.Vector3(obj.position[0], obj.position[1] + 0.15, obj.position[2]);
        const toTarget = objPos.clone().sub(camera.position).normalize();
        const alignment = currentLookDir.dot(toTarget);
        const planarAlignment =
          planarDist > 0.05 ? (forwardDir.x * dx + forwardDir.z * dz) / planarDist : 1;

        // Pop when within approx 30cm of desk/object surface
        const maxTriggerDist = 1.05;

        if (
          planarDist <= maxTriggerDist &&
          (planarAlignment > 0.15 || alignment > 0.15)
        ) {
          const score =
            (Math.max(alignment, planarAlignment) + 1.8) / (planarDist + 0.1);

          if (score > highestTargetScore) {
            highestTargetScore = score;
            closestTarget = {
              type: 'object',
              id: obj.id,
              name: obj.name,
              interactionLabel: formatCleanPromptAction('object', obj.name, obj.interactionLabel),
            };
          }
        }
      });

      updateNearbyTarget(closestTarget);

      // ---------------------------------------------------------------------
      // SUBTLE 3D TARGET HIGHLIGHT WHEN PLAYER IS IN INTERACTION RANGE
      // ---------------------------------------------------------------------
      npcGroupsRef.current.forEach((npcGroup, id) => {
        const ring = npcGroup.getObjectByName('targetHighlightRing') as THREE.Mesh | undefined;
        if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
          const isTargeted = closestTarget?.id === id;
          const targetScale = isTargeted ? 1.18 + Math.sin(animTime.current * 5) * 0.04 : 1.0;
          ring.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 10 * delta);
          ring.material.opacity = THREE.MathUtils.lerp(
            ring.material.opacity,
            isTargeted ? 0.95 : 0.35,
            10 * delta
          );
        }
      });

      objectMeshesRef.current.forEach((objGroup, id) => {
        const ring = objGroup.getObjectByName('targetHighlightRing') as THREE.Mesh | undefined;
        if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
          const isTargeted = closestTarget?.id === id;
          const targetScale = isTargeted ? 1.22 + Math.sin(animTime.current * 5) * 0.05 : 1.0;
          ring.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 10 * delta);
          ring.material.opacity = THREE.MathUtils.lerp(
            ring.material.opacity,
            isTargeted ? 0.95 : 0.35,
            10 * delta
          );
        }
      });

      // ---------------------------------------------------------------------
      // IN-HAND EVIDENCE PHONE VIEWMODEL UPDATE (Only used when in 1st-person POV)
      // In default 3rd-person view, the 3D Investigator holds the phone directly in their right hand bone
      // ---------------------------------------------------------------------
      if (phoneViewmodelRef.current) {
        const shouldShowFirstPersonPhone =
          curSettings.isFirstPerson &&
          curSettings.showPhoneInHand !== false &&
          !activeIntroShot &&
          !activeDialogueNpcIdRef.current;

        phoneViewmodelRef.current.visible = shouldShowFirstPersonPhone;
        if (shouldShowFirstPersonPhone) {
          const motionScale = curSettings.reducedMotion ? 0 : 1;
          const phoneBob = isMoving
            ? Math.sin(animTime.current * (isJogging ? 13 : 8.5)) * 0.004 * motionScale
            : Math.sin(animTime.current * 1.5) * 0.0012 * motionScale;
          const phoneSway = isMoving
            ? Math.cos(animTime.current * (isJogging ? 6.5 : 4.25)) * 0.003 * motionScale
            : 0;
          phoneViewmodelRef.current.position.set(0.24 + phoneSway, -0.19 + phoneBob, -0.42);
          phoneViewmodelRef.current.rotation.set(-0.14, -0.24, 0.08);
        }
      }

      // ---------------------------------------------------------------------
      // PROJECT NEARBY TARGETS TO 2D SCREEN COORDINATES (Clamped & Offset Beside Target)
      // ---------------------------------------------------------------------
      if (!lastMarkerUpdateRef.current || currentTime - lastMarkerUpdateRef.current > 35) {
        lastMarkerUpdateRef.current = currentTime;
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        const nextMarkers: ProjectedWorldMarker[] = [];

        level.npcs.forEach((npc) => {
          const dx = npc.position[0] - playerPos.current.x;
          const dz = npc.position[2] - playerPos.current.z;
          const planarDist = Math.hypot(dx, dz);
          const planarAlignment =
            planarDist > 0.05 ? (forwardDir.x * dx + forwardDir.z * dz) / planarDist : 1;

          // Anchor at shoulder height and offset beside Alex so face is never covered
          const worldPos = new THREE.Vector3(npc.position[0], npc.position[1] + 1.38, npc.position[2]);
          const projected = worldPos.clone().project(camera);
          // Only visible when near (approx 30cm from body boundary: planarDist <= 1.05m)
          const isVisible =
            planarDist <= 1.05 &&
            ((projected.z < 1 &&
              projected.x > -0.96 &&
              projected.x < 0.96 &&
              projected.y > -0.95 &&
              projected.y < 0.95) ||
              planarAlignment > 0.15);

          const rawX = projected.z < 1 ? (projected.x * 0.5 + 0.5) * w : w * 0.5;
          const clampedX = Math.max(130, Math.min(w - 130, rawX));
          const clampedY = h - 86;

          nextMarkers.push({
            id: npc.id,
            type: 'npc',
            name: npc.name,
            interactionLabel: formatCleanPromptAction('npc', npc.name, `Talk to ${npc.name}`),
            screenX: clampedX,
            screenY: clampedY,
            planarDist,
            isVisible,
          });
        });

        level.objects.forEach((obj) => {
          const dx = obj.position[0] - playerPos.current.x;
          const dz = obj.position[2] - playerPos.current.z;
          const planarDist = Math.hypot(dx, dz);
          const planarAlignment =
            planarDist > 0.05 ? (forwardDir.x * dx + forwardDir.z * dz) / planarDist : 1;

          // Raise anchor height slightly when very close so desk items below eye level stay comfortably on screen
          const anchorLift = planarDist < 1.35 ? 0.52 : 0.38;
          const worldPos = new THREE.Vector3(obj.position[0], obj.position[1] + anchorLift, obj.position[2]);
          const projected = worldPos.clone().project(camera);

          // Only visible when near the object (approx 30cm from desk edge / surface: planarDist <= 1.05m)
          const isVisible =
            planarDist <= 1.05 &&
            ((projected.z < 1 &&
              projected.x > -0.98 &&
              projected.x < 0.98 &&
              projected.y > -1.25 &&
              projected.y < 0.98) ||
              planarAlignment > 0.05);

          const rawX = projected.z < 1 ? (projected.x * 0.5 + 0.5) * w : w * 0.5;
          const clampedX = Math.max(130, Math.min(w - 130, rawX));
          const clampedY = h - 86;

          nextMarkers.push({
            id: obj.id,
            type: 'object',
            objectType: obj.type,
            name: obj.name,
            interactionLabel: formatCleanPromptAction('object', obj.name, obj.interactionLabel),
            previewSender: obj.inspection.senderOrSource,
            previewContent: obj.inspection.content,
            screenX: clampedX,
            screenY: clampedY,
            planarDist,
            isCollected: curCollectedClueIds.includes(obj.inspection.clueId),
            isVisible,
          });
        });

        setWorldMarkers(nextMarkers);
      }

      // Find nearest undiscovered clue for gentle objective guidance if player gets stuck
      let nearestUndiscoveredClueName: string | null = null;
      let minUndiscoveredDist = Infinity;
      level.objects.forEach((obj) => {
        if (!curCollectedClueIds.includes(obj.inspection.clueId)) {
          const d = Math.hypot(
            obj.position[0] - playerPos.current.x,
            obj.position[2] - playerPos.current.z
          );
          if (d < minUndiscoveredDist) {
            minUndiscoveredDist = d;
            nearestUndiscoveredClueName = obj.name;
          }
        }
      });

      // Telemetry dispatch for gentle stuck-player hint
      if (!lastTelemetryTime.current || currentTime - lastTelemetryTime.current > 40) {
        lastTelemetryTime.current = currentTime;
        window.dispatchEvent(
          new CustomEvent('sleuth-telemetry', {
            detail: {
              x: playerPos.current.x,
              z: playerPos.current.z,
              yaw: cameraAngles.current.yaw,
              nearestUndiscoveredClueName,
            },
          })
        );
      }

      // Render
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [level]);

  // Identify the single active prompt marker and any secondary close targets so prompts NEVER overlap
  const primaryMarker = worldMarkers.find((m) => m.id === activeNearby?.id && m.isVisible) || null;
  const secondaryCloseMarkers = worldMarkers.filter(
    (m) => m.id !== primaryMarker?.id && m.isVisible && m.planarDist <= 1.05
  );

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden ${
        isModalOpen ? 'cursor-auto' : 'cursor-none'
      }`}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className={`w-full h-full outline-none ${isModalOpen ? 'cursor-auto' : 'cursor-none'}`}
      />

      {/* Proximity-Based Contextual Pop-Up (Pops up when within approx 30cm of the person or object) */}
      <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {/* Single Prioritized Contextual Prompt Positioned Somewhat at the Bottom */}
        {primaryMarker && !isModalOpen && !introCameraShot && !activeDialogueNpcId && (
          <div
            key={primaryMarker.id}
            style={{
              left: `${primaryMarker.screenX}px`,
              bottom: '86px',
            }}
            className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-auto animate-prompt-pop"
          >
            <button
              type="button"
              onClick={() =>
                triggerFocusedInteraction({
                  type: primaryMarker.type,
                  id: primaryMarker.id,
                  name: primaryMarker.name,
                  interactionLabel: primaryMarker.interactionLabel,
                })
              }
              className={`px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 active:scale-95 ${
                primaryMarker.type === 'npc'
                  ? 'bg-[#070D1E]/92 border-[#00F0FF]/80 text-white shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_14px_rgba(0,240,255,0.4)]'
                  : 'bg-[#070D1E]/92 border-amber-400/80 text-white shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_14px_rgba(245,158,11,0.4)]'
              }`}
            >
              <span
                className={`w-5 h-5 flex items-center justify-center rounded text-[11px] font-mono font-black ${
                  primaryMarker.type === 'npc'
                    ? 'bg-[#00F0FF] text-slate-950'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                {primaryMarker.type === 'npc' ? 'T' : 'E'}
              </span>
              <span className="font-heading font-semibold text-xs text-white/95 whitespace-nowrap">
                {primaryMarker.interactionLabel}
              </span>
              {primaryMarker.type === 'object' && primaryMarker.isCollected && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-mono text-[9px] font-bold">
                  Clue ✓
                </span>
              )}
            </button>

            {/* Small non-overlapping nearby-target list if multiple targets are equally close */}
            {secondaryCloseMarkers.length > 0 && (
              <div className="mt-1 px-2 py-0.5 rounded-md bg-[#070D1E]/90 border border-slate-700/80 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                Also nearby: {secondaryCloseMarkers.map((s) => s.interactionLabel).join(' · ')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtle Optical Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_62%,rgba(0,0,0,0.32)_100%)]" />
    </div>
  );
};

// ---------------------------------------------------------------------------
// FIRST-PERSON IN-HAND SMARTPHONE VIEWMODEL (Shows Readable Fictional Message)
// ---------------------------------------------------------------------------

function createInHandPhoneViewmodel(msgSender?: string, msgBody?: string): THREE.Group {
  const group = new THREE.Group();

  // Smartphone body
  const bodyGeo = new THREE.BoxGeometry(0.11, 0.21, 0.012);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.25,
    metalness: 0.9,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(bodyMesh);

  // Brushed slate perimeter bezel
  const bezelGeo = new THREE.BoxGeometry(0.114, 0.214, 0.01);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.85,
    roughness: 0.25,
  });
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
  group.add(bezelMesh);

  // Phone screen with realistic smartphone home screen texture
  const screenGeo = new THREE.PlaneGeometry(0.106, 0.204);
  const screenTex = ProceduralTextureGenerator.createPhoneHomeScreenTexture();
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTex,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.0065;
  group.add(screenMesh);

  // Investigator hand & fingers matching the character skin and sleeve style
  const handMat = new THREE.MeshStandardMaterial({
    color: 0xe2b492,
    roughness: 0.6,
  });
  // Palm backing
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.11, 0.022), handMat);
  palm.position.set(0.01, -0.05, -0.015);
  group.add(palm);

  // Thumb resting along left bezel
  const thumbGeo = new THREE.CapsuleGeometry(0.013, 0.048, 6, 10);
  const thumb = new THREE.Mesh(thumbGeo, handMat);
  thumb.position.set(-0.06, -0.025, 0.008);
  thumb.rotation.z = -0.32;
  thumb.rotation.y = 0.22;
  group.add(thumb);

  // Fingers wrapped naturally on right bezel
  for (let f = 0; f < 4; f++) {
    const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.042, 6, 10), handMat);
    finger.position.set(0.06, 0.035 - f * 0.032, -0.003);
    finger.rotation.z = 0.12;
    group.add(finger);
  }

  // Tailored Investigator Jacket Cuff & Shirt Trim
  const cuffShirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.043, 0.046, 0.03, 14),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 })
  );
  cuffShirt.position.set(0.018, -0.11, -0.025);
  cuffShirt.rotation.x = 0.42;
  group.add(cuffShirt);

  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
  });
  const sleeveGeo = new THREE.CylinderGeometry(0.048, 0.062, 0.16, 14);
  const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  sleeve.position.set(0.02, -0.16, -0.04);
  sleeve.rotation.x = 0.42;
  group.add(sleeve);

  return group;
}

// ---------------------------------------------------------------------------
// 3D PHOTOREALISTIC PROCEDURAL ENVIRONMENT BUILDERS
// ---------------------------------------------------------------------------

function buildPhotorealisticEnvironment(scene: THREE.Scene, setting: 'apartment' | 'campus' | 'cafe' | 'office') {
  // Floor Geometry (10m x 10m)
  const floorGeo = new THREE.PlaneGeometry(10, 10);
  floorGeo.rotateX(-Math.PI / 2);

  let floorMat: THREE.Material;
  if (setting === 'apartment') {
    const { diffuse, roughness } = ProceduralTextureGenerator.createWoodFloorTexture();
    floorMat = new THREE.MeshStandardMaterial({
      map: diffuse,
      roughnessMap: roughness,
      roughness: 0.38,
      metalness: 0.08,
    });
  } else if (setting === 'cafe') {
    floorMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextureGenerator.createCafeTileTexture(),
      roughness: 0.22,
      metalness: 0.12,
    });
  } else if (setting === 'campus') {
    floorMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextureGenerator.createCampusStoneTexture(),
      roughness: 0.75,
      metalness: 0.05,
    });
  } else {
    // Office
    floorMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextureGenerator.createAcousticWoodSlatTexture(),
      roughness: 0.65,
      metalness: 0.05,
    });
  }

  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // High-Resolution Eggshell Plaster Drywall
  const wallMat = new THREE.MeshStandardMaterial({
    map: ProceduralTextureGenerator.createDrywallTexture(),
    color: 0xfdfbf7, // Warm off-white plaster finish
    roughness: 0.82,
    metalness: 0.02,
  });

  // Back Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3.6, 0.3), wallMat);
  backWall.position.set(0, 1.8, -5);
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.6, 10), wallMat);
  leftWall.position.set(-5, 1.8, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.6, 10), wallMat);
  rightWall.position.set(5, 1.8, 0);
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Architectural Mahogany/Oak Wainscoting Panels along lower walls
  const wainscotMat = new THREE.MeshStandardMaterial({
    map: ProceduralTextureGenerator.createAcousticWoodSlatTexture(),
    color: 0x3d271d,
    roughness: 0.45,
    metalness: 0.05,
  });
  const wainscotBack = new THREE.Mesh(new THREE.BoxGeometry(10, 1.1, 0.06), wainscotMat);
  wainscotBack.position.set(0, 0.55, -4.83);
  wainscotBack.receiveShadow = true;

  const wainscotLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 10), wainscotMat);
  wainscotLeft.position.set(-4.83, 0.55, 0);
  wainscotLeft.receiveShadow = true;

  const wainscotRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 10), wainscotMat);
  wainscotRight.position.set(4.83, 0.55, 0);
  wainscotRight.receiveShadow = true;

  scene.add(wainscotBack, wainscotLeft, wainscotRight);

  // Realistic Room Ceiling Enclosure with Perimeter Molding
  const ceilingGeo = new THREE.PlaneGeometry(10, 10);
  ceilingGeo.rotateX(Math.PI / 2);
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf3f6fa, roughness: 0.88 });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.position.y = 3.6;
  scene.add(ceilingMesh);

  // White Crown Molding around top wall ceiling perimeter
  const crownMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const crownBack = new THREE.Mesh(new THREE.BoxGeometry(10, 0.12, 0.12), crownMat);
  crownBack.position.set(0, 3.54, -4.82);
  const crownLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 10), crownMat);
  crownLeft.position.set(-4.82, 3.54, 0);
  const crownRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 10), crownMat);
  crownRight.position.set(4.82, 3.54, 0);
  scene.add(crownBack, crownLeft, crownRight);

  // 4 Recessed LED Architectural Downlight Fixtures in Ceiling
  for (const cx of [-2.2, 2.2]) {
    for (const cz of [-2.2, 2.2]) {
      const can = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.03, 20),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
      );
      can.position.set(cx, 3.59, cz);
      const bulb = new THREE.Mesh(
        new THREE.CircleGeometry(0.1, 20),
        new THREE.MeshBasicMaterial({ color: 0xfffaea })
      );
      bulb.rotateX(Math.PI / 2);
      bulb.position.set(cx, 3.582, cz);
      scene.add(can, bulb);
    }
  }

  // Baseboard Skirting Moldings along all walls
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x162033, roughness: 0.4 });
  const bbBack = new THREE.Mesh(new THREE.BoxGeometry(10, 0.14, 0.04), baseboardMat);
  bbBack.position.set(0, 0.07, -4.84);
  const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 10), baseboardMat);
  bbLeft.position.set(-4.84, 0.07, 0);
  const bbRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 10), baseboardMat);
  bbRight.position.set(4.84, 0.07, 0);
  scene.add(bbBack, bbLeft, bbRight);

  // Soft Ambient Occlusion Contact Shadow Decals under Furniture
  const shadowMat = new THREE.MeshBasicMaterial({
    map: ProceduralTextureGenerator.createContactShadowTexture(),
    transparent: true,
    opacity: 0.7,
  });

  const sofaShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.4), shadowMat);
  sofaShadow.rotateX(-Math.PI / 2);
  sofaShadow.position.set(2.0, 0.003, -1.2);
  sofaShadow.rotation.z = -Math.PI / 4;
  scene.add(sofaShadow);

  const tableShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), shadowMat);
  tableShadow.rotateX(-Math.PI / 2);
  tableShadow.position.set(1.5, 0.003, 0.4);
  scene.add(tableShadow);

  const deskShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), shadowMat);
  deskShadow.rotateX(-Math.PI / 2);
  deskShadow.position.set(-2.0, 0.003, -2.0);
  scene.add(deskShadow);

  // Setting-Specific Detailed Real-Life Architecture & Props
  if (setting === 'apartment') {
    // Dedicated Warm Fill Lighting for Right Wall
    const rightWallFillLight = new THREE.DirectionalLight(0xfff7ed, 0.65);
    rightWallFillLight.position.set(-3, 2.5, 0);
    scene.add(rightWallFillLight);

    // Modern Brass Wall Sconces with Up/Down Illumination on Right Wall
    const sconceMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    const glassShadeMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffbeb,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.2,
    });

    for (const sz of [-3.0, 3.0]) {
      const sconceGroup = new THREE.Group();
      const mountPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.24, 0.12), sconceMat);
      mountPlate.position.set(4.82, 2.25, sz);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), sconceMat);
      arm.position.set(4.76, 2.25, sz);
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.26, 16), glassShadeMat);
      shade.position.set(4.7, 2.25, sz);

      const sconceLight = new THREE.PointLight(0xffe8c6, 1.4, 6.5, 2);
      sconceLight.position.set(4.68, 2.25, sz);

      sconceGroup.add(mountPlate, arm, shade, sconceLight);
      scene.add(sconceGroup);
    }

    // 1. Large Panoramic Window on Right Wall with Outside City Skyline View
    const windowGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x82b4dc,
      transmission: 0.9,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      reflectivity: 0.9,
    });

    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), glassMat);
    winGlass.rotateY(-Math.PI / 2);
    winGlass.position.set(4.82, 1.9, 0);

    // Window Mullions (Grid lines)
    const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.6, 0.04), frameMat);
    mullionV.position.set(4.81, 1.9, 0);
    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 3.6), frameMat);
    mullionH.position.set(4.81, 1.9, 0);
    windowGroup.add(winGlass, mullionV, mullionH);
    scene.add(windowGroup);

    // Architectural 3D Window Outer Frame & Projected Sill on Right Wall
    const winCasing = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.76, 3.76),
      new THREE.MeshStandardMaterial({ color: 0x162033, roughness: 0.4 })
    );
    winCasing.position.set(4.8, 1.9, 0);

    const winSill = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.05, 3.84),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.35 })
    );
    winSill.position.set(4.72, 0.58, 0);
    winSill.receiveShadow = true;
    winSill.castShadow = true;

    // Small Ceramic Potted Succulent on Window Sill
    const sillPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.04, 0.08, 14),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    sillPot.position.set(4.72, 0.645, 1.1);
    const sillPlant = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.055),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
    );
    sillPlant.position.set(4.72, 0.70, 1.1);
    scene.add(winCasing, winSill, sillPot, sillPlant);

    // City Skyline View Outside the Window
    const skylineGeo = new THREE.PlaneGeometry(8.5, 4.8);
    skylineGeo.rotateY(-Math.PI / 2);
    const skylineMat = new THREE.MeshBasicMaterial({
      map: ProceduralTextureGenerator.createCitySkylineTexture(),
    });
    const skylineMesh = new THREE.Mesh(skylineGeo, skylineMat);
    skylineMesh.position.set(5.8, 2.2, 0);
    scene.add(skylineMesh);

    // Sheer Linen Window Curtains framing window
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      transparent: true,
      opacity: 0.8,
    });
    const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.8, 0.5), curtainMat);
    curtainL.position.set(4.75, 1.9, -1.9);
    const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.8, 0.5), curtainMat);
    curtainR.position.set(4.75, 1.9, 1.9);
    scene.add(curtainL, curtainR);

    // Right Wall Gallery Art Pair (at back right wall z = -3.0)
    const rightArtGroup = new THREE.Group();
    for (let a = 0; a < 2; a++) {
      const artY = 1.75 + a * 0.7;
      const artFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.58, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x24180f, roughness: 0.4 })
      );
      artFrame.position.set(4.8, artY, -3.0);

      const artMat = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.5, 0.4),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
      );
      artMat.position.set(4.79, artY, -3.0);

      const artPic = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.24),
        new THREE.MeshStandardMaterial({ map: ProceduralTextureGenerator.createGalleryArtTexture(), roughness: 0.5 })
      );
      artPic.rotateY(-Math.PI / 2);
      artPic.position.set(4.778, artY, -3.0);
      rightArtGroup.add(artFrame, artMat, artPic);
    }
    scene.add(rightArtGroup);

    // Right Wall Entryway Console, Brass Mirror & Key Dish (at front right wall z = 3.0)
    const entrywayRightGroup = new THREE.Group();
    const mirrorFrame = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.02, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 })
    );
    mirrorFrame.rotateZ(Math.PI / 2);
    mirrorFrame.position.set(4.8, 2.05, 3.0);

    const mirrorGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.005, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0.95, reflectivity: 0.95 })
    );
    mirrorGlass.rotateZ(Math.PI / 2);
    mirrorGlass.position.set(4.788, 2.05, 3.0);

    const consoleLedge = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.04, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.4 })
    );
    consoleLedge.position.set(4.74, 1.2, 3.0);

    const keyDish = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.05, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 })
    );
    keyDish.position.set(4.72, 1.235, 3.2);
    entrywayRightGroup.add(mirrorFrame, mirrorGlass, consoleLedge, keyDish);
    scene.add(entrywayRightGroup);

    // Real Entryway 4-Panel Front Door on Back Wall
    const doorCasing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.45, 0.06), new THREE.MeshStandardMaterial({ color: 0x162033, roughness: 0.4 }));
    doorCasing.position.set(-3.5, 1.22, -4.83);
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.08, 2.3, 0.04), new THREE.MeshStandardMaterial({ color: 0x24180f, roughness: 0.35 }));
    doorLeaf.position.set(-3.5, 1.15, -4.8);
    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 }));
    doorHandle.rotateZ(Math.PI / 2);
    doorHandle.position.set(-3.12, 1.05, -4.75);
    const mailSlot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.02), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 }));
    mailSlot.position.set(-3.5, 0.65, -4.77);
    scene.add(doorCasing, doorLeaf, doorHandle, mailSlot);

    // 2. Moroccan Berber Woven Wool Area Rug under Sofa & Coffee Table
    const rugGeo = new THREE.PlaneGeometry(3.4, 2.4);
    rugGeo.rotateX(-Math.PI / 2);
    const rugMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextureGenerator.createRugTexture(),
      roughness: 0.9,
      metalness: 0.0,
    });
    const rugMesh = new THREE.Mesh(rugGeo, rugMat);
    rugMesh.position.set(1.6, 0.005, -0.4);
    rugMesh.receiveShadow = true;
    scene.add(rugMesh);

    // 3. Realistic Sectional Modern Sofa
    const sofaGroup = new THREE.Group();
    const fabricMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0x27354d, roughness: 0.8 });
    const woodLegMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.4 });

    // Main base deck
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 1.1), fabricMat);
    sofaBase.position.set(0, 0.25, 0);
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;

    // Backrest angled
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.55, 0.25), fabricMat);
    sofaBack.position.set(0, 0.65, -0.42);
    sofaBack.castShadow = true;

    // Left and Right Armrests
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 1.1), fabricMat);
    armL.position.set(-1.18, 0.5, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 1.1), fabricMat);
    armR.position.set(1.18, 0.5, 0);

    // 3 Individual Seat Cushions
    for (let c = 0; c < 3; c++) {
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.16, 0.82), cushionMat);
      seatCushion.position.set(-0.7 + c * 0.7, 0.44, 0.06);
      seatCushion.castShadow = true;
      sofaGroup.add(seatCushion);
    }

    // Accent Throw Pillows (Ochre Mustard & Terracotta)
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.14), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }));
    pillow1.position.set(-0.85, 0.65, -0.22);
    pillow1.rotation.y = 0.25;
    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.14), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 }));
    pillow2.position.set(0.85, 0.65, -0.22);
    pillow2.rotation.y = -0.25;

    // Tapered Sofa Legs
    for (const lx of [-1.15, 1.15]) {
      for (const lz of [-0.45, 0.45]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.16, 12), woodLegMat);
        leg.position.set(lx, 0.08, lz);
        leg.castShadow = true;
        sofaGroup.add(leg);
      }
    }

    sofaGroup.add(sofaBase, sofaBack, armL, armR, pillow1, pillow2);
    sofaGroup.position.set(2.0, 0, -1.2);
    sofaGroup.rotation.y = -Math.PI / 4;
    scene.add(sofaGroup);

    // 4. Realistic Tempered Glass Coffee Table
    const coffeeTableGroup = new THREE.Group();
    const glassTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.03, 0.85),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.88,
        opacity: 0.9,
        transparent: true,
        roughness: 0.05,
        metalness: 0.1,
      })
    );
    glassTop.position.set(0, 0.42, 0);
    glassTop.castShadow = true;

    // Lower Walnut Shelf holding magazine
    const lowerShelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.02, 0.75), new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.35 }));
    lowerShelf.position.set(0, 0.18, 0);
    lowerShelf.receiveShadow = true;

    // Magazines on lower shelf
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.015, 0.35), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
    mag.position.set(0.3, 0.2, 0.1);
    mag.rotation.y = 0.2;

    // Brushed Black Steel Legs
    const steelLegMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.3 });
    for (const sx of [-0.75, 0.75]) {
      for (const sz of [-0.38, 0.38]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 12), steelLegMat);
        leg.position.set(sx, 0.21, sz);
        leg.castShadow = true;
        coffeeTableGroup.add(leg);
      }
    }
    coffeeTableGroup.add(glassTop, lowerShelf, mag);
    coffeeTableGroup.position.set(1.5, 0, 0.4);
    scene.add(coffeeTableGroup);

    // 5. High-End Solid Walnut Writing Desk
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.06, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x2b1c11, roughness: 0.3, metalness: 0.05 })
    );
    deskTop.position.set(0, 0.74, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;

    // Black Leather Blotter Desk Mat
    const blotter = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.005, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 })
    );
    blotter.position.set(-0.1, 0.772, 0.05);

    // Ceramic Coffee Mug with Latte Foam
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
    mug.position.set(0.65, 0.82, -0.2);
    const foam = new THREE.Mesh(new THREE.CircleGeometry(0.046, 16), new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 }));
    foam.rotateX(-Math.PI / 2);
    foam.position.set(0.65, 0.87, -0.2);

    // Desk Trestle Steel Legs
    for (const dx of [-0.98, 0.98]) {
      for (const dz of [-0.42, 0.42]) {
        const dleg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.72, 0.04), steelLegMat);
        dleg.position.set(dx, 0.36, dz);
        dleg.castShadow = true;
        deskGroup.add(dleg);
      }
    }
    deskGroup.add(deskTop, blotter, mug, foam);
    deskGroup.position.set(-2.0, 0, -2.0);
    scene.add(deskGroup);

    // 6. Sculpted Fiddle-Leaf Fig Indoor Plant with Wooden Stand & Ceramic Pot
    const plantGroup = new THREE.Group();

    // Wooden Stand: 4 vertical legs and cross-brace support
    const standLegMat = new THREE.MeshStandardMaterial({ color: 0x5c3214, roughness: 0.45 });
    for (let s = 0; s < 4; s++) {
      const standLeg = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.44, 0.032), standLegMat);
      const angle = (s * Math.PI) / 2;
      standLeg.position.set(Math.cos(angle) * 0.24, 0.22, Math.sin(angle) * 0.24);
      standLeg.castShadow = true;
      plantGroup.add(standLeg);
    }
    // Cross brace supporting pot
    const crossBrace1 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.032, 0.032), standLegMat);
    crossBrace1.position.set(0, 0.16, 0);
    const crossBrace2 = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.032, 0.46), standLegMat);
    crossBrace2.position.set(0, 0.16, 0);
    plantGroup.add(crossBrace1, crossBrace2);

    // Ceramic Pot sitting inside stand on cross-brace
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.19, 0.48, 28),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.05 })
    );
    pot.position.set(0, 0.41, 0);
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot); // Added pot mesh to group!

    // Soil
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.225, 0.22, 0.03, 24),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 })
    );
    soil.position.set(0, 0.63, 0);
    soil.receiveShadow = true;
    plantGroup.add(soil);

    // Main Stem & Curved Leaf Branches
    const mainStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.024, 0.95, 10),
      new THREE.MeshStandardMaterial({ color: 0x3f2e18, roughness: 0.7 })
    );
    mainStem.position.set(0, 1.1, 0);
    mainStem.castShadow = true;
    plantGroup.add(mainStem);

    // 8 Lush Organic Fiddle-Leaf Fig Leaves
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.28,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    for (let l = 0; l < 8; l++) {
      const leafStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.009, 0.18, 6),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 })
      );
      const leafY = 0.75 + l * 0.12;
      const leafAngle = l * 1.25 + 0.3;
      const radius = 0.08 + (l % 2) * 0.02;

      // Position stem
      leafStem.position.set(
        Math.cos(leafAngle) * (radius * 0.5),
        leafY,
        Math.sin(leafAngle) * (radius * 0.5)
      );
      leafStem.rotation.set(0.4, leafAngle, -0.4);
      plantGroup.add(leafStem);

      // Broad scalloped leaf geometry
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(0.12, 0.08, 0.18, 0.22, 0.14, 0.38);
      leafShape.bezierCurveTo(0.08, 0.46, -0.08, 0.46, -0.14, 0.38);
      leafShape.bezierCurveTo(-0.18, 0.22, -0.12, 0.08, 0, 0);

      const leafGeo = new THREE.ShapeGeometry(leafShape, 12);
      const leaf = new THREE.Mesh(leafGeo, leafMat);

      leaf.position.set(
        Math.cos(leafAngle) * radius,
        leafY + 0.04,
        Math.sin(leafAngle) * radius
      );
      leaf.rotation.set(-0.3, leafAngle + Math.PI / 2, 0.4);
      leaf.scale.set(0.85, 0.85, 0.85);
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }

    plantGroup.position.set(-3.6, 0, 1.5);
    scene.add(plantGroup);

    // 7. Mid-Century Articulated Floor Lamp
    const lampGroup = new THREE.Group();
    const marbleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 20), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
    marbleBase.position.set(0, 0.03, 0);
    const brassStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 }));
    brassStem.position.set(0, 0.98, 0);
    const linenShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.32, 0.36, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7, side: THREE.DoubleSide })
    );
    linenShade.position.set(0, 1.9, 0);
    lampGroup.add(marbleBase, brassStem, linenShade);
    lampGroup.position.set(-3.2, 0, -3.2);
    scene.add(lampGroup);

    // 8. Gallery Framed Modern Landscape Art on Back Wall (Hollow frame molding & recessed Z-layers to eliminate Z-fighting)
    const artFrameGroup = new THREE.Group();
    const frameWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.35 });

    // Backing Board
    const backingBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.66, 1.26, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 })
    );
    backingBoard.position.z = -0.01;

    // Outer Wooden Frame Molding (4 perimeter bars)
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.08, 0.04), frameWoodMat);
    topBar.position.set(0, 0.59, 0.01);
    const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.08, 0.04), frameWoodMat);
    bottomBar.position.set(0, -0.59, 0.01);
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.10, 0.04), frameWoodMat);
    leftBar.position.set(-0.79, 0, 0.01);
    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.10, 0.04), frameWoodMat);
    rightBar.position.set(0.79, 0, 0.01);

    // Recessed White Mat Board
    const matBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.1, 0.008),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
    );
    matBoard.position.z = 0.002;

    // Canvas Art Painting (Inset inside mat board, set forward by 2mm)
    const canvasArt = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.8),
      new THREE.MeshStandardMaterial({
        map: ProceduralTextureGenerator.createGalleryArtTexture(),
        roughness: 0.6,
      })
    );
    canvasArt.position.z = 0.008;

    artFrameGroup.add(backingBoard, topBar, bottomBar, leftBar, rightBar, matBoard, canvasArt);
    artFrameGroup.position.set(1.5, 2.2, -4.8);
    scene.add(artFrameGroup);

    // 9. Floating Oak Wall Bookshelves with Colorful Books, Framed Photo & Succulent (Left Wall)
    const shelfGroup = new THREE.Group();
    const oakShelfMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.4 });
    const bookColors = [0x0284c7, 0xd97706, 0x15803d, 0xbe123c, 0x4338ca, 0xf1f5f9, 0x1e293b];

    for (let s = 0; s < 2; s++) {
      const shelfY = 1.7 + s * 0.55;
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 1.8), oakShelfMat);
      shelf.position.set(-4.7, shelfY, -0.6);
      shelf.receiveShadow = true;
      shelfGroup.add(shelf);

      // Books standing on the shelf
      for (let b = 0; b < 9; b++) {
        const bookH = 0.2 + (b % 3) * 0.035;
        const bookD = 0.16 + (b % 2) * 0.02;
        const bookW = 0.03 + (b % 4) * 0.01;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(bookD, bookH, bookW),
          new THREE.MeshStandardMaterial({ color: bookColors[b % bookColors.length], roughness: 0.65 })
        );
        book.position.set(-4.7 + (0.24 - bookD) * 0.5, shelfY + bookH / 2 + 0.018, -1.3 + b * 0.045);
        book.castShadow = true;
        shelfGroup.add(book);
      }

      // Small potted succulent on top shelf
      if (s === 1) {
        const succPot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.035, 0.07, 12),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
        );
        succPot.position.set(-4.68, shelfY + 0.05, 0.1);
        const succLeaf = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.04),
          new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 })
        );
        succLeaf.position.set(-4.68, shelfY + 0.1, 0.1);
        shelfGroup.add(succPot, succLeaf);

        // Framed picture
        const picFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.16, 0.12),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 })
        );
        picFrame.position.set(-4.68, shelfY + 0.1, -0.2);
        picFrame.rotation.y = 0.2;
        shelfGroup.add(picFrame);
      }
    }
    scene.add(shelfGroup);

    // 10. Practical Desk Task Lamp over Alex's Writing Desk (Casting warm incandescent light)
    const deskLampGroup = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), brassMat);
    lampBase.position.set(-1.45, 0.78, -2.35);
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 12), brassMat);
    lampStem.position.set(-1.45, 0.99, -2.35);
    lampStem.rotation.z = -0.25;
    const lampHood = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.14, 16),
      brassMat
    );
    lampHood.rotation.z = Math.PI / 1.35;
    lampHood.position.set(-1.38, 1.18, -2.35);

    // Warm incandescent desk point light focusing on the evidence desk
    const deskTaskLight = new THREE.PointLight(0xffe0a3, 1.4, 3.5, 2);
    deskTaskLight.position.set(-1.4, 1.15, -2.15);
    deskLampGroup.add(lampBase, lampStem, lampHood, deskTaskLight);
    scene.add(deskLampGroup);

    // 11. Cork Bulletin Board above Alex's Desk with Sticky Notes & Delivery Notices
    const boardGroup = new THREE.Group();
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.9, 0.025),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 })
    );
    boardFrame.position.set(-2.0, 1.85, -4.84);
    const corkSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.95 })
    );
    corkSurface.position.set(-2.0, 1.85, -4.82);
    boardGroup.add(boardFrame, corkSurface);

    // Sticky reminder notes on corkboard
    const notePositions = [
      { x: -2.4, y: 1.95, color: 0xfef08a, rot: 0.05 },
      { x: -2.1, y: 1.85, color: 0x93c5fd, rot: -0.08 },
      { x: -1.7, y: 1.98, color: 0xfbcfe8, rot: 0.12 },
      { x: -1.9, y: 1.68, color: 0x86efac, rot: -0.04 },
    ];
    for (const np of notePositions) {
      const note = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, 0.12),
        new THREE.MeshStandardMaterial({ color: np.color, roughness: 0.85 })
      );
      note.position.set(np.x, np.y, -4.815);
      note.rotation.z = np.rot;
      boardGroup.add(note);
    }
    scene.add(boardGroup);

    // 12. Entryway Hallway Coat Rack, Keys Hooks & Console Table by Front Door
    const entryGroup = new THREE.Group();
    const entryTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.76, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 })
    );
    entryTable.position.set(-4.2, 0.38, -3.8);
    entryGroup.add(entryTable);

    // Mail letters on entry console
    const letter1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.015, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    letter1.position.set(-4.15, 0.77, -3.8);
    letter1.rotation.y = 0.25;
    const letter2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.015, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xfee2e2, roughness: 0.6 })
    );
    letter2.position.set(-4.22, 0.78, -3.8);
    letter2.rotation.y = -0.15;
    entryGroup.add(letter1, letter2);

    // Standing Coat Rack by the Door
    const coatRackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.85, 12), coatRackMat);
    pole.position.set(-4.4, 0.92, -4.4);
    const baseDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), coatRackMat);
    baseDisk.position.set(-4.4, 0.015, -4.4);
    entryGroup.add(pole, baseDisk);

    // Hung Raincoat on Coat Rack
    const raincoat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.24, 0.95, 14),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
    );
    raincoat.position.set(-4.38, 1.25, -4.38);
    entryGroup.add(raincoat);
    scene.add(entryGroup);

    // 13. Cozy Woven Throw Blanket Draped on Sofa Arm
    const blanketMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.95 });
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.52, 0.55), blanketMat);
    blanket.position.set(0.9, 0.52, -1.05);
    blanket.rotation.y = -Math.PI / 4;
    scene.add(blanket);
  } else if (setting === 'campus') {
    // Campus Quad stone benches & library brick walls
    const benchGroup = new THREE.Group();
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.3 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 0.6), benchMat);
    seat.position.set(0, 0.45, 0);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.06), benchMat);
    back.position.set(0, 0.75, -0.28);
    benchGroup.add(seat, back);
    for (const bx of [-0.9, 0.9]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.6), ironMat);
      leg.position.set(bx, 0.225, 0);
      benchGroup.add(leg);
    }
    benchGroup.position.set(1.8, 0, 1.0);
    scene.add(benchGroup);

    // Classical Stone Planter with Lush Green Hedge
    const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 0.7, 18), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }));
    planter.position.set(-2.5, 0.35, 2.5);
    const treeFoliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
    treeFoliage.position.set(-2.5, 2.1, 2.5);
    scene.add(planter, treeFoliage);
  } else if (setting === 'cafe') {
    // Bistro Round Tables with Carrara Marble Top & Cast Iron Pedestal
    const cafeTableGroup = new THREE.Group();
    const marbleTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.04, 32),
      new THREE.MeshStandardMaterial({
        map: ProceduralTextureGenerator.createMarbleTexture(),
        roughness: 0.18,
        metalness: 0.1,
      })
    );
    marbleTop.position.set(0, 0.74, 0);
    marbleTop.castShadow = true;

    // Brass rim ring
    const brassRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.015, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 })
    );
    brassRim.rotateX(Math.PI / 2);
    brassRim.position.set(0, 0.74, 0);

    // Cast iron ornate pedestal base
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.4 });
    const ironCol = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.72, 16), ironMat);
    ironCol.position.set(0, 0.36, 0);
    const ironBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.04, 18), ironMat);
    ironBase.position.set(0, 0.02, 0);

    cafeTableGroup.add(marbleTop, brassRim, ironCol, ironBase);
    cafeTableGroup.position.set(1.5, 0, 0.8);
    scene.add(cafeTableGroup);
  } else {
    // Modern Office with Scandinavian Slat Wood Accent Wall & Glass Divider
    const deskMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.75, 1.0),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    deskMesh.position.set(1.6, 0.375, 0.6);
    scene.add(deskMesh);

    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.6, 4.2),
      new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.1, transmission: 0.85 })
    );
    glass.position.set(-1.0, 1.3, 0);
    scene.add(glass);
  }
}

// ---------------------------------------------------------------------------
// 3D HUMAN CHARACTER CREATION (Believable Human Anatomy, Skeleton & Clothing)
// ---------------------------------------------------------------------------
function createPlayerCharacter(): HumanCharacterInstance {
  return createHumanCharacter({
    id: 'player_detective',
    name: 'Detective Rowan Vance',
    archetype: 'investigator',
    style: 'investigator_coat',
    isNpc: false,
    hasBeard: false,
  });
}

function createNpcCharacter(npc: NpcDef): HumanCharacterInstance {
  return createHumanCharacter({
    id: npc.id,
    name: npc.name,
    role: npc.role,
    isNpc: true,
  });
}

// ---------------------------------------------------------------------------
// 3D PHOTOREALISTIC WORLD INTERACTIVE OBJECT PROPS (Grounded on Evidence Tables)
// ---------------------------------------------------------------------------
function createPhotorealisticWorldObjectProp(obj: WorldObjectDef, isCollected: boolean): THREE.Object3D {
  const group = new THREE.Group();

  if (obj.type === 'phone') {
    // Angled Smartphone on Desk Stand showing the readable fictional delivery message
    const standGroup = new THREE.Group();

    const dockBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.02, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 })
    );
    dockBase.position.set(0, 0.01, 0);

    const phoneBodyGeo = new THREE.BoxGeometry(0.22, 0.38, 0.016);
    const phoneBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const phoneBody = new THREE.Mesh(phoneBodyGeo, phoneBodyMat);
    phoneBody.position.set(0, 0.19, 0.02);
    phoneBody.rotation.x = -0.28;
    phoneBody.castShadow = true;

    // Glowing OLED Screen Glass showing readable fictional delivery message
    const screenGeo = new THREE.PlaneGeometry(0.202, 0.358);
    const screenTexture = ProceduralTextureGenerator.createPhoneScreenTexture(
      obj.inspection.senderOrSource,
      obj.inspection.content,
      isCollected
    );
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.19, 0.029);
    screenMesh.rotation.x = -0.28;

    const screenLight = new THREE.PointLight(0x38bdf8, 0.65, 1.4, 2);
    screenLight.position.set(0, 0.25, 0.18);

    standGroup.add(dockBase, phoneBody, screenMesh, screenLight);
    group.add(standGroup);
  } else if (obj.type === 'laptop') {
    const baseGeo = new THREE.BoxGeometry(0.48, 0.016, 0.32);
    const aluMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, aluMat);
    baseMesh.castShadow = true;

    const trackpad = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.09),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 })
    );
    trackpad.rotateX(-Math.PI / 2);
    trackpad.position.set(0, 0.009, 0.08);

    const kbWell = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
    );
    kbWell.rotateX(-Math.PI / 2);
    kbWell.position.set(0, 0.009, -0.05);

    const lidGeo = new THREE.BoxGeometry(0.48, 0.32, 0.012);
    const lidMesh = new THREE.Mesh(lidGeo, aluMat);
    lidMesh.position.set(0, 0.16, -0.16);
    lidMesh.rotation.x = 0.18;
    lidMesh.castShadow = true;

    const dispGeo = new THREE.PlaneGeometry(0.45, 0.29);
    const laptopTexture = ProceduralTextureGenerator.createLaptopScreenTexture(
      obj.inspection.senderOrSource,
      obj.inspection.title
    );
    const dispMat = new THREE.MeshBasicMaterial({
      map: laptopTexture,
    });
    const dispMesh = new THREE.Mesh(dispGeo, dispMat);
    dispMesh.position.set(0, 0.16, -0.152);
    dispMesh.rotation.x = 0.18;

    group.add(baseMesh, trackpad, kbWell, lidMesh, dispMesh);
  } else if (obj.type === 'package') {
    const boxGeo = new THREE.BoxGeometry(0.45, 0.38, 0.45);
    const boxMat = new THREE.MeshStandardMaterial({
      map: ProceduralTextureGenerator.createPackageTexture(),
      roughness: 0.85,
      metalness: 0.0,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    group.add(boxMesh);
  } else {
    // Framed Courier Policy Card / Case Evidence Folder on Angled Easel
    const folderMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55 });
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });

    const backing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.018), borderMat);
    backing.position.set(0, 0.15, 0);
    backing.rotation.x = -0.35;
    backing.castShadow = true;

    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.28), folderMat);
    sheet.position.set(0, 0.15, 0.011);
    sheet.rotation.x = -0.35;

    const accentBar = new THREE.Mesh(
      new THREE.PlaneGeometry(0.34, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    accentBar.position.set(0, 0.24, 0.013);
    accentBar.rotation.x = -0.35;

    group.add(backing, sheet, accentBar);
  }

  // Subtle Evidence Ring (Amber if uninspected, Emerald if inspected; brightens on proximity)
  const ringGeo = new THREE.RingGeometry(0.24, 0.29, 28);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: isCollected ? 0x10b981 : 0xf59e0b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.name = 'targetHighlightRing';
  ring.position.y = 0.008;

  group.add(ring);
  return group;
}

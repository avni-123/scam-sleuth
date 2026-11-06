# Scam Sleuth: Atmospheric Narrative Investigation (Glasshouse Syndicate)

Rework **Scam Sleuth** from an arcadey cyber-defense trainer into a grounded, cinematic first-person narrative adventure with the atmospheric pacing, environmental storytelling, and quiet tension of an indie mystery/horror title. All visuals, settings, characters, soundscapes, and investigative interactions will be overhauled to focus on immersion, subtle tension, and believable cyber-safety threats without monsters or cheap jump scares.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The overhaul is designed around your confirmed answers and prompt specifications:
> - **Soundscape Atmosphere**: Subtle room tones, low 60Hz fluorescent hums, distant muffled city traffic, creaking floorboards, and realistic tactile phone vibrations driven entirely by a real-time procedural Web Audio synthesis engine.
> - **Visual Framing & Subtitles**: Cinematic lower-third subtitle bar with speaker names, subtle depth of field (DoF) camera easing on interactions, adjustable subtitle sizing and contrast/opacity controls, and auto-advance toggle.
> - **Campaign Presentation**: Episodic mystery chapters linked by the elusive **Glasshouse Syndicate**—tracing a web of coordinated social engineering, deceptive delivery notifications, campus portal attacks, and corporate spear phishing.
> - **Interaction Model**: Proximity-hidden contextual prompts (showing only when approaching characters or evidence), smooth first-person camera easing into inspected devices, clean mouse release without requiring extra clicks, and unobtrusive contextual objectives.

---

## 1. Overview & Core Concept

Instead of floating gameified UI markers and neon cyber-effects, the player steps into grounded, dimly lit, lived-in spaces:
1. **The Walk-Up Hallway (Night)**: Flickering warm corridor sconces, worn parquet flooring, muted rain against windowpanes, and a stressed neighbor holding an urgent parcel delivery message.
2. **Oakridge Campus Computer Lab (Late Evening)**: Rows of CRT/LCD monitors casting cold blue luminescence, rhythmic hum of cooling fans, and a panicked student locked out of their graduation portal.
3. **Café Lumière (Closing Time)**: Stattered espresso cups, upside-down chairs on tables, quiet street reflections through storefront glass, and a freelancer dealing with an unexpected payment escrow dispute.
4. **Apex Archival Office (After Hours)**: Desks with scattered papers, low amber desk lamps, distant elevator chimes, and an urgent executive wire transfer request.

Each chapter follows a deliberate 4-part pacing arc:
- **Arrival & Atmosphere**: Enter the quiet space; hear environmental room tone and discover the contextual objective (e.g., *"Find Alex in the hallway"*).
- **Conversational Hook**: Approach character; gentle camera ease toward the speaker with cinematic lower-third subtitles conveying realistic vocal hesitation, anxiety, and dialogue options.
- **Hands-On Inspection**: Examine the inspectable phone, laptop screen, or physical document with real-time smooth camera focus, zero-pill interactive UI, and high-fidelity simulated hardware.
- **Critical Decision & Syndicate Resolution**: Choose how to handle the deceptive situation; reveal how the clue links to the overarching Glasshouse syndicate dossier, closing the chapter cleanly.

---

## 2. User Experience & Visual Design

### A. First-Person Camera & Atmospheric Lighting
- **Camera Feel**:
  - Smooth first-person movement (WASD) with gentle head-bob inertia (toggleable in accessibility settings) and natural mouse-look smoothing.
  - Proximity detection triggers subtle camera easing toward the speaker's eye-line or downward toward the inspectable evidence surface upon interaction.
  - Reduced Motion mode: instant stationary framing with zero head bob or inertia.
- **Restrained Cinematic Lighting & Materials**:
  - Physically based Three.js materials (`MeshStandardMaterial`) with roughness/bump map detailing for worn floorboards, painted drywall, brushed aluminum, and glass.
  - Contrast between warm interior pools of light (amber lamps, corridor fixtures) and cold exterior/device glow (rainy blue window bounce, phone screens).
  - Subtle distance fog and vignette shaders to create natural depth without obscuring evidence readability.

### B. Dialogue & Cinematic Subtitles
- **Lower-Third Subtitle Bar**:
  - Positioned along the bottom-center of the screen, elevated cleanly away from the player's direct line of sight.
  - High-contrast typography: Speaker name in bold crisp brass/gold (`Outfit`), dialogue prose in clear white (`Plus Jakarta Sans`), and contextual interaction prompt (`[Space / Click] Continue`).
  - Accessibility & Display Settings:
    - Font Size: Normal (16px), Large (20px), Extra Large (24px).
    - Background Opacity: Translucent Dark (70%), Solid Black (95%), or High-Contrast Outline.
    - Auto-Advance option with customizable reading pace (slow/medium/fast).

### C. Contextual Investigation & Inspectable Devices
- **Proximity-Activated Prompts**:
  - Clean, minimal prompt tags that fade in only when within 2.5 meters and looking directly at an entity (e.g., `[E] Speak with Alex` or `[E] Examine Delivery Notification`).
  - No permanent floating billboards or arcade markers cluttering the screen.
- **Direct Device Inspection**:
  - Examining a phone or computer smoothly tilts the camera and transitions to an immersive hardware overlay with realistic screen glare, authentic notification banners, and interactive tap-to-expand details.
  - Pointer lock is automatically released upon opening an inspection modal so the cursor is instantly active—no manual clicking required to begin investigating.

---

## 3. Soundscape & Procedural Audio Engine

All audio is generated via procedural Web Audio nodes, ensuring zero missing external assets:
1. **Layered Room Tone & Environmental Ambience**:
  - Continuous pink noise filtered through resonant low-pass filters to emulate room reverberation and air circulation.
  - 60Hz / 120Hz harmonic hum with micro-jitter for fluorescent ballast and refrigerator/server coils.
  - Distant low-frequency rumble and filtered stereo noise bursts simulating rain and muted city traffic.
2. **Foley & Interaction Sound Effects**:
  - Soft footstep rustles with subtle pitch variations.
  - Tactile mechanical switch clicks on opening doors or clicking device buttons.
  - Realistic dual-pulse vibration hum (`haptic-buzz`) for mobile phone SMS and notification alerts.
  - Tension stingers: subtle sustained minor drone that swells quietly during high-stakes decisions.

---

## 4. Technical Architecture & Component Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           App.tsx (Main Hub)                            │
│  • Manages active chapter, player progression, settings & modal states  │
│  • Coordinates soundscape volume & accessibility preferences            │
└───────────────┬─────────────────────────────────────────┬───────────────┘
                │                                         │
                ▼                                         ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────┐
│       AdventureWorld.tsx (3D)         │ │   AtmosphericSoundscape.ts    │
│  • Three.js scene: grounded rooms     │ │  • Continuous room tone       │
│  • Lighting, fog, materials, props    │ │  • Fluorescent ballast hum    │
│  • First-person controller & easing   │ │  • Tactile phone buzzes       │
│  • Proximity raycasting & focus cams  │ │  • Foley footstep generator   │
└───────────────┬───────────────────────┘ └───────────────────────────────┘
                │
                ├─────────────────────────────────────────┐
                ▼                                         ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────┐
│      CinematicSubtitleOverlay.tsx     │ │      DeviceInspectModal.tsx   │
│  • Lower-third cinematic subtitles    │ │  • Inspectable phone / PC     │
│  • Speaker tags, typing animation     │ │  • Real-time optical zoom     │
│  • Size, opacity, auto-advance        │ │  • Immediate cursor release   │
│  • Conversational branching dialogue  │ │  • Contextual clue highlights │
└───────────────────────────────────────┘ └───────────────────────────────┘
```

### Module Responsibilities:
1. **`src/types/adventure.ts`**:
   - Expanded data model for Glasshouse Syndicate episodic chapters, multi-beat dialogue trees, inspectable device items, and clue evidence tags.
2. **`src/services/atmosphericAudio.ts`**:
   - Procedural Web Audio API engine providing continuous room tones, ambient fluorescent buzzes, distant city rumbles, tactile phone pulses, and subtle tension drones.
3. **`src/components/AdventureWorld.tsx`**:
   - Refactored 3D world with realistic room proportions, grounded architectural props (desks, lamps, monitors, doorways, corridors), cinematic lighting, and smooth camera transitions.
4. **`src/components/CinematicSubtitleOverlay.tsx`**:
   - Polished lower-third dialogue system with speaker attribution, gentle backdrop depth-of-field styling, and accessibility adjustments.
5. **`src/components/DeviceInspectModal.tsx`**:
   - Realistic mobile phone and terminal inspection viewport with immediate cursor focus, interactive clue zones, and tactile audio feedback.
6. **`src/components/AtmosphericHud.tsx`**:
   - Stripped-down, minimal HUD featuring only subtle contextual objectives and proximity interaction cues.

---

## 5. Verification & Acceptance Criteria

1. **Atmosphere & Pacing**:
   - Environments feel grounded, moody, and lived-in with restrained lighting and subtle shadow falloff.
   - Procedural room tones and ambient hums run quietly in the background, reinforcing immersion without distraction.
2. **Camera & Interaction Smoothness**:
   - First-person walking and mouse looking are smooth, with smooth camera easing toward characters and evidence.
   - Pointer lock releases instantly on interaction; inspecting phones/documents enables immediate cursor control without needing an extra click.
3. **Dialogue & Subtitles**:
   - Lower-third subtitles are high contrast, readable, and clearly attribute each speaker.
   - Subtitle preferences (size, background opacity, auto-advance) persist and apply seamlessly.
4. **Build & Performance**:
   - Clean compilation (`compile_applet`) and zero TypeScript or linting errors (`lint_applet`).
   - 60 FPS rendering in the Three.js viewport with graceful memory disposal across chapter transitions.

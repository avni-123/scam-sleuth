# Scam Sleuth Blue-and-Pink Theme Overhaul

Implemented the cohesive blue-and-pink aesthetic across all shared styles, game components, and the title-screen artwork in strict accordance with the palette specifications:

- **Deep navy**: `#081426` for interface backgrounds, panels, modals, and container scrims
- **Electric blue**: `#39BDF7` for primary highlights, buttons, progress bars, active selections, and interactive clues
- **Vivid pink**: `#F05A9D` for selected states, case markers, clue pulses, badges, and secondary accents
- **Soft white**: `#F2F5FA` for high-contrast readable text, typography, and crisp labels

## 1. Title Screen & Artwork
- **Artwork**: Generated high-fidelity, photorealistic late-night detective desk artwork (`scam_sleuth_blue_pink_desk_1794314110762.jpg`) featuring a rain-streaked apartment window overlooking electric blue and vivid magenta/pink cyberpunk city lighting, reflecting subtly on dark desk surfaces and task lamp. Removed all warm amber/gold lighting.
- **Title Lockup**: SCAM in `#F2F5FA`, SLEUTH in `#F05A9D` with soft pink glow and electric blue & pink accent lines (`ScamSleuthLogo.tsx`).
- **Interactive Menu**: Navigation buttons, active borders, dual selection dots, progress subtitles, and glowing gradient underlines styled in `#39BDF7` and `#F05A9D`.
- **Modals**: Re-skinned Case Files modal, Achievements modal, Reset confirmation, and Stand-down modal into `#081426` with `#39BDF7` and `#F05A9D` accents.

## 2. Shared Game Components & HUD
- **Case Board (`CaseBoard.tsx`)**: Replaced all amber and gold pins, header accents, and buttons with `#081426`, `#39BDF7`, `#F05A9D`, and `#F2F5FA`.
- **Mission HUD (`MissionHud.tsx`)**: Electric blue and pink progress bar, chapter decision triggers, interaction reticles, and keybind badges.
- **Investigation Desk (`InvestigationDesk.tsx`)**: Updated magnifier reticle, clue trays, clue guidance, question drop targets, and clue inspection popups to `#39BDF7` and `#F05A9D`.
- **Cutscenes & Dialogue (`PreInvestigationCutscene.tsx`, `DialogueOverlay.tsx`, `levelIntroCutscenes.ts`, `adventureLevels.ts`)**: Recolored speech headers, detective avatar tags, and skip buttons to `#39BDF7` and `#F05A9D`.
- **Decision & Journal Modals (`FourChoiceDecisionModal.tsx`, `CaseJournalModal.tsx`, `ConsequenceModal.tsx`)**: Framed in deep navy `#081426` with electric blue borders and pink choice letter markers.
- **Evidence Locker & Case Report (`EvidenceLocker.tsx`, `CaseReport.tsx`)**: Badges, unlocked achievements, and review cards updated to `#F05A9D` and `#39BDF7`.
- **Neon City Map (`NeonCityMap.tsx`)**: Replaced yellow/amber highway glow and reward indicators with `#39BDF7` and `#F05A9D`.
- **Procedural Textures (`proceduralTextures.ts`)**: Phone message bubbles, carrier alerts, and clue borders updated to `#081426`, `#39BDF7`, and `#F05A9D`.

## 3. Verification & Integrity
- All menu items, chapter navigation, level progression, and save states preserved.
- Verified build and TypeScript type-checking via `compile_applet` and `lint_applet` (0 errors).
- Validated UI rendering with headless browser screenshots. Zero gold/amber accent styling remains.

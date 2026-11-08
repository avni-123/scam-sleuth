# Visible Mid-Chest 3D Smartphone Prop & Grip in Character Dossier Pose

Fix the smartphone attachment, pose, and material contrast so that the full 3D smartphone prop is clearly and prominently visible in the front-facing dossier view:
- **Upright at Mid-Chest Height**: Held forward in front of the jacket at `y ≈ 1.235m` and `z ≈ 0.390m` (>15 cm clear of clothing), eliminating any clipping into the jacket torso.
- **Camera-Facing Rear Visibility**: Upright orientation (`+Y` world `~0.999`) with the rear back cover (`+Z` world `~0.999`) facing directly toward the camera, showcasing the frosted slate rear panel, raised camera module island, polished silver bezel, triple sapphire camera lenses, LED flash, and metallic emblem.
- **High-Contrast Silhouette**: Polished titanium outer chamfer rim (`0xd1d5db`, `metalness: 0.96`, `roughness: 0.14`) that catches studio lighting, giving a razor-sharp outline against the dark charcoal jacket.
- **Anatomical Grip**: Palm positioned directly behind the phone supporting it, fingers wrapped around one side edge (`j1: 0.28, j2: 0.38, j3: 0.24`), and thumb resting along the opposite side edge (`t1: 0.22, 0.14, -0.06`).
- **Free Hand Separation**: Left arm hanging relaxed and straight down alongside the hip/thigh, cleanly separated by >46 cm from the phone with zero obstruction.

## 1. Transform & Pose Specifications

- **Right Arm**: `slerpBoneOffset(bones.rightArm, 0.80 + syncBreath, 0.00, -0.60, blendAlpha)`
- **Right Forearm**: `slerpBoneOffset(bones.rightForeArm, 0.55, 0.00, -0.30, blendAlpha)`
- **Right Hand**: `slerpBoneOffset(bones.rightHand, -0.10, -0.25, 0.15, blendAlpha)`
- **Phone Prop Transform in RightHand local space**:
  - `position`: `[0.012, 0.055, 0.006]`
  - `rotation`: `[-2.0224, 0.2698, -1.5401]`
  - Resulting World Coordinates: `[0.023, 1.235, 0.390]`, NDC on dossier screen `(0.024, 0.382)`.

## 2. Verification

- Co-execute `compile_applet` and `lint_applet` together to verify clean build.
- Dev server verified active and serving on port 3000.

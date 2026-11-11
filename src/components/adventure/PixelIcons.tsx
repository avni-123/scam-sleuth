import React from 'react';

interface PixelIconProps {
  className?: string;
  size?: number;
}

/**
 * Crisp 16x16 blocky pixel-art icons for Scam Sleuth's cyber detective inventory.
 * Handcrafted on a 16x16 grid with square pixels, authentic cyber-detective motifs,
 * and high-contrast blue (#39BDF7) & pink (#F05A9D) accents.
 */

// Detective Case Dossier Folder with Pink Alert Seal
export const PixelCaseFolderIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Folder Back Tab */}
    <rect x="2" y="3" width="5" height="2" fill="#39BDF7" />
    {/* Folder Body */}
    <rect x="2" y="5" width="12" height="8" fill="#152B4D" />
    <rect x="3" y="6" width="10" height="6" fill="#0A182F" />
    {/* Cyan Border Highlights */}
    <rect x="2" y="5" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="12" width="12" height="1" fill="#0D1E36" />
    <rect x="2" y="5" width="1" height="8" fill="#39BDF7" />
    <rect x="13" y="5" width="1" height="8" fill="#0D1E36" />
    {/* Pink Evidence Seal Pin */}
    <rect x="7" y="8" width="2" height="2" fill="#F05A9D" />
    <rect x="6" y="9" width="4" height="1" fill="#F05A9D" />
  </svg>
);

// New Investigation Fresh Folder with Plus Mark
export const PixelNewCaseIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="2" y="3" width="5" height="2" fill="#39BDF7" />
    <rect x="2" y="5" width="12" height="8" fill="#0A182F" />
    <rect x="2" y="5" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="12" width="12" height="1" fill="#0D1E36" />
    <rect x="2" y="5" width="1" height="8" fill="#39BDF7" />
    <rect x="13" y="5" width="1" height="8" fill="#0D1E36" />
    {/* Plus Sign */}
    <rect x="7" y="7" width="2" height="4" fill="#39BDF7" />
    <rect x="6" y="8" width="4" height="2" fill="#39BDF7" />
  </svg>
);

// Case Files Archive (3x3 grid of micro dossiers)
export const PixelArchiveGridIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="2" y="2" width="12" height="12" fill="#0A182F" />
    <rect x="2" y="2" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="13" width="12" height="1" fill="#0D1E36" />
    <rect x="2" y="2" width="1" height="12" fill="#39BDF7" />
    <rect x="13" y="2" width="1" height="12" fill="#0D1E36" />
    {/* Grid Tiles */}
    <rect x="4" y="4" width="2" height="2" fill="#39BDF7" />
    <rect x="7" y="4" width="2" height="2" fill="#39BDF7" />
    <rect x="10" y="4" width="2" height="2" fill="#F05A9D" />
    <rect x="4" y="7" width="2" height="2" fill="#39BDF7" />
    <rect x="7" y="7" width="2" height="2" fill="#F05A9D" />
    <rect x="10" y="7" width="2" height="2" fill="#39BDF7" />
    <rect x="4" y="10" width="2" height="2" fill="#39BDF7" />
    <rect x="7" y="10" width="2" height="2" fill="#39BDF7" />
    <rect x="10" y="10" width="2" height="2" fill="#39BDF7" />
  </svg>
);

// Investigator Safety Badge / Trophy
export const PixelBadgeIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Star/Shield Outline */}
    <rect x="7" y="2" width="2" height="2" fill="#39BDF7" />
    <rect x="5" y="4" width="6" height="4" fill="#39BDF7" />
    <rect x="3" y="6" width="10" height="2" fill="#39BDF7" />
    <rect x="4" y="8" width="8" height="2" fill="#39BDF7" />
    <rect x="6" y="10" width="4" height="2" fill="#39BDF7" />
    <rect x="7" y="12" width="2" height="2" fill="#39BDF7" />
    {/* Pink Center Gem */}
    <rect x="6" y="6" width="4" height="2" fill="#F05A9D" />
    <rect x="7" y="5" width="2" height="4" fill="#F05A9D" />
  </svg>
);

// Character Rig Dossier (Detective Flat Cap & Trench Silhouette)
export const PixelCharacterDossierIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Flat Cap Crown */}
    <rect x="5" y="3" width="6" height="2" fill="#39BDF7" />
    <rect x="4" y="5" width="8" height="1" fill="#39BDF7" />
    {/* Cap Visor */}
    <rect x="10" y="5" width="3" height="1" fill="#94A3B8" />
    {/* Head */}
    <rect x="6" y="6" width="4" height="3" fill="#F2F5FA" />
    {/* Trench Collar & Red Tie */}
    <rect x="5" y="9" width="6" height="4" fill="#39BDF7" />
    <rect x="7" y="9" width="2" height="3" fill="#F05A9D" />
    <rect x="4" y="13" width="8" height="1" fill="#0D1E36" />
  </svg>
);

// Terminal Preferences / Configuration Chip
export const PixelSettingsGearIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Gear Core */}
    <rect x="5" y="5" width="6" height="6" fill="#39BDF7" />
    <rect x="7" y="7" width="2" height="2" fill="#081426" />
    {/* Gear Teeth */}
    <rect x="7" y="2" width="2" height="3" fill="#39BDF7" />
    <rect x="7" y="11" width="2" height="3" fill="#39BDF7" />
    <rect x="2" y="7" width="3" height="2" fill="#39BDF7" />
    <rect x="11" y="7" width="3" height="2" fill="#39BDF7" />
    {/* Diagonal Corner Teeth */}
    <rect x="4" y="4" width="1" height="1" fill="#F05A9D" />
    <rect x="11" y="4" width="1" height="1" fill="#F05A9D" />
    <rect x="4" y="11" width="1" height="1" fill="#F05A9D" />
    <rect x="11" y="11" width="1" height="1" fill="#F05A9D" />
  </svg>
);

// Stand Down / Quit Shield
export const PixelQuitIcon: React.FC<PixelIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="4" y="3" width="8" height="2" fill="#39BDF7" />
    <rect x="3" y="5" width="10" height="4" fill="#39BDF7" />
    <rect x="4" y="9" width="8" height="2" fill="#39BDF7" />
    <rect x="5" y="11" width="6" height="2" fill="#39BDF7" />
    <rect x="7" y="13" width="2" height="1" fill="#39BDF7" />
    {/* Inner Lock / Shield Mark */}
    <rect x="6" y="6" width="4" height="3" fill="#081426" />
    <rect x="7" y="7" width="2" height="3" fill="#F05A9D" />
  </svg>
);

// Clue Magnifier Lens
export const PixelMagnifierIcon: React.FC<PixelIconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="4" y="2" width="5" height="1" fill="#39BDF7" />
    <rect x="3" y="3" width="7" height="1" fill="#39BDF7" />
    <rect x="2" y="4" width="2" height="4" fill="#39BDF7" />
    <rect x="9" y="4" width="2" height="4" fill="#39BDF7" />
    <rect x="3" y="8" width="7" height="1" fill="#39BDF7" />
    <rect x="4" y="9" width="5" height="1" fill="#39BDF7" />
    {/* Glass center with pink reflection */}
    <rect x="4" y="4" width="5" height="4" fill="#0A182F" />
    <rect x="5" y="5" width="2" height="1" fill="#F05A9D" />
    {/* Handle */}
    <rect x="9" y="9" width="2" height="2" fill="#39BDF7" />
    <rect x="11" y="11" width="2" height="2" fill="#39BDF7" />
    <rect x="13" y="13" width="2" height="2" fill="#39BDF7" />
  </svg>
);

// Floppy Disk Evidence
export const PixelFloppyDiskIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="2" y="2" width="11" height="1" fill="#39BDF7" />
    <rect x="2" y="3" width="12" height="11" fill="#0E1E38" />
    <rect x="2" y="2" width="1" height="12" fill="#39BDF7" />
    <rect x="13" y="4" width="1" height="10" fill="#39BDF7" />
    <rect x="2" y="13" width="12" height="1" fill="#39BDF7" />
    {/* Metal Shutter */}
    <rect x="5" y="3" width="6" height="4" fill="#39BDF7" />
    <rect x="6" y="4" width="2" height="2" fill="#081426" />
    {/* Paper Label */}
    <rect x="4" y="8" width="8" height="5" fill="#F2F5FA" />
    <rect x="5" y="9" width="6" height="1" fill="#F05A9D" />
    <rect x="5" y="11" width="4" height="1" fill="#39BDF7" />
  </svg>
);

// USB Drive Evidence
export const PixelUsbDriveIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Connector Pin */}
    <rect x="6" y="2" width="4" height="3" fill="#94A3B8" />
    <rect x="7" y="3" width="1" height="1" fill="#081426" />
    <rect x="8" y="3" width="1" height="1" fill="#081426" />
    {/* USB Body */}
    <rect x="5" y="5" width="6" height="8" fill="#0C1D3A" />
    <rect x="5" y="5" width="6" height="1" fill="#39BDF7" />
    <rect x="5" y="12" width="6" height="1" fill="#39BDF7" />
    <rect x="5" y="5" width="1" height="8" fill="#39BDF7" />
    <rect x="10" y="5" width="1" height="8" fill="#39BDF7" />
    {/* Pink Indicator Light */}
    <rect x="7" y="7" width="2" height="2" fill="#F05A9D" />
  </svg>
);

// Smartphone Evidence
export const PixelPhoneIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="4" y="2" width="8" height="12" fill="#071224" />
    <rect x="4" y="2" width="8" height="1" fill="#39BDF7" />
    <rect x="4" y="13" width="8" height="1" fill="#39BDF7" />
    <rect x="4" y="2" width="1" height="12" fill="#39BDF7" />
    <rect x="11" y="2" width="1" height="12" fill="#39BDF7" />
    {/* Screen */}
    <rect x="5" y="4" width="6" height="7" fill="#0E2347" />
    {/* Notification Banner */}
    <rect x="6" y="5" width="4" height="2" fill="#F05A9D" />
    {/* Home Button */}
    <rect x="7" y="12" width="2" height="1" fill="#39BDF7" />
  </svg>
);

// QR Code Phishing Tile
export const PixelQrIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="2" y="2" width="12" height="12" fill="#061021" />
    {/* Corners */}
    <rect x="3" y="3" width="4" height="4" fill="#39BDF7" />
    <rect x="4" y="4" width="2" height="2" fill="#061021" />
    <rect x="9" y="3" width="4" height="4" fill="#39BDF7" />
    <rect x="10" y="4" width="2" height="2" fill="#061021" />
    <rect x="3" y="9" width="4" height="4" fill="#39BDF7" />
    <rect x="4" y="10" width="2" height="2" fill="#061021" />
    {/* Data Bits */}
    <rect x="8" y="8" width="2" height="2" fill="#F05A9D" />
    <rect x="11" y="10" width="2" height="2" fill="#39BDF7" />
    <rect x="8" y="11" width="1" height="1" fill="#F05A9D" />
  </svg>
);

// Detective Case Notebook with Pink Bookmark
export const PixelNotebookIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Book Cover */}
    <rect x="3" y="2" width="10" height="12" fill="#0A1830" />
    <rect x="3" y="2" width="10" height="1" fill="#39BDF7" />
    <rect x="3" y="13" width="10" height="1" fill="#39BDF7" />
    <rect x="3" y="2" width="2" height="12" fill="#39BDF7" />
    <rect x="12" y="2" width="1" height="12" fill="#39BDF7" />
    {/* Notebook Lines */}
    <rect x="6" y="5" width="5" height="1" fill="#94A3B8" />
    <rect x="6" y="7" width="5" height="1" fill="#94A3B8" />
    <rect x="6" y="9" width="4" height="1" fill="#94A3B8" />
    {/* Pink Ribbon Bookmark hanging out */}
    <rect x="8" y="2" width="2" height="13" fill="#F05A9D" />
    <rect x="8" y="14" width="1" height="1" fill="#F05A9D" />
    <rect x="9" y="13" width="1" height="1" fill="#F05A9D" />
  </svg>
);

// Phishing Message / Chat Alert
export const PixelMessageIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Speech Bubble */}
    <rect x="2" y="3" width="12" height="8" fill="#0C1B33" />
    <rect x="2" y="3" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="10" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="3" width="1" height="8" fill="#39BDF7" />
    <rect x="13" y="3" width="1" height="8" fill="#39BDF7" />
    {/* Tail */}
    <rect x="4" y="11" width="2" height="2" fill="#39BDF7" />
    <rect x="3" y="13" width="2" height="1" fill="#39BDF7" />
    {/* Red/Pink Exclamation Alert */}
    <rect x="7" y="5" width="2" height="3" fill="#F05A9D" />
    <rect x="7" y="9" width="2" height="1" fill="#F05A9D" />
  </svg>
);

// Cyber Access Keycard
export const PixelKeycardIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="2" y="4" width="12" height="8" fill="#081426" />
    <rect x="2" y="4" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="11" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="4" width="1" height="8" fill="#39BDF7" />
    <rect x="13" y="4" width="1" height="8" fill="#39BDF7" />
    {/* Magnetic Strip */}
    <rect x="3" y="6" width="10" height="2" fill="#1E3A66" />
    {/* Glowing Chip */}
    <rect x="4" y="9" width="3" height="2" fill="#F05A9D" />
  </svg>
);

// Wiretap Audio Cassette Tape
export const PixelAudioTapeIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="2" y="4" width="12" height="8" fill="#0C1B33" />
    <rect x="2" y="4" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="11" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="4" width="1" height="8" fill="#39BDF7" />
    <rect x="13" y="4" width="1" height="8" fill="#39BDF7" />
    {/* Tape Spools */}
    <rect x="4" y="6" width="3" height="3" fill="#39BDF7" />
    <rect x="5" y="7" width="1" height="1" fill="#081426" />
    <rect x="9" y="6" width="3" height="3" fill="#39BDF7" />
    <rect x="10" y="7" width="1" height="1" fill="#081426" />
    {/* Center Window */}
    <rect x="7" y="7" width="2" height="1" fill="#F05A9D" />
  </svg>
);

// Surveillance Snapshot Camera
export const PixelCameraIcon: React.FC<PixelIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    {/* Flash top */}
    <rect x="5" y="3" width="3" height="2" fill="#39BDF7" />
    <rect x="9" y="3" width="2" height="1" fill="#F05A9D" />
    {/* Body */}
    <rect x="2" y="5" width="12" height="8" fill="#081426" />
    <rect x="2" y="5" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="12" width="12" height="1" fill="#39BDF7" />
    <rect x="2" y="5" width="1" height="8" fill="#39BDF7" />
    <rect x="13" y="5" width="1" height="8" fill="#39BDF7" />
    {/* Lens */}
    <rect x="6" y="7" width="4" height="4" fill="#39BDF7" />
    <rect x="7" y="8" width="2" height="2" fill="#F05A9D" />
  </svg>
);


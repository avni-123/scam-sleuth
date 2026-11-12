import * as THREE from 'three';

// Ultra-realistic procedural HTML5 canvas textures for Scam Sleuth PBR rendering
export class ProceduralTextureGenerator {
  // Photorealistic European Walnut / Oak Wood Floor (1024x1024)
  static createWoodFloorTexture(): { diffuse: THREE.CanvasTexture; roughness: THREE.CanvasTexture } {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const roughCtx = roughCanvas.getContext('2d')!;

    // Rich multi-tone dark walnut base
    ctx.fillStyle = '#4a2f1b';
    ctx.fillRect(0, 0, size, size);

    roughCtx.fillStyle = '#666666'; // Baseline satin roughness (~0.4)
    roughCtx.fillRect(0, 0, size, size);

    const plankCount = 12;
    const plankHeight = size / plankCount;

    for (let i = 0; i < plankCount; i++) {
      const y = i * plankHeight;

      // Individual plank wood hue variation
      const hueShift = (Math.random() - 0.5) * 15;
      const lightness = 22 + (Math.random() - 0.5) * 8;
      ctx.fillStyle = `hsl(${26 + hueShift}, 48%, ${lightness}%)`;
      ctx.fillRect(0, y, size, plankHeight);

      // Micro-grain fiber streaks
      for (let g = 0; g < 40; g++) {
        const gy = y + Math.random() * plankHeight;
        const alpha = 0.04 + Math.random() * 0.08;
        ctx.strokeStyle = Math.random() > 0.4 ? `rgba(20, 10, 4, ${alpha})` : `rgba(180, 120, 70, ${alpha * 0.7})`;
        ctx.lineWidth = 0.8 + Math.random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(
          size * 0.3, gy + (Math.random() - 0.5) * 8,
          size * 0.7, gy + (Math.random() - 0.5) * 8,
          size, gy
        );
        ctx.stroke();
      }

      // Occasional natural wood knot
      if (Math.random() > 0.6) {
        const knotX = 80 + Math.random() * (size - 160);
        const knotY = y + plankHeight * 0.5 + (Math.random() - 0.5) * 15;
        for (let r = 24; r > 3; r -= 3) {
          ctx.strokeStyle = `rgba(35, 18, 8, ${0.15 + (24 - r) * 0.03})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(knotX, knotY, r * 1.8, r * 0.7, 0.05, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Plank dividing shadow seam & bevel highlight
      ctx.fillStyle = '#180c05';
      ctx.fillRect(0, y, size, 4);

      ctx.fillStyle = 'rgba(255, 235, 205, 0.12)';
      ctx.fillRect(0, y + 4, size, 1.5);

      // Staggered vertical end joints
      const stagger = (i % 3) * (size / 3);
      for (let x = stagger; x < size; x += size / 2) {
        ctx.fillStyle = '#180c05';
        ctx.fillRect(x, y, 4, plankHeight);
        ctx.fillStyle = 'rgba(255, 235, 205, 0.1)';
        ctx.fillRect(x + 4, y, 1.5, plankHeight);

        roughCtx.fillStyle = '#999999'; // Rougher in joints
        roughCtx.fillRect(x - 2, y, 8, plankHeight);
      }

      // Roughness variation map (matte vs satin polyurethane)
      roughCtx.fillStyle = `rgba(${Math.floor(100 + Math.random() * 40)}, ${Math.floor(100 + Math.random() * 40)}, ${Math.floor(100 + Math.random() * 40)}, 0.4)`;
      roughCtx.fillRect(0, y, size, plankHeight);
    }

    const diffuse = new THREE.CanvasTexture(canvas);
    diffuse.wrapS = THREE.RepeatWrapping;
    diffuse.wrapT = THREE.RepeatWrapping;
    diffuse.repeat.set(3, 3);
    diffuse.colorSpace = THREE.SRGBColorSpace;

    const roughness = new THREE.CanvasTexture(roughCanvas);
    roughness.wrapS = THREE.RepeatWrapping;
    roughness.wrapT = THREE.RepeatWrapping;
    roughness.repeat.set(3, 3);

    return { diffuse, roughness };
  }

  // Moroccan Berber Area Rug Texture (512x512)
  static createRugTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Cream woven wool base
    ctx.fillStyle = '#ece5d8';
    ctx.fillRect(0, 0, 512, 512);

    // Wool fiber noise
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 205, 190, 0.35)' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(x, y, 2, 2);
    }

    // Charcoal diamond geometric Berber pattern
    ctx.strokeStyle = '#2d2d2d';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    for (let row = 0; row < 512; row += 128) {
      for (let col = 0; col < 512; col += 128) {
        ctx.beginPath();
        ctx.moveTo(col + 64, row);
        ctx.lineTo(col + 128, row + 64);
        ctx.lineTo(col + 64, row + 128);
        ctx.lineTo(col, row + 64);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Fringe borders
    ctx.fillStyle = '#dfd5c4';
    ctx.fillRect(0, 0, 512, 16);
    ctx.fillRect(0, 496, 512, 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Italian Carrara White Marble Texture (1024x1024)
  static createMarbleTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Polished off-white stone base
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle cloud marbling
    for (let i = 0; i < 30; i++) {
      const grad = ctx.createRadialGradient(
        Math.random() * 1024, Math.random() * 1024, 50,
        Math.random() * 1024, Math.random() * 1024, 400
      );
      grad.addColorStop(0, 'rgba(226, 232, 240, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    // Branching gray & gold mineral veins
    const drawVein = (startX: number, startY: number, color: string, width: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      let curX = startX;
      let curY = startY;
      ctx.moveTo(curX, curY);

      for (let step = 0; step < 16; step++) {
        curX += (Math.random() - 0.2) * 90;
        curY += (Math.random() + 0.3) * 70;
        ctx.lineTo(curX, curY);
      }
      ctx.stroke();
    };

    for (let v = 0; v < 8; v++) {
      drawVein(Math.random() * 1024, 0, 'rgba(148, 163, 184, 0.35)', 2.5);
      drawVein(Math.random() * 1024, 0, 'rgba(100, 116, 139, 0.2)', 1.2);
      if (v % 3 === 0) {
        drawVein(Math.random() * 1024, 0, 'rgba(217, 119, 6, 0.18)', 1.5); // Warm gold vein
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Realistic Flemish Red-Brick Wall Texture (1024x1024)
  static createBrickWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Mortar background
    ctx.fillStyle = '#b0a89d';
    ctx.fillRect(0, 0, 1024, 1024);

    const brickH = 48;
    const brickW = 120;
    const mortar = 8;

    let row = 0;
    for (let y = 0; y < 1024; y += brickH + mortar) {
      const offset = (row % 2 === 0) ? 0 : -brickW / 2;
      for (let x = offset; x < 1024 + brickW; x += brickW + mortar) {
        // Brick clay tone variation
        const hue = 8 + (Math.random() - 0.5) * 8;
        const sat = 55 + (Math.random() - 0.5) * 15;
        const light = 36 + (Math.random() - 0.5) * 12;
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
        ctx.fillRect(x, y, brickW, brickH);

        // Brick surface clay stipple
        for (let s = 0; s < 30; s++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';
          ctx.fillRect(x + Math.random() * brickW, y + Math.random() * brickH, 2, 2);
        }

        // Top/left subtle highlight, bottom/right shadow
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(x, y, brickW, 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x, y + brickH - 3, brickW, 3);
      }
      row++;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Scandinavian Acoustic Slatted Wood Panel Texture (512x512)
  static createAcousticWoodSlatTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Black acoustic felt backing
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, 512, 512);

    const slatW = 24;
    const gap = 16;
    for (let x = 8; x < 512; x += slatW + gap) {
      // Warm blonde oak slat
      ctx.fillStyle = '#c89d66';
      ctx.fillRect(x, 0, slatW, 512);

      // Slat edge shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(x + slatW - 3, 0, 3, 512);

      // Slat edge highlight
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(x, 0, 2, 512);

      // Fine oak grain
      ctx.strokeStyle = 'rgba(80, 50, 20, 0.15)';
      ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        ctx.beginPath();
        const gx = x + 3 + g * 5;
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx + (Math.random() - 0.5) * 3, 512);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Campus Weathered Stone Paver Texture (1024x1024)
  static createCampusStoneTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#525c68';
    ctx.fillRect(0, 0, 1024, 1024);

    const step = 128;
    for (let y = 0; y < 1024; y += step) {
      for (let x = 0; x < 1024; x += step) {
        const shade = 105 + (Math.random() - 0.5) * 30;
        ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 8})`;
        ctx.fillRect(x + 3, y + 3, step - 6, step - 6);

        // Stone chisel texture
        for (let p = 0; p < 80; p++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';
          ctx.fillRect(x + 5 + Math.random() * (step - 12), y + 5 + Math.random() * (step - 12), 3, 3);
        }

        // Stone bevel edge
        ctx.strokeStyle = '#2b343e';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, step, step);

        // Subtle moss/weathering in corner
        if (Math.random() > 0.6) {
          ctx.fillStyle = 'rgba(50, 90, 40, 0.18)';
          ctx.beginPath();
          ctx.arc(x + 6, y + 6, 16, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Parisian Bistro Checkered Tile Floor (1024x1024)
  static createCafeTileTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const tileSize = 128;
    for (let y = 0; y < 1024; y += tileSize) {
      for (let x = 0; x < 1024; x += tileSize) {
        const isDark = ((x / tileSize) + (y / tileSize)) % 2 === 0;

        if (isDark) {
          ctx.fillStyle = '#1e2430'; // Slate charcoal
          ctx.fillRect(x, y, tileSize, tileSize);
        } else {
          ctx.fillStyle = '#e8ecf2'; // Glazed porcelain cream
          ctx.fillRect(x, y, tileSize, tileSize);
        }

        // Porcelain glaze reflection border
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);

        // Recessed grout seam
        ctx.strokeStyle = '#0f141d';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Photorealistic Smartphone OLED Display Texture showing readable fictional delivery message (512x1024)
  static createPhoneScreenTexture(
    msgSender: string,
    msgBody: string,
    highlightClues = false
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Deep slate messaging app background
    ctx.fillStyle = '#0B1220';
    ctx.fillRect(0, 0, 512, 1024);

    // Camera cutout pill
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(196, 14, 120, 30, 15);
    ctx.fill();

    // Status bar
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 20px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('20:42', 36, 38);
    ctx.font = 'bold 16px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('5G   94%', 392, 38);

    // Messaging App Header
    ctx.fillStyle = '#111C33';
    ctx.beginPath();
    ctx.roundRect(20, 62, 472, 118, 20);
    ctx.fill();
    ctx.strokeStyle = highlightClues ? '#F05A9D' : '#1E293B';
    ctx.lineWidth = highlightClues ? 3 : 1.5;
    ctx.stroke();

    // Sender Avatar Circle
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(64, 118, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#39BDF7';
    ctx.font = 'bold 22px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SMS', 64, 126);
    ctx.textAlign = 'left';

    // Sender Number (Fictional)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 21px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText((msgSender || '+1 (555) 019-3382').slice(0, 24), 106, 108);

    ctx.fillStyle = '#39BDF7';
    ctx.font = 'bold 15px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Unverified Number · Not in Contacts', 106, 136);

    if (highlightClues) {
      ctx.fillStyle = 'rgba(240, 90, 157, 0.22)';
      ctx.fillRect(102, 86, 370, 62);
      ctx.fillStyle = '#F2F5FA';
      ctx.font = 'bold 13px "Silkscreen", "Courier New", Courier, monospace';
      ctx.fillText('🔍 CLUE 1: Random mobile number', 106, 166);
    }

    // Timestamp divider
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Text Message · Today 8:42 PM', 256, 212);
    ctx.textAlign = 'left';

    // Message Bubble
    ctx.fillStyle = '#081426';
    ctx.strokeStyle = highlightClues ? '#F05A9D' : '#39BDF7';
    ctx.lineWidth = highlightClues ? 3 : 2;
    ctx.beginPath();
    ctx.roundRect(22, 234, 468, 520, 26);
    ctx.fill();
    ctx.stroke();

    // Header inside SMS bubble
    ctx.fillStyle = '#F2F5FA';
    ctx.font = 'bold 22px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('CITY-POST DELIVERY NOTICE', 44, 280);

    // Wrap message body clearly with high contrast and large readable font
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 22px "Silkscreen", "Courier New", Courier, monospace';
    const cleanText =
      msgBody ||
      'CITY-POST ALERT: Parcel #CP-8831 is ON HOLD due to an incomplete street label ($2.85 redelivery fee). Pay within 2 hours at parcel-relabel-hold.invalid/pay or item returns to sender.';
    const words = cleanText.split(' ');
    let line = '';
    let y = 330;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 420 && n > 0) {
        ctx.fillText(line, 44, y);
        line = words[n] + ' ';
        y += 36;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 44, y);

    // Highlighted Fictional Link Box (Non-working .invalid domain)
    const linkBoxY = Math.max(y + 28, 535);
    ctx.fillStyle = '#0B1A33';
    ctx.strokeStyle = highlightClues ? '#F05A9D' : '#39BDF7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(42, linkBoxY, 428, 92, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 14px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('FICTIONAL LINK PREVIEW (DO NOT OPEN):', 60, linkBoxY + 30);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 19px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('parcel-relabel-hold.invalid/pay', 60, linkBoxY + 62);

    if (highlightClues) {
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 15px "Silkscreen", "Courier New", Courier, monospace';
      ctx.fillText('🔍 CLUE 2: 2-hr panic timer & $2.85 fee', 44, linkBoxY + 125);
      ctx.fillText('🔍 CLUE 3: Look-alike .invalid web address', 44, linkBoxY + 152);
    } else {
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 16px "Silkscreen", "Courier New", Courier, monospace';
      ctx.fillText('Press E to inspect message clues closely', 44, linkBoxY + 135);
    }

    // Bottom Safe Reminder Footer
    ctx.fillStyle = '#0F1A32';
    ctx.beginPath();
    ctx.roundRect(22, 785, 468, 145, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 16px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('EVIDENCE ITEM · CASE 01', 44, 822);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '18px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Check sender details, urgent countdown,', 44, 856);
    ctx.fillText('and payment link before taking action.', 44, 884);

    // Home indicator bar
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.roundRect(176, 990, 160, 6, 3);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Photorealistic Laptop Display (1024x640)
  static createLaptopScreenTexture(url: string, title: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    // Browser chrome dark slate
    ctx.fillStyle = '#1e2433';
    ctx.fillRect(0, 0, 1024, 640);

    // macOS Window Controls (Red, Yellow, Green)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(24, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(46, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(68, 22, 7, 0, Math.PI * 2);
    ctx.fill();

    // Active Tab
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(100, 8, 280, 36, 10);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText(title.slice(0, 26), 120, 31);

    // URL Address Bar with Security Warning
    ctx.fillStyle = '#090e18';
    ctx.beginPath();
    ctx.roundRect(100, 52, 824, 38, 10);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('⚠ NOT SECURE | ' + url, 120, 76);

    // Webpage Content White Canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 100, 984, 520);

    // Webpage Header Banner
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(20, 100, 984, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('CRITICAL ACCOUNT VERIFICATION ALERT', 60, 150);

    ctx.fillStyle = '#1e293b';
    ctx.font = '20px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Immediate action required: Credentials expire in 15 minutes.', 60, 230);
    ctx.font = '16px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('Please verify your user identification and password below to prevent deactivation.', 60, 265);

    // Form Input Fields
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 310, 480, 52);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Username / Account Email', 80, 343);

    ctx.strokeRect(60, 380, 480, 52);
    ctx.fillText('••••••••••••••••', 80, 413);

    // Submit Button
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(60, 460, 220, 54, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('VERIFY ACCOUNT NOW', 76, 494);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Delivery package cardboard texture with barcode & shipping sticker (512x512)
  static createPackageTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Kraft cardboard base
    ctx.fillStyle = '#b37d45';
    ctx.fillRect(0, 0, 512, 512);

    // Cardboard corrugated fibers
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(90, 50, 20, 0.12)' : 'rgba(255, 230, 180, 0.12)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 1);
    }

    // Heavy-duty packing tape
    ctx.fillStyle = 'rgba(200, 150, 80, 0.7)';
    ctx.fillRect(0, 220, 512, 70);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 222, 512, 4);

    // White Thermal Shipping Label
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 60, 392, 240);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('EXPRESS COURIER SERVICE', 80, 105);

    ctx.font = '16px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('TRACKING: #PKG-9941-ALERT', 80, 140);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 18px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('HOLD AT DEPOT: UNPAID FEE ($2.85)', 80, 175);

    // Scannable Barcode Lines
    ctx.fillStyle = '#000000';
    for (let x = 80; x < 410; x += (Math.random() > 0.4 ? 8 : 4)) {
      ctx.fillRect(x, 200, Math.random() > 0.5 ? 4 : 2, 75);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Realistic Drywall Eggshell Plaster Texture (512x512)
  static createDrywallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Warm contemporary residential plaster taupe wall
    ctx.fillStyle = '#e6ded4';
    ctx.fillRect(0, 0, 512, 512);

    // Fine plaster orange-peel stippling
    for (let i = 0; i < 25000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 100, 80, 0.04)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Gallery Framed Landscape Canvas Art Texture (512x384)
  static createGalleryArtTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;

    // Warm dusk mountain landscape canvas painting
    const grad = ctx.createLinearGradient(0, 0, 0, 384);
    grad.addColorStop(0, '#081426');
    grad.addColorStop(0.35, '#1B2C52');
    grad.addColorStop(0.68, '#39BDF7');
    grad.addColorStop(0.88, '#F05A9D');
    grad.addColorStop(1, '#F2F5FA');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 384);

    // Mountain silhouettes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(110, 180);
    ctx.lineTo(220, 230);
    ctx.lineTo(360, 140);
    ctx.lineTo(512, 270);
    ctx.lineTo(512, 384);
    ctx.lineTo(0, 384);
    ctx.fill();

    // Foreground tree ridge
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.quadraticCurveTo(180, 260, 340, 300);
    ctx.quadraticCurveTo(440, 280, 512, 290);
    ctx.lineTo(512, 384);
    ctx.lineTo(0, 384);
    ctx.fill();

    // Subtle sun disc
    ctx.fillStyle = 'rgba(255, 251, 235, 0.85)';
    ctx.beginPath();
    ctx.arc(360, 120, 28, 0, Math.PI * 2);
    ctx.fill();

    // Canvas linen texture weave
    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 384;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(x, y, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // City Skyline Window Backdrop Texture (1024x512)
  static createCitySkylineTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Golden hour / atmospheric dusk sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#1a365d'); // Deep twilight blue
    skyGrad.addColorStop(0.4, '#2b6cb0');
    skyGrad.addColorStop(0.75, '#dd6b20'); // Warm horizon sunset orange
    skyGrad.addColorStop(1, '#ecc94b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Distant soft mountain / hill silhouette
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.moveTo(0, 380);
    ctx.bezierCurveTo(250, 340, 500, 360, 750, 330);
    ctx.bezierCurveTo(850, 320, 950, 340, 1024, 350);
    ctx.lineTo(1024, 512);
    ctx.lineTo(0, 512);
    ctx.fill();

    // High-rise City Skyscrapers Silhouette
    const buildingCount = 28;
    for (let b = 0; b < buildingCount; b++) {
      const bw = 24 + Math.random() * 45;
      const bx = b * (1024 / buildingCount) + (Math.random() - 0.5) * 15;
      const bh = 120 + Math.random() * 240;
      const by = 512 - bh;

      // Dark glass/concrete building silhouette
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bx, by, bw, bh);

      // Antenna / Spire on taller buildings
      if (bh > 260 && Math.random() > 0.5) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2, by);
        ctx.lineTo(bx + bw / 2, by - 35);
        ctx.stroke();

        // Red aviation hazard light blinking atop
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx + bw / 2, by - 36, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lit office windows
      const rows = Math.floor(bh / 14);
      const cols = Math.floor(bw / 10);
      for (let r = 2; r < rows - 2; r++) {
        for (let c = 1; c < cols - 1; c++) {
          if (Math.random() > 0.45) {
            ctx.fillStyle = Math.random() > 0.3 ? 'rgba(254, 240, 138, 0.75)' : 'rgba(186, 230, 253, 0.6)';
            ctx.fillRect(bx + c * 10, by + r * 14, 5, 7);
          }
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Soft Ambient Occlusion Contact Shadow Decal (128x128)
  static createContactShadowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const radGrad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    radGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)');
    radGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // In-Hand Smartphone AMOLED Display showing the realistic Home Screen (512x1024)
  static createPhoneHomeScreenTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const drawRoundBox = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
      }
    };

    // 1. Deep Midnight Cyberpunk/Detective Wallpaper
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 1024);
    bgGrad.addColorStop(0, '#060B17');
    bgGrad.addColorStop(0.3, '#0B1528');
    bgGrad.addColorStop(0.65, '#0E1D36');
    bgGrad.addColorStop(1, '#050914');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 1024);

    // Subtle atmospheric ambient glow
    const glowGrad = ctx.createRadialGradient(256, 320, 20, 256, 320, 300);
    glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.18)');
    glowGrad.addColorStop(0.45, 'rgba(99, 102, 241, 0.1)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 512, 1024);

    // Soft fine grid pattern for high-tech investigator OS feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 32; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 32; y < 1024; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // 2. Dynamic Island / Camera Notch Pill
    ctx.fillStyle = '#000000';
    drawRoundBox(196, 14, 120, 32, 16);
    ctx.fill();

    // Camera lens glint inside notch
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(224, 30, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(224, 30, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(288, 30, 3, 0, Math.PI * 2);
    ctx.fill();

    // 3. Status Bar
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('20:42', 36, 36);

    // Signal Bars
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(392, 32, 3, 5);
    ctx.fillRect(398, 29, 3, 8);
    ctx.fillRect(404, 26, 3, 11);
    ctx.fillRect(410, 23, 3, 14);

    // 5G Label
    ctx.font = 'bold 13px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('5G', 422, 35);

    // Battery Indicator
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(448, 23, 26, 14);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(450, 25, 18, 10);
    ctx.fillRect(474, 27, 2, 6);

    // 4. Large Digital Clock & Date Lockscreen/Home Widget
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 15px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('THURSDAY, NOVEMBER 5', 256, 94);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '300 86px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('20:42', 256, 178);

    // Weather Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundBox(146, 198, 220, 34, 17);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 14px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('🌧 12°C · Rain · Metro Dist.', 256, 220);

    // 5. Sleek Notification / Case Status Widget Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    drawRoundBox(24, 252, 464, 88, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shield Icon inside Notification
    ctx.fillStyle = '#0284C7';
    drawRoundBox(40, 268, 26, 26, 7);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('S', 53, 286);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 12px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('SCAM SLEUTH OS · ACTIVE CASE', 76, 286);

    ctx.fillStyle = '#64748B';
    ctx.font = '11px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('NOW', 440, 286);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 15px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Operation Glasshouse · Evidence Standby', 40, 316);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Digital clues synchronized · Ready for inspection', 40, 332);

    // 6. Home Screen App Grid (3 rows x 4 columns)
    const apps = [
      // Row 1
      {
        id: 'phone',
        name: 'Phone',
        color1: '#10B981',
        color2: '#059669',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(cx + 2, cy - 2, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx - 3, cy + 3, 5, 0, Math.PI * 2);
          ctx.fill();
        },
      },
      {
        id: 'messages',
        name: 'Messages',
        color1: '#38BDF8',
        color2: '#0284C7',
        badge: 1,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx, cy, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy + 8);
          ctx.lineTo(cx - 14, cy + 16);
          ctx.lineTo(cx - 1, cy + 13);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#0284C7';
          ctx.beginPath();
          ctx.arc(cx - 6, cy, 2.5, 0, Math.PI * 2);
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        },
      },
      {
        id: 'files',
        name: 'Case Files',
        color1: '#6366F1',
        color2: '#4338CA',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          drawRoundBox(cx - 16, cy - 12, 32, 24, 4);
          ctx.fill();
          ctx.fillStyle = '#C7D2FE';
          drawRoundBox(cx - 16, cy - 15, 14, 7, 3);
          ctx.fill();
        },
      },
      {
        id: 'camera',
        name: 'Camera',
        color1: '#334155',
        color2: '#1E293B',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#64748B';
          drawRoundBox(cx - 17, cy - 12, 34, 24, 6);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(cx + 2, cy - 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        },
      },
      // Row 2
      {
        id: 'maps',
        name: 'Maps',
        color1: '#14B8A6',
        color2: '#0F766E',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx, cy - 3, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy - 1);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx + 8, cy - 1);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(cx, cy - 3, 5, 0, Math.PI * 2);
          ctx.fill();
        },
      },
      {
        id: 'recorder',
        name: 'Recorder',
        color1: '#F43F5E',
        color2: '#BE123C',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          const heights = [8, 16, 24, 18, 10];
          for (let i = 0; i < 5; i++) {
            const bx = cx - 12 + i * 6;
            const bh = heights[i];
            ctx.fillRect(bx, cy - bh / 2, 3.5, bh);
          }
        },
      },
      {
        id: 'notes',
        name: 'Notes',
        color1: '#FBBF24',
        color2: '#D97706',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          drawRoundBox(cx - 14, cy - 16, 28, 32, 4);
          ctx.fill();
          ctx.fillStyle = '#D97706';
          ctx.fillRect(cx - 9, cy - 8, 18, 2.5);
          ctx.fillRect(cx - 9, cy - 2, 18, 2.5);
          ctx.fillRect(cx - 9, cy + 4, 12, 2.5);
        },
      },
      {
        id: 'security',
        name: 'Security',
        color1: '#06B6D4',
        color2: '#0891B2',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 15);
          ctx.lineTo(cx + 14, cy - 8);
          ctx.lineTo(cx + 14, cy + 3);
          ctx.bezierCurveTo(cx + 14, cy + 13, cx, cy + 18, cx, cy + 18);
          ctx.bezierCurveTo(cx, cy + 18, cx - 14, cy + 13, cx - 14, cy + 3);
          ctx.lineTo(cx - 14, cy - 8);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#0891B2';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx - 6, cy + 1);
          ctx.lineTo(cx - 1, cy + 6);
          ctx.lineTo(cx + 7, cy - 4);
          ctx.stroke();
        },
      },
      // Row 3
      {
        id: 'photos',
        name: 'Photos',
        color1: '#A855F7',
        color2: '#7E22CE',
        badge: 0,
        render: (cx: number, cy: number) => {
          const colors = ['#38BDF8', '#F43F5E', '#FBBF24', '#10B981'];
          for (let p = 0; p < 4; p++) {
            ctx.fillStyle = colors[p];
            ctx.beginPath();
            const angle = (p * Math.PI) / 2;
            const px = cx + Math.cos(angle) * 7;
            const py = cy + Math.sin(angle) * 7;
            ctx.arc(px, py, 6.5, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      },
      {
        id: 'browser',
        name: 'Browser',
        color1: '#0EA5E9',
        color2: '#0369A1',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx, cy, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0369A1';
          ctx.beginPath();
          ctx.arc(cx, cy, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx - 13, cy);
          ctx.lineTo(cx + 13, cy);
          ctx.moveTo(cx, cy - 13);
          ctx.lineTo(cx, cy + 13);
          ctx.stroke();
        },
      },
      {
        id: 'clock',
        name: 'Clock',
        color1: '#27272A',
        color2: '#18181B',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx, cy, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.arc(cx, cy, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy - 8);
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + 6, cy);
          ctx.stroke();
          ctx.strokeStyle = '#F97316';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx - 5, cy + 6);
          ctx.stroke();
        },
      },
      {
        id: 'settings',
        name: 'Settings',
        color1: '#64748B',
        color2: '#475569',
        badge: 0,
        render: (cx: number, cy: number) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(cx, cy, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          for (let g = 0; g < 6; g++) {
            const ga = (g * Math.PI) / 3;
            const gx = cx + Math.cos(ga) * 13;
            const gy = cy + Math.sin(ga) * 13;
            ctx.beginPath();
            ctx.arc(gx, gy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      },
    ];

    const colX = [48, 160, 272, 384];
    const rowY = [360, 485, 610];
    const iconSize = 64;

    apps.forEach((app, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = colX[col];
      const y = rowY[row];
      const cx = x + iconSize / 2;
      const cy = y + iconSize / 2;

      // Icon Gradient Background
      const iconGrad = ctx.createLinearGradient(x, y, x, y + iconSize);
      iconGrad.addColorStop(0, app.color1);
      iconGrad.addColorStop(1, app.color2);
      ctx.fillStyle = iconGrad;
      drawRoundBox(x, y, iconSize, iconSize, 18);
      ctx.fill();

      // Icon Glass Specular Highlight
      const specGrad = ctx.createLinearGradient(x, y, x, y + 26);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specGrad;
      drawRoundBox(x, y, iconSize, 26, 18);
      ctx.fill();

      // Render Icon Symbol
      app.render(cx, cy);

      // Unread Notification Badge if applicable
      if (app.badge > 0) {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(x + iconSize - 4, y + 4, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px "Silkscreen", "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(app.badge), x + iconSize - 4, y + 8);
      }

      // App Label
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '500 13px "Silkscreen", "Courier New", Courier, monospace';
      ctx.fillText(app.name, cx, y + iconSize + 19);
    });

    // 7. Page Indicator Dots
    const dotCenterY = 730;
    // Active Pill
    ctx.fillStyle = '#FFFFFF';
    drawRoundBox(234, dotCenterY - 3, 18, 6, 3);
    ctx.fill();
    // Inactive Dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(264, dotCenterY, 3, 0, Math.PI * 2);
    ctx.arc(278, dotCenterY, 3, 0, Math.PI * 2);
    ctx.fill();

    // 8. Frosted Glass Bottom Dock
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    drawRoundBox(24, 765, 464, 115, 34);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 4 Primary Docked Apps (Phone, Messages, Browser, Camera)
    const dockApps = [
      apps[0], // Phone
      apps[1], // Messages
      apps[9], // Browser
      apps[3], // Camera
    ];

    dockApps.forEach((app, idx) => {
      const x = colX[idx];
      const y = 790;
      const cx = x + iconSize / 2;
      const cy = y + iconSize / 2;

      const iconGrad = ctx.createLinearGradient(x, y, x, y + iconSize);
      iconGrad.addColorStop(0, app.color1);
      iconGrad.addColorStop(1, app.color2);
      ctx.fillStyle = iconGrad;
      drawRoundBox(x, y, iconSize, iconSize, 18);
      ctx.fill();

      const specGrad = ctx.createLinearGradient(x, y, x, y + 26);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specGrad;
      drawRoundBox(x, y, iconSize, 26, 18);
      ctx.fill();

      app.render(cx, cy);

      if (app.badge > 0) {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(x + iconSize - 4, y + 4, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px "Silkscreen", "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(app.badge), x + iconSize - 4, y + 8);
      }
    });

    // 9. Bottom Home Indicator Bar (Swipe gesture line)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    drawRoundBox(176, 985, 160, 6, 3);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * High-contrast illuminated smartphone display showing the fictional suspicious
   * delivery message relevant to the current investigation case (512x1024).
   */
  static createCaseDeliveryMessageScreenTexture(
    msgSender = '+1 (555) 019-3382',
    msgBody = 'CityPost: $2.85 fee required to release parcel [GH-PRISM-01]. Verify now: citypost-track-id.net'
  ): THREE.CanvasTexture {
    const w = 512;
    const h = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const drawRoundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    // 1. Illuminated Slate-Navy AMOLED Messaging Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#111c35');
    bgGrad.addColorStop(1, '#091020');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Top Status Bar (Time, 5G, Battery)
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('20:42', 36, 48);

    ctx.textAlign = 'right';
    ctx.font = 'bold 20px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('5G', w - 92, 46);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.5;
    drawRoundRect(w - 76, 28, 42, 20, 4);
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(w - 72, 32, 30, 12);

    // 3. Messaging Header Bar (Sender Number & Unverified Warning)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 68, w, 108);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 176);
    ctx.lineTo(w, 176);
    ctx.stroke();

    // Avatar Circle
    ctx.fillStyle = '#F05A9D';
    ctx.beginPath();
    ctx.arc(64, 122, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#081426';
    ctx.font = '900 26px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('!', 64, 132);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText(msgSender, 112, 115);

    ctx.fillStyle = '#39BDF7';
    ctx.font = 'bold 18px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('UNVERIFIED CARRIER · SMS', 112, 146);

    // 4. High-Contrast Suspicious Delivery Alert Banner
    ctx.fillStyle = 'rgba(240, 90, 157, 0.22)';
    drawRoundRect(24, 200, w - 48, 68, 16);
    ctx.fill();
    ctx.strokeStyle = '#F05A9D';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#F2F5FA';
    ctx.font = 'bold 21px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ CASE EVIDENCE: DELIVERY FEE SCAM', w / 2, 242);

    // 5. Primary Incoming Delivery Scam SMS Bubble (Bright, Legible at a Glance)
    ctx.fillStyle = '#1e293b';
    drawRoundRect(24, 296, w - 48, 390, 28);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Tag inside bubble
    ctx.fillStyle = '#0284c7';
    drawRoundRect(48, 322, 230, 38, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px "Silkscreen", "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CITYPOST PARCEL ALERT', 62, 347);

    // Wrapped Message Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 28px "Silkscreen", "Courier New", Courier, monospace';
    const lines = [
      'CityPost: $2.85 customs',
      'fee required to release',
      'parcel [GH-PRISM-01].',
    ];
    lines.forEach((line, idx) => {
      ctx.fillText(line, 48, 412 + idx * 44);
    });

    // Highlighted Suspicious URL Pill inside SMS Bubble
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    drawRoundRect(44, 536, w - 88, 74, 16);
    ctx.fill();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 17px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('SUSPICIOUS TRACKING LINK:', 64, 564);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('citypost-track-id.net/pay', 64, 596);

    // Urgency footer inside bubble
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('Reply Y or tap link within 2 hrs', 48, 654);

    // 6. Forensic Clue Analysis Card Below Message
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    drawRoundRect(24, 718, w - 48, 185, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('SLEUTH FORENSIC NOTES:', 48, 758);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px "Silkscreen", "Courier New", Courier, monospace';
    ctx.fillText('• Lookalike domain (.net)', 48, 800);
    ctx.fillText('• Unsolicited $2.85 fee trap', 48, 836);
    ctx.fillText('• Artificial 2-hour urgency', 48, 872);

    // 7. Subtle Diagonal Glass Reflection Streak
    const reflGrad = ctx.createLinearGradient(0, 0, w, h * 0.65);
    reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    reflGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.05)');
    reflGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = reflGrad;
    ctx.fillRect(0, 0, w, h);

    // 8. Bottom Home Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    drawRoundRect(176, 976, 160, 8, 4);
    ctx.fill();

    // Suppress unused parameter lint while keeping signature flexible
    void msgBody;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // In-Hand Smartphone AMOLED Display showing the suspicious delivery message (512x1024)
  static createInHandScannerScreenTexture(
    msgSender = '+1 (555) 019-3382',
    msgBody = '',
    _highlightClues = false
  ): THREE.CanvasTexture {
    return ProceduralTextureGenerator.createCaseDeliveryMessageScreenTexture(msgSender, msgBody);
  }

  // Realistic Human Skin PBR Textures (Diffuse + Roughness) with Pore Detail & Subsurface Warmth
  static createHumanSkinTexture(baseHex = '#e4b69b', toneType: 'fair' | 'warm' | 'tan' | 'deep' = 'warm'): {
    diffuse: THREE.CanvasTexture;
    roughness: THREE.CanvasTexture;
  } {
    const size = 512;
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = size;
    diffCanvas.height = size;
    const diffCtx = diffCanvas.getContext('2d')!;

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const roughCtx = roughCanvas.getContext('2d')!;

    // 1. Base skin tone fill
    diffCtx.fillStyle = baseHex;
    diffCtx.fillRect(0, 0, size, size);

    // Baseline skin roughness (0.55 - 0.65 satin matte)
    roughCtx.fillStyle = '#949494';
    roughCtx.fillRect(0, 0, size, size);

    // 2. Subcutaneous capillary warmth (subtle flush / vascular undertone)
    const warmthGrad = diffCtx.createRadialGradient(size * 0.5, size * 0.45, 40, size * 0.5, size * 0.5, size * 0.7);
    warmthGrad.addColorStop(0, 'rgba(235, 115, 105, 0.16)');
    warmthGrad.addColorStop(0.6, 'rgba(215, 95, 85, 0.08)');
    warmthGrad.addColorStop(1, 'rgba(210, 160, 130, 0.0)');
    diffCtx.fillStyle = warmthGrad;
    diffCtx.fillRect(0, 0, size, size);

    // 3. Micro-pore texture and epidermal cellular noise
    const imgData = diffCtx.getImageData(0, 0, size, size);
    const data = imgData.data;
    const roughData = roughCtx.getImageData(0, 0, size, size);
    const rData = roughData.data;

    for (let i = 0; i < data.length; i += 4) {
      // High-frequency skin grain
      const noise = (Math.random() - 0.5) * 14;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.8));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.6));

      // Roughness variation (pores slightly rougher)
      const rNoise = (Math.random() - 0.5) * 20;
      rData[i] = Math.min(255, Math.max(0, rData[i] + rNoise));
      rData[i + 1] = rData[i];
      rData[i + 2] = rData[i];
    }
    diffCtx.putImageData(imgData, 0, 0);
    roughCtx.putImageData(roughData, 0, 0);

    // 4. Subtle micro-freckles and natural skin variance
    for (let f = 0; f < 350; f++) {
      const fx = Math.random() * size;
      const fy = Math.random() * size;
      const rad = 0.8 + Math.random() * 1.6;
      diffCtx.fillStyle = 'rgba(140, 75, 50, 0.09)';
      diffCtx.beginPath();
      diffCtx.arc(fx, fy, rad, 0, Math.PI * 2);
      diffCtx.fill();
    }

    const diffuse = new THREE.CanvasTexture(diffCanvas);
    diffuse.wrapS = THREE.RepeatWrapping;
    diffuse.wrapT = THREE.RepeatWrapping;
    diffuse.repeat.set(2, 2);
    diffuse.colorSpace = THREE.SRGBColorSpace;

    const roughness = new THREE.CanvasTexture(roughCanvas);
    roughness.wrapS = THREE.RepeatWrapping;
    roughness.wrapT = THREE.RepeatWrapping;
    roughness.repeat.set(2, 2);

    return { diffuse, roughness };
  }

  // Realistic Human Iris with Limbal Ring, Stroma Fibrils & Pupil (256x256)
  static createRealisticIrisTexture(irisHex = '#4a2f1c'): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.48;

    // Sclera border
    ctx.fillStyle = '#f8f4f0';
    ctx.fillRect(0, 0, size, size);

    // Parse base color for tone gradients
    const baseCol = new THREE.Color(irisHex);
    const innerHighlight = baseCol.clone().lerp(new THREE.Color('#ffffff'), 0.38).getStyle();
    const deepTone = baseCol.clone().multiplyScalar(0.45).getStyle();
    const outerRing = baseCol.clone().multiplyScalar(0.22).getStyle();
    const collaretteTone = baseCol.clone().lerp(new THREE.Color('#7dd3fc'), 0.4).getStyle();

    // Dark Limbal Ring (Outer perimeter)
    const limbalGrad = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
    limbalGrad.addColorStop(0, irisHex);
    limbalGrad.addColorStop(0.7, outerRing);
    limbalGrad.addColorStop(1, '#080503');
    ctx.fillStyle = limbalGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Iris Base Color
    const baseGrad = ctx.createRadialGradient(cx, cy, r * 0.35, cx, cy, r * 0.85);
    baseGrad.addColorStop(0, innerHighlight);
    baseGrad.addColorStop(0.5, irisHex);
    baseGrad.addColorStop(1, deepTone);
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
    ctx.fill();

    // Radial Stroma Fibrils (Fibrous texture)
    for (let a = 0; a < 360; a += 1.5) {
      const rad = (a * Math.PI) / 180;
      const length = r * (0.35 + Math.random() * 0.52);
      const alpha = 0.15 + Math.random() * 0.35;
      ctx.strokeStyle = Math.random() > 0.4
        ? baseCol.clone().lerp(new THREE.Color('#ffffff'), 0.5).getStyle()
        : baseCol.clone().multiplyScalar(0.3).getStyle();
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 0.8 + Math.random() * 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * (r * 0.32), cy + Math.sin(rad) * (r * 0.32));
      ctx.lineTo(cx + Math.cos(rad) * length, cy + Math.sin(rad) * length);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Inner Collarette Ring (Contrasting subtle pigment ring)
    ctx.strokeStyle = collaretteTone;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // Deep Black Pupil
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Soft cornea specular glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.16, cy - r * 0.18, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Realistic Everyday Fabric Weave & Cloth Texture (Gabardine / Wool Twill / Cotton Poplin)
  static createFabricClothTexture(baseHex = '#1e293b', isDenim = false): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base cloth tone
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, size, size);

    // Microscopic cross-hatch textile weave
    const step = isDenim ? 4 : 3;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const isWarp = (Math.floor(x / step) + Math.floor(y / step)) % 2 === 0;
        const alpha = isWarp ? 0.065 : 0.035;
        ctx.fillStyle = isWarp ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha * 1.6})`;
        ctx.fillRect(x, y, step, step);
      }
    }

    // Diagonal gabardine / wool-twill ribs & subtle herringbone texture
    if (isDenim) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1.25;
      for (let d = -size; d < size * 2; d += 6) {
        ctx.beginPath();
        ctx.moveTo(d, 0);
        ctx.lineTo(d + size, size);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      for (let d = -size + 3; d < size * 2; d += 6) {
        ctx.beginPath();
        ctx.moveTo(d, 0);
        ctx.lineTo(d + size, size);
        ctx.stroke();
      }
    }

    // Vertical and horizontal organic cloth fold shadows and creases
    for (let c = 0; c < 8; c++) {
      const grad = ctx.createLinearGradient(0, c * 64, 0, (c + 1) * 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.07)');
      grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.09)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, c * 64, size, 64);
    }

    for (let v = 0; v < 6; v++) {
      const vGrad = ctx.createLinearGradient(v * 85, 0, (v + 1) * 85, 0);
      vGrad.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.035)');
      vGrad.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(v * 85, 0, 85, size);
    }

    // Subtle double topstitch seam lines along panel borders
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    for (const sx of [64, 256, 448]) {
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, size);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(isDenim ? 4 : 3, isDenim ? 4 : 3);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Directional Hair Strand Texture (256x256)
  static createHairStrandTexture(baseHex = '#1a1410'): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, size, size);

    // Hair fiber lines with warm golden/wheat highlights for lighter hair tones
    const baseColor = new THREE.Color(baseHex);
    const isLighterHair = (baseColor.r + baseColor.g + baseColor.b) / 3 > 0.3;

    for (let i = 0; i < 450; i++) {
      const x = Math.random() * size;
      const length = 60 + Math.random() * 120;
      const y = Math.random() * (size - length);
      const alpha = 0.08 + Math.random() * 0.16;

      const rand = Math.random();
      if (rand < 0.42) {
        ctx.strokeStyle = isLighterHair
          ? `rgba(255, 230, 175, ${alpha * 1.3})`
          : `rgba(255, 255, 255, ${alpha})`;
      } else if (rand < 0.68 && isLighterHair) {
        ctx.strokeStyle = `rgba(220, 185, 130, ${alpha * 1.2})`;
      } else {
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 1.3})`;
      }

      ctx.lineWidth = 0.7 + Math.random() * 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + (Math.random() - 0.5) * 8,
        y + length * 0.5,
        x + (Math.random() - 0.5) * 12,
        y + length * 0.8,
        x + (Math.random() - 0.5) * 6,
        y + length
      );
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}


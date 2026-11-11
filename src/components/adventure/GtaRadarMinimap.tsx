import React, { useEffect, useRef } from 'react';
import { Search, Compass, CheckCircle2 } from 'lucide-react';
import { AdventureLevel } from '../../types/adventure';

interface TelemetryData {
  x: number;
  z: number;
  yaw: number;
}

interface GtaRadarMinimapProps {
  level: AdventureLevel;
  collectedClueIds: string[];
  activeChapterNum?: 1 | 2 | 3;
}

export const GtaRadarMinimap: React.FC<GtaRadarMinimapProps> = ({
  level,
  collectedClueIds,
  activeChapterNum = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const telemetryRef = useRef<TelemetryData>({
    x: level.playerSpawn[0],
    z: level.playerSpawn[2],
    yaw: level.playerSpawnRotationY,
  });

  const totalClues = level.objects.length;
  const foundCount = collectedClueIds.length;
  const phaseLabel =
    activeChapterNum === 1
      ? 'Setup'
      : activeChapterNum === 2
      ? 'Investigation'
      : 'Decision';

  // Track player position & orientation
  useEffect(() => {
    const handleTelemetry = (e: CustomEvent<TelemetryData>) => {
      if (e.detail) {
        telemetryRef.current = e.detail;
      }
    };

    window.addEventListener('sleuth-telemetry', handleTelemetry as EventListener);
    return () => {
      window.removeEventListener('sleuth-telemetry', handleTelemetry as EventListener);
    };
  }, []);

  // Room Investigation Map Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderRadar = () => {
      animId = requestAnimationFrame(renderRadar);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radarRadius = Math.min(centerX, centerY) - 6;

      const { x: playerX, z: playerZ, yaw } = telemetryRef.current;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      const rectW = width - 8;
      const rectH = height - 8;
      const radius = 14;
      const rx = 4;
      const ry = 4;

      ctx.beginPath();
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + rectW - radius, ry);
      ctx.quadraticCurveTo(rx + rectW, ry, rx + rectW, ry + radius);
      ctx.lineTo(rx + rectW, ry + rectH - radius);
      ctx.quadraticCurveTo(rx + rectW, ry + rectH, rx + rectW - radius, ry + rectH);
      ctx.lineTo(rx + radius, ry + rectH);
      ctx.quadraticCurveTo(rx, ry + rectH, rx, ry + rectH - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      ctx.closePath();

      ctx.fillStyle = '#070E1C';
      ctx.fill();
      ctx.clip();

      // Rotate room map around investigator gaze
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-yaw + Math.PI);

      const scale = 12;

      // Room floorplan boundary
      ctx.fillStyle = 'rgba(15, 26, 48, 0.85)';
      ctx.fillRect(-4.5 * scale - playerX * scale, -4.5 * scale - playerZ * scale, 9 * scale, 9 * scale);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-4.5 * scale - playerX * scale, -4.5 * scale - playerZ * scale, 9 * scale, 9 * scale);

      // Draw Evidence Blips (Soft Rose diamond for uninspected clue, Emerald dot for inspected)
      level.objects.forEach((obj) => {
        const isCollected = collectedClueIds.includes(obj.inspection.clueId);
        const ox = obj.position[0];
        const oz = obj.position[2];

        const screenRelX = ox * scale - playerX * scale;
        const screenRelZ = oz * scale - playerZ * scale;

        if (!isCollected) {
          ctx.save();
          ctx.translate(screenRelX, screenRelZ);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#F472B6';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 5;
          ctx.fillRect(-3.5, -3.5, 7, 7);
          ctx.restore();
        } else {
          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.arc(screenRelX, screenRelZ, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw NPC Witness Blip (Cyan marker)
      level.npcs.forEach((npc) => {
        const nx = npc.position[0];
        const nz = npc.position[2];

        const screenRelX = nx * scale - playerX * scale;
        const screenRelZ = nz * scale - playerZ * scale;

        ctx.fillStyle = '#00F0FF';
        ctx.beginPath();
        ctx.arc(screenRelX, screenRelZ, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      ctx.restore();

      // Subtle range ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Investigator arrow at center
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.5, 4.5);
      ctx.lineTo(0, 2);
      ctx.lineTo(-4.5, 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    renderRadar();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [level, collectedClueIds]);

  return (
    <div className="flex flex-col items-start gap-1.5 select-none pointer-events-none">
      {/* Compact Investigation Map & Case Progress Indicator (No HP/Armor Combat Bars) */}
      <div className="rounded-2xl bg-[#060D20]/92 p-2 border border-sky-500/25 shadow-xl backdrop-blur-md w-[168px] space-y-2">
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-slate-300">
          <span className="flex items-center gap-1 font-bold text-[#00F0FF]">
            <Compass className="w-3 h-3" />
            <span>ROOM MAP</span>
          </span>
          <span className="text-pink-300 font-semibold">Ch {activeChapterNum}/3</span>
        </div>

        <canvas
          ref={canvasRef}
          width={150}
          height={94}
          className="rounded-xl block mx-auto border border-sky-500/20"
        />

        {/* Legend for Witness & Clues */}
        <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block" />
            <span>{level.npcs[0]?.name.split(' ')[0] || 'Witness'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rotate-45 bg-pink-400 inline-block" />
            <span>Evidence</span>
          </span>
        </div>

        {/* Investigation Status: Clues Found & Case Progress */}
        <div className="pt-1.5 border-t border-sky-500/20 space-y-1.5 px-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-300 flex items-center gap-1 font-semibold">
              <Search className="w-3 h-3 text-pink-400" />
              <span>Clues found</span>
            </span>
            <span className="font-bold text-pink-300 tabular-nums">
              {foundCount} / {totalClues}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {level.objects.map((obj) => {
              const found = collectedClueIds.includes(obj.inspection.clueId);
              return (
                <div
                  key={obj.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    found ? 'bg-emerald-400' : 'bg-pink-500/30'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#38BDF8]" />
              <span>Stage</span>
            </span>
            <span className="text-white font-semibold">{phaseLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

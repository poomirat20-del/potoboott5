import { BackgroundTone, FrameMetrics, PhotoboothFrame } from '../types';

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points = 4,
  color = '#FDE68A'
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMiniKrathong(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  petalColor = '#16A34A',
  accentColor = '#F472B6'
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Water glow ring
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
  ctx.lineWidth = Math.max(1.2, 1.8 * s);
  ctx.beginPath();
  ctx.ellipse(0, 12 * s, 24 * s, 5.5 * s, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Banana leaf base
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.ellipse(0, 7 * s, 18 * s, 6 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Folded leaf petals
  for (let i = -2; i <= 2; i++) {
    ctx.fillStyle = i % 2 === 0 ? petalColor : '#22C55E';
    ctx.beginPath();
    ctx.moveTo(i * 6.5 * s - 4.5 * s, 7 * s);
    ctx.lineTo(i * 6.5 * s, -4 * s);
    ctx.lineTo(i * 6.5 * s + 4.5 * s, 7 * s);
    ctx.closePath();
    ctx.fill();
  }

  // Lotus / marigold trim
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.ellipse(0, 3 * s, 12 * s, 3.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Candle + flame
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(-1.8 * s, -12 * s, 3.6 * s, 13 * s);
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.ellipse(0, -16 * s, 3 * s, 5.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.ellipse(0, -15 * s, 1.5 * s, 3.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawChediSilhouette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  gold = '#F5B041'
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Warm halo behind Phra Pathom Chedi
  const grad = ctx.createRadialGradient(0, -4 * s, 2 * s, 0, -4 * s, 32 * s);
  grad.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
  grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, -4 * s, 32 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = gold;
  // Base terrace
  ctx.fillRect(-24 * s, 12 * s, 48 * s, 5 * s);
  ctx.fillRect(-19 * s, 7 * s, 38 * s, 5 * s);
  // Bell dome (องค์ระฆัง)
  ctx.beginPath();
  ctx.moveTo(-14 * s, 7 * s);
  ctx.quadraticCurveTo(-15 * s, -10 * s, -4 * s, -16 * s);
  ctx.lineTo(4 * s, -16 * s);
  ctx.quadraticCurveTo(15 * s, -10 * s, 14 * s, 7 * s);
  ctx.closePath();
  ctx.fill();

  // Spire (ปล้องไฉน & ยอด)
  ctx.beginPath();
  ctx.moveTo(-4.5 * s, -16 * s);
  ctx.lineTo(0, -34 * s);
  ctx.lineTo(4.5 * s, -16 * s);
  ctx.closePath();
  ctx.fill();

  // Spire tip highlight
  drawStar(ctx, 0, -36 * s, 4 * s, 1.4 * s, 4, '#FEF08A');
  ctx.restore();
}

function drawSkyLantern(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color = '#FB923C'
) {
  ctx.save();
  ctx.translate(cx, cy);

  const glow = ctx.createRadialGradient(0, 2 * s, 1, 0, 0, 18 * s);
  glow.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
  glow.addColorStop(1, 'rgba(251, 146, 60, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 18 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-8 * s, -8 * s);
  ctx.quadraticCurveTo(0, -14 * s, 8 * s, -8 * s);
  ctx.lineTo(5 * s, 8 * s);
  ctx.lineTo(-5 * s, 8 * s);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.ellipse(0, 5 * s, 3.2 * s, 2.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLotusFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  petal = '#F472B6',
  highlight = '#FBCFE8'
) {
  ctx.save();
  ctx.translate(cx, cy);

  const angles = [-0.65, -0.32, 0.32, 0.65, 0];
  angles.forEach((ang, idx) => {
    ctx.save();
    ctx.rotate(ang);
    ctx.fillStyle = idx === 4 ? highlight : petal;
    ctx.beginPath();
    ctx.moveTo(0, 8 * s);
    ctx.quadraticCurveTo(-7 * s, -2 * s, 0, -13 * s);
    ctx.quadraticCurveTo(7 * s, -2 * s, 0, 8 * s);
    ctx.fill();
    ctx.restore();
  });

  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(0, 5 * s, 2.8 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawKanokCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flipX: 1 | -1,
  flipY: 1 | -1,
  s: number,
  color = '#F5B041'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX, flipY);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.5, 2.4 * s);

  ctx.beginPath();
  ctx.moveTo(0, 38 * s);
  ctx.lineTo(0, 0);
  ctx.lineTo(38 * s, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(6 * s, 28 * s);
  ctx.quadraticCurveTo(8 * s, 8 * s, 28 * s, 6 * s);
  ctx.quadraticCurveTo(14 * s, 14 * s, 14 * s, 24 * s);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(10 * s, 10 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFireworkBurst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const rays = 12;
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    ctx.lineWidth = Math.max(1.2, r * 0.08);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.28, Math.sin(a) * r * 0.28);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawDiamondDivider(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  s: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.2, 1.6 * s);

  const half = width * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - half, cy);
  ctx.lineTo(cx - 14 * s, cy);
  ctx.moveTo(cx + 14 * s, cy);
  ctx.lineTo(cx + half, cy);
  ctx.stroke();

  drawStar(ctx, cx, cy, 7 * s, 2.5 * s, 4, color);
  ctx.beginPath();
  ctx.arc(cx - 18 * s, cy, 2.2 * s, 0, Math.PI * 2);
  ctx.arc(cx + 18 * s, cy, 2.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const PHOTOBOOTH_FRAMES: PhotoboothFrame[] = [
  {
    id: 'phra-pathom-gold',
    name: 'พระปฐมเจดีย์เรืองรอง',
    description: 'ลายองค์พระปฐมเจดีย์สีทองอร่ามพร้อมแสงเทียนมงคล',
    badgeColor: '#F59E0B',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, bottomAreaHeight, scale: s } = m;
      const pad = 16 * s;

      // Double golden border
      ctx.save();
      ctx.strokeStyle = '#F5B041';
      ctx.lineWidth = 3 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      ctx.strokeStyle = 'rgba(253, 230, 138, 0.55)';
      ctx.lineWidth = 1.2 * s;
      ctx.strokeRect(pad + 7 * s, pad + 7 * s, w - (pad + 7 * s) * 2, h - (pad + 7 * s) * 2);
      ctx.restore();

      // Symmetric corner ornaments
      drawKanokCorner(ctx, pad + 7 * s, pad + 7 * s, 1, 1, 0.72 * s, '#F5B041');
      drawKanokCorner(ctx, w - (pad + 7 * s), pad + 7 * s, -1, 1, 0.72 * s, '#F5B041');
      drawKanokCorner(ctx, pad + 7 * s, h - (pad + 7 * s), 1, -1, 0.72 * s, '#F5B041');
      drawKanokCorner(ctx, w - (pad + 7 * s), h - (pad + 7 * s), -1, -1, 0.72 * s, '#F5B041');

      // Top center ornament balanced between top inner line and photo top
      const topMidY = (pad + 7 * s + topAreaHeight) / 2;
      drawDiamondDivider(ctx, w / 2, topMidY, w * 0.42, s, '#FDE68A');
      drawStar(ctx, w / 2 - w * 0.24, topMidY, 4.5 * s, 1.8 * s, 4, '#F5B041');
      drawStar(ctx, w / 2 + w * 0.24, topMidY, 4.5 * s, 1.8 * s, 4, '#F5B041');

      // Bottom center Phra Pathom Chedi balanced between photo bottom and bottom inner line
      const bottomInner = h - (pad + 7 * s);
      const bottomMidY = (bottomAreaY + bottomInner) / 2 + 4 * s;
      drawChediSilhouette(ctx, w / 2, bottomMidY, 1.05 * s, '#F5B041');
      drawMiniKrathong(ctx, w / 2 - 96 * s, bottomMidY + 8 * s, 0.78 * s);
      drawMiniKrathong(ctx, w / 2 + 96 * s, bottomMidY + 8 * s, 0.78 * s);
    },
  },
  {
    id: 'banana-leaf-krathong',
    name: 'กระทงวิจิตรใบตอง',
    description: 'ขอบลายกลีบใบตองพับจีบและกระทงลอยน้ำ',
    badgeColor: '#22C55E',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 16 * s;

      // Banana leaf border frame
      ctx.save();
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 4 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 1.5 * s;
      ctx.strokeRect(pad + 6 * s, pad + 6 * s, w - (pad + 6 * s) * 2, h - (pad + 6 * s) * 2);

      // Folded leaf triangles along top and bottom borders
      const step = 26 * s;
      ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
      for (let x = pad + 20 * s; x <= w - pad - 20 * s; x += step) {
        ctx.beginPath();
        ctx.moveTo(x - 10 * s, pad + 6 * s);
        ctx.lineTo(x, pad + 18 * s);
        ctx.lineTo(x + 10 * s, pad + 6 * s);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x - 10 * s, h - pad - 6 * s);
        ctx.lineTo(x, h - pad - 18 * s);
        ctx.lineTo(x + 10 * s, h - pad - 6 * s);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      const topMidY = (pad + 18 * s + topAreaHeight) / 2;
      drawLotusFlower(ctx, w / 2, topMidY, 0.9 * s, '#F472B6', '#FBCFE8');
      drawStar(ctx, w / 2 - 48 * s, topMidY, 5 * s, 2 * s, 4, '#FDE047');
      drawStar(ctx, w / 2 + 48 * s, topMidY, 5 * s, 2 * s, 4, '#FDE047');

      const bottomInner = h - pad - 18 * s;
      const bottomMidY = (bottomAreaY + bottomInner) / 2;
      drawMiniKrathong(ctx, w / 2, bottomMidY + 2 * s, 1.05 * s);
      drawMiniKrathong(ctx, w / 2 - 84 * s, bottomMidY + 4 * s, 0.72 * s, '#16A34A', '#FBBF24');
      drawMiniKrathong(ctx, w / 2 + 84 * s, bottomMidY + 4 * s, 0.72 * s, '#16A34A', '#FBBF24');
    },
  },
  {
    id: 'fullmoon-lantern',
    name: 'แสงจันทร์ & โคมลอย',
    description: 'พระจันทร์เต็มดวงและโคมลอยยี่เป็งเรืองแสง',
    badgeColor: '#FB923C',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 18 * s;

      ctx.save();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)';
      ctx.lineWidth = 2 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.restore();

      const topMidY = (pad + topAreaHeight) / 2;
      // Centered full moon with halo
      ctx.save();
      const moonGlow = ctx.createRadialGradient(w / 2, topMidY, 6 * s, w / 2, topMidY, 34 * s);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
      moonGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(w / 2, topMidY, 34 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(w / 2, topMidY, 17 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      drawSkyLantern(ctx, w / 2 - 78 * s, topMidY + 2 * s, 0.85 * s, '#FB923C');
      drawSkyLantern(ctx, w / 2 + 78 * s, topMidY + 2 * s, 0.85 * s, '#F59E0B');

      const bottomMidY = (bottomAreaY + h - pad) / 2;
      drawSkyLantern(ctx, w / 2 - 96 * s, bottomMidY, 0.9 * s, '#FBBF24');
      drawSkyLantern(ctx, w / 2, bottomMidY - 2 * s, 1.15 * s, '#FB923C');
      drawSkyLantern(ctx, w / 2 + 96 * s, bottomMidY, 0.9 * s, '#FBBF24');
      drawStar(ctx, w / 2 - 48 * s, bottomMidY, 4.5 * s, 1.5 * s, 4, '#FEF08A');
      drawStar(ctx, w / 2 + 48 * s, bottomMidY, 4.5 * s, 1.5 * s, 4, '#FEF08A');
    },
  },
  {
    id: 'fireworks-celebration',
    name: 'พลุประกายไฟเฉลิมฉลอง',
    description: 'ดอกไม้ไฟสีทองและชมพูประดับงานเทศกาล',
    badgeColor: '#F43F5E',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 16 * s;

      ctx.save();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.5 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.restore();

      const topMidY = (pad + topAreaHeight) / 2;
      drawFireworkBurst(ctx, w / 2 - 90 * s, topMidY, 18 * s, '#FDE047');
      drawFireworkBurst(ctx, w / 2, topMidY, 22 * s, '#F472B6');
      drawFireworkBurst(ctx, w / 2 + 90 * s, topMidY, 18 * s, '#FDE047');

      const bottomMidY = (bottomAreaY + h - pad) / 2;
      drawFireworkBurst(ctx, w / 2 - 110 * s, bottomMidY, 22 * s, '#FB7185');
      drawFireworkBurst(ctx, w / 2, bottomMidY, 27 * s, '#FACC15');
      drawFireworkBurst(ctx, w / 2 + 110 * s, bottomMidY, 22 * s, '#FB7185');
      drawStar(ctx, w / 2 - 55 * s, bottomMidY, 5 * s, 1.8 * s, 4, '#FEF08A');
      drawStar(ctx, w / 2 + 55 * s, bottomMidY, 5 * s, 1.8 * s, 4, '#FEF08A');
    },
  },
  {
    id: 'modern-kanok-gold',
    name: 'กนกทองคำโมเดิร์น',
    description: 'ลายไทยกนก 4 มุมเรียบหรู สง่างาม',
    badgeColor: '#EAB308',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 18 * s;

      ctx.save();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2.6 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.restore();

      drawKanokCorner(ctx, pad, pad, 1, 1, 1.05 * s, '#D4AF37');
      drawKanokCorner(ctx, w - pad, pad, -1, 1, 1.05 * s, '#D4AF37');
      drawKanokCorner(ctx, pad, h - pad, 1, -1, 1.05 * s, '#D4AF37');
      drawKanokCorner(ctx, w - pad, h - pad, -1, -1, 1.05 * s, '#D4AF37');

      const topMidY = (pad + topAreaHeight) / 2;
      drawDiamondDivider(ctx, w / 2, topMidY, w * 0.45, s, '#FACC15');

      const bottomMidY = (bottomAreaY + h - pad) / 2;
      drawDiamondDivider(ctx, w / 2, bottomMidY, w * 0.52, s, '#FACC15');
      drawLotusFlower(ctx, w / 2, bottomMidY - 2 * s, 0.85 * s, '#F59E0B', '#FEF08A');
    },
  },
  {
    id: 'retro-film-strip',
    name: 'ฟิล์มสตริปเรโทร',
    description: 'สไตล์แผ่นฟิล์มคลาสสิกพร้อมรูหนามเตยซ้าย-ขวา',
    badgeColor: '#94A3B8',
    draw: (ctx, m, tone) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const holeColor = tone.isLight ? '#1E293B' : 'rgba(255, 255, 255, 0.85)';
      const accent = tone.isLight ? '#B45309' : '#FDE047';

      ctx.save();
      ctx.fillStyle = holeColor;
      const holeW = 14 * s;
      const holeH = 20 * s;
      const holeStep = 38 * s;
      for (let y = 26 * s; y < h - 26 * s; y += holeStep) {
        ctx.beginPath();
        ctx.roundRect(12 * s, y, holeW, holeH, 3 * s);
        ctx.roundRect(w - 12 * s - holeW, y, holeW, holeH, 3 * s);
        ctx.fill();
      }

      // Pure graphic barcode (no text) centered at bottom
      const bottomMidY = (bottomAreaY + h - 14 * s) / 2;
      const barWidthTotal = 140 * s;
      const startX = w / 2 - barWidthTotal / 2;
      const barPattern = [3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 4, 1, 2];
      let curX = startX;
      ctx.fillStyle = accent;
      for (let i = 0; i < barPattern.length && curX < startX + barWidthTotal; i++) {
        const bw = barPattern[i] * 2.1 * s;
        if (i % 2 === 0) {
          ctx.fillRect(curX, bottomMidY - 12 * s, bw, 24 * s);
        }
        curX += bw + 1.8 * s;
      }

      // Top film sprocket markers
      const topMidY = topAreaHeight / 2;
      drawDiamondDivider(ctx, w / 2, topMidY, w * 0.36, s, accent);
      ctx.restore();
    },
  },
  {
    id: 'glowing-river-stream',
    name: 'สายธารกระทงสาย',
    description: 'คลื่นน้ำยามราตรีและขบวนกระทงสายเรืองแสง',
    badgeColor: '#38BDF8',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 16 * s;

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      // Gentle river ripples top and bottom
      const drawWaves = (baseY: number) => {
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
        ctx.lineWidth = 1.6 * s;
        ctx.beginPath();
        for (let x = pad + 18 * s; x <= w - pad - 18 * s; x += 6 * s) {
          const y = baseY + Math.sin(x * 0.045) * 4 * s;
          if (x === pad + 18 * s) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      const topMidY = (pad + topAreaHeight) / 2;
      drawWaves(topMidY + 8 * s);
      drawStar(ctx, w / 2 - 70 * s, topMidY - 6 * s, 4.5 * s, 1.6 * s, 4, '#BAE6FD');
      drawStar(ctx, w / 2, topMidY - 8 * s, 6.5 * s, 2.2 * s, 4, '#FDE047');
      drawStar(ctx, w / 2 + 70 * s, topMidY - 6 * s, 4.5 * s, 1.6 * s, 4, '#BAE6FD');

      const bottomMidY = (bottomAreaY + h - pad) / 2;
      drawWaves(bottomMidY + 14 * s);
      drawMiniKrathong(ctx, w / 2 - 110 * s, bottomMidY, 0.72 * s, '#0D9488', '#FDE047');
      drawMiniKrathong(ctx, w / 2 - 38 * s, bottomMidY - 2 * s, 0.85 * s, '#16A34A', '#F472B6');
      drawMiniKrathong(ctx, w / 2 + 38 * s, bottomMidY - 2 * s, 0.85 * s, '#16A34A', '#F472B6');
      drawMiniKrathong(ctx, w / 2 + 110 * s, bottomMidY, 0.72 * s, '#0D9488', '#FDE047');
      ctx.restore();
    },
  },
  {
    id: 'jasmine-marigold-garland',
    name: 'มาลัยมะลิ & ดาวเรือง',
    description: 'ร้อยเรียงดอกมะลิขาวสลับดอกดาวเรืองมงคล',
    badgeColor: '#FBBF24',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 20 * s;

      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
      ctx.lineWidth = 1.6 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      const drawFlowerBead = (x: number, y: number, isMarigold: boolean) => {
        ctx.fillStyle = isMarigold ? '#F59E0B' : '#FFFBEB';
        ctx.beginPath();
        ctx.arc(x, y, (isMarigold ? 6.5 : 4.5) * s, 0, Math.PI * 2);
        ctx.fill();
        if (isMarigold) {
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(x, y, 2.8 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const step = 20 * s;
      let idx = 0;
      for (let x = pad + 16 * s; x <= w - pad - 16 * s; x += step) {
        drawFlowerBead(x, pad, idx % 3 === 0);
        drawFlowerBead(x, h - pad, idx % 3 === 0);
        idx++;
      }

      const topMidY = (pad + topAreaHeight) / 2 + 2 * s;
      drawFlowerBead(w / 2 - 42 * s, topMidY, false);
      drawFlowerBead(w / 2, topMidY, true);
      drawFlowerBead(w / 2 + 42 * s, topMidY, false);

      const bottomMidY = (bottomAreaY + h - pad) / 2 - 2 * s;
      drawLotusFlower(ctx, w / 2 - 58 * s, bottomMidY, 0.72 * s, '#F59E0B', '#FEF08A');
      drawLotusFlower(ctx, w / 2, bottomMidY, 0.95 * s, '#F472B6', '#FFFBEB');
      drawLotusFlower(ctx, w / 2 + 58 * s, bottomMidY, 0.72 * s, '#F59E0B', '#FEF08A');
      ctx.restore();
    },
  },
  {
    id: 'minimal-polaroid-candle',
    name: 'โพลารอยด์แสงเทียน',
    description: 'การ์ดสีครีมมินิมอลขอบนุ่มนวลอบอุ่น',
    badgeColor: '#FDE68A',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, contentLeft, contentRight, scale: s } = m;
      const cardPad = 24 * s;
      const cardTop = topAreaHeight - 14 * s;
      const cardBottom = bottomAreaY + 14 * s;

      ctx.save();
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.8)';
      ctx.lineWidth = 2.2 * s;
      ctx.beginPath();
      ctx.roundRect(
        contentLeft - 14 * s,
        cardTop,
        contentRight - contentLeft + 28 * s,
        cardBottom - cardTop,
        14 * s
      );
      ctx.stroke();

      const topMidY = cardTop / 2;
      drawStar(ctx, w / 2 - 36 * s, topMidY, 4 * s, 1.5 * s, 4, '#FDE68A');
      drawStar(ctx, w / 2, topMidY, 6 * s, 2 * s, 4, '#F59E0B');
      drawStar(ctx, w / 2 + 36 * s, topMidY, 4 * s, 1.5 * s, 4, '#FDE68A');

      const bottomMidY = (cardBottom + h) / 2;
      drawMiniKrathong(ctx, w / 2, bottomMidY, 0.9 * s, '#16A34A', '#FBBF24');
      drawStar(ctx, cardPad + 24 * s, bottomMidY, 4 * s, 1.5 * s, 4, '#FDE68A');
      drawStar(ctx, w - cardPad - 24 * s, bottomMidY, 4 * s, 1.5 * s, 4, '#FDE68A');
      ctx.restore();
    },
  },
  {
    id: 'nang-noppamas-lotus',
    name: 'มนต์เสน่ห์นางนพมาศ',
    description: 'กลีบบัวชมพูตัดเส้นสีทองอ่อนหวานประณีต',
    badgeColor: '#EC4899',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 16 * s;

      ctx.save();
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 2.5 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.2 * s;
      ctx.strokeRect(pad + 6 * s, pad + 6 * s, w - (pad + 6 * s) * 2, h - (pad + 6 * s) * 2);

      const topMidY = (pad + 6 * s + topAreaHeight) / 2;
      drawLotusFlower(ctx, w / 2 - 58 * s, topMidY, 0.72 * s, '#EC4899', '#FBCFE8');
      drawLotusFlower(ctx, w / 2, topMidY, 0.95 * s, '#F472B6', '#FDF2F8');
      drawLotusFlower(ctx, w / 2 + 58 * s, topMidY, 0.72 * s, '#EC4899', '#FBCFE8');

      const bottomMidY = (bottomAreaY + h - pad - 6 * s) / 2;
      drawDiamondDivider(ctx, w / 2, bottomMidY, w * 0.5, s, '#F9A8D4');
      drawLotusFlower(ctx, w / 2, bottomMidY - 2 * s, 1.05 * s, '#EC4899', '#FDF2F8');
      ctx.restore();
    },
  },
  {
    id: 'temple-lantern-arch',
    name: 'ซุ้มโคมประทีปวัดไทย',
    description: 'ซุ้มโคมประดับงานวัดเรียงรายงดงาม',
    badgeColor: '#F97316',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 16 * s;

      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.4 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      // Hanging arch cable at top
      const archBaseY = pad + 8 * s;
      const archDip = Math.min(26 * s, (topAreaHeight - archBaseY) * 0.45);
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(pad + 18 * s, archBaseY);
      ctx.quadraticCurveTo(w / 2, archBaseY + archDip, w - pad - 18 * s, archBaseY);
      ctx.stroke();

      const lanternColors = ['#FB7185', '#FBBF24', '#34D399', '#FBBF24', '#FB7185'];
      const count = 5;
      for (let i = 0; i < count; i++) {
        const t = (i + 1) / (count + 1);
        const lx = pad + 18 * s + (w - (pad + 18 * s) * 2) * t;
        const curveY = archBaseY + 2 * t * (1 - t) * archDip;
        drawSkyLantern(ctx, lx, curveY + 12 * s, 0.72 * s, lanternColors[i]);
      }

      const bottomMidY = (bottomAreaY + h - pad) / 2;
      drawChediSilhouette(ctx, w / 2 - 74 * s, bottomMidY + 3 * s, 0.72 * s, '#F59E0B');
      drawSkyLantern(ctx, w / 2, bottomMidY, 0.95 * s, '#FB7185');
      drawChediSilhouette(ctx, w / 2 + 74 * s, bottomMidY + 3 * s, 0.72 * s, '#F59E0B');
      ctx.restore();
    },
  },
  {
    id: 'royal-gold-brocade',
    name: 'ทองอร่ามพัสตราภรณ์',
    description: 'กรอบทองคำคู่ลายฉลุทรงไทยโบราณ',
    badgeColor: '#D97706',
    draw: (ctx, m) => {
      const { canvasWidth: w, canvasHeight: h, topAreaHeight, bottomAreaY, scale: s } = m;
      const pad = 14 * s;

      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#FDE68A');
      grad.addColorStop(0.5, '#D97706');
      grad.addColorStop(1, '#FDE68A');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4 * s;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      ctx.strokeStyle = 'rgba(253, 230, 138, 0.7)';
      ctx.lineWidth = 1.2 * s;
      ctx.strokeRect(pad + 8 * s, pad + 8 * s, w - (pad + 8 * s) * 2, h - (pad + 8 * s) * 2);

      // Diamond pattern along side margins
      ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
      for (let y = pad + 44 * s; y <= h - pad - 44 * s; y += 34 * s) {
        drawStar(ctx, pad + 16 * s, y, 4.2 * s, 1.8 * s, 4, 'rgba(253, 224, 71, 0.65)');
        drawStar(ctx, w - pad - 16 * s, y, 4.2 * s, 1.8 * s, 4, 'rgba(253, 224, 71, 0.65)');
      }

      const topMidY = (pad + 8 * s + topAreaHeight) / 2;
      drawDiamondDivider(ctx, w / 2, topMidY, w * 0.48, s, '#FDE68A');

      const bottomMidY = (bottomAreaY + h - pad - 8 * s) / 2;
      drawDiamondDivider(ctx, w / 2, bottomMidY, w * 0.56, s, '#FDE68A');
      drawStar(ctx, w / 2, bottomMidY, 11 * s, 4 * s, 8, '#F59E0B');
      ctx.restore();
    },
  },
];

export const FRAME_MAP: Record<string, PhotoboothFrame> = Object.fromEntries(
  PHOTOBOOTH_FRAMES.map((f) => [f.id, f])
);

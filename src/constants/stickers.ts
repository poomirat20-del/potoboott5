import { StickerDefinition } from '../types';

function makeSvgPreview(inner: string, bg = 'transparent'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${
    bg !== 'transparent' ? `<rect width="100" height="100" rx="20" fill="${bg}"/>` : ''
  }${inner}</svg>`;
}

export const LOY_KRATHONG_STICKERS: StickerDefinition[] = [
  {
    id: 'krathong-classic',
    name: 'กระทงใบตอง',
    category: 'krathong',
    previewSvg: makeSvgPreview(`
      <ellipse cx="50" cy="72" rx="34" ry="10" fill="#15803D"/>
      <polygon points="22,70 30,44 38,70" fill="#22C55E"/>
      <polygon points="34,70 42,40 50,70" fill="#16A34A"/>
      <polygon points="46,70 54,40 62,70" fill="#22C55E"/>
      <polygon points="58,70 66,44 74,70" fill="#16A34A"/>
      <ellipse cx="50" cy="64" rx="22" ry="7" fill="#F472B6"/>
      <rect x="47" y="34" width="6" height="24" rx="2" fill="#FACC15"/>
      <ellipse cx="50" cy="24" rx="5" ry="10" fill="#FEF08A"/>
      <ellipse cx="50" cy="26" rx="2.5" ry="5" fill="#F97316"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.ellipse(0, 22 * s, 34 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      const petals = [-22, -10, 2, 14];
      petals.forEach((px, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#22C55E' : '#16A34A';
        ctx.beginPath();
        ctx.moveTo(px * s - 7 * s, 20 * s);
        ctx.lineTo(px * s, -10 * s);
        ctx.lineTo(px * s + 7 * s, 20 * s);
        ctx.closePath();
        ctx.fill();
      });

      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.ellipse(0, 14 * s, 22 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-3 * s, -16 * s, 6 * s, 24 * s);
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.ellipse(0, -26 * s, 5 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.ellipse(0, -24 * s, 2.5 * s, 5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'krathong-gold',
    name: 'กระทงทองคำ',
    category: 'krathong',
    previewSvg: makeSvgPreview(`
      <ellipse cx="50" cy="72" rx="34" ry="10" fill="#B45309"/>
      <polygon points="22,70 32,42 42,70" fill="#F59E0B"/>
      <polygon points="38,70 50,38 62,70" fill="#FBBF24"/>
      <polygon points="58,70 68,42 78,70" fill="#F59E0B"/>
      <ellipse cx="50" cy="64" rx="22" ry="7" fill="#FEF08A"/>
      <rect x="47" y="34" width="6" height="24" rx="2" fill="#FFFBEB"/>
      <ellipse cx="50" cy="24" rx="5" ry="10" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.ellipse(0, 22 * s, 34 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = -2; i <= 2; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#FBBF24' : '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(i * 11 * s - 8 * s, 20 * s);
        ctx.lineTo(i * 11 * s, -12 * s);
        ctx.lineTo(i * 11 * s + 8 * s, 20 * s);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.ellipse(0, 14 * s, 22 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(-3 * s, -16 * s, 6 * s, 24 * s);
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(0, -26 * s, 5 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'krathong-lotus',
    name: 'กระทงดอกบัว',
    category: 'krathong',
    previewSvg: makeSvgPreview(`
      <ellipse cx="50" cy="74" rx="34" ry="9" fill="#166534"/>
      <ellipse cx="32" cy="60" rx="14" ry="20" transform="rotate(-20 32 60)" fill="#EC4899"/>
      <ellipse cx="68" cy="60" rx="14" ry="20" transform="rotate(20 68 60)" fill="#EC4899"/>
      <ellipse cx="50" cy="56" rx="16" ry="24" fill="#F472B6"/>
      <ellipse cx="50" cy="62" rx="10" ry="6" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.ellipse(0, 24 * s, 34 * s, 9 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      [-0.5, 0.5, 0].forEach((rot, idx) => {
        ctx.save();
        ctx.rotate(rot);
        ctx.fillStyle = idx === 2 ? '#F472B6' : '#EC4899';
        ctx.beginPath();
        ctx.ellipse(0, 4 * s, 14 * s, 24 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(0, 12 * s, 10 * s, 6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'sky-lantern',
    name: 'โคมลอยยี่เป็ง',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <path d="M28,28 Q50,12 72,28 L64,74 L36,74 Z" fill="#FB923C"/>
      <ellipse cx="50" cy="74" rx="14" ry="4" fill="#B45309"/>
      <ellipse cx="50" cy="64" rx="7" ry="10" fill="#FEF08A"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      const g = ctx.createRadialGradient(0, 10 * s, 4 * s, 0, 0, 42 * s);
      g.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
      g.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 42 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FB923C';
      ctx.beginPath();
      ctx.moveTo(-22 * s, -22 * s);
      ctx.quadraticCurveTo(0, -38 * s, 22 * s, -22 * s);
      ctx.lineTo(14 * s, 24 * s);
      ctx.lineTo(-14 * s, 24 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.ellipse(0, 14 * s, 8 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'phra-pathom-chedi',
    name: 'พระปฐมเจดีย์',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <rect x="20" y="76" width="60" height="8" rx="2" fill="#D97706"/>
      <rect x="26" y="68" width="48" height="8" rx="2" fill="#F59E0B"/>
      <path d="M32,68 Q30,44 44,36 L56,36 Q70,44 68,68 Z" fill="#FBBF24"/>
      <polygon points="44,36 50,10 56,36" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#D97706';
      ctx.fillRect(-30 * s, 26 * s, 60 * s, 8 * s);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-24 * s, 18 * s, 48 * s, 8 * s);
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.moveTo(-18 * s, 18 * s);
      ctx.quadraticCurveTo(-20 * s, -6 * s, -6 * s, -14 * s);
      ctx.lineTo(6 * s, -14 * s);
      ctx.quadraticCurveTo(20 * s, -6 * s, 18 * s, 18 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.moveTo(-6 * s, -14 * s);
      ctx.lineTo(0, -40 * s);
      ctx.lineTo(6 * s, -14 * s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'full-moon',
    name: 'พระจันทร์เต็มดวง',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <circle cx="50" cy="50" r="34" fill="#FEF08A"/>
      <circle cx="38" cy="40" r="6" fill="#FDE047"/>
      <circle cx="62" cy="58" r="8" fill="#FDE047"/>
      <circle cx="56" cy="34" r="4" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      const g = ctx.createRadialGradient(0, 0, 12 * s, 0, 0, 44 * s);
      g.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      g.addColorStop(0.75, 'rgba(254, 240, 138, 0.25)');
      g.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 44 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, 0, 30 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
      ctx.beginPath();
      ctx.arc(-10 * s, -8 * s, 6 * s, 0, Math.PI * 2);
      ctx.arc(12 * s, 8 * s, 7 * s, 0, Math.PI * 2);
      ctx.arc(6 * s, -14 * s, 4 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'moon-rabbit',
    name: 'กระต่ายในดวงจันทร์',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <circle cx="50" cy="52" r="32" fill="#FEF08A"/>
      <ellipse cx="44" cy="34" rx="5" ry="14" transform="rotate(-10 44 34)" fill="#F59E0B"/>
      <ellipse cx="56" cy="34" rx="5" ry="14" transform="rotate(10 56 34)" fill="#F59E0B"/>
      <circle cx="50" cy="52" r="12" fill="#F59E0B"/>
      <ellipse cx="50" cy="68" rx="14" ry="10" fill="#F59E0B"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, 2 * s, 32 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(-6 * s, -16 * s, 5 * s, 14 * s, -0.15, 0, Math.PI * 2);
      ctx.ellipse(6 * s, -16 * s, 5 * s, 14 * s, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 12 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 16 * s, 14 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'incense-candle',
    name: 'ธูปเทียนมงคล',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <rect x="44" y="40" width="12" height="44" rx="3" fill="#FACC15"/>
      <ellipse cx="50" cy="24" rx="6" ry="12" fill="#FEF08A"/>
      <line x1="34" y1="84" x2="30" y2="30" stroke="#A16207" stroke-width="4" stroke-linecap="round"/>
      <line x1="66" y1="84" x2="70" y2="30" stroke="#A16207" stroke-width="4" stroke-linecap="round"/>
      <circle cx="30" cy="28" r="3" fill="#EF4444"/>
      <circle cx="70" cy="28" r="3" fill="#EF4444"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.strokeStyle = '#A16207';
      ctx.lineWidth = 4 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-16 * s, 34 * s);
      ctx.lineTo(-20 * s, -18 * s);
      ctx.moveTo(16 * s, 34 * s);
      ctx.lineTo(20 * s, -18 * s);
      ctx.stroke();

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(-20 * s, -20 * s, 3.2 * s, 0, Math.PI * 2);
      ctx.arc(20 * s, -20 * s, 3.2 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-6 * s, -8 * s, 12 * s, 42 * s);
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.ellipse(0, -24 * s, 6 * s, 12 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.ellipse(0, -22 * s, 3 * s, 6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'phang-prathip',
    name: 'ผางประทีปโบราณ',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <path d="M22,62 Q50,86 78,62 L70,52 L30,52 Z" fill="#B45309"/>
      <ellipse cx="50" cy="54" rx="22" ry="7" fill="#FDE047"/>
      <ellipse cx="50" cy="36" rx="7" ry="14" fill="#FEF08A"/>
      <ellipse cx="50" cy="39" rx="3.5" ry="7" fill="#F97316"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.moveTo(-28 * s, 12 * s);
      ctx.quadraticCurveTo(0, 36 * s, 28 * s, 12 * s);
      ctx.lineTo(20 * s, 2 * s);
      ctx.lineTo(-20 * s, 2 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(0, 4 * s, 22 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.ellipse(0, -14 * s, 7 * s, 14 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.ellipse(0, -11 * s, 3.5 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'firework-gold',
    name: 'พลุประกายทอง',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <g stroke="#FDE047" stroke-width="4" stroke-linecap="round">
        <line x1="50" y1="14" x2="50" y2="34"/><line x1="50" y1="66" x2="50" y2="86"/>
        <line x1="14" y1="50" x2="34" y2="50"/><line x1="66" y1="50" x2="86" y2="50"/>
        <line x1="25" y1="25" x2="39" y2="39"/><line x1="61" y1="61" x2="75" y2="75"/>
        <line x1="75" y1="25" x2="61" y2="39"/><line x1="39" y1="61" x2="25" y2="75"/>
      </g>
      <circle cx="50" cy="50" r="6" fill="#F59E0B"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.strokeStyle = '#FDE047';
      ctx.fillStyle = '#FDE047';
      ctx.lineWidth = 3.5 * s;
      ctx.lineCap = 'round';
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 12 * s, Math.sin(a) * 12 * s);
        ctx.lineTo(Math.cos(a) * 36 * s, Math.sin(a) * 36 * s);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 39 * s, Math.sin(a) * 39 * s, 3 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, 6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'firework-pink',
    name: 'พลุดอกไม้ชมพู',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <g stroke="#F472B6" stroke-width="4" stroke-linecap="round">
        <line x1="50" y1="14" x2="50" y2="34"/><line x1="50" y1="66" x2="50" y2="86"/>
        <line x1="14" y1="50" x2="34" y2="50"/><line x1="66" y1="50" x2="86" y2="50"/>
        <line x1="25" y1="25" x2="39" y2="39"/><line x1="61" y1="61" x2="75" y2="75"/>
        <line x1="75" y1="25" x2="61" y2="39"/><line x1="39" y1="61" x2="25" y2="75"/>
      </g>
      <circle cx="50" cy="50" r="7" fill="#FEF08A"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.strokeStyle = '#F472B6';
      ctx.fillStyle = '#FBCFE8';
      ctx.lineWidth = 3.5 * s;
      ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 12 * s, Math.sin(a) * 12 * s);
        ctx.lineTo(Math.cos(a) * 35 * s, Math.sin(a) * 35 * s);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 38 * s, Math.sin(a) * 38 * s, 3.2 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, 0, 6.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'lotus-bloom',
    name: 'ดอกบัวหลวง',
    category: 'flora',
    previewSvg: makeSvgPreview(`
      <ellipse cx="32" cy="56" rx="14" ry="22" transform="rotate(-28 32 56)" fill="#EC4899"/>
      <ellipse cx="68" cy="56" rx="14" ry="22" transform="rotate(28 68 56)" fill="#EC4899"/>
      <ellipse cx="50" cy="48" rx="15" ry="26" fill="#F9A8D4"/>
      <circle cx="50" cy="64" r="6" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      [-0.6, -0.3, 0.3, 0.6, 0].forEach((rot, i) => {
        ctx.save();
        ctx.rotate(rot);
        ctx.fillStyle = i === 4 ? '#F9A8D4' : '#EC4899';
        ctx.beginPath();
        ctx.moveTo(0, 22 * s);
        ctx.quadraticCurveTo(-16 * s, -4 * s, 0, -28 * s);
        ctx.quadraticCurveTo(16 * s, -4 * s, 0, 22 * s);
        ctx.fill();
        ctx.restore();
      });
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(0, 14 * s, 6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'jasmine-flower',
    name: 'ดอกมะลิขาว',
    category: 'flora',
    previewSvg: makeSvgPreview(`
      <g fill="#FFFBEB">
        <circle cx="50" cy="28" r="12"/><circle cx="71" cy="43" r="12"/>
        <circle cx="63" cy="68" r="12"/><circle cx="37" cy="68" r="12"/>
        <circle cx="29" cy="43" r="12"/>
      </g>
      <circle cx="50" cy="50" r="9" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#FFFBEB';
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 18 * s, Math.sin(a) * 18 * s, 12 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(0, 0, 8.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'marigold-flower',
    name: 'ดอกดาวเรือง',
    category: 'flora',
    previewSvg: makeSvgPreview(`
      <circle cx="50" cy="50" r="28" fill="#F59E0B"/>
      <circle cx="50" cy="50" r="20" fill="#FBBF24"/>
      <circle cx="50" cy="50" r="11" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 18 * s, Math.sin(a) * 18 * s, 11 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FBBF24';
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + 0.2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 10 * s, Math.sin(a) * 10 * s, 9 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(0, 0, 8 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'thai-garland',
    name: 'พวงมาลัยไทย',
    category: 'flora',
    previewSvg: makeSvgPreview(`
      <circle cx="50" cy="44" r="24" fill="none" stroke="#FFFBEB" stroke-width="10"/>
      <circle cx="50" cy="20" r="6" fill="#F59E0B"/>
      <path d="M40,66 L36,86 M60,66 L64,86" stroke="#EC4899" stroke-width="6" stroke-linecap="round"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.strokeStyle = '#FFFBEB';
      ctx.lineWidth = 10 * s;
      ctx.beginPath();
      ctx.arc(0, -6 * s, 22 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, -28 * s, 6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 6 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-10 * s, 14 * s);
      ctx.lineTo(-14 * s, 34 * s);
      ctx.moveTo(10 * s, 14 * s);
      ctx.lineTo(14 * s, 34 * s);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: 'carp-mobile',
    name: 'ปลาตะเพียนสาน',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <polygon points="24,50 50,30 76,50 50,70" fill="#F59E0B"/>
      <polygon points="74,50 88,36 88,64" fill="#EF4444"/>
      <circle cx="38" cy="48" r="3" fill="#070B14"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(-28 * s, 0);
      ctx.lineTo(0, -20 * s);
      ctx.lineTo(24 * s, 0);
      ctx.lineTo(0, 20 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(22 * s, 0);
      ctx.lineTo(36 * s, -14 * s);
      ctx.lineTo(36 * s, 14 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.moveTo(-10 * s, 0);
      ctx.lineTo(0, -10 * s);
      ctx.lineTo(10 * s, 0);
      ctx.lineTo(0, 10 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#070B14';
      ctx.beginPath();
      ctx.arc(-14 * s, -3 * s, 3 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'golden-heart',
    name: 'หัวใจประกายทอง',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <path d="M50,80 C20,62 16,38 30,26 C40,18 50,28 50,34 C50,28 60,18 70,26 C84,38 80,62 50,80 Z" fill="#F43F5E" stroke="#FDE047" stroke-width="4"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#F43F5E';
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(0, 30 * s);
      ctx.bezierCurveTo(-32 * s, 12 * s, -36 * s, -14 * s, -18 * s, -24 * s);
      ctx.bezierCurveTo(-6 * s, -30 * s, 0, -18 * s, 0, -14 * s);
      ctx.bezierCurveTo(0, -18 * s, 6 * s, -30 * s, 18 * s, -24 * s);
      ctx.bezierCurveTo(36 * s, -14 * s, 32 * s, 12 * s, 0, 30 * s);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: 'golden-star',
    name: 'ดาวประกายวิบวับ',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <polygon points="50,12 58,42 88,50 58,58 50,88 42,58 12,50 42,42" fill="#FDE047"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = (i % 2 === 0 ? 38 : 12) * s;
        const a = (Math.PI * i) / 4 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  },
  {
    id: 'thai-banner-happy',
    name: 'ป้ายสุขสันต์วันลอยกระทง',
    category: 'festival',
    previewSvg: makeSvgPreview(`
      <rect x="8" y="30" width="84" height="40" rx="12" fill="#991B1B" stroke="#FBBF24" stroke-width="4"/>
      <text x="50" y="55" text-anchor="middle" fill="#FEF08A" font-size="13" font-weight="bold">ลอยกระทง</text>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#991B1B';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.roundRect(-42 * s, -20 * s, 84 * s, 40 * s, 12 * s);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.font = `700 ${Math.round(15 * s)}px "Kanit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ลอยกระทง', 0, 1 * s);
      ctx.restore();
    },
  },
  {
    id: 'banner-tesaban5',
    name: 'ป้ายเทศบาล ๕',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <rect x="8" y="30" width="84" height="40" rx="12" fill="#1E1B4B" stroke="#F59E0B" stroke-width="4"/>
      <text x="50" y="55" text-anchor="middle" fill="#FDE68A" font-size="13" font-weight="bold">เทศบาล ๕</text>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#1E1B4B';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.roundRect(-42 * s, -20 * s, 84 * s, 40 * s, 12 * s);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FDE68A';
      ctx.font = `700 ${Math.round(15 * s)}px "Kanit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('เทศบาล ๕', 0, 1 * s);
      ctx.restore();
    },
  },
  {
    id: 'banana-leaf-boat',
    name: 'แพกระทงคู่',
    category: 'krathong',
    previewSvg: makeSvgPreview(`
      <ellipse cx="36" cy="64" rx="18" ry="8" fill="#15803D"/>
      <ellipse cx="64" cy="64" rx="18" ry="8" fill="#16A34A"/>
      <rect x="34" y="42" width="4" height="16" fill="#FACC15"/>
      <rect x="62" y="42" width="4" height="16" fill="#FACC15"/>
      <circle cx="36" cy="36" r="4" fill="#FEF08A"/>
      <circle cx="64" cy="36" r="4" fill="#FEF08A"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      [-14 * s, 14 * s].forEach((ox, idx) => {
        ctx.fillStyle = idx === 0 ? '#15803D' : '#16A34A';
        ctx.beginPath();
        ctx.ellipse(ox, 14 * s, 18 * s, 7 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F472B6';
        ctx.beginPath();
        ctx.ellipse(ox, 10 * s, 11 * s, 4 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(ox - 2 * s, -10 * s, 4 * s, 18 * s);
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.ellipse(ox, -15 * s, 3.5 * s, 6 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    },
  },
  {
    id: 'thai-fan',
    name: 'พัดไทยสีทอง',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <path d="M50,74 L18,40 A36,36 0 0,1 82,40 Z" fill="#D97706" stroke="#FEF08A" stroke-width="3"/>
      <rect x="47" y="70" width="6" height="16" rx="2" fill="#78350F"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#D97706';
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(0, 24 * s);
      ctx.arc(0, 24 * s, 42 * s, -Math.PI * 0.82, -Math.PI * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#78350F';
      ctx.fillRect(-3 * s, 22 * s, 6 * s, 16 * s);
      ctx.restore();
    },
  },
  {
    id: 'temple-lantern-red',
    name: 'โคมแดงงานวัด',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <ellipse cx="50" cy="48" rx="22" ry="26" fill="#DC2626" stroke="#FBBF24" stroke-width="3"/>
      <rect x="40" y="18" width="20" height="6" rx="2" fill="#FBBF24"/>
      <rect x="40" y="72" width="20" height="6" rx="2" fill="#FBBF24"/>
      <line x1="50" y1="78" x2="50" y2="90" stroke="#FBBF24" stroke-width="4"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#DC2626';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.ellipse(0, -2 * s, 22 * s, 26 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(-10 * s, -32 * s, 20 * s, 6 * s);
      ctx.fillRect(-10 * s, 22 * s, 20 * s, 6 * s);
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(0, 28 * s);
      ctx.lineTo(0, 40 * s);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: 'water-ripple',
    name: 'ระลอกคลื่นแสงจันทร์',
    category: 'krathong',
    previewSvg: makeSvgPreview(`
      <path d="M16,44 Q32,32 50,44 T84,44" fill="none" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
      <path d="M22,60 Q36,50 50,60 T78,60" fill="none" stroke="#FDE047" stroke-width="4" stroke-linecap="round"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 5 * s;
      ctx.beginPath();
      ctx.moveTo(-34 * s, -6 * s);
      ctx.quadraticCurveTo(-17 * s, -18 * s, 0, -6 * s);
      ctx.quadraticCurveTo(17 * s, 6 * s, 34 * s, -6 * s);
      ctx.stroke();

      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(-28 * s, 10 * s);
      ctx.quadraticCurveTo(-14 * s, 0, 0, 10 * s);
      ctx.quadraticCurveTo(14 * s, 20 * s, 28 * s, 10 * s);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: 'golden-kanok-ornament',
    name: 'ลายกนกทองคู่',
    category: 'temple',
    previewSvg: makeSvgPreview(`
      <path d="M50,68 C26,64 16,44 26,28 C32,42 42,46 50,30 C58,46 68,42 74,28 C84,44 74,64 50,68 Z" fill="#F59E0B" stroke="#FEF08A" stroke-width="2"/>
    `),
    draw: (ctx, size) => {
      const s = size / 100;
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2.5 * s;
      ctx.beginPath();
      ctx.moveTo(0, 18 * s);
      ctx.bezierCurveTo(-24 * s, 14 * s, -34 * s, -6 * s, -24 * s, -22 * s);
      ctx.bezierCurveTo(-18 * s, -8 * s, -8 * s, -4 * s, 0, -20 * s);
      ctx.bezierCurveTo(8 * s, -4 * s, 18 * s, -8 * s, 24 * s, -22 * s);
      ctx.bezierCurveTo(34 * s, -6 * s, 24 * s, 14 * s, 0, 18 * s);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
  },
];

export const STICKER_MAP: Record<string, StickerDefinition> = Object.fromEntries(
  LOY_KRATHONG_STICKERS.map((s) => [s.id, s])
);

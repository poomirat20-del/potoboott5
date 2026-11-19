import { BackgroundTone } from '../types';

export const BACKGROUND_TONES: BackgroundTone[] = [
  {
    id: 'river-midnight',
    name: 'น้ำเงินค่ำคืนแม่น้ำ',
    primaryColor: '#0A1428',
    secondaryColor: '#050914',
    accentColor: '#F5B041',
    sparkleColor: '#FDE68A',
  },
  {
    id: 'candle-amber',
    name: 'ทองอำพันแสงเทียน',
    primaryColor: '#2B1B0E',
    secondaryColor: '#120A04',
    accentColor: '#FBBF24',
    sparkleColor: '#FEF08A',
  },
  {
    id: 'chedi-night',
    name: 'ราตรีพระปฐมเจดีย์',
    primaryColor: '#1B112B',
    secondaryColor: '#0B0614',
    accentColor: '#F4C430',
    sparkleColor: '#FDE047',
  },
  {
    id: 'lotus-pink',
    name: 'ชมพูกลีบบัวหลวง',
    primaryColor: '#3B1228',
    secondaryColor: '#1B0712',
    accentColor: '#F9A8D4',
    sparkleColor: '#FBCFE8',
  },
  {
    id: 'emerald-stream',
    name: 'เขียวมรกตสายน้ำ',
    primaryColor: '#0A2923',
    secondaryColor: '#041411',
    accentColor: '#EAB308',
    sparkleColor: '#A7F3D0',
  },
  {
    id: 'twilight-plum',
    name: 'ม่วงสนธยายี่เป็ง',
    primaryColor: '#23163D',
    secondaryColor: '#0F091F',
    accentColor: '#F59E0B',
    sparkleColor: '#DDD6FE',
  },
  {
    id: 'crimson-temple',
    name: 'แดงชาดงานวัดไทย',
    primaryColor: '#380E14',
    secondaryColor: '#190508',
    accentColor: '#FACC15',
    sparkleColor: '#FDE68A',
  },
  {
    id: 'obsidian-modern',
    name: 'ดำนิลโมเดิร์น',
    primaryColor: '#14171F',
    secondaryColor: '#07090D',
    accentColor: '#D4AF37',
    sparkleColor: '#E2E8F0',
  },
  {
    id: 'ivory-cream',
    name: 'ขาวครีมงาช้าง',
    primaryColor: '#FAF5EB',
    secondaryColor: '#EFE4D2',
    accentColor: '#B45309',
    sparkleColor: '#D97706',
    isLight: true,
  },
  {
    id: 'pastel-blossom',
    name: 'ชมพูนมกลีบบัว',
    primaryColor: '#FDF2F5',
    secondaryColor: '#F8DFE6',
    accentColor: '#BE185D',
    sparkleColor: '#F472B6',
    isLight: true,
  },
];

export function isHexLight(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}

export function darkenHex(hex: string, factor = 0.45): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '#070B14';
  const r = Math.max(0, Math.round(parseInt(clean.slice(0, 2), 16) * (1 - factor)));
  const g = Math.max(0, Math.round(parseInt(clean.slice(2, 4), 16) * (1 - factor)));
  const b = Math.max(0, Math.round(parseInt(clean.slice(4, 6), 16) * (1 - factor)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`;
}

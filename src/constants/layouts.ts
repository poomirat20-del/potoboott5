import { LayoutId, PhotoboothLayout, PhotoSlot } from '../types';

function createStripLayout(
  id: LayoutId,
  name: string,
  subtitle: string,
  shotCount: number
): PhotoboothLayout {
  const canvasWidth = 650;
  const sidePadding = 54;
  const topPadding = 92;
  const bottomPadding = 110;
  const gap = 24;
  const slotWidth = canvasWidth - sidePadding * 2;
  const slotHeight = Math.round((slotWidth * 3) / 4); // 4:3 crisp landscape slots
  const canvasHeight =
    topPadding + shotCount * slotHeight + (shotCount - 1) * gap + bottomPadding;

  const slots: PhotoSlot[] = [];
  for (let i = 0; i < shotCount; i++) {
    slots.push({
      x: sidePadding,
      y: topPadding + i * (slotHeight + gap),
      width: slotWidth,
      height: slotHeight,
    });
  }

  return {
    id,
    name,
    subtitle,
    shotCount,
    canvasWidth,
    canvasHeight,
    topPadding,
    bottomPadding,
    sidePadding,
    gap,
    slots,
  };
}

function createSingleLayout(): PhotoboothLayout {
  const canvasWidth = 900;
  const sidePadding = 72;
  const topPadding = 104;
  const bottomPadding = 132;
  const slotWidth = canvasWidth - sidePadding * 2;
  const slotHeight = Math.round((slotWidth * 4) / 3.4);
  const canvasHeight = topPadding + slotHeight + bottomPadding;

  return {
    id: 'single',
    name: 'ภาพเดี่ยว (1 ช็อต)',
    subtitle: 'โปสการ์ดแนวตั้ง คมชัดเต็มตา',
    shotCount: 1,
    canvasWidth,
    canvasHeight,
    topPadding,
    bottomPadding,
    sidePadding,
    gap: 0,
    slots: [
      {
        x: sidePadding,
        y: topPadding,
        width: slotWidth,
        height: slotHeight,
      },
    ],
  };
}

function createGrid4Layout(): PhotoboothLayout {
  const canvasWidth = 1040;
  const sidePadding = 68;
  const topPadding = 108;
  const bottomPadding = 132;
  const gap = 26;
  const slotWidth = Math.round((canvasWidth - sidePadding * 2 - gap) / 2);
  const slotHeight = Math.round((slotWidth * 3) / 4);
  const canvasHeight = topPadding + slotHeight * 2 + gap + bottomPadding;

  const slots: PhotoSlot[] = [
    { x: sidePadding, y: topPadding, width: slotWidth, height: slotHeight },
    { x: sidePadding + slotWidth + gap, y: topPadding, width: slotWidth, height: slotHeight },
    { x: sidePadding, y: topPadding + slotHeight + gap, width: slotWidth, height: slotHeight },
    {
      x: sidePadding + slotWidth + gap,
      y: topPadding + slotHeight + gap,
      width: slotWidth,
      height: slotHeight,
    },
  ];

  return {
    id: 'grid4',
    name: 'กริด 4 ช็อต (2×2)',
    subtitle: 'สไตล์โพลารอยด์ภาพครอบครัว',
    shotCount: 4,
    canvasWidth,
    canvasHeight,
    topPadding,
    bottomPadding,
    sidePadding,
    gap,
    slots,
  };
}

export const PHOTOBOOTH_LAYOUTS: Record<LayoutId, PhotoboothLayout> = {
  strip3: createStripLayout('strip3', 'โฟโต้สตริป 3 ช็อต', 'ตู้สติกเกอร์ยอดนิยม 3 แอ็กชัน', 3),
  strip4: createStripLayout('strip4', 'โฟโต้สตริป 4 ช็อต', 'สตริปยาว 4 ช็อตแนวตั้ง', 4),
  single: createSingleLayout(),
  grid4: createGrid4Layout(),
};

export const LAYOUT_LIST: PhotoboothLayout[] = [
  PHOTOBOOTH_LAYOUTS.strip3,
  PHOTOBOOTH_LAYOUTS.strip4,
  PHOTOBOOTH_LAYOUTS.grid4,
  PHOTOBOOTH_LAYOUTS.single,
];

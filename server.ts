import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface StoredPhoto {
  buffer: Buffer;
  mimeType: string;
  createdAt: number;
}

const photoStore = new Map<string, StoredPhoto>();
const MAX_STORED_PHOTOS = 150;

function cleanupPhotoStore() {
  if (photoStore.size <= MAX_STORED_PHOTOS) return;
  const entries = Array.from(photoStore.entries()).sort((a, b) => a[1].createdAt - b[1].createdAt);
  const toDelete = entries.length - MAX_STORED_PHOTOS;
  for (let i = 0; i < toDelete; i++) {
    photoStore.delete(entries[i][0]);
  }
}

async function uploadToUguu(buffer: Buffer, mimeType: string): Promise<string> {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  const form = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  form.append('files[]', blob, `loy-krathong-${Date.now()}.${ext}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://uguu.se/upload', {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`uguu HTTP ${res.status}`);
    }
    const data = (await res.json()) as { success?: boolean; files?: Array<{ url?: string }> };
    const url = data?.files?.[0]?.url;
    if (!data?.success || !url) {
      throw new Error('uguu returned invalid payload');
    }
    return url;
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadToTmpFiles(buffer: Buffer, mimeType: string): Promise<string> {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  const form = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  form.append('file', blob, `loy-krathong-${Date.now()}.${ext}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`tmpfiles HTTP ${res.status}`);
    }
    const data = (await res.json()) as { status?: string; data?: { url?: string } };
    const url = data?.data?.url;
    if (data?.status !== 'success' || !url) {
      throw new Error('tmpfiles returned invalid payload');
    }
    return url;
  } finally {
    clearTimeout(timeout);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Upload image and return a direct public URL for QR scanning
  app.post('/api/upload', async (req, res) => {
    try {
      const { imageData } = req.body as { imageData?: string };
      if (!imageData || typeof imageData !== 'string') {
        res.status(400).json({ error: 'Missing imageData' });
        return;
      }

      const match = imageData.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);
      if (!match) {
        res.status(400).json({ error: 'Invalid image data URI' });
        return;
      }

      const mimeType = match[1] === 'image/jpg' ? 'image/jpeg' : match[1];
      const buffer = Buffer.from(match[2], 'base64');

      // Keep a local fallback copy in memory
      const id = crypto.randomBytes(6).toString('hex');
      photoStore.set(id, { buffer, mimeType, createdAt: Date.now() });
      cleanupPhotoStore();

      // Prefer uguu.se (serves direct raw image 200 OK), fallback to tmpfiles.org
      try {
        const publicUrl = await Promise.any([
          uploadToUguu(buffer, mimeType),
          uploadToTmpFiles(buffer, mimeType),
        ]);
        res.json({ url: publicUrl, provider: 'public', localFallback: `/raw/${id}` });
        return;
      } catch {
        // Fallback to local server direct image route
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const fallbackUrl = `${protocol}://${host}/view/${id}`;
        res.json({ url: fallbackUrl, provider: 'local' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to process image upload' });
    }
  });

  // Direct raw image endpoint
  app.get('/raw/:id', (req, res) => {
    const item = photoStore.get(req.params.id);
    if (!item) {
      res.status(404).send('ไม่พบรูปภาพ หรือรูปภาพหมดอายุแล้ว');
      return;
    }
    res.setHeader('Content-Type', item.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(item.buffer);
  });

  // Clean photo-only viewer page (no photobooth controls, only photo + save + print)
  app.get('/view/:id', (req, res) => {
    const item = photoStore.get(req.params.id);
    if (!item) {
      res.status(404).send('<!doctype html><html lang="th"><meta charset="utf-8"><body style="background:#070B14;color:#fef3c7;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><p>ไม่พบรูปภาพ หรือรูปภาพหมดอายุแล้ว</p></body></html>');
      return;
    }
    const ext = item.mimeType === 'image/png' ? 'png' : 'jpg';
    const rawPath = `/raw/${req.params.id}`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>รับรูปภาพลอยกระทง</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: #070B14; color: #fef3c7; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; gap: 16px; }
    img { max-width: 100%; max-height: 78vh; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    a.btn, button.btn { padding: 12px 22px; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; }
    .primary { background: #F59E0B; color: #070B14; }
    .secondary { background: #1E293B; color: #FEF3C7; border: 1px solid rgba(245,158,11,0.3); }
    p.hint { font-size: 13px; color: #cbd5e1; margin: 0; text-align: center; }
    @media print {
      @page { margin: 0; }
      body { background: #fff !important; padding: 0 !important; }
      .actions, .hint { display: none !important; }
      img { max-width: 100vw !important; max-height: 100vh !important; border-radius: 0 !important; box-shadow: none !important; }
    }
  </style>
</head>
<body>
  <img src="${rawPath}" alt="ภาพถ่ายลอยกระทง" />
  <p class="hint">แตะค้างที่รูปภาพเพื่อบันทึกลงอัลบั้ม หรือกดปุ่มด้านล่าง</p>
  <div class="actions">
    <a class="btn primary" href="${rawPath}" download="loy-krathong-photobooth.${ext}">บันทึกรูปลงเครื่อง</a>
    <button class="btn secondary" onclick="window.print()">พิมพ์รูป</button>
  </div>
</body>
</html>`);
  });

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build not found');
      }
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Loy Krathong Photobooth server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

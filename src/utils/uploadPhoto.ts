export interface UploadResult {
  url: string;
  provider: 'server' | 'tmpfiles-cors';
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

async function uploadDirectToTmpFiles(dataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  const formData = new FormData();
  formData.append('file', blob, `loy-krathong-${Date.now()}.jpg`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }
    const json = (await response.json()) as {
      status?: string;
      data?: { url?: string };
    };
    if (json?.status !== 'success' || !json?.data?.url) {
      throw new Error('TmpFiles returned invalid response');
    }
    return json.data.url;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Smart uploader that works BOTH:
 * 1) On full-stack Express server (/api/upload -> uguu.se / tmpfiles.org)
 * 2) On static GitHub Pages hosting (no backend -> direct CORS upload to tmpfiles.org)
 */
export async function uploadPhotoForQR(dataUrl: string): Promise<UploadResult> {
  // Try backend endpoint first if running on full-stack Express host
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    try {
      const res = await fetch('./api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: dataUrl }),
        signal: controller.signal,
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = (await res.json()) as { url?: string };
        if (data?.url && data.url.startsWith('http')) {
          return { url: data.url, provider: 'server' };
        }
      }
    } finally {
      clearTimeout(timer);
    }
  } catch {
    // Backend unavailable (e.g., GitHub Pages static deploy) - proceed to CORS fallback
  }

  // Static / GitHub Pages direct CORS upload
  const corsUrl = await uploadDirectToTmpFiles(dataUrl);
  return { url: corsUrl, provider: 'tmpfiles-cors' };
}

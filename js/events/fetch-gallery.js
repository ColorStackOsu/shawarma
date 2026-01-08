const DRIVE_API_KEY = window.__APP_CONFIG__?.GOOGLE_DRIVE_API_KEY;

const folderCache = new Map(); // folderId -> [{src, full, alt}]

export function driveThumb(fileId, size = 1200) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

export async function fetchDriveFolderImages(folderId) {
  if (!folderId) return [];
  if (!DRIVE_API_KEY)
    throw new Error("Missing GOOGLE_DRIVE_API_KEY in config.js");
  if (folderCache.has(folderId)) return folderCache.get(folderId);

  const q = encodeURIComponent(
    `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`
  );

  const url =
    `https://www.googleapis.com/drive/v3/files` +
    `?key=${encodeURIComponent(DRIVE_API_KEY)}` +
    `&q=${q}` +
    `&fields=files(id,name)` +
    `&orderBy=name`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);

  const data = await res.json();

  const images = (data.files || []).map((f, idx) => ({
    src: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`,
    full: `https://drive.google.com/uc?export=view&id=${f.id}`,
    alt: f.name || `Image ${idx + 1}`,
  }));

  folderCache.set(folderId, images);
  return images;
}

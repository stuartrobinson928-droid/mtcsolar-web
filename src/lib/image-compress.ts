// Client-side image compression: resize to a max dimension and re-encode as WebP.
// Returns a new File you can upload. Falls back to the original if the browser
// can't decode it.
export async function compressImage(
  file: File,
  opts: { maxDim?: number; quality?: number; type?: string } = {},
): Promise<File> {
  const { maxDim = 1200, quality = 0.82, type = "image/webp" } = opts;
  if (!file.type.startsWith("image/")) return file;

  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("decode failed"));
    im.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, type, quality));
  if (!blob || blob.size >= file.size) return file; // keep original if no savings

  const base = file.name.replace(/\.[^.]+$/, "");
  const ext = type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `${base}.${ext}`, { type });
}

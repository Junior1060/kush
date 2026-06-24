// Client-side image compression: downscale to a max dimension and re-encode as
// JPEG before upload. Cuts phone-camera photos from several MB to ~100–300KB,
// slashing storage + bandwidth and making the app faster. Runs in the browser.
export async function compressImage(
  file: File,
  maxDim = 1080,
  quality = 0.8
): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      return file; // can't decode — upload original
    }
  }

  let { width, height } = bitmap;
  if (width > height && width > maxDim) {
    height = Math.round((height * maxDim) / width);
    width = maxDim;
  } else if (height >= width && height > maxDim) {
    width = Math.round((width * maxDim) / height);
    height = maxDim;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  // Fall back to the original if compression somehow produced something larger.
  if (!blob || blob.size >= file.size) return blob ?? file;
  return blob;
}

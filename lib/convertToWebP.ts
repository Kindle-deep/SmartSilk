// 客户端：将图片 Blob/File/URL 转成 WebP 的小工具
export async function convertBlobToWebP(blob: Blob, quality = 0.8): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建 canvas context');
  ctx.drawImage(bitmap, 0, 0);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('转换为 WebP 失败'));
    }, 'image/webp', quality);
  });
}

export async function fileToWebP(file: File, quality = 0.8): Promise<File> {
  const blob = await convertBlobToWebP(file, quality);
  const name = file.name.replace(/\.[^/.]+$/, '') + '.webp';
  return new File([blob], name, { type: 'image/webp' });
}

export async function urlToWebP(url: string, quality = 0.8): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('图片下载失败');
  const blob = await res.blob();
  return convertBlobToWebP(blob, quality);
}

export default convertBlobToWebP;

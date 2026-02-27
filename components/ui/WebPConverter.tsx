import { useState } from 'react';
import { fileToWebP } from '@/lib/convertToWebP';

export default function WebPConverter() {
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setOrigUrl(URL.createObjectURL(f));
    setLoading(true);
    try {
      const webpFile = await fileToWebP(f, 0.8);
      setWebpUrl(URL.createObjectURL(webpFile));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'grid', gap: 8, maxWidth: 520}}>
      <label>
        选择图片（前端转换为 WebP）：
        <input type="file" accept="image/*" onChange={onFile} />
      </label>
      {loading && <div>转换中…</div>}
      {origUrl && (
        <div>
          <div>原图预览：</div>
          <img src={origUrl} alt="原图" style={{maxWidth: '100%'}} />
        </div>
      )}
      {webpUrl && (
        <div>
          <div>WebP 结果（右键或点击下载）：</div>
          <a href={webpUrl} download="converted.webp">下载 WebP</a>
          <br />
          <img src={webpUrl} alt="webp" style={{maxWidth: '100%'}} />
        </div>
      )}
    </div>
  );
}

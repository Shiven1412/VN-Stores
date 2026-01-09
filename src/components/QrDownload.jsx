import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { supabase } from '../supabaseClient';

export default function QrDownload({ value, fileName = 'vn-qr.png', onUpload }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [publicUrl, setPublicUrl] = useState(null);

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, { margin: 1, scale: 6 })
      .then(url => setDataUrl(url))
      .catch(err => console.error(err));
  }, [value]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const dataUrlToBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleUpload = async () => {
    if (!dataUrl) return;
    setUploading(true);
    try {
      const blob = dataUrlToBlob(dataUrl);
      const timestamp = Date.now();
      const path = `qrcodes/${timestamp}-${fileName}`;

      const { data, error: uploadError } = await supabase.storage.from('qrcodes').upload(path, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/png'
      });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('qrcodes').getPublicUrl(path);
      setPublicUrl(urlData.publicUrl);
      if (onUpload) onUpload(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error', err.message || err);
      alert('Upload failed: ' + (err.message || String(err)));
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert('Copied to clipboard');
    } catch (e) {
      console.error(e);
      alert('Copy failed');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {dataUrl ? (
        <>
          <img src={dataUrl} alt="QR Code" style={{ maxWidth: '300px', width: '80%', borderRadius: 12, border: '6px solid rgba(255,255,255,0.04)' }} />
          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleDownload} className="btn btn-primary">Download QR</button>
            <a href={dataUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Open in new tab</a>
            <button onClick={handleUpload} className="btn btn-outline" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload to Storage'}
            </button>
          </div>
          {publicUrl && (
            <div style={{ marginTop: 12 }}>
              <p style={{ color: 'var(--text-muted)', wordBreak: 'break-all' }}>Public URL: <a href={publicUrl} target="_blank" rel="noreferrer">Open</a></p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={handleCopy}>Copy Link</button>
                <a className="btn btn-outline" href={publicUrl} target="_blank" rel="noreferrer">Open Link</a>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Generating QR...</p>
      )}
      <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>Uploaded QR will be stored in the `qrcodes` storage bucket.</p>
    </div>
  );
}

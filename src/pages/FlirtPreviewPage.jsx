import React from 'react';
import FlirtDeckPreview from './FlirtDeckPreview';

export default function FlirtPreviewPage() {
  const params = new URLSearchParams(window.location.search);
  const d = params.get('d');
  let data = null;
  if (d) {
    try {
      const json = decodeURIComponent(escape(atob(d)));
      data = JSON.parse(json);
    } catch (e) {
      console.error('Failed to parse preview data', e);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <FlirtDeckPreview data={data} />
    </div>
  );
}

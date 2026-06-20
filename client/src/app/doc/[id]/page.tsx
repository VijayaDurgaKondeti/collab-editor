'use client';

import dynamic from 'next/dynamic';
import { use } from 'react';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>📝 Collaborative Editor</h1>
        <div style={{ fontSize: 13, color: '#888', background: '#f0f0f0', padding: '4px 12px', borderRadius: 20 }}>
          Room: {id}
        </div>
      </div>
      <Editor docId={id} />
    </main>
  );
}
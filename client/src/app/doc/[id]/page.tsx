'use client';

import dynamic from 'next/dynamic';
import { use, useState } from 'react';

import type { ComponentProps } from 'react';
import EditorComponent from '@/components/Editor';

const Editor = dynamic<ComponentProps<typeof EditorComponent>>(
  () => import('@/components/Editor'),
  { ssr: false }
);

export default function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [onlineCount, setOnlineCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24 }}>📝 Collaborative Editor</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Online users count */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 20, padding: '4px 12px', fontSize: 13, color: '#16a34a'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            {onlineCount} online
          </div>
          {/* Room ID badge */}
          <div style={{
            fontSize: 13, color: '#888', background: '#f0f0f0',
            padding: '4px 12px', borderRadius: 20
          }}>
            Room: {id}
          </div>
          {/* Copy link button */}
          <button
            onClick={copyLink}
            style={{
              padding: '6px 14px', fontSize: 13,
              background: copied ? '#22c55e' : '#000',
              color: '#fff', border: 'none', borderRadius: 20,
              cursor: 'pointer', transition: 'background 0.2s'
            }}
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      {/* Editor with awareness callback */}
      <Editor docId={id} onOnlineCountChange={setOnlineCount} />
    </main>
  );
}
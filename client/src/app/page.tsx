'use client';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: 24 }}>Collaborative Editor</h1>
      <Editor docId='my-first-doc' />
    </main>
  );
}

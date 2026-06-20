'use client';

import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const USER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
const randomColor = () => USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
const randomName  = () => `User-${Math.floor(Math.random() * 1000)}`;

interface EditorProps {
  docId: string;
  onOnlineCountChange?: (count: number) => void;
}

export default function Editor({ docId, onOnlineCountChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const editorDiv = document.createElement('div');
    container.appendChild(editorDiv);

    const ydoc = new Y.Doc();
    const ytext = ydoc.getText('quill');

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';
    const provider = new WebsocketProvider(wsUrl, docId, ydoc);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      placeholder: 'Start typing to collaborate...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [1, 2, 3, false] }],
          ['link'],
        ],
      },
    });

    let isSynced = false;

    provider.on('sync', (synced: boolean) => {
      if (synced && !isSynced) {
        isSynced = true;
        const delta = ytext.toDelta();
        if (delta.ops && delta.ops.length > 0) {
          quill.setContents(delta, 'silent');
        }
      }
    });

    ytext.observe((_event, transaction) => {
      if (transaction.local) return;
      const delta = ytext.toDelta();
      quill.setContents(delta, 'silent');
    });

    quill.on('text-change', (delta, _old, source) => {
      if (source !== 'user') return;
      ydoc.transact(() => {
        ytext.applyDelta(delta.ops as any[]);
      });
    });

    const awareness = provider.awareness;
    awareness.setLocalStateField('user', {
      name: randomName(),
      color: randomColor(),
    });

    // Report online count to parent
    awareness.on('change', () => {
      const count = awareness.getStates().size;
      onOnlineCountChange?.(count);
    });

    quill.on('selection-change', (range) => {
      awareness.setLocalStateField('cursor', range);
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
      container.innerHTML = '';
    };
  }, [docId, onOnlineCountChange]);

  return (
    <div
      ref={containerRef}
      style={{ background: '#fff', borderRadius: 8, border: '1px solid #ddd', minHeight: 540 }}
    />
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const id = generateId();
    router.push(`/doc/${id}`);
  };

 const joinRoom = () => {
  if (!roomId.trim()) return;
  
  // Handle both full URL and just room ID
  const input = roomId.trim();
  if (input.includes('/doc/')) {
    const id = input.split('/doc/')[1];
    router.push(`/doc/${id}`);
  } else {
    router.push(`/doc/${input}`);
  }
};

  return (
    <main style={{ maxWidth: 500, margin: '100px auto', padding: '0 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>📝 Collaborative Editor</h1>
      <p style={{ color: '#888', marginBottom: 40 }}>
        Create a new document or join an existing one
      </p>

      <button
        onClick={createRoom}
        style={{
          width: '100%',
          padding: '14px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        + Create New Document
      </button>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Enter room ID or paste link..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button
          onClick={joinRoom}
          style={{
            padding: '12px 20px',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Join
        </button>
      </div>

      <p style={{ color: '#bbb', fontSize: 13, marginTop: 24 }}>
        Share the room ID with others to collaborate in real-time
      </p>
    </main>
  );
}
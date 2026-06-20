'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f0f1a' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </main>
    );
  }

  const createRoom = () => router.push(`/doc/${generateId()}`);
  const joinRoom = () => {
    if (!roomId.trim()) return;
    const input = roomId.trim();
    const id = input.includes('/doc/') ? input.split('/doc/')[1] : input;
    router.push(`/doc/${id}`);
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float1 { animation: float 6s ease-in-out infinite; }
        .float2 { animation: float 8s ease-in-out infinite 1s; }
        .hero { animation: fadeUp 0.7s ease-out; }
        .btn-create {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% auto;
          color: #fff;
          transition: all 0.3s;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }
        .btn-create:hover {
          background-position: right center;
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(99,102,241,0.4);
        }
        .btn-create:active { transform: translateY(-1px); }
        .btn-join {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-join:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .feature-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(99,102,241,0.4);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(99,102,241,0.15);
        }
        .btn-signout {
          padding: 8px 18px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          color: #d1d5db;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-signout:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .input-join {
          flex: 1;
          padding: 12px 16px;
          border: none;
          outline: none;
          font-size: 15px;
          background: transparent;
          color: #fff;
        }
        .input-join::placeholder { color: #6b7280; }
      `}</style>

      <main style={{ minHeight: '100vh', background: '#0f0f1a', position: 'relative', overflow: 'hidden' }}>
        {/* Background blobs */}
        <div className="float1" style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          top: -150, left: -150, borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div className="float2" style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
          bottom: -100, right: -100, borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Navbar */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 32px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>📝</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Collaborative Editor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {session?.user?.image && (
              <img src={session.user.image} width={34} height={34}
                style={{ borderRadius: '50%', border: '2px solid rgba(99,102,241,0.5)' }} alt="avatar" />
            )}
            <span style={{ fontSize: 14, color: '#d1d5db', fontWeight: 500 }}>
              {session?.user?.name || session?.user?.email}
            </span>
            <button className="btn-signout" onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
              Sign out
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="hero" style={{
          maxWidth: 680, margin: '80px auto 0',
          padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20, padding: '6px 16px',
            fontSize: 13, color: '#a78bfa', fontWeight: 600, marginBottom: 24,
          }}>
            ⚡ Powered by Yjs CRDTs
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 900, lineHeight: 1.1,
            marginBottom: 20, color: '#fff',
          }}>
            Your documents,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              together
            </span>
          </h1>

          <p style={{ fontSize: 17, color: '#9ca3af', marginBottom: 48, lineHeight: 1.7 }}>
            Create a document, share the link, and collaborate in real-time.
            Changes sync instantly with zero conflicts.
          </p>

          {/* Create button */}
          <button className="btn-create" onClick={createRoom}>
            ✨ Create New Document
          </button>

          {/* Join room */}
          <div style={{
            display: 'flex', gap: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: 14, padding: 6, marginBottom: 64,
          }}>
            <input
              className="input-join"
              type="text"
              placeholder="Enter room ID or paste link..."
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && joinRoom()}
            />
            <button className="btn-join" onClick={joinRoom}>Join Room</button>
          </div>

          {/* Feature cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 16, marginBottom: 60,
          }}>
            {[
              { icon: '⚡', title: 'Real-time sync', desc: 'Changes appear instantly for all users', color: '#fbbf24' },
              { icon: '🧠', title: 'No conflicts', desc: 'Powered by Yjs CRDTs technology', color: '#a78bfa' },
              { icon: '🔗', title: 'Shareable rooms', desc: 'Share a link to collaborate instantly', color: '#34d399' },
              { icon: '💾', title: 'Auto-saved', desc: 'Documents saved to PostgreSQL', color: '#60a5fa' },
            ].map(f => (
              <div key={f.title} className="feature-card" style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: 28, marginBottom: 12,
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
                }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: '#f9fafb' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Please fill all fields');
    if (isSignUp && !name) return setError('Please enter your name');
    setLoading(true);
    const result = await signIn('credentials', {
      email, password, name,
      isSignUp: isSignUp ? 'true' : 'false',
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError(result.error);
    else router.push('/');
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .float1 { animation: float 6s ease-in-out infinite; }
        .float2 { animation: float 8s ease-in-out infinite 1s; }
        .float3 { animation: float 7s ease-in-out infinite 2s; }
        .card { animation: fadeIn 0.6s ease-out; }
        .btn-google {
          width: 100%;
          padding: 13px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          transition: all 0.2s;
          color: #374151;
        }
        .btn-google:hover {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          transform: translateY(-1px);
        }
        .btn-main {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }
        .btn-main:active { transform: translateY(0); }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          background: #fafafa;
          transition: all 0.2s;
          margin-bottom: 12px;
          color: #111827;
        }
        .input-field:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .toggle-link {
          color: #6366f1;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
        }
        .toggle-link:hover { color: #4f46e5; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#0f0f1a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background blobs */}
        <div className="float1" style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          top: -100, left: -100, borderRadius: '50%',
        }} />
        <div className="float2" style={{
          position: 'absolute', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
          bottom: -50, right: 200, borderRadius: '50%',
        }} />
        <div className="float3" style={{
          position: 'absolute', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          top: 200, right: -50, borderRadius: '50%',
        }} />

        {/* Left panel */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 60, position: 'relative', zIndex: 1,
        }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>📝</div>
          <h1 style={{
            fontSize: 36, fontWeight: 800, color: '#fff',
            marginBottom: 16, textAlign: 'center', lineHeight: 1.2,
          }}>
            Collaborate in<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Real-Time</span>
          </h1>
          <p style={{ color: '#9ca3af', textAlign: 'center', maxWidth: 300, lineHeight: 1.7, fontSize: 15 }}>
            Edit documents together with zero merge conflicts, powered by Yjs CRDTs.
          </p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '⚡', text: 'Real-time sync across all users' },
              { icon: '🧠', text: 'Zero conflicts with Yjs CRDTs' },
              { icon: '🔗', text: 'Shareable document rooms' },
              { icon: '💾', text: 'Auto-saved to PostgreSQL' },
            ].map(f => (
              <div key={f.text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 16px',
              }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ color: '#d1d5db', fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 40, position: 'relative', zIndex: 1,
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: 420,
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 24, padding: '40px 36px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: 28, marginBottom: 16,
              }}>📝</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h2>
              <p style={{ color: '#6b7280', fontSize: 14 }}>
                {isSignUp ? 'Start collaborating in seconds' : 'Sign in to continue'}
              </p>
            </div>

            {/* Google */}
            <button className="btn-google" onClick={() => signIn('google', { callbackUrl: '/' })}>
              <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="G" />
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {isSignUp && (
              <input className="input-field" type="text" placeholder="Full name"
                value={name} onChange={e => setName(e.target.value)} />
            )}
            <input className="input-field" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ marginBottom: 16 }} />

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '10px 14px',
                color: '#dc2626', fontSize: 14, marginBottom: 16,
              }}>⚠️ {error}</div>
            )}

            <button className="btn-main" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Please wait...' : isSignUp ? '🚀 Create Account' : '✨ Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 20 }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span className="toggle-link" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
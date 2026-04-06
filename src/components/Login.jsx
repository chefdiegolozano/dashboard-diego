import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const VALID_USER = import.meta.env.VITE_LOGIN_USER || 'diego';
const VALID_PASS = import.meta.env.VITE_LOGIN_PASS || 'levena2026';

export function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for feel
    setTimeout(() => {
      if (user.trim().toLowerCase() === VALID_USER && pass === VALID_PASS) {
        sessionStorage.setItem('dl_session', 'authenticated');
        onLogin();
      } else {
        setError('Usuário ou senha incorretos.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1209',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '380px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '16px',
            background: '#B8860B',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '28px', color: '#1A1209',
            marginBottom: '16px',
          }}>
            DL
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontWeight: 700,
            color: '#B8860B', fontSize: '22px', margin: '0 0 4px',
          }}>
            Diego Lozano
          </h1>
          <p style={{ color: 'rgba(184,134,11,0.5)', fontSize: '13px', margin: 0 }}>
            Dashboard de Conteúdo
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#241A0D',
            borderRadius: '12px',
            border: '1px solid rgba(184,134,11,0.2)',
            padding: '32px',
          }}
        >
          {/* Usuário */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(184,134,11,0.7)', textTransform: 'uppercase',
              letterSpacing: '0.8px', marginBottom: '6px',
            }}>
              Usuário
            </label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="seu usuário"
              autoComplete="username"
              autoFocus
              required
              style={{
                width: '100%', padding: '11px 14px',
                borderRadius: '8px',
                border: `1px solid ${error ? 'rgba(198,40,40,0.5)' : 'rgba(184,134,11,0.25)'}`,
                background: 'rgba(255,255,255,0.05)',
                color: '#F5EDE0', fontSize: '14px', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#B8860B'}
              onBlur={e => e.target.style.borderColor = error ? 'rgba(198,40,40,0.5)' : 'rgba(184,134,11,0.25)'}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(184,134,11,0.7)', textTransform: 'uppercase',
              letterSpacing: '0.8px', marginBottom: '6px',
            }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                required
                style={{
                  width: '100%', padding: '11px 42px 11px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${error ? 'rgba(198,40,40,0.5)' : 'rgba(184,134,11,0.25)'}`,
                  background: 'rgba(255,255,255,0.05)',
                  color: '#F5EDE0', fontSize: '14px', fontFamily: 'inherit',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#B8860B'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(198,40,40,0.5)' : 'rgba(184,134,11,0.25)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(184,134,11,0.5)', padding: 0, display: 'flex',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(198,40,40,0.15)', border: '1px solid rgba(198,40,40,0.4)',
              borderRadius: '6px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#EF9A9A', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              borderRadius: '8px', border: 'none',
              background: loading ? 'rgba(184,134,11,0.5)' : '#B8860B',
              color: '#1A1209', fontWeight: 700, fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => !loading && (e.target.style.background = '#D4A017')}
            onMouseLeave={e => !loading && (e.target.style.background = '#B8860B')}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #1A1209', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Entrando...
              </>
            ) : (
              <><LogIn size={16} /> Entrar</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(184,134,11,0.25)', fontSize: '11px', marginTop: '24px' }}>
          Levena · ECDL · Pastry Club
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

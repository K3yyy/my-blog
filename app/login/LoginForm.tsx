'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from "@/lib/supabase/clients"

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/admin/set-article'

    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        })

        if (error) {
            setError('Invalid email or password')
            setLoading(false)
            return
        }

        router.replace(redirect)
        router.refresh()
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Orbitron:wght@500;700&display=swap');

        .login-root {
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(220,38,38,0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .login-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(220,38,38,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.4;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 48px 32px;
          background: rgba(15,15,15,0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(220,38,38,0.15);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.08);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .login-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .login-title {
              font-family: 'Orbitron', monospace;
              font-size: 3.5rem;
              font-weight: 700;
              color: #fff;                    /* kept as white (#fff) for maximum contrast on dark bg */
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 8px;
              text-shadow: 
                0 0 10px rgba(124, 58, 237, 0.6),   /* violet-600 glow */
                0 0 20px rgba(59, 130, 246, 0.4),   /* blue-500 secondary glow */
                0 0 40px rgba(124, 58, 237, 0.2);   /* softer violet halo */
}

        .login-subtitle {
          font-size: 1rem;
          color: #aaa;
          margin-bottom: 40px;
          letter-spacing: 1px;
        }

        .field-group {
          margin-bottom: 24px;
        }

        .field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #888;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          background: rgba(30,30,30,0.8);
          border: 1px solid #222;
          border-radius: 8px;
          color: #eee;
          font-family: 'Inter', monospace;
          font-size: 1rem;
          padding: 14px 16px;
          transition: all 0.3s ease;
        }

        .field-input:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.15);
          background: rgba(40,40,40,0.9);
        }

        .field-input::placeholder {
          color: #444;
        }

        .error-msg {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);  /* blue-600 to blue-500 */
  color: white;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

        .submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);  /* blue glow shadow */
}

       .submit-btn:disabled {
  background: #333;
  cursor: not-allowed;
}

        .submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}

.submit-btn:hover::before {
  left: 100%;
}

        .redirect-hint {
          margin-top: 32px;
          text-align: center;
          font-size: 0.75rem;
          color: #555;
          letter-spacing: 1px;
        }
      `}</style>

            <div className="login-root">
                <div className={`login-card ${mounted ? 'visible' : ''}`}>
                    <h1 className="login-title">Login</h1>
                    <p className="login-subtitle">If you're not Keyy, this page is not for you!!</p>

                    <form onSubmit={handleLogin}>
                        <div className="field-group">
                            <label className="field-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="field-input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="admin@yourdomain.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="field-input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="error-msg">
                                ⚠ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Login →'}
                        </button>
                    </form>

                    <div className="redirect-hint">
                        Redirecting to: {redirect}
                        <div>
                            contact to,  <a className="text-purple-500" href="https://www.instagram.com/k3y_yy/"> K3y_yy</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
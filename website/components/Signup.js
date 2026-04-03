import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kiwo.onrender.com'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setMessage('Please fill in all fields')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('kiwo_token', data.token)
        localStorage.setItem('kiwo_user', JSON.stringify(data.user))
        setMessage('Account created! Redirecting...')
        setTimeout(() => window.location.href = '/dashboard', 800)
      } else {
        setMessage(data.error?.message || 'Signup failed. Please try again.')
        setLoading(false)
      }
    } catch {
      setMessage('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9F9F9' }}>
      {/* Header mini */}
      <div style={{ padding: '24px 32px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, background: '#000', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>✦</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#000', letterSpacing: '-0.2px' }}>Kiwo</span>
          </div>
        </Link>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card fade-up" style={{ width: '100%', maxWidth: 420, padding: 40, border: '1px solid #E5E7EB', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#000', marginBottom: 8, letterSpacing: '-0.8px', textAlign: 'center' }}>
            Get started
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 32 }}>
            Create your AI memory layer account
          </p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="input"
                style={{ padding: '12px 16px', fontSize: 15 }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
                style={{ padding: '12px 16px', fontSize: 15 }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  className="input"
                  style={{ padding: '12px 16px', fontSize: 15, paddingRight: 50 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#9CA3AF', cursor: 'pointer',
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {message && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 24, fontWeight: 500,
                background: '#F3F4F6', color: '#000', border: '1px solid #E5E7EB'
              }}>
                {message.includes('successful') || message.includes('Redirecting') ? '✓ ' : '⚠ '} {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password || !name}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 15, marginBottom: 24 }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

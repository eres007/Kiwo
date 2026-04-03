import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kiwo.onrender.com'

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setMessage('Invalid or missing reset token')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const data = await res.json()
      if (res.ok) {
        setIsSuccess(true)
        setMessage('Password reset successfully! Redirecting to login...')
        setTimeout(() => window.location.href = '/login', 2000)
      } else {
        setMessage(data.error?.message || 'Failed to reset password.')
      }
    } catch {
      setMessage('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token && router.isReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F9F9', padding: 24 }}>
        <div className="card" style={{ maxWidth: 400, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Invalid Link</h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn-primary" style={{ textDecoration: 'none', display: 'block' }}>
            Request new link
          </Link>
        </div>
      </div>
    )
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
            New Password
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 32 }}>
            Set a new secure password for your account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
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

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="input"
                style={{ padding: '12px 16px', fontSize: 15 }}
              />
            </div>

            {message && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 24, fontWeight: 500,
                background: isSuccess ? '#F0FDF4' : '#F3F4F6', 
                color: isSuccess ? '#15803D' : '#000', 
                border: `1px solid ${isSuccess ? '#BBF7D0' : '#E5E7EB'}`
              }}>
                {isSuccess ? '✓ ' : '⚠ '} {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword || isSuccess}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 15, marginBottom: 24 }}
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

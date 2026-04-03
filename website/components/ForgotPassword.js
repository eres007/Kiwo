import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kiwo.onrender.com'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    
    if (!email || !newPassword) {
      setMessage('Please fill in all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password-direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setIsSuccess(true)
        setMessage('Password reset successfully! You can now sign in.')
        setTimeout(() => window.location.href = '/login', 2000)
      } else {
        setMessage(data.error?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setMessage('Connection error. Please try again.')
    } finally {
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
            Reset Password
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 32 }}>
            Set a new password for your account directly
          </p>

          <form onSubmit={handleReset}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Your Email
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

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                Confirm New Password
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
              disabled={loading || !email || !newPassword || isSuccess}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 15, marginBottom: 24 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
            Remembered your password?{' '}
            <Link href="/login" style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

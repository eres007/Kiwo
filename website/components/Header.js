import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    
    // Check for user session
    const storedUser = localStorage.getItem('kiwo_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {}
    }

    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = user ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ] : [
    { label: 'Product', href: '#product' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(245,243,240,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid transparent',
      transition: 'all 0.25s ease',
    }}>
      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
              <div style={{
                width: 28, height: 28,
                background: '#1A1A1A',
                borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: '#fff',
              }}>✦</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.3px' }}>Kiwo</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desk-nav">
            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href} style={{
                color: '#6B7280', textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = '#1A1A1A'}
                onMouseLeave={e => e.target.style.color = '#6B7280'}
              >{label}</Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desk-nav">
            {!user ? (
              <>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Sign In</button>
                </Link>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: 13 }}
                  >
                    Get started →
                  </button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', background: '#000', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 
                }}>
                  {user.name?.[0].toUpperCase()}
                </div>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mob-btn"
            style={{
              background: 'none', border: '1.5px solid #E5E7EB',
              borderRadius: 8, padding: '6px 10px',
              cursor: 'pointer', color: '#1A1A1A',
            }}
          >
            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ paddingBottom: 16, paddingTop: 12, borderTop: '1px solid #E5E7EB' }}>
            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)} style={{
                display: 'block', padding: '10px 0',
                color: '#6B7280', textDecoration: 'none', fontSize: 15, fontWeight: 500,
              }}>{label}</Link>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {!user ? (
                <>
                  <Link href="/login" style={{ flex: 1, textDecoration: 'none' }}>
                    <button className="btn-ghost" style={{ width: '100%' }}>Sign In</button>
                  </Link>
                  <Link href="/signup" style={{ flex: 1, textDecoration: 'none' }}>
                    <button className="btn-primary" style={{ width: '100%' }}>Get Started</button>
                  </Link>
                </>
              ) : (
                <button 
                  className="btn-ghost" 
                  style={{ width: '100%', color: '#EF4444' }}
                  onClick={() => {
                    localStorage.removeItem('kiwo_token');
                    localStorage.removeItem('kiwo_user');
                    window.location.href = '/login';
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 720px) { .desk-nav { display: none !important; } }
        @media (min-width: 721px) { .mob-btn { display: none !important; } }
      `}</style>
    </header>
  )
}

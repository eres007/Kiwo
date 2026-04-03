import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kiwo.onrender.com'

function PatternGrid() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 4v20M4 14h20' stroke='%23000000' stroke-width='1.2' stroke-linecap='round' opacity='0.08'/%3E%3C/svg%3E")`,
      backgroundSize: '28px 28px',
      borderRadius: 'inherit',
    }} />
  )
}

export default function Hero() {
  return (
    <section style={{ minHeight: 'calc(100vh - 60px)', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="hero-grid">

      {/* ── Left panel ───────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '72px 0 72px 64px',
        maxWidth: 640, position: 'relative', zIndex: 10
      }} className="hero-left">

        {/* Decorative Context Stream (Fills the left space) */}
        <div style={{
          position: 'absolute', left: -40, top: '10%', bottom: '10%', width: 1, 
          background: 'linear-gradient(to bottom, transparent, #E5E7EB, transparent)',
          opacity: 0.5
        }} />
        
        <div className="desk-only" style={{
          position: 'absolute', left: -140, top: '20%', display: 'flex', flexDirection: 'column', gap: 24,
          opacity: 0.2, pointerEvents: 'none', userSelect: 'none'
        }}>
          {['architecture.md', 'auth_fix.js', 'db_schema.sql', 'rules.json'].map((file, i) => (
            <div key={file} style={{ 
              fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#000',
              transform: `translateX(${i * 8}px)`, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ color: '#6B7280' }}>↳</span> {file}
            </div>
          ))}
        </div>

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
          <div style={{
            width: 22, height: 22,
            background: '#000', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: '#fff',
          }}>✦</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#000', letterSpacing: '-0.2px' }}>Kiwo</span>
        </div>

        {/* Headline */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: '#F3F4F6', color: '#1A1A1A', fontSize: 13, fontWeight: 700, borderRadius: 100, marginBottom: 20, letterSpacing: '0.5px' }}>
            YOUR AI IS ONLY AS GOOD AS ITS CONTEXT
          </div>
          <h1 style={{
            fontSize: 'clamp(42px, 5vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            color: '#000',
          }}>
            Stop prompting <br />
            from scratch <br />
            <span style={{ color: '#000', opacity: 0.3 }}>every single time.</span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="fade-up delay-1" style={{
          fontSize: 16, color: '#6B7280', lineHeight: 1.7, maxWidth: 480, marginBottom: 36,
        }}>
          A shared persistent memory layer for all your favorite LLMs. Move seamlessly between Claude, Cursor, and Gemini without ever replicating context.
        </p>

        {/* CTA row */}
        <div className="fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <Link href="/signup" className="btn-primary" style={{ borderRadius: 100, padding: '14px 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Get started →
          </Link>
          <Link href="/login" style={{ fontSize: 16, fontWeight: 600, color: '#6B7280', textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#000'}
            onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* ── Right panel (pattern + floating cards) ── */}
      <div style={{
        position: 'relative',
        background: '#F9F9F9',
        overflow: 'hidden',
        minHeight: 520,
        borderLeft: '1px solid #E5E7EB',
      }} className="hero-right">
        <PatternGrid />

        {/* Floating memory card */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          background: '#fff',
          borderRadius: 16, padding: '24px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
          width: 310,
          border: '1px solid #E5E7EB',
          zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#000', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Memory Layer</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000', background: '#F3F4F6', padding: '4px 8px', borderRadius: 100 }}>✓ Synced</span>
          </div>
          {[
            { emoji: '🏗️', label: 'Architecture', text: 'Next.js, no Tailwind' },
            { emoji: '💡', label: 'The "Why"', text: 'Optimize for rendering speed' },
            { emoji: '🐛', label: 'Found Bugs', text: 'Auth edge-case fixed yesterday' },
          ].map(({ emoji, label, text }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px', borderRadius: 10,
              background: '#F9F9F9',
              border: '1px solid #E5E7EB',
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }}>{emoji}</span>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Response bubble */}
        <div style={{
          position: 'absolute', bottom: '22%', right: '12%',
          background: '#000',
          borderRadius: 16, padding: '16px 20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
          maxWidth: 240,
          zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <img src="/images/claude-color.png" style={{ height: 16, filter: 'grayscale(100%) brightness(2)' }} alt="" />
            <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>CLAUDE</span>
          </div>
          <span style={{ fontSize: 14, color: '#fff', fontWeight: 500, lineHeight: 1.5 }}>
            I remember our architecture rules and the authentication bug fix from yesterday. Generating code...
          </span>
        </div>

      </div>

      <style>{`
        .hero-grid { grid-template-columns: 1.1fr 0.9fr; }
        .hero-left { padding-left: 180px; }
        @media (max-width: 1200px) {
          .hero-left { padding-left: 100px; }
        }
        @media (max-width: 1024px) {
          .hero-left { padding-left: 64px; }
          .desk-only { display: none; }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-right { min-height: 400px; order: -1; }
          .hero-left { padding: 48px 24px; max-width: 100%; margin: 0; }
        }
      `}</style>
    </section>
  )
}

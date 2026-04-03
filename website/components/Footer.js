export default function Footer() {
  return (
    <footer style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '80px 24px 40px' }}>
      <div className="section" style={{ padding: 0 }}>
        
        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 80 }}>
          
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 24, height: 24, background: '#1A1A1A', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff',
              }}>✦</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.2px' }}>Kiwo</span>
            </div>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
              Your AI should remember what matters. One clean memory layer for all your developer tools.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="#product" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Features</a>
              <a href="#pricing" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Pricing</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Security</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Changelog</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="https://github.com/eres007/Kiwo" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>GitHub</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Documentation</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Help Center</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          paddingTop: 32, borderTop: '1px solid #E5E7EB',
        }}>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>
            © {new Date().getFullYear()} Kiwo. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#9CA3AF' }}>Twitter</a>
            <a href="https://github.com/eres007/Kiwo" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF' }}>GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

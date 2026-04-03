const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    desc: 'Perfect for personal projects',
    cta: 'Start Free',
    features: ['Up to 100 memories', '1 AI tool integration', 'Basic search', 'Community support'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    desc: 'For power users & indie devs',
    cta: 'Start Trial',
    features: ['Unlimited memories', '5 AI tool integrations', 'Semantic matching', 'Priority support', 'Advanced analytics', 'Export & backup'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For teams & organizations',
    cta: 'Contact Sales',
    features: ['Everything in Pro', 'Unlimited integrations', 'SSO & SAML', 'Dedicated support', 'Custom deployment', 'SLA guarantee'],
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '120px 24px', position: 'relative' }}>
      <div className="divider" style={{ marginBottom: 100, maxWidth: 1160, margin: '0 auto' }} />

      <div className="section">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }} className="fade-up">
          <div className="badge" style={{ marginBottom: 24, display: 'inline-flex', background: '#F3F4F6', color: '#000', border: '1px solid #E5E7EB' }}>
            Pricing
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#000', marginBottom: 16 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 440, margin: '0 auto' }}>
            No hidden fees. Cancel anytime. Always flexible to scale with you.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map(({ name, price, period, desc, cta, features, popular }, i) => (
            <div
              key={name}
              className="card fade-up"
              style={{
                padding: popular ? 36 : 32,
                transform: popular ? 'scale(1.02)' : 'scale(1)',
                position: 'relative',
                border: popular ? '2px solid #000' : '1px solid #E5E7EB',
                boxShadow: popular ? '0 12px 40px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                animationDelay: `${i * 0.15}s`,
                zIndex: popular ? 2 : 1,
              }}
            >
              {popular && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 14px', borderRadius: 100,
                  background: '#000', color: '#fff',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 6 }}>
                  {name}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, color: '#000', letterSpacing: '-2px', lineHeight: 1 }}>
                    {price}
                  </span>
                  {period && <span style={{ fontSize: 15, color: '#6B7280', paddingBottom: 6 }}>{period}</span>}
                </div>
                <p style={{ fontSize: 14, color: '#6B7280' }}>{desc}</p>
              </div>

              <button
                className={popular ? 'btn-primary' : 'btn-ghost'}
                style={{ width: '100%', marginBottom: 32, padding: '12px', fontSize: 15 }}
              >
                {cta}
              </button>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 24 }}>
                {features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: popular ? '#000' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: popular ? '#fff' : '#6B7280', flexShrink: 0,
                    }}>✓</div>
                    <span style={{ fontSize: 14, color: '#4B5563', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 48, fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
          All plans include a 14-day free trial · No credit card required
        </p>
      </div>
    </section>
  )
}

export default function Features() {
  const logos = [
    { src: '/images/openai.png', alt: 'OpenAI' },
    { src: '/images/claude-color.png', alt: 'Claude' },
    { src: '/images/copilot-color.png', alt: 'Copilot' },
    { src: '/images/gemini-color.png', alt: 'Gemini' },
    { src: '/images/perplexity-color.png', alt: 'Perplexity' },
    { src: '/images/anthropic.png', alt: 'Anthropic' },
  ];

  return (
    <div style={{ background: '#fff' }}>
      
      {/* ── Logo Banner ── */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <div className="section" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#000', marginBottom: 32, letterSpacing: '2px', textTransform: 'uppercase' }}>
            A shared persistent memory layer for your favorite LLMs
          </p>
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            gap: 'clamp(32px, 6vw, 64px)', flexWrap: 'wrap' 
          }}>
            {logos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: 32,
                  objectFit: 'contain',
                  filter: 'grayscale(100%) contrast(1.2) opacity(0.4)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.filter = 'grayscale(100%) contrast(1.2) opacity(0.9)'}
                onMouseLeave={e => e.currentTarget.style.filter = 'grayscale(100%) contrast(1.2) opacity(0.4)'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Features Area ── */}
      <section id="product" style={{ padding: '140px 24px', background: '#F9F9F9' }}>
        <div className="section">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, '@media (min-width: 900px)': { gridTemplateColumns: 'minmax(300px, 400px) 1fr' } }}>
            
            {/* Header Content */}
            <div className="fade-up" style={{ alignSelf: 'start', position: 'sticky', top: 100 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ display: 'block', width: 40, borderTop: '2px solid #000' }}></span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#000', letterSpacing: '1px', textTransform: 'uppercase' }}>THE KIWO PHILOSOPHY</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(36px, 4vw, 56px)',
                fontWeight: 900,
                letterSpacing: '-2px',
                lineHeight: 1.05,
                color: '#000',
                marginBottom: 24,
              }}>
                Agents get smarter<br />
                every single day.
              </h2>
              <p style={{ fontSize: 17, color: '#1A1A1A', fontWeight: 500, lineHeight: 1.7, marginBottom: 12, maxWidth: 400 }}>
                Not because the foundation models improved, but because the context did.
              </p>
              <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.6, maxWidth: 400 }}>
                Most people open Claude and start prompting from scratch every single time. They lose everything from the last session: the architecture they chose, and the bugs they already fixed.
              </p>
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              
              <div className="card fade-up delay-1" style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#000', marginBottom: 16, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  They know WHY you're building it
                </h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, flex: 1, marginBottom: 32 }}>
                  Your AI is only as good as what it knows about your project. Our system holds every decision and lesson learned, so Claude reads it all before writing a single line of code.
                </p>
                <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#000', textDecoration: 'none', width: 'fit-content', borderBottom: '1px solid #000', paddingBottom: 2 }}>
                  See how it works →
                </a>
              </div>

              <div className="card fade-up delay-2" style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                <img src="/images/mcp.png" alt="MCP Logo" style={{ position: 'absolute', top: 32, right: 32, height: 48, filter: 'grayscale(100%) opacity(0.05)' }} />
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#000', marginBottom: 16, letterSpacing: '-0.5px', lineHeight: 1.2, position: 'relative', zIndex: 1 }}>
                  Native file synchronization
                </h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, flex: 1, marginBottom: 32, position: 'relative', zIndex: 1 }}>
                  No complex MCP configs. Kiwo automatically formats and writes your context directly into .cursorrules, CLAUDE.md, and copilot-instructions.md.
                </p>
                <a href="https://github.com/eres007/Kiwo#file-sync" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: '#000', textDecoration: 'none', width: 'fit-content', borderBottom: '1px solid #000', paddingBottom: 2, position: 'relative', zIndex: 1 }}>
                  View sync methodology →
                </a>
              </div>

              <div className="card fade-up delay-3" style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#000', marginBottom: 16, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  Stop the prompt repetition
                </h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, flex: 1, marginBottom: 32 }}>
                  Never paste the same instructions again. Your memory layer instantly synchronizes across connected apps, retaining constraints automatically.
                </p>
                <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#000', textDecoration: 'none', width: 'fit-content', borderBottom: '1px solid #000', paddingBottom: 2 }}>
                  Learn about sync →
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
      
      {/* ── Example Use Case (Stacked List) ── */}
      <section style={{ padding: '0 24px 100px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }} className="fade-up delay-4">
          
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#000', marginBottom: 12, lineHeight: 1.2 }}>
              Example use cases:<br/>
              Real-time memory sync
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 460, lineHeight: 1.6 }}>
              Swap these cards with your final sequences. Each use case links AI memories, automations, and team workflows together seamlessly.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div className="card" style={{ padding: '36px 40px', border: 'none', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <img src="/images/openai.png" style={{ height: 22, filter: 'grayscale(100%) contrast(2)' }} alt="OpenAI" />
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>→</span>
                <img src="/images/claude-color.png" style={{ height: 22, filter: 'grayscale(100%) contrast(2)' }} alt="Claude" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
                Automatically update corporate knowledge
              </h3>
            </div>

            <div className="card" style={{ padding: '36px 40px', border: 'none', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <img src="/images/claude-color.png" style={{ height: 22, filter: 'grayscale(100%) contrast(2)' }} alt="Claude" />
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>→</span>
                <img src="/images/copilot-color.png" style={{ height: 22, filter: 'grayscale(100%) contrast(2)' }} alt="Copilot" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
                Update context across all your accounts
              </h3>
            </div>

            <div className="card" style={{ padding: '36px 40px', border: 'none', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 22, height: 22, background: '#1A1A1A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>→</span>
                <img src="/images/openai.png" style={{ height: 22, filter: 'grayscale(100%) contrast(2)' }} alt="OpenAI" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
                Connect non-AI dev apps
              </h3>
            </div>

            <div className="card" style={{ padding: '36px 40px', border: 'none', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, color: '#1A1A1A' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>→</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
                Collaborate with your team
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* ── Switching Providers Section ── */}
      <section style={{ padding: '80px 24px 100px', background: '#F9F9F9' }}>
        <div className="section fade-up" style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-1px', color: '#1A1A1A', marginBottom: 24 }}>
            Moving from one provider to another?
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 20 }}>
            Take your AI memories with you!
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li style={{ fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#9CA3AF' }}>→</span> No more AI memory loss when changing providers
            </li>
            <li style={{ fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#9CA3AF' }}>→</span> Continue where you've left the conversation
            </li>
            <li style={{ fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#9CA3AF' }}>→</span> Done with one click
            </li>
          </ul>
        </div>
      </section>

      {/* ── How to set it up ── */}
      <section style={{ padding: '120px 24px', background: '#fff' }}>
        <div className="section fade-up" style={{ textAlign: 'center', maxWidth: 960 }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1.5px', color: '#1A1A1A', marginBottom: 80 }}>
            How to set it up
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40, marginBottom: 80 }}>
            
            {/* Step 1 */}
            <div>
              <div style={{ fontSize: 84, fontWeight: 300, color: '#1A1A1A', lineHeight: 1, marginBottom: 16, letterSpacing: '-4px' }}>1</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.5px' }}>Run the sync</h3>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                Run the script or use our CLI. Kiwo automatically generates the correct context files for your IDE.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div style={{ fontSize: 84, fontWeight: 300, color: '#1A1A1A', lineHeight: 1, marginBottom: 16, letterSpacing: '-4px' }}>2</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.5px' }}>Create account</h3>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                Create your Kiwo Account for free to sync your AI memory natively.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div style={{ fontSize: 84, fontWeight: 300, color: '#1A1A1A', lineHeight: 1, marginBottom: 16, letterSpacing: '-4px' }}>3</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.5px' }}>Start using</h3>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                Your synchronized memory is ready! Query your AI.
              </p>
            </div>

          </div>

          <button className="btn-primary" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 100, fontWeight: 700 }} onClick={() => document.getElementById('hero-email')?.focus()}>
            Get started →
          </button>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .features-layout {
            display: grid;
            grid-template-columns: minmax(300px, 400px) 1fr;
            gap: 64px;
          }
        }
        @media (max-width: 899px) {
          .features-layout {
            display: flex;
            flex-direction: column;
            gap: 48px;
          }
        }
      `}</style>
    </div>
  )
}

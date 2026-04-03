import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [memories, setMemories] = useState([])
  const [loadingMemories, setLoadingMemories] = useState(true)
  
  // New memory form state
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('architecture')
  const [submitting, setSubmitting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('kiwo_user')
    const token = localStorage.getItem('kiwo_token')
    if (!storedUser || !token) {
      window.location.href = '/login'
      return
    }
    try {
      setUser(JSON.parse(storedUser))
      fetchMemories(token)
    } catch {
      window.location.href = '/login'
    }
    setLoading(false)
  }, [])

  const fetchMemories = async (token) => {
    setLoadingMemories(true)
    try {
      const res = await fetch(`${API_URL}/api/memory/list?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setMemories(data.memories || [])
      }
    } catch (e) {
      console.error('Failed to fetch memories', e)
    } finally {
      setLoadingMemories(false)
    }
  }

  const handleCapture = async (e) => {
    e.preventDefault()
    if (!newContent.trim()) return
    setSubmitting(true)
    const token = localStorage.getItem('kiwo_token')
    try {
      const res = await fetch(`${API_URL}/api/memory/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent, category: newCategory })
      })
      if (res.ok) {
        setNewContent('')
        fetchMemories(token) // Refresh feed
      } else {
        alert('Failed to save memory.')
      }
    } catch (error) {
      console.error(error)
      alert('Connection error.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this memory?')) return
    const token = localStorage.getItem('kiwo_token')
    try {
      const res = await fetch(`${API_URL}/api/memory/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setMemories(memories.filter((m) => m.id !== id))
      }
    } catch (e) {
      console.error('Failed to delete memory', e)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('kiwo_token')
    localStorage.removeItem('kiwo_user')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F9F9' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const categoryOptions = ['architecture', 'preferences', 'stack', 'tasks', 'decisions', 'other']

  return (
    <div style={{ minHeight: '100vh', background: '#F9F9F9' }}>
      
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#000', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
              ✦
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#000', letterSpacing: '-0.3px' }}>Kiwo Dashboard</span>
          </div>
          <button onClick={handleLogout} className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13, color: '#000' }}>
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="section" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 32, alignItems: 'start' }}>
        
        {/* Left Column: Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#000', letterSpacing: '-0.5px' }}>Memory Feed</h1>
            <div className="badge" style={{ background: '#fff', color: '#000', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span> Wait for Sync
            </div>
          </div>

          {loadingMemories ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>Loading memories...</div>
          ) : memories.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center', background: '#fff', border: '1px dashed #D1D5DB' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🧠</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000', marginBottom: 8 }}>No memories yet</h3>
              <p style={{ color: '#6B7280', maxWidth: 300, margin: '0 auto' }}>
                Capture your first memory using the form on the right, or by connecting your IDE.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {memories.map(memory => (
                <div key={memory.id} className="card fade-up" style={{ padding: 24, background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', background: '#F3F4F6', padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {memory.category}
                    </span>
                    <button 
                      onClick={() => handleDelete(memory.id)}
                      style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4, fontSize: 16 }}
                      title="Delete Memory"
                    >
                      ×
                    </button>
                  </div>
                  <p style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {memory.content}
                  </p>
                  <div style={{ marginTop: 16, fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span>✓ {new Date(memory.created_at).toLocaleDateString()}</span>
                    <span>Score: {memory.importance_score?.toFixed(2) || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Capture Box & Token */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 96 }}>
          
          {/* Capture Form */}
          <div className="card" style={{ padding: 24, background: '#fff' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#000', marginBottom: 16 }}>Capture Context</h3>
            <form onSubmit={handleCapture}>
              <textarea
                className="input"
                placeholder="E.g., We use Next.js for frontend and Express for backend. Always use early returns."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                style={{ width: '100%', minHeight: 120, padding: 12, marginBottom: 16, resize: 'vertical' }}
              />
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                <select
                  className="input"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px' }}
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary" disabled={submitting || !newContent.trim()} style={{ width: '100%', padding: 12, fontSize: 14 }}>
                {submitting ? 'Saving...' : 'Save Memory'}
              </button>
            </form>
          </div>

          {/* Token Box */}
          <div className="card" style={{ padding: 24, background: '#fff', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 8 }}>API Token</h3>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
              Use this token for CLI scripts or native integrations.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input 
                type="password" 
                readOnly 
                value={typeof window !== 'undefined' ? localStorage.getItem('kiwo_token') || '' : ''} 
                className="input" 
                style={{ fontSize: 13, fontFamily: 'monospace', flex: 1, padding: '8px 12px' }} 
              />
               <button 
                 className="btn-ghost" 
                 style={{ padding: '8px 12px', border: '1px solid #E5E7EB', background: '#F9F9F9', minWidth: 80 }}
                 onClick={() => {
                   navigator.clipboard.writeText(localStorage.getItem('kiwo_token') || '');
                   setCopySuccess(true);
                   setTimeout(() => setCopySuccess(false), 2000);
                 }}
               >
                 {copySuccess ? 'Copied!' : 'Copy'}
               </button>
            </div>
          </div>

        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          main.section {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

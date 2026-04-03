import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function ApiKeyManager() {
  const [keys, setKeys] = useState([])
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('kiwo_token')
      const res = await fetch(`${API_URL}/api/api-keys/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setKeys(data.keys || [])
      } else {
        setError(data.error?.message || 'Failed to load keys')
      }
    } catch (e) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!label) return
    
    setGenerating(true)
    setError('')
    try {
      const token = localStorage.getItem('kiwo_token')
      const res = await fetch(`${API_URL}/api/api-keys/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ label })
      })
      const data = await res.json()
      if (res.ok) {
        setNewKey(data.key)
        setLabel('')
        fetchKeys()
      } else {
        setError(data.error?.message || 'Failed to generate key')
      }
    } catch (e) {
      setError('Failed to generate key')
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async (id) => {
    if (!confirm('Are you sure you want to revoke this key? Any tools using it will stop working.')) return

    try {
      const token = localStorage.getItem('kiwo_token')
      const res = await fetch(`${API_URL}/api/api-keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        fetchKeys()
      }
    } catch (e) {
      setError('Failed to revoke key')
    }
  }

  return (
    <div className="card" style={{ padding: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>API Keys</h2>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
        Use these keys to integrate Kiwo with your IDE (VS Code, Cursor, etc.) via the <code>X-API-Key</code> header.
      </p>

      {error && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', color: '#B91C1C', borderRadius: 8, fontSize: 13, marginBottom: 24 }}>
          ⚠ {error}
        </div>
      )}

      {/* New Key Alert */}
      {newKey && (
        <div style={{ 
          padding: 20, background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, marginBottom: 24,
          animation: 'fade-in 0.3s ease-out'
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0369A1', marginBottom: 8 }}>✓ New API Key Generated</p>
          <p style={{ fontSize: 12, color: '#0369A1', marginBottom: 12 }}>
            Copy this key now. For your security, it will not be shown again.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input 
              readOnly 
              value={newKey} 
              style={{ flex: 1, padding: '8px 12px', background: '#fff', border: '1px solid #BAE6FD', borderRadius: 6, fontSize: 13, fontFamily: 'monospace' }} 
            />
            <button 
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => {
                navigator.clipboard.writeText(newKey);
                alert('Copied to clipboard!');
              }}
            >
              Copy
            </button>
            <button 
              className="btn-ghost" 
              style={{ fontSize: 13 }}
              onClick={() => setNewKey(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Generate Form */}
      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input
          placeholder="Key Label (e.g., VS Code Laptop)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14 }}
          required
        />
        <button 
          className="btn-primary" 
          type="submit" 
          disabled={generating}
          style={{ padding: '10px 20px', fontSize: 14, whiteSpace: 'nowrap' }}
        >
          {generating ? 'Generating...' : 'Create Key'}
        </button>
      </form>

      {/* Keys List */}
      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
        {loading ? (
          <p style={{ textAlign: 'center', py: 20, color: '#9CA3AF', fontSize: 14 }}>Loading keys...</p>
        ) : keys.length === 0 ? (
          <p style={{ textAlign: 'center', py: 20, color: '#9CA3AF', fontSize: 14 }}>No API keys yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {keys.map(key => (
              <div key={key.id} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '12px 16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #F3F4F6'
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{key.label}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    Used: {key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'} • 
                    Created: {new Date(key.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  onClick={() => handleRevoke(key.id)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 8 }}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import ApiKeyManager from '../components/ApiKeyManager'

export default function Settings() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('kiwo_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      window.location.href = '/login'
    }
  }, [])

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <Head>
        <title>Settings - Kiwo</title>
      </Head>

      <Header />

      <main style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>Settings</h1>
          <p style={{ color: '#6B7280' }}>Manage your account and API access.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Profile Section */}
          <section className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                {user.name?.[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</div>
                <div style={{ color: '#6B7280', fontSize: 14 }}>{user.email}</div>
              </div>
            </div>
          </section>

          {/* API Keys Section */}
          <ApiKeyManager />
          
          {/* Logout Section */}
          <section style={{ textAlign: 'center', marginTop: 16 }}>
            <button 
              onClick={() => {
                localStorage.removeItem('kiwo_token');
                localStorage.removeItem('kiwo_user');
                window.location.href = '/login';
              }}
              style={{ color: '#EF4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
            >
              Sign out from all devices
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}

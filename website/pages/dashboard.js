import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kiwo.onrender.com'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('kiwo_user')
    const token = localStorage.getItem('kiwo_token')

    if (!storedUser || !token) {
      window.location.href = '/login'
      return
    }

    try {
      setUser(JSON.parse(storedUser))
      setLoading(false)
    } catch (err) {
      setError('Failed to load user data')
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('kiwo_token')
    localStorage.removeItem('kiwo_user')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/login">
            <button className="bg-dark text-white px-6 py-3 rounded-lg">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark">Kiwo Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray mb-4">
            Email: {user?.email}
          </p>
          <p className="text-gray">
            Your Kiwo account is ready. You can now start capturing memories across all your AI tools.
          </p>
        </div>

        {/* Getting Started */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Setup IDE */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-dark mb-4">1. Setup Your IDE</h3>
            <p className="text-gray mb-4">
              Add Kiwo MCP server to your favorite IDE (Cursor, Claude Code, Windsurf, etc.)
            </p>
            <a
              href="https://github.com/eres007/Kiwo#ide-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View IDE Setup Guide →
            </a>
          </div>

          {/* Capture Memory */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-dark mb-4">2. Capture Memories</h3>
            <p className="text-gray mb-4">
              Tell your AI tools about your project, preferences, and decisions. Kiwo will remember them.
            </p>
            <p className="text-sm text-gray">
              Example: "Remember that we use Supabase for database"
            </p>
          </div>

          {/* Use Everywhere */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-dark mb-4">3. Use Everywhere</h3>
            <p className="text-gray mb-4">
              Switch between IDEs and AI tools. Your memories are available everywhere.
            </p>
            <p className="text-sm text-gray">
              All your AI tools will have the same context automatically.
            </p>
          </div>

          {/* API Access */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-dark mb-4">4. API Access</h3>
            <p className="text-gray mb-4">
              Use Kiwo API to build custom integrations.
            </p>
            <p className="text-sm text-gray font-mono">
              Token: {localStorage.getItem('kiwo_token')?.substring(0, 20)}...
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
          <h3 className="text-xl font-bold text-dark mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-dark">Memory Capture</p>
                <p className="text-sm text-gray">Automatically capture context from your AI tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-dark">AI Refinement</p>
                <p className="text-sm text-gray">AI refines raw memories into structured data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-dark">Cross-IDE Sync</p>
                <p className="text-sm text-gray">Memories sync across all your AI tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-dark">Secure Storage</p>
                <p className="text-sm text-gray">Your memories are encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl p-8 mt-8 border border-blue-200">
          <h3 className="text-xl font-bold text-dark mb-4">Next Steps</h3>
          <ol className="space-y-3 text-gray">
            <li>1. Choose your IDE (Cursor, Claude Code, Windsurf, etc.)</li>
            <li>2. Follow the IDE setup guide to add Kiwo MCP server</li>
            <li>3. Start capturing memories in your IDE</li>
            <li>4. Switch to another IDE and see your memories</li>
            <li>5. Enjoy seamless context across all your AI tools!</li>
          </ol>
        </div>
      </main>
    </div>
  )
}

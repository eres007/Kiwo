import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kiwo.onrender.com'

export default function Hero() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'TempPassword123!',
          name: email.split('@')[0]
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Account created successfully
        setMessage('✓ Account created! You can now log in with your email and password: TempPassword123!')
        setEmail('')
        // Store token for later use
        if (data.token) {
          localStorage.setItem('kiwo_token', data.token)
          localStorage.setItem('kiwo_user', JSON.stringify(data.user))
        }
      } else if (response.status === 409) {
        setMessage('Email already registered. Try signing in.')
      } else {
        setMessage(data.error?.message || 'Signup failed. Please try again.')
      }
    } catch (error) {
      setMessage('Connection error. Please try again.')
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-br from-cream via-white to-cream min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side */}
        <div className="space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-blue-600 text-xs sm:text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            AI memory assistant for every conversation
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark leading-tight">
            Your AI should<br />remember what<br />matters.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray leading-relaxed max-w-lg">
            Kiwo keeps your preferences, decisions, and context in one calm layer so every AI feels more personal, useful, and consistent across apps.
          </p>

          {/* Email Signup */}
          <form onSubmit={handleSignup} className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {loading ? 'Starting...' : 'Start Free'}
              </button>
            </div>
            {message && (
              <div className="space-y-2">
                <p className={`text-xs sm:text-sm ${message.includes('✓') ? 'text-green-600' : 'text-blue-600'}`}>
                  {message}
                </p>
                {message.includes('✓') && (
                  <Link href="/login">
                    <button className="text-xs sm:text-sm text-blue-600 hover:underline">
                      Go to login →
                    </button>
                  </Link>
                )}
              </div>
            )}
          </form>

          {/* Features */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">✦</span>
              <span className="text-xs sm:text-sm text-gray">Remembers tone and preferences</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">⚙</span>
              <span className="text-xs sm:text-sm text-gray">Works across your AI tools</span>
            </div>
          </div>
        </div>

        {/* Right Side - Memory Card */}
        <div className="relative mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 border border-gray-100">
            {/* Quote */}
            <div className="text-dark text-xs sm:text-sm leading-relaxed font-medium border-l-4 border-blue-500 pl-4">
              Remember that I prefer concise answers, vegetarian recipes, and Monday planning reviews.
            </div>

            {/* Memory Items */}
            <div className="space-y-4 sm:space-y-5">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-gray-200">
                <div className="text-xs font-semibold text-dark uppercase tracking-wide">Kiwo memory</div>
                <div className="text-xs bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full font-medium">✓ Synced</div>
              </div>

              {/* Item 1 */}
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="text-lg sm:text-xl flex-shrink-0">🍽️</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm text-dark">Food preference</div>
                  <div className="text-xs text-gray mt-1">Vegetarian recipes and lighter dinners</div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="text-lg sm:text-xl flex-shrink-0">📅</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm text-dark">Weekly ritual</div>
                  <div className="text-xs text-gray mt-1">Context review this week</div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="pt-4 sm:pt-5 border-t border-gray-200 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray font-medium">Saved to your</div>
                  <div className="text-xs text-gray">memory layer.</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl sm:text-4xl font-bold text-dark">84%</div>
                  <div className="text-xs text-gray mt-1">Accuracy</div>
                </div>
              </div>

              {/* Progress Circles */}
              <div className="flex gap-1.5 sm:gap-2 justify-end pt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all ${
                      i < 4 
                        ? 'w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-b from-gray-400 to-gray-500' 
                        : 'w-5 h-5 sm:w-6 sm:h-6 bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

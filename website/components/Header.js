import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl font-bold text-dark">✦</div>
            <span className="text-xl font-bold text-dark hidden sm:inline">Kiwo</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#product" className="text-gray hover:text-dark transition text-sm">Product</a>
            <a href="#pricing" className="text-gray hover:text-dark transition text-sm">Pricing</a>
            <a href="#faq" className="text-gray hover:text-dark transition text-sm">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-3 items-center">
            <button className="text-dark px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition text-sm">
              Sign In
            </button>
            <button className="bg-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="#product" className="block text-gray hover:text-dark transition text-sm py-2">Product</a>
            <a href="#pricing" className="block text-gray hover:text-dark transition text-sm py-2">Pricing</a>
            <a href="#faq" className="block text-gray hover:text-dark transition text-sm py-2">FAQ</a>
            <div className="flex gap-2 pt-4">
              <button className="flex-1 text-dark px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition text-sm">
                Sign In
              </button>
              <button className="flex-1 bg-dark text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

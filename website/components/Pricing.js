export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-sm sm:text-base text-gray max-w-2xl mx-auto">
            Choose the plan that works best for you. Always flexible to scale.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Starter */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-dark hover:shadow-lg transition">
            <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">Starter</h3>
            <p className="text-gray text-sm mb-6">Perfect for individuals</p>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-dark">$0</span>
              <span className="text-gray text-sm">/month</span>
            </div>
            <button className="w-full bg-dark text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition mb-8 text-sm">
              Get Started
            </button>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">Up to 100 memories</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">1 AI tool integration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">Basic support</span>
              </li>
            </ul>
          </div>

          {/* Pro - Featured */}
          <div className="bg-dark text-white rounded-2xl p-6 sm:p-8 border-2 border-dark transform md:scale-105 hover:scale-105 transition shadow-xl">
            <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
              MOST POPULAR
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Pro</h3>
            <p className="text-gray-300 text-sm mb-6">For power users</p>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-bold">$29</span>
              <span className="text-gray-300 text-sm">/month</span>
            </div>
            <button className="w-full bg-white text-dark py-3 rounded-lg font-medium hover:bg-gray-100 transition mb-8 text-sm">
              Start Free Trial
            </button>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Unlimited memories</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>5 AI tool integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Advanced analytics</span>
              </li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-dark hover:shadow-lg transition">
            <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">Enterprise</h3>
            <p className="text-gray text-sm mb-6">For teams & organizations</p>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-dark">Custom</span>
            </div>
            <button className="w-full bg-dark text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition mb-8 text-sm">
              Contact Sales
            </button>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">Unlimited integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray">Custom integrations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

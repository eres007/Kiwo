export default function Features() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="text-sm sm:text-base text-gray mb-4">
            Droova synchronizes your AI memories across all your apps.
          </p>
          <div className="flex justify-center gap-4 sm:gap-6">
            <span className="text-2xl sm:text-3xl">🧠</span>
            <span className="text-2xl sm:text-3xl">💎</span>
            <span className="text-2xl sm:text-3xl">🌟</span>
            <span className="text-2xl sm:text-3xl">⚡</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-cream rounded-2xl p-6 sm:p-8 lg:p-12">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4 text-center">
            Solving memory lock-in<br className="hidden sm:block" />
            once and for all
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            Different AI vendors locking away your AI memory saps the experience. Take back control with Droova.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 hover:shadow-lg transition">
              <h3 className="text-lg sm:text-xl font-bold text-dark mb-4">
                Real-time<br />memory<br />synchronization
              </h3>
              <p className="text-xs sm:text-sm text-gray leading-relaxed mb-6">
                We all use different AI tools for different tasks. Providing context and memories across all of them makes everything more efficient and effective.
              </p>
              <a href="#" className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 transition">
                See use cases →
              </a>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 hover:shadow-lg transition">
              <h3 className="text-lg sm:text-xl font-bold text-dark mb-4">
                Easy memory<br />migration
              </h3>
              <p className="text-xs sm:text-sm text-gray leading-relaxed mb-6">
                Gone are the days when you need to leave behind all the context and memories when changing your AI tool.
              </p>
              <a href="#" className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 transition">
                How to migrate memories →
              </a>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 hover:shadow-lg transition">
              <h3 className="text-lg sm:text-xl font-bold text-dark mb-4">
                No API or<br />automation<br />tool needed
              </h3>
              <p className="text-xs sm:text-sm text-gray leading-relaxed mb-6">
                Droova is completely Plug-in powered and does not require any complex setup or offer third party connectors.
              </p>
              <a href="#" className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 transition">
                How it works →
              </a>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="border-t border-gray-200 pt-12 sm:pt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">
              Example use cases:
            </h3>
            <p className="text-sm sm:text-base text-dark font-semibold mb-6">
              Real-time memory sync
            </p>
            <p className="text-xs sm:text-sm text-gray mb-8 max-w-2xl">
              Read these cards with your final memories. Each use case links AI memories, automations, and team workflows.
            </p>

            {/* Use Case Cards */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              <div className="flex-shrink-0 w-32 sm:w-40 h-24 sm:h-28 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <span className="text-2xl sm:text-3xl">🧠</span>
              </div>
              <div className="flex-shrink-0 w-32 sm:w-40 h-24 sm:h-28 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <span className="text-2xl sm:text-3xl">➕</span>
              </div>
              <div className="flex-shrink-0 w-32 sm:w-40 h-24 sm:h-28 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <span className="text-2xl sm:text-3xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

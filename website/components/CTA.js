export default function CTA() {
  return (
    <section className="bg-dark text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          Ready to remember what matters?
        </h2>
        <p className="text-sm sm:text-base text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Join thousands of developers who are already using Kiwo to keep their AI assistants in sync.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-dark px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-sm sm:text-base">
            Start Free
          </button>
          <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition text-sm sm:text-base">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  )
}

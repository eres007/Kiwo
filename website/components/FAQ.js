import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'How does Kiwo work?',
      answer: 'Kiwo captures your preferences, decisions, and context from conversations and stores them in a secure memory layer. This information is then synchronized across all your AI tools, making each interaction more personalized and consistent.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade encryption (AES-256) to protect your data at rest and in transit. All data is stored securely in Supabase with row-level security policies.'
    },
    {
      question: 'Which AI tools does Kiwo support?',
      answer: 'Kiwo works with Cursor, Claude, ChatGPT, GitHub Copilot, and more. We continuously add support for new AI tools and platforms.'
    },
    {
      question: 'Can I export my memories?',
      answer: 'Absolutely! You can export all your memories at any time in JSON format. Your data is always yours to keep.'
    },
    {
      question: 'What happens if I delete my account?',
      answer: 'You can request complete data deletion at any time. All your memories and personal information will be permanently removed from our servers within 30 days.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! The Starter plan is completely free. For Pro features, we offer a 14-day free trial with no credit card required.'
    }
  ]

  return (
    <section className="bg-cream py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray">
            Everything you need to know about Kiwo
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-dark transition"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <h3 className="text-sm sm:text-base font-semibold text-dark text-left">
                  {faq.question}
                </h3>
                <span className={`text-xl text-dark transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs sm:text-sm text-gray leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

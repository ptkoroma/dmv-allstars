'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // Simulate send (replace with actual email service integration)
    await new Promise(r => setTimeout(r, 1000))
    setStatus('sent')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Contact <span className="text-orange-500">Us</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a question or want to join? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Reach Out</h2>
            <div className="space-y-6">
              {[
                { icon: '📍', label: 'Address', value: 'Washington, DC Metro Area' },
                { icon: '📧', label: 'Email', value: 'info@dmvallstarsfc.com' },
                { icon: '📞', label: 'Phone', value: '+1 (202) 555-0100' },
                { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri: 9am – 6pm' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                    {icon}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-white font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <h3 className="text-white font-bold mb-2">Tryouts & Registration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Interested in joining the team? Head to our{' '}
                <a href="/register" className="text-orange-500 hover:underline">registration page</a>{' '}
                to sign up or contact us for tryout schedules.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-8">
            {status === 'sent' ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-white font-bold text-lg mb-2">Send a Message</h3>
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option>Player Registration</option>
                    <option>Tryout Information</option>
                    <option>Sponsorship</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    required
                    rows={5}
                    className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded transition-colors"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

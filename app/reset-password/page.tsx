'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter.'); return }
    if (!/[0-9]/.test(password)) { setError('Password must contain at least one number.'); return }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?]/.test(password)) { setError('Password must contain at least one special character.'); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 pt-16">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center bg-orange-500/10">
              <span className="text-orange-500 font-black text-lg">DMV</span>
            </div>
            <div className="text-white font-black text-xl">DMV ALL STARS FC</div>
          </Link>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8">
          {done ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-black text-white mb-2">Password Updated!</h2>
              <p className="text-gray-400 text-sm">Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-1">Set New Password</h1>
              <p className="text-gray-400 text-sm mb-8">Choose a strong password for your account.</p>

              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { value: password, setter: setPassword, show: showPassword, toggle: setShowPassword, label: 'New Password' },
                  { value: confirm, setter: setConfirm, show: showPassword, toggle: setShowPassword, label: 'Confirm Password' },
                ].map(({ value, setter, show, toggle, label }) => (
                  <div key={label}>
                    <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                    <div className="relative">
                      <input type={show ? 'text' : 'password'} value={value} onChange={e => setter(e.target.value)} placeholder="••••••••" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 pr-11 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                      <button type="button" onClick={() => toggle(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        <EyeIcon show={show} />
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-600">8+ chars · uppercase · number · special character</p>
                <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded-lg transition-colors">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

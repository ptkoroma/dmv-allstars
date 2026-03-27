'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('loading')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setStatus('idle')
    } else {
      setStatus('sent')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/5 rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-orange-500/5 rounded-full" />
      </div>

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
          {status === 'sent' ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-black text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-6">
                We sent a password reset link to <span className="text-white font-semibold">{email}</span>. Check your inbox and click the link to reset your password.
              </p>
              <Link href="/login" className="text-orange-500 hover:text-orange-400 text-sm font-semibold">Back to Login</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-1">Reset Password</h1>
              <p className="text-gray-400 text-sm mb-8">Enter your email and we'll send you a reset link.</p>

              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded-lg transition-colors">
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                <Link href="/login" className="text-orange-500 hover:text-orange-400 font-semibold">Back to Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

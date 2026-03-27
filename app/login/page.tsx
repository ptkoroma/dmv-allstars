'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { createClient } from '@/lib/supabase/client'

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!captchaToken) { setError('Please complete the CAPTCHA.'); return }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    })

    if (error) {
      setError(error.message)
      captchaRef.current?.resetCaptcha()
      setCaptchaToken('')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
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
          <h1 className="text-2xl font-black text-white mb-1">Welcome Back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to access your player dashboard.</p>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-sm">Password</label>
                <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 pr-11 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <HCaptcha ref={captchaRef} sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!} onVerify={token => setCaptchaToken(token)} onExpire={() => setCaptchaToken('')} theme="dark" />
            </div>

            <button type="submit" disabled={loading || !captchaToken} className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider rounded-lg transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Not registered yet?{' '}
            <Link href="/register" className="text-orange-500 hover:text-orange-400 font-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

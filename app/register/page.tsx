'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { createClient } from '@/lib/supabase/client'

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
const ageGroups = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18', 'Adult']
const PHONE_RE = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/\\`~]/.test(pw)) score++
  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: '#ef4444' },
    { score: 2, label: 'Weak', color: '#f97316' },
    { score: 3, label: 'Fair', color: '#eab308' },
    { score: 4, label: 'Strong', color: '#22c55e' },
    { score: 5, label: 'Very Strong', color: '#16a34a' },
  ]
  return levels[Math.min(score, 5)]
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '',
    dateOfBirth: '', phone: '', position: '', ageGroup: '',
    experience: '', parentName: '', parentPhone: '', emergencyContact: '',
  })

  const router = useRouter()
  const supabase = createClient()
  const strength = getPasswordStrength(form.password)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
      if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
      if (!/[A-Z]/.test(form.password)) { setError('Password must contain at least one uppercase letter.'); return }
      if (!/[0-9]/.test(form.password)) { setError('Password must contain at least one number.'); return }
      if (!/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?]/.test(form.password)) { setError('Password must contain at least one special character.'); return }
      setStep(2)
      return
    }

    if (form.phone && !PHONE_RE.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number.'); return
    }
    if (form.parentPhone && !PHONE_RE.test(form.parentPhone.replace(/\s/g, ''))) {
      setError('Please enter a valid parent/guardian phone number.'); return
    }
    if (!agreedToTerms) { setError('Please accept the Terms of Service and Privacy Policy.'); return }
    if (!captchaToken) { setError('Please complete the CAPTCHA.'); return }

    setLoading(true)

    // Create auth user — Supabase trigger auto-creates the profile row
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        captchaToken,
        data: { first_name: form.firstName, last_name: form.lastName },
      },
    })

    if (authError || !authData.user) {
      setError(authError?.message ?? 'Registration failed. Please try again.')
      captchaRef.current?.resetCaptcha()
      setCaptchaToken('')
      setLoading(false)
      return
    }

    // Update the trigger-created profile row with full player details
    const { error: profileError } = await supabase.from('profiles').update({
      first_name: form.firstName,
      last_name: form.lastName,
      date_of_birth: form.dateOfBirth || null,
      phone: form.phone || null,
      position: form.position || null,
      age_group: form.ageGroup || null,
      experience_years: parseInt(form.experience) || 0,
      parent_name: form.parentName || null,
      parent_phone: form.parentPhone || null,
      emergency_contact: form.emergencyContact || null,
    }).eq('id', authData.user.id)

    if (profileError) {
      // Profile will still exist (created by trigger) — user can fill details later in dashboard
      console.error('Profile update error:', profileError.message)
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 pt-16 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/5 rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-orange-500/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center bg-orange-500/10">
              <span className="text-orange-500 font-black text-lg">DMV</span>
            </div>
            <div className="text-white font-black text-xl">DMV ALL STARS FC</div>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Player Registration</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step >= s ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-500'}`}>{s}</div>
              <div className={`text-xs font-semibold ${step >= s ? 'text-white' : 'text-gray-500'}`}>{s === 1 ? 'Account' : 'Player Info'}</div>
              {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <h2 className="text-xl font-black text-white mb-1">Create Your Account</h2>
                <p className="text-gray-400 text-sm mb-6">Start with your login credentials.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ name: 'firstName', label: 'First Name', placeholder: 'John' }, { name: 'lastName', label: 'Last Name', placeholder: 'Doe' }].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                      <input type="text" name={name} value={form[name as keyof typeof form]} onChange={handleChange} placeholder={placeholder} required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 pr-11 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                  {/* Strength meter */}
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)' }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Must be 8+ chars with uppercase, number, and special character</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 pr-11 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      <EyeIcon show={showConfirm} />
                    </button>
                  </div>
                  {form.confirmPassword.length > 0 && (
                    <p className={`text-xs mt-1 ${form.password === form.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                      {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors mt-2">
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-black text-white mb-1">Player Information</h2>
                <p className="text-gray-400 text-sm mb-6">Tell us about your soccer experience.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (202) 555-0100" pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Position</label>
                    <select name="position" value={form.position} onChange={handleChange} required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm">
                      <option value="">Select position</option>
                      {positions.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Age Group</label>
                    <select name="ageGroup" value={form.ageGroup} onChange={handleChange} required className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm">
                      <option value="">Select age group</option>
                      {ageGroups.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Years of Experience</label>
                  <input type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 3" min="0" max="30" className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Parent / Guardian (required if under 18)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{ name: 'parentName', label: 'Parent/Guardian Name', placeholder: 'Full name', type: 'text' }, { name: 'parentPhone', label: 'Parent/Guardian Phone', placeholder: '+1 (202) 555-0101', type: 'tel' }].map(({ name, label, placeholder, type }) => (
                      <div key={name}>
                        <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                        <input type={type} name={name} value={form[name as keyof typeof form]} onChange={handleChange} placeholder={placeholder} className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-400 text-sm mb-1.5">Emergency Contact</label>
                    <input type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Name and phone number" className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer flex-shrink-0" />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-orange-500 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" target="_blank" className="text-orange-500 hover:underline">Privacy Policy</Link>.
                    {' '}For players under 18, a parent/guardian has consented to this registration.
                  </span>
                </label>

                {/* hCaptcha */}
                <div className="flex justify-center pt-2">
                  <HCaptcha ref={captchaRef} sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!} onVerify={token => setCaptchaToken(token)} onExpire={() => setCaptchaToken('')} theme="dark" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-white/20 text-gray-300 hover:border-white/40 font-bold uppercase tracking-wider rounded-lg transition-colors">Back</button>
                  <button type="submit" disabled={loading || !captchaToken || !agreedToTerms} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider rounded-lg transition-colors">
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already registered?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
const ageGroups = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18', 'Adult']

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    position: '',
    ageGroup: '',
    experience: '',
    parentName: '',
    parentPhone: '',
    emergencyContact: '',
  })

  const router = useRouter()
  const supabase = createClient()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      setStep(2)
      return
    }

    setLoading(true)

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    })

    if (authError || !authData.user) {
      setError(authError?.message ?? 'Registration failed. Please try again.')
      setLoading(false)
      return
    }

    // Create player profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      date_of_birth: form.dateOfBirth,
      phone: form.phone,
      position: form.position,
      age_group: form.ageGroup,
      experience_years: parseInt(form.experience) || 0,
      parent_name: form.parentName,
      parent_phone: form.parentPhone,
      emergency_contact: form.emergencyContact,
      status: 'pending',
      role: 'player',
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center bg-orange-500/10">
              <span className="text-orange-500 font-black text-lg">DMV</span>
            </div>
            <div className="text-white font-black text-xl">DMV ALL STARS FC</div>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Player Registration</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                step >= s ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-500'
              }`}>
                {s}
              </div>
              <div className={`text-xs font-semibold ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                {s === 1 ? 'Account' : 'Player Info'}
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <h2 className="text-xl font-black text-white mb-1">Create Your Account</h2>
                <p className="text-gray-400 text-sm mb-6">Start with your login credentials.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
                    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
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
                </div>

                {[
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
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

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors mt-2"
                >
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
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (202) 555-0100"
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Position</label>
                    <select
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm"
                    >
                      <option value="">Select position</option>
                      {positions.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Age Group</label>
                    <select
                      name="ageGroup"
                      value={form.ageGroup}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white outline-none transition-colors text-sm"
                    >
                      <option value="">Select age group</option>
                      {ageGroups.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    min="0"
                    max="30"
                    className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Parent / Guardian (if under 18)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'parentName', label: 'Parent/Guardian Name', placeholder: 'Full name' },
                      { name: 'parentPhone', label: 'Parent/Guardian Phone', placeholder: '+1 (202) 555-0101' },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                        <input
                          type="text"
                          name={name}
                          value={form[name as keyof typeof form]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-400 text-sm mb-1.5">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={form.emergencyContact}
                      onChange={handleChange}
                      placeholder="Name and phone number"
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-white/20 text-gray-300 hover:border-white/40 font-bold uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already registered?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

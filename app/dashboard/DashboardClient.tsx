'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  phone: string
  position: string
  age_group: string
  experience_years: number
  parent_name: string
  parent_phone: string
  emergency_contact: string
  status: string
  created_at: string
}

interface Props {
  user: User
  profile: Profile | null
}

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
const ageGroups = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18', 'Adult']

export default function DashboardClient({ user, profile }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState({
    first_name: profile?.first_name ?? '',
    last_name: profile?.last_name ?? '',
    phone: profile?.phone ?? '',
    position: profile?.position ?? '',
    age_group: profile?.age_group ?? '',
    experience_years: profile?.experience_years?.toString() ?? '0',
    parent_name: profile?.parent_name ?? '',
    parent_phone: profile?.parent_phone ?? '',
    emergency_contact: profile?.emergency_contact ?? '',
  })

  const router = useRouter()
  const supabase = createClient()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        position: form.position,
        age_group: form.age_group,
        experience_years: parseInt(form.experience_years) || 0,
        parent_name: form.parent_name,
        parent_phone: form.parent_phone,
        emergency_contact: form.emergency_contact,
      })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      setSaveMsg('Failed to save changes.')
    } else {
      setSaveMsg('Profile updated successfully!')
      setEditing(false)
      router.refresh()
    }
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const statusColor = {
    active: 'bg-green-500/10 border-green-500/30 text-green-400',
    pending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    inactive: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
  }[profile?.status ?? 'pending'] ?? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              Welcome, <span className="text-orange-500">{profile?.first_name ?? 'Player'}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className={`px-4 py-2 text-sm font-semibold rounded transition-colors ${
                editing
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-semibold border border-white/20 text-gray-300 hover:border-red-500/50 hover:text-red-400 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {saveMsg && (
          <div className={`mb-6 p-3 rounded-lg text-sm border ${saveMsg.includes('success') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {saveMsg}
          </div>
        )}

        {/* Status card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {(profile?.status ?? 'Pending').charAt(0).toUpperCase() + (profile?.status ?? 'pending').slice(1)}
            </span>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Position</div>
            <div className="text-white font-bold">{profile?.position || '—'}</div>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Age Group</div>
            <div className="text-white font-bold">{profile?.age_group || '—'}</div>
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <span className="text-orange-500 font-black">
                {(profile?.first_name ?? user.email ?? 'P')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-white font-bold">{profile ? `${profile.first_name} ${profile.last_name}` : 'Player Profile'}</div>
              <div className="text-gray-500 text-xs">Registered {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</div>
            </div>
          </div>

          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'first_name', label: 'First Name' },
                    { name: 'last_name', label: 'Last Name' },
                    { name: 'phone', label: 'Phone' },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                      <input
                        type="text"
                        name={name}
                        value={form[name as keyof typeof form]}
                        onChange={handleChange}
                        className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Position</label>
                    <select
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                    >
                      <option value="">Select</option>
                      {positions.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Age Group</label>
                    <select
                      name="age_group"
                      value={form.age_group}
                      onChange={handleChange}
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                    >
                      <option value="">Select</option>
                      {ageGroups.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Years of Experience</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={form.experience_years}
                      onChange={handleChange}
                      min="0"
                      max="30"
                      className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Parent / Emergency Info</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'parent_name', label: 'Parent/Guardian Name' },
                      { name: 'parent_phone', label: 'Parent/Guardian Phone' },
                      { name: 'emergency_contact', label: 'Emergency Contact' },
                    ].map(({ name, label }) => (
                      <div key={name}>
                        <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                        <input
                          type="text"
                          name={name}
                          value={form[name as keyof typeof form]}
                          onChange={handleChange}
                          className="w-full bg-[#0f0f0f] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { label: 'First Name', value: profile?.first_name },
                  { label: 'Last Name', value: profile?.last_name },
                  { label: 'Email', value: profile?.email ?? user.email },
                  { label: 'Phone', value: profile?.phone },
                  { label: 'Date of Birth', value: profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : undefined },
                  { label: 'Position', value: profile?.position },
                  { label: 'Age Group', value: profile?.age_group },
                  { label: 'Experience', value: profile?.experience_years != null ? `${profile.experience_years} years` : undefined },
                  { label: 'Parent / Guardian', value: profile?.parent_name },
                  { label: 'Parent Phone', value: profile?.parent_phone },
                  { label: 'Emergency Contact', value: profile?.emergency_contact },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-white font-medium">{value || <span className="text-gray-600">—</span>}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* No profile notice */}
        {!profile && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
            Your profile could not be loaded. Please contact support if this persists.
          </div>
        )}
      </div>
    </div>
  )
}

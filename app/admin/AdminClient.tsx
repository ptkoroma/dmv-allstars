'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Player {
  id: string
  first_name: string
  last_name: string
  email: string
  position: string
  age_group: string
  experience_years: number
  status: string
  role: string
  created_at: string
}

const statusOptions = ['pending', 'active', 'inactive']

const statusStyle: Record<string, string> = {
  active: 'bg-green-500/10 border-green-500/30 text-green-400',
  pending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  inactive: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
}

export default function AdminClient({ players: initial }: { players: Player[] }) {
  const [players, setPlayers] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const supabase = createClient()

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id)
    if (!error) {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, status } : p))
      if (selectedPlayer?.id === id) setSelectedPlayer(prev => prev ? { ...prev, status } : prev)
    }
    setUpdating(null)
  }

  async function updateRole(id: string, role: string) {
    setUpdating(id)
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (!error) {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, role } : p))
      if (selectedPlayer?.id === id) setSelectedPlayer(prev => prev ? { ...prev, role } : prev)
    }
    setUpdating(null)
  }

  const filtered = players.filter(p => {
    const matchSearch = `${p.first_name} ${p.last_name} ${p.email} ${p.position}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: players.length,
    active: players.filter(p => p.status === 'active').length,
    pending: players.filter(p => p.status === 'pending').length,
    inactive: players.filter(p => p.status === 'inactive').length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">
            Admin <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-1">Manage all registered players</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Players', value: stats.total, color: 'text-white' },
            { label: 'Active', value: stats.active, color: 'text-green-400' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Inactive', value: stats.inactive, color: 'text-gray-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</div>
              <div className={`text-3xl font-black ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, email or position..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-white/10 focus:border-orange-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none text-sm transition-colors"
          />
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Players table */}
          <div className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-bold">Players ({filtered.length})</h2>
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center text-gray-500">No players found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Player', 'Position', 'Age Group', 'Status', 'Role', 'Registered', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-gray-500 text-xs uppercase tracking-wider font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map(player => (
                      <tr
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className={`hover:bg-white/5 cursor-pointer transition-colors ${selectedPlayer?.id === player.id ? 'bg-orange-500/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-orange-500 text-xs font-bold">
                                {player.first_name?.[0]?.toUpperCase() ?? '?'}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium whitespace-nowrap">
                                {player.first_name} {player.last_name}
                              </div>
                              <div className="text-gray-500 text-xs">{player.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{player.position || '—'}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{player.age_group || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyle[player.status] ?? statusStyle.inactive}`}>
                            <span className="w-1 h-1 rounded-full bg-current" />
                            {player.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${player.role === 'admin' ? 'text-orange-500' : 'text-gray-400'}`}>
                            {player.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(player.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {statusOptions.filter(s => s !== player.status).map(s => (
                              <button
                                key={s}
                                onClick={e => { e.stopPropagation(); updateStatus(player.id, s) }}
                                disabled={updating === player.id}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-colors disabled:opacity-50 ${
                                  s === 'active' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' :
                                  s === 'pending' ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' :
                                  'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Player detail panel */}
          {selectedPlayer && (
            <div className="w-72 flex-shrink-0 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 self-start sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Player Details</h3>
                <button onClick={() => setSelectedPlayer(null)} className="text-gray-500 hover:text-white text-lg">×</button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center mb-3">
                  <span className="text-orange-500 font-black text-2xl">
                    {selectedPlayer.first_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="text-white font-bold text-lg text-center">
                  {selectedPlayer.first_name} {selectedPlayer.last_name}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{selectedPlayer.email}</div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                {[
                  { label: 'Position', value: selectedPlayer.position },
                  { label: 'Age Group', value: selectedPlayer.age_group },
                  { label: 'Experience', value: selectedPlayer.experience_years != null ? `${selectedPlayer.experience_years} yrs` : null },
                  { label: 'Joined', value: new Date(selectedPlayer.created_at).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white font-medium">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Status control */}
              <div className="mb-4">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Status</div>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedPlayer.id, s)}
                      disabled={updating === selectedPlayer.id}
                      className={`flex-1 py-1.5 rounded text-xs font-bold capitalize transition-colors disabled:opacity-50 ${
                        selectedPlayer.status === s
                          ? s === 'active' ? 'bg-green-500 text-white' : s === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role control */}
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Role</div>
                <div className="flex gap-2">
                  {['player', 'admin'].map(r => (
                    <button
                      key={r}
                      onClick={() => updateRole(selectedPlayer.id, r)}
                      disabled={updating === selectedPlayer.id}
                      className={`flex-1 py-1.5 rounded text-xs font-bold capitalize transition-colors disabled:opacity-50 ${
                        selectedPlayer.role === r
                          ? r === 'admin' ? 'bg-orange-500 text-white' : 'bg-white/20 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

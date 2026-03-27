'use client'

import { useState } from 'react'

const categories = ['All', 'Match Day', 'Training', 'Team', 'Awards']

// Placeholder gallery items using solid color backgrounds with gradient overlays
const galleryItems = [
  { id: 1, category: 'Match Day', title: 'Championship Final 2024', color: 'from-orange-900 to-orange-600' },
  { id: 2, category: 'Training', title: 'Morning Drills', color: 'from-gray-800 to-gray-600' },
  { id: 3, category: 'Team', title: 'Squad Photo 2024', color: 'from-orange-800 to-orange-500' },
  { id: 4, category: 'Awards', title: 'Best Team Award', color: 'from-yellow-900 to-yellow-600' },
  { id: 5, category: 'Match Day', title: 'Away Game Highlights', color: 'from-orange-900 to-red-700' },
  { id: 6, category: 'Training', title: 'Skills Workshop', color: 'from-gray-900 to-gray-700' },
  { id: 7, category: 'Team', title: 'Team Celebration', color: 'from-orange-700 to-orange-400' },
  { id: 8, category: 'Match Day', title: 'Home Opener 2024', color: 'from-red-900 to-orange-600' },
  { id: 9, category: 'Awards', title: 'MVP Ceremony', color: 'from-yellow-800 to-orange-500' },
  { id: 10, category: 'Training', title: 'Goalkeeper Training', color: 'from-gray-800 to-gray-500' },
  { id: 11, category: 'Team', title: 'Youth Academy Day', color: 'from-orange-800 to-yellow-600' },
  { id: 12, category: 'Match Day', title: 'Playoff Victory', color: 'from-orange-900 to-orange-700' },
]

export default function GalleryPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? galleryItems : galleryItems.filter(g => g.category === active)

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Moments</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Our <span className="text-orange-500">Gallery</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Browse highlights from our matches, training sessions, and team events.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-[#111111] border-b border-white/10 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded text-sm font-semibold uppercase tracking-wider transition-colors ${
                  active === cat
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(({ id, title, category, color }) => (
              <div
                key={id}
                className={`relative rounded-xl overflow-hidden aspect-square bg-gradient-to-br ${color} group cursor-pointer`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="text-4xl mb-2">⚽</div>
                  <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">{category}</div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-white font-bold text-center text-sm">{title}</p>
                  <span className="mt-2 px-3 py-1 bg-orange-500 text-white text-xs rounded uppercase tracking-wider">{category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

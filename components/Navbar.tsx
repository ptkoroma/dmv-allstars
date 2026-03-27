'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
        setIsAdmin(data?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    })
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        setIsAdmin(profile?.role === 'admin')
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#111111]/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-[#111111]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <span className="text-orange-500 font-black text-xs leading-none text-center">DMV</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-sm leading-none">DMV ALL STARS</div>
              <div className="text-orange-500 text-xs font-semibold tracking-widest">FC · 2015</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-colors relative group ${
                  pathname === href ? 'text-orange-500' : 'text-gray-300 hover:text-white'
                }`}
              >
                {label}
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-orange-500 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-semibold border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors uppercase tracking-wider"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 border-t border-white/10' : 'max-h-0'
        } bg-[#111111]`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-3 text-sm font-semibold uppercase tracking-wider rounded transition-colors ${
                pathname === href
                  ? 'text-orange-500 bg-orange-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/10">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="block px-3 py-3 text-sm font-semibold text-orange-500 hover:text-orange-400">
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/dashboard" className="block px-3 py-3 text-sm font-semibold text-white hover:text-orange-500">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full mt-2 py-3 text-sm font-bold border border-orange-500 text-orange-500 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-center py-3 text-sm font-bold bg-orange-500 text-white rounded uppercase tracking-wider"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

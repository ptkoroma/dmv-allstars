import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <span className="text-orange-500 font-black text-xs">DMV</span>
              </div>
              <div>
                <div className="font-black text-white text-sm">DMV ALL STARS FC</div>
                <div className="text-orange-500 text-xs tracking-widest">EST. 2015</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Developing the next generation of soccer talent in the DMV area.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
                { href: '/register', label: 'Player Registration' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Washington, DC Metro Area</li>
              <li>info@dmvallstarsfc.com</li>
              <li>+1 (202) 555-0100</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} DMV All Stars FC. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/terms" className="text-gray-600 hover:text-orange-500 text-xs transition-colors">Terms</a>
              <a href="/privacy" className="text-gray-600 hover:text-orange-500 text-xs transition-colors">Privacy</a>
            </div>
          </div>
          <div className="flex gap-4">
            {['Instagram', 'Twitter', 'Facebook'].map((s) => (
              <a key={s} href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

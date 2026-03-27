import Image from 'next/image'
import Link from 'next/link'

const stats = [
  { value: '200+', label: 'Players' },
  { value: '15+', label: 'Trophies' },
  { value: '10', label: 'Seasons' },
  { value: '50+', label: 'Coaches' },
]

const features = [
  {
    icon: '⚽',
    title: 'Elite Training',
    desc: 'Professional coaching programs designed to develop world-class soccer skills at every level.',
  },
  {
    icon: '🏆',
    title: 'Competitive Play',
    desc: 'Compete in regional and national leagues with a team that has a winning tradition.',
  },
  {
    icon: '🌟',
    title: 'Youth Development',
    desc: 'Nurturing young talent through structured academies and mentorship programs.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
        {/* Geometric orange triangles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            {/* Large polygon shapes mimicking the design */}
            <div className="absolute top-10 right-20 w-40 h-40 bg-orange-500/20 rotate-45 transform-gpu" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute top-32 right-60 w-24 h-24 bg-orange-500/30" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute top-60 right-10 w-32 h-32 bg-orange-600/25" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
            <div className="absolute bottom-40 right-40 w-48 h-48 bg-orange-500/15" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
            <div className="absolute top-20 right-[30%] w-16 h-16 bg-orange-400/40" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute top-72 right-[45%] w-20 h-20 bg-orange-500/35" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute bottom-20 right-[20%] w-28 h-28 bg-orange-600/20" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Est. 2015</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6">
              <span className="text-white">DMV ALL</span>
              <br />
              <span className="text-orange-500">STARS</span>
              <br />
              <span className="text-white text-4xl sm:text-5xl">FC</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Developing champions on and off the field. Join the DMV area's premier soccer club and elevate your game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider rounded transition-colors text-center"
              >
                Register Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-white/20 hover:border-orange-500 text-white hover:text-orange-500 font-bold uppercase tracking-wider rounded transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src="/soccer.png"
                alt="DMV All Stars FC Player"
                width={600}
                height={500}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#111111]/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              {stats.map(({ value, label }) => (
                <div key={label} className="px-6 py-5 text-center">
                  <div className="text-2xl font-black text-orange-500">{value}</div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Why Choose <span className="text-orange-500">DMV All Stars?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We are more than a soccer club. We are a community dedicated to excellence, growth, and championship culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#1a1a1a] border border-white/5 hover:border-orange-500/30 rounded-xl p-8 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-orange-500 transition-colors">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', background: 'white' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', background: 'white' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Join the Team?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Register today and become part of the DMV All Stars family.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-orange-600 font-black uppercase tracking-wider rounded hover:bg-orange-50 transition-colors"
          >
            Register as a Player
          </Link>
        </div>
      </section>
    </>
  )
}

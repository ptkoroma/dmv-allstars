const coaches = [
  { name: 'Marcus Williams', role: 'Head Coach', exp: '15 years coaching experience' },
  { name: 'Sofia Reyes', role: 'Assistant Coach', exp: 'Former professional player' },
  { name: 'James Carter', role: 'Youth Academy Director', exp: 'UEFA B License' },
]

const values = [
  { title: 'Discipline', desc: 'Building mental strength and commitment on and off the pitch.' },
  { title: 'Teamwork', desc: 'Fostering collaboration, trust, and unity in everything we do.' },
  { title: 'Excellence', desc: 'Pursuing the highest standards in training, character, and performance.' },
  { title: 'Community', desc: 'Giving back to the DMV area through soccer and leadership.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-[#111111] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Our Story</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-6">
              About <span className="text-orange-500">DMV All Stars FC</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded in 2015, DMV All Stars FC was built on a simple belief: every player deserves access to elite coaching, competitive play, and a supportive team culture. What started as a small group of passionate players has grown into one of the DMV area's most respected soccer clubs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">Our <span className="text-orange-500">Mission</span></h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              To develop well-rounded soccer players and responsible citizens through high-quality coaching, competitive opportunities, and a culture of continuous improvement.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We believe soccer is more than a game — it is a vehicle for personal growth, discipline, and lifelong friendships.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map(({ title, desc }) => (
              <div key={title} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
                <h3 className="text-orange-500 font-bold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching staff */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2">Our <span className="text-orange-500">Coaching Staff</span></h2>
            <p className="text-gray-400">World-class coaches dedicated to your development.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {coaches.map(({ name, role, exp }) => (
              <div key={name} className="bg-[#1a1a1a] border border-white/5 hover:border-orange-500/30 rounded-xl p-8 text-center transition-all">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-500 font-black text-xl">{name[0]}</span>
                </div>
                <h3 className="text-white font-bold text-lg">{name}</h3>
                <p className="text-orange-500 text-sm font-semibold mt-1">{role}</p>
                <p className="text-gray-400 text-sm mt-2">{exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

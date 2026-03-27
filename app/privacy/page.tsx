import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for DMV All Stars FC. How we collect, use, and protect your personal data.',
  alternates: { canonical: 'https://dmv-allstars.com/privacy' },
}
export default function PrivacyPage() {
  return (
    <section className="pt-28 pb-20 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl font-black text-white mt-2 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 2026</p>

        {[
          { title: '1. Information We Collect', body: 'We collect information you provide during registration: full name, email address, date of birth, phone number, soccer position, age group, years of experience, and parent/guardian contact details for players under 18.' },
          { title: '2. How We Use Your Information', body: 'Your information is used to: manage player registrations, communicate club updates and schedules, verify eligibility for age group participation, and maintain emergency contact records for player safety.' },
          { title: '3. Data Storage', body: 'All data is stored securely using Supabase (PostgreSQL), hosted on servers within the United States. We use Row Level Security to ensure each player\'s data is accessible only to themselves and authorized club administrators.' },
          { title: '4. Children\'s Privacy (COPPA)', body: 'We take the privacy of children seriously. For players under 13, we require verifiable parental consent before collecting personal information. Parents may review, update, or request deletion of their child\'s data by contacting us at info@dmv-allstars.com.' },
          { title: '5. Data Sharing', body: 'We do not sell, trade, or share your personal information with third parties except as required by law or as necessary to operate the platform (e.g., authentication services). We use Supabase for authentication and data storage, and Vercel for hosting.' },
          { title: '6. Data Retention', body: 'We retain player data for the duration of their membership. Upon request, we will delete your personal data within 30 days, except where retention is required by law.' },
          { title: '7. Security', body: 'We implement industry-standard security measures including encrypted connections (HTTPS), hashed passwords, CAPTCHA bot protection, and role-based access controls. However, no online system is 100% secure.' },
          { title: '8. Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Log in to your dashboard to update your profile, or contact us at info@dmv-allstars.com to request data deletion.' },
          { title: '9. Contact', body: 'For privacy questions or to exercise your rights, email info@dmv-allstars.com or write to DMV All Stars FC, Washington DC Metro Area.' },
        ].map(({ title, body }) => (
          <div key={title} className="mb-8">
            <h2 className="text-white font-bold text-lg mb-2">{title}</h2>
            <p className="text-gray-400 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

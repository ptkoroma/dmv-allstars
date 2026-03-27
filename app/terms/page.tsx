import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for DMV All Stars FC.',
  alternates: { canonical: 'https://dmv-allstars.com/terms' },
}
export default function TermsPage() {
  return (
    <section className="pt-28 pb-20 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl font-black text-white mt-2 mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 2026</p>

        {[
          { title: '1. Acceptance of Terms', body: 'By registering on the DMV All Stars FC website, you agree to these Terms of Service. If you are under 18, a parent or legal guardian must consent on your behalf.' },
          { title: '2. Registration', body: 'You agree to provide accurate and complete information during registration. You are responsible for maintaining the security of your account credentials. Notify us immediately of any unauthorized use of your account.' },
          { title: '3. Use of the Platform', body: 'This platform is for player registration and club management purposes only. You may not use it for any unlawful purpose, to transmit harmful content, or to impersonate another person.' },
          { title: '4. Personal Data', body: 'We collect personal information including name, date of birth, contact details, and soccer experience to manage player registrations. Please refer to our Privacy Policy for full details on how your data is used and protected.' },
          { title: '5. Minors', body: 'For players under 13 years of age, a parent or legal guardian must complete registration and provide consent. By registering a minor, the parent/guardian confirms they have legal authority to do so and consent to the collection of the minor\'s personal data.' },
          { title: '6. Account Termination', body: 'DMV All Stars FC reserves the right to suspend or terminate accounts that violate these terms, provide false information, or engage in conduct harmful to the club or its members.' },
          { title: '7. Limitation of Liability', body: 'DMV All Stars FC is not liable for any indirect, incidental, or consequential damages arising from your use of this platform. The platform is provided "as is" without warranties of any kind.' },
          { title: '8. Changes to Terms', body: 'We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.' },
          { title: '9. Contact', body: 'For questions about these Terms, contact us at info@dmv-allstars.com.' },
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

import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with DMV All Stars FC. Contact us for player registration, tryout information, sponsorship, or general inquiries.',
  alternates: { canonical: 'https://dmv-allstars.com/contact' },
  openGraph: { title: 'Contact DMV All Stars FC', description: 'Reach out for registration, tryouts, and general inquiries.', url: 'https://dmv-allstars.com/contact' },
}

export default function ContactPage() {
  return <ContactClient />
}

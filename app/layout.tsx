import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://dmv-allstars.com'),
  title: {
    default: 'DMV All Stars FC — Elite Soccer Club | Washington DC',
    template: '%s | DMV All Stars FC',
  },
  description: 'DMV All Stars FC is an elite youth and adult soccer club in the Washington DC metro area. Founded in 2015, developing champions on and off the field.',
  keywords: ['soccer club', 'DMV soccer', 'Washington DC soccer', 'youth soccer', 'soccer registration', 'DMV All Stars'],
  authors: [{ name: 'DMV All Stars FC' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dmv-allstars.com',
    siteName: 'DMV All Stars FC',
    title: 'DMV All Stars FC — Elite Soccer Club',
    description: 'Developing champions on and off the field. Join the DMV area\'s premier soccer club.',
    images: [{ url: '/soccer.png', width: 1200, height: 630, alt: 'DMV All Stars FC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DMV All Stars FC',
    description: 'Elite soccer club in the Washington DC metro area. Est. 2015.',
    images: ['/soccer.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

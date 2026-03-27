import type { Metadata } from 'next'
import GalleryClient from './GalleryClient'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse photos from DMV All Stars FC matches, training sessions, team events, and award ceremonies.',
  alternates: { canonical: 'https://dmv-allstars.com/gallery' },
  openGraph: { title: 'DMV All Stars FC Gallery', description: 'Photos from matches, training, and team events.', url: 'https://dmv-allstars.com/gallery' },
}

export default function GalleryPage() {
  return <GalleryClient />
}

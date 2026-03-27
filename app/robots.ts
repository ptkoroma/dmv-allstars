import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/admin', '/reset-password'],
    },
    sitemap: 'https://dmv-allstars.com/sitemap.xml',
  }
}

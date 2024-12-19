import type { MetadataRoute } from 'next'

/**
 * @name manifest
 * @description Generate the web app manifest for the site, mainly for PWA
 *
 * @returns {MetadataRoute.Manifest} The web app manifest configuration
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Medieteknik - KTH',
    short_name: 'Medieteknik',
    categories: ['education', 'news', 'social'],
    id: '/',
    start_url: '.',
    description:
      'Website for the Media Technology programme at KTH (Royal Institute of Technology).',
    theme_color: '#FACC15',
    background_color: '#ffffff',
    orientation: 'portrait-primary',
    display_override: ['window-controls-overlay'],
    display: 'standalone',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
        purpose: 'maskable',
      },
      {
        src: 'apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: 'screenshots/desktop.jpg',
        sizes: '2560x1440',
        type: 'image/webp',
        label: 'Desktop',
        platform: 'windows',
        form_factor: 'wide',
      },
      {
        src: 'screenshots/phone.jpg',
        sizes: '430x932',
        type: 'image/webp',
        label: 'Phone',
        platform: 'android',
        form_factor: 'narrow',
      },
    ],
  }
}

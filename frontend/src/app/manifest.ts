import { MetadataRoute } from 'next'

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
    description: 'Website for the Media Technology programme at KTH (Royal Institute of Technology).',
    theme_color: '#FACC15',
    background_color: '#ffffff',
    orientation: 'portrait-primary',
    display_override: ['window-controls-overlay'],
    display: 'standalone',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: 'apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    screenshots: [
      {
        src: 'screenshots/desktop.webp',
        sizes: '2560x1440',
        type: 'image/webp',
      },
      {
        src: 'screenshots/phone.webp',
        sizes: '1078x2048',
        type: 'image/webp',
      },
    ],
    }
  }
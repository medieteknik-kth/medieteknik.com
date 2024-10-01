'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload(
    'https://storage.googleapis.com/medieteknik-static/static/landingpage.webp',
    { as: 'image' }
  )
}

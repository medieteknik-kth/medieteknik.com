import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xxs: '320px',
        // => @media (min-width: 320px) { ... }
  
        xs: '480px',
        // => @media (min-width: 480px) { ... }

        desktop: '1920px',
        // => @media (min-width: 1920px) { ... }

        ...defaultTheme.screens
      },
    }
  },
  plugins: [],
}
export default config

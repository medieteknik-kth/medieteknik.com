/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    theme: {
      extend: {
        colors: {
          'base-content': 'var(--ion-text-color)',
        }
      },
    },
    plugins: [],
    // Prevent Tailwind from resetting Ionic's default styles
    corePlugins: {
      preflight: false,
    }
  }
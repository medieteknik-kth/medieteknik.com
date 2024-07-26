import Logo from 'public/images/logobig_light.jpg'
import './error.css'
export default async function NotFound() {
  return (
    <main aria-label='Page not found'>
      <img src={Logo.src} alt='logo' aria-label='logo' />
      <div>
        <h1>404 - Page Not Found</h1>

        <h2>
          Go back to the <a href='/'>homepage</a>.
        </h2>
        <p>
          If you believe this to be an error, please mail us at{' '}
          <a href='mailto:webmaster@medieteknik.com'>
            webmaster@medieteknik.com
          </a>
        </p>
      </div>
    </main>
  )
}

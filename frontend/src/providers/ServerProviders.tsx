import { CookiesProvider } from 'next-client-cookies/server'

/**
 * A React component that provides all the server providers for the application.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function ServerProviders({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return <CookiesProvider>{children}</CookiesProvider>
}

'use client'

import ErrorBoundary from './ErrorBoundary'
import ErrorFallback from './ErrorFallback'

interface ClientErrorBoundaryProps {
  children: React.ReactNode
}

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={(error) => <ErrorFallback error={error} />}>
      {children}
    </ErrorBoundary>
  )
}

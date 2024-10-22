'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: React.ReactNode
  fallback: React.ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  /**
   * Update the state so the next render will show the fallback UI.
   *
   * @param {Error} _ - The error that was thrown
   * @returns {State} The updated state
   */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  /**
   * Log the error to the console.
   *
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - The error information
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
  }

  /**
   * Render the children if there is no error, otherwise render the fallback UI.
   *
   * @returns {ReactNode} The children or the fallback UI
   */
  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

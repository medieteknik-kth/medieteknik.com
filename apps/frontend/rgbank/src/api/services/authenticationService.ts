import type { LanguageCode } from '@/models/Language'
import type { AuthenticationResponse } from '@/models/response/AuthenticationResponse'

const CACHE_REVALIDATION_PERIOD_SECONDS = 60

export const authService = {
  /**
   * Login function that makes a POST request to the server to login the user.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {string} csrf_token - The CSRF token of the user.
   * @param {boolean} remember - Whether to remember the user or not (optional: default is false).
   *
   * @returns {Promise<void>}
   */
  login: async (
    email: string,
    password: string,
    csrf_token: string,
    remember?: boolean
  ): Promise<Response> => {
    const json_data = {
      email: email.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      password: password.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      csrf_token: csrf_token,
      remember: remember ?? false,
    }
    const response = await fetch('/api/login?filter=rgbank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf_token,
      },
      credentials: 'include',
      body: JSON.stringify(json_data),
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    return response
  },

  /**
   * Get user data function that makes a GET request to the server to get the user data.
   *
   * @param {LanguageCode} language - The language code of the user.
   * @returns {Promise<SuccessfulAuthenticationResponse>}
   */
  getUserData: async (
    language: LanguageCode
  ): Promise<AuthenticationResponse> => {
    const response = await fetch(
      `/api/students/me?language=${language}&filter=rgbank`,
      {
        method: 'GET',
        credentials: 'include',
        next: {
          revalidate: CACHE_REVALIDATION_PERIOD_SECONDS,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    return response.json() as Promise<AuthenticationResponse>
  },

  /**
   * Logout function that makes a DELETE request to the server to logout the user.
   *
   * @returns {Promise<void>}
   */
  logout: async (): Promise<void> => {
    const response = await fetch('/api/logout', {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to logout')
    }
  },
}

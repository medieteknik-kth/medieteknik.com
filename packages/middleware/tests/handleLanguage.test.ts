import { FALLBACK_LANGUAGE, LANGUAGE_COOKIE_NAME } from '@medieteknik/constants'
import { NextResponse } from 'next/server'
import { handleLanguage } from '../src/handleLanguage'

// Mock the NextURL constructor
jest.mock('next/dist/server/web/next-url', () => {
  return {
    NextURL: jest.fn().mockImplementation((url, base) => {
      return {
        pathname: url,
        searchParams: new URLSearchParams(),
        href: url,
        clone: () => ({ pathname: url, searchParams: new URLSearchParams() }),
      }
    }),
  }
})

describe('handleLanguage', () => {
  // Mock request and response objects
  // biome-ignore lint/suspicious/noExplicitAny: Mock request object
  let mockRequest: any
  // biome-ignore lint/suspicious/noExplicitAny: Mock response object
  let mockResponse: any
  const blacklistedUrlsRegex = /^\/api\//
  const mockMergeResponses = jest.fn((response, newResponse) => newResponse)

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Create mock request
    mockRequest = {
      nextUrl: {
        pathname: '/',
        searchParams: new URLSearchParams(),
        clone: () => ({ pathname: '/', searchParams: new URLSearchParams() }),
      },
      cookies: {
        has: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(null),
      },
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
    }

    // Create mock response
    mockResponse = {
      cookies: {
        set: jest.fn(),
      },
    }

    // Mock NextResponse.redirect
    NextResponse.redirect = jest.fn().mockImplementation((url) => {
      return {
        cookies: {
          set: jest.fn(),
        },
        url,
      }
    })
  })

  describe('Blacklisted URLs', () => {
    it('should return the original response for blacklisted URLs', () => {
      mockRequest.nextUrl.pathname = '/api/some-endpoint'

      const result = handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(result).toBe(mockResponse)
      expect(mockRequest.cookies.has).not.toHaveBeenCalled()
    })
  })

  describe('Path with language and no cookie', () => {
    it('should set a cookie when path has language and no cookie is present', () => {
      mockRequest.nextUrl.pathname = '/en/some-page'
      mockRequest.cookies.has.mockReturnValue(false)

      const result = handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(result).toBe(mockResponse)
      expect(mockRequest.cookies.has).toHaveBeenCalledWith(LANGUAGE_COOKIE_NAME)
      expect(mockResponse.cookies.set).toHaveBeenCalledWith(
        LANGUAGE_COOKIE_NAME,
        'en',
        expect.any(Object)
      )
    })
  })

  describe('Language detection', () => {
    it('should use cookie language when available', () => {
      mockRequest.nextUrl.pathname = '/some-page'
      mockRequest.cookies.has.mockReturnValue(true)
      mockRequest.cookies.get.mockReturnValue({ value: 'sv' })

      handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(NextResponse.redirect).toHaveBeenCalled()
      expect(mockMergeResponses).toHaveBeenCalled()
      expect(mockResponse.cookies.set).toHaveBeenCalledWith(
        LANGUAGE_COOKIE_NAME,
        'sv',
        expect.any(Object)
      )
    })

    it('should use browser language when cookie not available', () => {
      mockRequest.nextUrl.pathname = '/some-page'
      mockRequest.cookies.has.mockReturnValue(false)
      mockRequest.cookies.get.mockReturnValue(null)
      mockRequest.headers.get.mockImplementation((header) => {
        if (header === 'Accept-Language') {
          return 'sv,en-US;q=0.9,en;q=0.8'
        }
        return null
      })

      handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(NextResponse.redirect).toHaveBeenCalled()
      expect(mockMergeResponses).toHaveBeenCalled()
    })

    it('should use referer language when cookie and browser language not available', () => {
      mockRequest.nextUrl.pathname = '/some-page'
      mockRequest.cookies.has.mockReturnValue(false)
      mockRequest.cookies.get.mockReturnValue(null)
      mockRequest.headers.get.mockImplementation((header) => {
        if (header === 'Referer') {
          return 'https://example.com/en/previous-page'
        }
        return null
      })

      handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(NextResponse.redirect).toHaveBeenCalled()
      expect(mockMergeResponses).toHaveBeenCalled()
    })

    it('should use fallback language when no other language is available', () => {
      mockRequest.nextUrl.pathname = '/some-page'
      mockRequest.cookies.has.mockReturnValue(false)
      mockRequest.cookies.get.mockReturnValue(null)
      mockRequest.headers.get.mockReturnValue(null)

      handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(NextResponse.redirect).toHaveBeenCalled()
      expect(mockMergeResponses).toHaveBeenCalled()
      // Should redirect to fallback language
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: `/${FALLBACK_LANGUAGE}/some-page`,
        })
      )
    })
  })

  describe('Path with language that matches detected language', () => {
    it('should return original response when path language matches detected language', () => {
      mockRequest.nextUrl.pathname = '/en/some-page'
      mockRequest.cookies.has.mockReturnValue(true)
      mockRequest.cookies.get.mockReturnValue({ value: 'en' })

      const result = handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(result).toBe(mockResponse)
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })
  })

  describe('URL query parameters', () => {
    it('should preserve query parameters when redirecting', () => {
      mockRequest.nextUrl.pathname = '/some-page'
      mockRequest.nextUrl.searchParams = new Map([
        ['param1', 'value1'],
        ['param2', 'value2'],
      ])
      mockRequest.cookies.has.mockReturnValue(false)

      // Mock the search params handling
      const mockSearchParams = {
        set: jest.fn(),
        size: 2,
        forEach: (callback: (value: string, key: string) => void) => {
          callback('value1', 'param1')
          callback('value2', 'param2')
        },
      }
      mockRequest.nextUrl.searchParams = mockSearchParams

      handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(NextResponse.redirect).toHaveBeenCalled()
      expect(mockMergeResponses).toHaveBeenCalled()
    })
  })

  describe('Development mode logging', () => {
    const originalNodeEnv = process.env.NODE_ENV

    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      process.env.NODE_ENV = 'development'
    })

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
      jest.restoreAllMocks()
    })

    it('should log warning in development mode when redirecting', () => {
      mockRequest.nextUrl.pathname = '/some-page'
      mockRequest.cookies.has.mockReturnValue(false)

      handleLanguage(
        mockRequest,
        mockResponse,
        blacklistedUrlsRegex,
        mockMergeResponses
      )

      expect(console.warn).toHaveBeenCalled()
    })
  })
})

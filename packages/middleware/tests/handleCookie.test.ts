import {
  COOKIE_SETTINGS,
  COOKIE_VERSION_NAME,
  COOKIE_VERSION_VALUE,
  LANGUAGE_COOKIE_NAME,
} from '@medieteknik/constants'
import { handleCookieUpdates } from '../src/handleCookie'

describe('handleCookieUpdates', () => {
  // Mock request and response objects
  // biome-ignore lint/suspicious/noExplicitAny: Mock request object
  let mockRequest: any
  // biome-ignore lint/suspicious/noExplicitAny: Mock response object
  let mockResponse: any

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Create mock request
    mockRequest = {
      cookies: {
        has: jest.fn(),
        get: jest.fn(),
      },
    }

    // Create mock response
    mockResponse = {
      cookies: {
        set: jest.fn(),
      },
    }
  })

  it('should return unmodified response when cookie version is current', () => {
    // Mock current cookie version
    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return { value: COOKIE_VERSION_VALUE }
      }
      return null
    })

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    expect(mockResponse.cookies.set).not.toHaveBeenCalled()
  })

  it('should update existing cookies with correct options', () => {
    // Mock outdated cookie version
    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return { value: 'outdated-version' }
      }
      if (name === LANGUAGE_COOKIE_NAME) {
        return { value: 'en' }
      }
      return null
    })

    mockRequest.cookies.has.mockImplementation((name) => {
      return name === LANGUAGE_COOKIE_NAME
    })

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      LANGUAGE_COOKIE_NAME,
      'en',
      COOKIE_SETTINGS[LANGUAGE_COOKIE_NAME]
    )
  })

  it('should set cookie version when no cookie version exists', () => {
    // Mock no existing cookie version
    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return null
      }
      return null
    })

    mockRequest.cookies.has.mockReturnValue(false)

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      COOKIE_VERSION_NAME,
      COOKIE_VERSION_VALUE,
      COOKIE_SETTINGS[COOKIE_VERSION_NAME]
    )
  })

  it('should update cookie version when it is outdated', () => {
    // Mock outdated cookie version
    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return { value: 'outdated-version' }
      }
      return null
    })

    mockRequest.cookies.has.mockReturnValue(false)

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      COOKIE_VERSION_NAME,
      COOKIE_VERSION_VALUE,
      COOKIE_SETTINGS[COOKIE_VERSION_NAME]
    )
  })

  it('should handle multiple cookies correctly', () => {
    // Create a mock custom cookie name for testing
    const CUSTOM_COOKIE_NAME = 'custom_cookie'

    // Add the custom cookie to our mock settings
    const testCookieSettings = {
      ...COOKIE_SETTINGS,
      [CUSTOM_COOKIE_NAME]: {
        path: '/',
        sameSite: 'strict',
      },
    }

    // Mock the custom settings for this test
    jest.mock('@medieteknik/constants', () => ({
      ...jest.requireActual('@medieteknik/constants'),
      COOKIE_SETTINGS: testCookieSettings,
    }))

    // Mock multiple cookies
    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return { value: 'outdated-version' }
      }
      if (name === LANGUAGE_COOKIE_NAME) {
        return { value: 'sv' }
      }
      if (name === CUSTOM_COOKIE_NAME) {
        return { value: 'custom-value' }
      }
      return null
    })

    mockRequest.cookies.has.mockImplementation((name) => {
      return name === LANGUAGE_COOKIE_NAME || name === CUSTOM_COOKIE_NAME
    })

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    expect(mockResponse.cookies.set).toHaveBeenCalledTimes(2) // 2 cookies + version
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      LANGUAGE_COOKIE_NAME,
      'sv',
      COOKIE_SETTINGS[LANGUAGE_COOKIE_NAME]
    )
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      COOKIE_VERSION_NAME,
      COOKIE_VERSION_VALUE,
      COOKIE_SETTINGS[COOKIE_VERSION_NAME]
    )
  })

  it('should not update cookies that do not exist in the request', () => {
    // Mock no existing cookies except version
    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return { value: 'outdated-version' }
      }
      return null
    })

    mockRequest.cookies.has.mockReturnValue(false)

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    expect(mockResponse.cookies.set).toHaveBeenCalledTimes(1) // Only version cookie
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      COOKIE_VERSION_NAME,
      COOKIE_VERSION_VALUE,
      COOKIE_SETTINGS[COOKIE_VERSION_NAME]
    )
  })

  it('should skip cookies that exist in request but not in COOKIE_SETTINGS', () => {
    // Mock a cookie that's not in settings
    const NON_EXISTENT_COOKIE = 'non_existent_cookie'

    mockRequest.cookies.get.mockImplementation((name) => {
      if (name === COOKIE_VERSION_NAME) {
        return { value: 'outdated-version' }
      }
      if (name === NON_EXISTENT_COOKIE) {
        return { value: 'some-value' }
      }
      return null
    })

    mockRequest.cookies.has.mockImplementation((name) => {
      return name === NON_EXISTENT_COOKIE
    })

    const result = handleCookieUpdates(mockRequest, mockResponse)

    expect(result).toBe(mockResponse)
    // Only setting cookie version, not updating the non-existent cookie
    expect(mockResponse.cookies.set).toHaveBeenCalledTimes(1)
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      COOKIE_VERSION_NAME,
      COOKIE_VERSION_VALUE,
      COOKIE_SETTINGS[COOKIE_VERSION_NAME]
    )
  })
})

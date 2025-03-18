/**
 * @name ApiSuccessResponse
 * @description The API success response object with data, but no error
 */
type ApiSuccessResponse<T> = {
  data: T
  error: null
}

/**
 * @name ApiErrorResponse
 * @description The API error response object with no data, but an error
 */
type ApiErrorResponse<T> = {
  data: T extends unknown[] ? T : null
  error: Error
}

/**
 * @name ApiResponse
 * @description The API response object with a successful response or an error response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse<T>

/**
 * @name createSuccessResponse
 * @description Create a successful API response object with no error
 *
 * @param {T} data - The data to return
 * @returns {ApiSuccessResponse<T>} The successful API response object
 */
function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    data,
    error: null,
  }
}

/**
 * @name createErrorResponse
 * @description Create an error API response object with an error, but no data. If the T type is an array, it will return an empty array.
 *
 * @param {Error} error - The error to return
 * @returns {ApiErrorResponse<T>} The error API response object
 */
function createErrorResponse<T>(error: Error): ApiErrorResponse<T> {
  return {
    data: [] as T extends unknown[] ? T : null,
    error,
  }
}

/**
 * @name fetchData
 * @description Fetch data from an API endpoint and returns an object with the data or an error
 *
 * @param {string} url - The URL to fetch data from
 * @param {RequestInit} options - The fetch options (mainly used for next revalidation)
 * @returns {Promise<ApiResponse<T>>} The API response
 */
export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: T = await response.json()
    return createSuccessResponse<T>(data)
  } catch (error) {
    return createErrorResponse<T>(
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

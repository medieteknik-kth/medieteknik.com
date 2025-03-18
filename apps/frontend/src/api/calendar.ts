import { type ApiResponse, fetchData } from '@/api/api'
import type { LanguageCode } from '@/models/Language'
import type Event from '@/models/items/Event'
import { API_BASE_URL } from '@/utility/Constants'

/**
 * @name getEvents
 * @description Get the events for a specific date and language
 *
 * @param {Date} date - The date to get events for
 * @param {LanguageCode} language - The language to get events in
 * @param {number} revalidate - The time in seconds to revalidate the data (default: 15 minutes)
 * @returns {Promise<ApiResponse<Event[]>>} The API response with the events or an error
 */
export const getEvents = async (
  date: Date,
  language: LanguageCode,
  revalidate = 60 // 1 minute
): Promise<ApiResponse<Event[]>> => {
  const convertedDate = date.toISOString().substring(0, 7)
  const { data, error } = await fetchData<Event[]>(
    `${API_BASE_URL}/public/calendar/events?date=${convertedDate}&language=${language}`,
    {
      next: {
        revalidate: revalidate,
      },
    }
  )

  if (error) {
    return { data, error }
  }

  return { data, error: null }
}

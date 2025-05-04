/**
 * @name sortByCreatedAt
 * @description Sorts an array of items by their created_at property.
 *
 * @param {T[]} items - The array of items to sort. Has to be an array of objects with a created_at property.
 * @param {boolean} descending - If true, sorts in descending order. If false, sorts in ascending order. Defaults to true.
 * @returns {T[]} - The sorted array of items.
 */
export function sortByCreatedAt<T extends { created_at: string | Date }>(
  items: T[],
  descending = true,
  ignoreErrors = false
): T[] {
  if (!Array.isArray(items)) {
    if (!ignoreErrors) {
      console.error('Invalid input: items should be an array')
    }
    return []
  }

  if (items.length === 0) {
    return items
  }

  return [...items].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)

    if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
      if (!ignoreErrors) {
        console.error(
          'Invalid date format:',
          a.created_at,
          b.created_at,
          'in items',
          items
        )
      }
      return 0
    }

    if (descending) {
      return dateB.getTime() - dateA.getTime()
    }

    return dateA.getTime() - dateB.getTime()
  })
}

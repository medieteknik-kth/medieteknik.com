/**
 * Returns an array of dates representing the last week of the previous month adjusted to include only dates that are before the start of the current month.
 *
 * @param {Date} date - The current date.
 * @return {Date[]} An array of dates representing the last week of the previous month adjusted to include only dates that are before the start of the current month.
 */
export function getPreviousMonthLastWeekToCurrent(date: Date): Date[] {
  const firstDayOfCurrentMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  )
  const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth)
  lastDayOfPreviousMonth.setDate(0)
  const result: Date[] = []
  
  // If the first day of the month is also the first day of the week, return an empty array
  if (firstDayOfCurrentMonth.getDay() === 1) {
    return result;
  }
  
  let currentDay = new Date(lastDayOfPreviousMonth)
  // Go back to the Monday (or first day of the week) of the last week
  const daysToSubtract = (currentDay.getDay() + 6) % 7
  currentDay.setDate(currentDay.getDate() - daysToSubtract)
  
  // Add days until we reach the first day of the current month
  while (currentDay < firstDayOfCurrentMonth) {
    result.push(new Date(currentDay))
    currentDay.setDate(currentDay.getDate() + 1)
  }
  
  return result
}
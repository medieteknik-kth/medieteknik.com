import { Event } from '@/models/Items'

interface Props {
  event: Event
  onEventClick?: (event: Event) => void
}

/**
 * @name EventComponent
 * @description This component is used to display an event in the calendar.
 *
 * @param {Props} props
 * @param {Event} props.event - The event to display.
 * @param {(event: Event) => void} props.onEventClick - The callback function when the event is clicked.
 *
 * @returns {JSX.Element} The event component.
 */
export default function EventComponent({
  event,
  onEventClick,
}: Props): JSX.Element {
  const tinycolor = require('tinycolor2')
  const tinyEventColor = tinycolor(event.background_color)

  return (
    <li
      className={`w-2 h-4 sm:w-full sm:h-fit px-2 py-0.5 z-50 rounded-2xl text-xs overflow-hidden
        ${
          tinycolor(event.background_color).isDark()
            ? 'text-white'
            : 'text-black'
        }
        ${event.background_color === '#FFFFFF' && 'border dark:border-none'}`}
      style={{
        backgroundColor: tinyEventColor.isDark()
          ? tinyEventColor.darken(15).toString()
          : event.background_color,
      }}
      onMouseEnter={(e) => {
        e.stopPropagation()
        // Hover effect
        const bg = tinycolor(event.background_color)
        e.currentTarget.style.backgroundColor = bg.isDark()
          ? bg.darken(10).toString()
          : bg.lighten(10).toString()
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        e.currentTarget.style.backgroundColor = event.background_color
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (onEventClick) onEventClick(event)
      }}
    >
      <p className='truncate hidden sm:block'>{event.translations[0].title}</p>
    </li>
  )
}

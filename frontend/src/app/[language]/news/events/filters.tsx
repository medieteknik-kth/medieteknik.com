import { Event } from './events'

export default function Filters({
  params: { language, nonHighlightedEvents, setFilteredEvents, filteredEvents },
}: {
  params: {
    language: string
    nonHighlightedEvents: Event[]
    setFilteredEvents: Function
    filteredEvents: Event[]
  }
}) {
  const filters = [
    {
      title: 'Category',
      options: ['Administrative', 'Social', 'Educational'],
      type: 'checkbox',
    },
    {
      title: 'Date Range',
      options: ['Date'],
      type: 'range',
    },
  ]

  return (
    <div>
      <h2 className='text-black text-xl font-bold py-4'>Filters</h2>
      <ul className='text-black'>
        {filters.map((filter, index) => (
          <li key={index} className='w-full h-fit'>
            <div
              className='w-full h-fit flex flex-col justify-between relative py-1 rounded-lg'
              title={filter.title}
              aria-label={filter.title}
            >
              <h3 className='text-lg'>{filter.title}</h3>
              <ul className='h-fit px-2'>
                {filter.options.map((option, index) => (
                  <li key={index} className='w-full h-fit pt-1 flex'>
                    {filter.type === 'range' ? (
                      <div className='w-full flex justify-between items-center'>
                        <input
                          type='date'
                          className='w-fit h-fit bg-white rounded-lg border-2 border-gray-300 px-1 py-1 -ml-2'
                          onChange={(e) => {
                            setFilteredEvents(
                              [...nonHighlightedEvents].filter((event) => {
                                return (
                                  new Date(event.startDate).getTime() >
                                  new Date(e.target.value).getTime()
                                )
                              })
                            )
                          }}
                          defaultValue={
                            new Date(nonHighlightedEvents[0].startDate)
                              .toISOString()
                              .split('T')[0]
                          }
                        />
                        <p className='px-2'>to</p>
                        <input
                          type='date'
                          className='w-fit h-fit bg-white rounded-lg border-2 border-gray-300 px-1 py-1 -mr-2'
                          onChange={(e) => {
                            setFilteredEvents(
                              [...nonHighlightedEvents].filter((event) => {
                                return (
                                  new Date(event.endDate).getTime() <
                                  new Date(e.target.value).getTime()
                                )
                              })
                            )
                          }}
                          defaultValue={
                            new Date(
                              nonHighlightedEvents[
                                nonHighlightedEvents.length - 1
                              ].startDate
                            )
                              .toISOString()
                              .split('T')[0]
                          }
                        />
                      </div>
                    ) : filter.type === 'checkbox' ? (
                      <div className='flex'>
                        <input
                          type='checkbox'
                          defaultChecked
                          className='mr-2'
                          onChange={(e) => {
                            if (!e.target.checked) {
                              setFilteredEvents(
                                [...filteredEvents].filter(
                                  (event) => event.category !== option
                                )
                              )
                            } else {
                              setFilteredEvents(
                                [...filteredEvents].concat(
                                  [...nonHighlightedEvents].filter(
                                    (event) => event.category === option
                                  )
                                )
                              )
                            }
                          }}
                        />
                        <p>{option}</p>
                      </div>
                    ) : (
                      ''
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

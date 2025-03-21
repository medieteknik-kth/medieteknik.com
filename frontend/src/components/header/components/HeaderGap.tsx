import type { JSX } from 'react'

/**
 * @name HeaderGap
 * @description A gap to be used in elements that need to be spaced from the top of the page, as the header is fixed without a margin
 *
 * @returns {JSX.Element} The gap depening on the screen size
 */
export default function HeaderGap(): JSX.Element {
  return (
    <div id='gap' className='w-full h-20 lg:h-28 bg-inherit hidden md:block' />
  )
}

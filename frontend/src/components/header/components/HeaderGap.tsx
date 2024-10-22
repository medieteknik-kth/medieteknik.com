import type { JSX } from "react";
/**
 * @name HeaderGap
 * @description A gap to be used in elements that need to be spaced from the top of the page, as the header is fixed without a margin
 * @returns {JSX.Element} The gap depening on the screen size
 */
export default function HeaderGap(): JSX.Element {
  return <div className='h-16 lg:h-24 bg-black' />
}

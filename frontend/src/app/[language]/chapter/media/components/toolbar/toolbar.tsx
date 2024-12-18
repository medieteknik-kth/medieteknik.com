import ToolbarAuth from '@/app/[language]/chapter/media/components/toolbar/auth'
import { LanguageCode } from '@/models/Language'
import { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name MediaToolbar
 * @description The toolbar for the media page
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {Promise<JSX.Element>} The media toolbar
 */
export default async function MediaToolbar({
  language,
}: Props): Promise<JSX.Element> {
  return (
    <div className='w-full h-fit py-2 px-2 sm:px-5 md:px-10 border-b-2'>
      <ToolbarAuth language={language} />
    </div>
  )
}

import { useTranslation } from '@/app/i18n/client'
import { LanguageCode } from '@/models/Language'
import { LANGUAGES } from '@/utility/Constants'
import tinycolor from 'tinycolor2'

interface Props {
  language: string
  currentColor: string
  translations: { language_code?: string; title: string }[]
}

/**
 * @name EventPreview
 * @description Preview of the event when creating or editing an event
 *
 * @param {Props} props - The props for the component
 * @param {string} props.language - The language of the component
 * @param {string} props.currentColor - The current color of the event
 * @param {{ language_code?: string; title: string }[]} props.translations - The translations of the event
 * @returns {JSX.Element} The event preview
 */
export default function EventPreview({
  language,
  currentColor,
  translations,
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'bulletin')

  return (
    <>
      <h2 className='text-lg font-semibold leading-none tracking-tight mb-2'>
        {t('event.form.preview')}
      </h2>
      <div className='w-52 min-h-36 h-fit border relative self-center'>
        <p className='absolute top-2 left-2 text-2xl text-neutral-400 select-none'>
          1
        </p>
        <div className='w-full h-fit relative top-10 mb-12 left-0 px-2 flex flex-col gap-1'>
          {translations.map((translation, index) => (
            <div
              key={index}
              className={`w-full text-xs rounded-2xl px-2 py-0.5 h-6 border font-bold overflow-hidden ${
                tinycolor(currentColor).isDark() ? 'text-white' : 'text-black'
              }`}
              style={{
                backgroundColor: currentColor,
              }}
              onMouseEnter={(e) => {
                e.stopPropagation()
                const bg = tinycolor(currentColor)
                if (bg.isDark()) {
                  e.currentTarget.style.backgroundColor = bg
                    .lighten(10)
                    .toString()
                } else {
                  e.currentTarget.style.backgroundColor = bg
                    .darken(10)
                    .toString()
                }
              }}
              onMouseLeave={(e) => {
                e.stopPropagation()
                e.currentTarget.style.backgroundColor = currentColor
              }}
            >
              <div className='w-2 absolute -left-6'>
                <span
                  className={`fi fi-${
                    LANGUAGES[translation.language_code as LanguageCode].flag
                  } mr-1`}
                />
              </div>
              <p className='truncate'>{translation.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

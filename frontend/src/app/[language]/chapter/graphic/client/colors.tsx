'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState, useRef } from 'react'

/**
 * @interface Props
 * @property {string} language - The currently selected language
 */
interface Props {
  language: string
}

/**
 * @name Colors
 * @description The relevant colors for the graphical identity
 *
 * @param {Props} props - The component properties
 * @param {string} props.language - The currently selected language
 * @returns {JSX.Element} The relevant colors for the graphical identity
 */
export default function Colors({ language }: Props): JSX.Element {
  const [mac, setMac] = useState(false)
  const { toast } = useToast()
  const tinycolor = require('tinycolor2')
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useTranslation(language, 'graphic')
  const allColors = [
    {
      hex: '#EEC912',
      cmyk: '0, 15.55, 92.44, 6.67',
    },
    {
      hex: '#FACC15',
      cmyk: '0, 18.4, 91.6, 1.96',
    },
    {
      hex: '#B0B0B0',
      cmyk: '0, 0, 0, 30.98',
    },
    {
      hex: '#545454',
      cmyk: '0, 0, 0, 67.06',
    },
    {
      hex: '#0C0A09',
      cmyk: '0, 16.67, 25, 95.29',
    },
    {
      hex: '#111111',
      cmyk: '0, 0, 0, 93.33',
    },
    {
      hex: '#222222',
      cmyk: '0, 0, 0, 86.67',
    },
  ]

  const handleTouchStart = (color: string) => {
    touchTimeoutRef.current = setTimeout(() => {
      navigator.clipboard.writeText(color)
      toast({
        title: t('colors.copied'),
        description: color,
      })
    }, 500)
  }

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current)
      touchTimeoutRef.current = null
    }
  }

  return (
    <section id='colors' className='px-12 mb-8'>
      <div className='py-4'>
        <h2 className='font-bold text-3xl uppercase tracking-wide'>
          {t('colors')}
        </h2>
        <p className='pb-2'>{t('colors.description')}</p>

        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-1'>
            <span className='py-0.5 px-0.5 border rounded-md shadow shadow-black/20 dark:shadow-white/20 select-none'>
              {t('colors.click_button')}
            </span>
            <p className='py-0.5 flex items-center text-neutral-600 dark:text-neutral-300'>
              {t('colors.click_action')}
            </p>
          </div>

          <div className='items-center gap-1 hidden md:flex'>
            <span
              className='py-0.5 px-0.5 border rounded-md shadow shadow-black/20 dark:shadow-white/20 select-none'
              onMouseOver={() => setMac(true)}
              title='CTRL on Windows/Linux, ⌘ CMD on macOS'
            >
              {mac ? '⌘ CMD' : 'CTRL'}
            </span>
            <span className='select-none'>+</span>
            <span className='py-0.5 px-0.5 border rounded-md shadow shadow-black/20 dark:shadow-white/20 select-none'>
              {t('colors.click_button')}
            </span>
            <p className='py-0.5 flex items-center text-neutral-600 dark:text-neutral-300'>
              {t('colors.secondary_click_action')}
            </p>
          </div>
        </div>
        <div className='items-center gap-1 flex md:hidden'>
          <span className='py-0.5 px-0.5 border rounded-md shadow shadow-black/20 dark:shadow-white/20 select-none'>
            HOLD
          </span>
          <p className='py-0.5 flex items-center text-neutral-600 dark:text-neutral-300'>
            {t('colors.secondary_click_action')}
          </p>
        </div>
      </div>

      <ul className='flex flex-wrap gap-4 justify-center lg:justify-start'>
        {allColors.map((color) => (
          <li
            key={color.hex}
            className='w-36 md:w-72 aspect-square grid place-items-center rounded-md dark:border'
            style={{
              backgroundColor: color.hex,
            }}
          >
            <Button
              className={`w-full h-full bg-inherit transition-transform ${
                tinycolor(color.hex).isDark()
                  ? 'text-white hover:text-white'
                  : 'text-black hover:text-black'
              } hover:bg-inherit hover:scale-105`}
              variant={'ghost'}
              title='Click to copy color'
              onClick={(event) => {
                if (event.ctrlKey) {
                  navigator.clipboard.writeText(color.cmyk)
                  toast({
                    title: t('colors.copied'),
                    description: color.cmyk,
                  })
                  return
                }
                navigator.clipboard.writeText(color.hex)
                toast({
                  title: t('colors.copied'),
                  description: color.hex,
                })
              }}
              onTouchStart={() => handleTouchStart(color.cmyk)}
              onTouchEnd={handleTouchEnd}
            >
              <div>
                <strong>
                  <p className='text-lg md:text-2xl tracking-wider'>
                    {color.hex}
                  </p>
                </strong>
                <p className='text-xs md:text-base tracking-tight'>
                  {color.cmyk}
                </p>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

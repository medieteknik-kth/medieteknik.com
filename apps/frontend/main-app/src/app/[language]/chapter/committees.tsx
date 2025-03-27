'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CarouselApi } from '@/components/ui/carousel'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { type JSX, useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[]
}

/**
 * @name Committees
 * @description Renders the committees section, with a carousel of the public committees
 *
 * @param {Props} props
 * @param {string} props.language - The current language of the page
 * @param {Committee[]} props.committees - The committees to render
 *
 * @returns {JSX.Element} The rendered committees section
 */
export default function Committees({
  language,
  committees,
}: Props): JSX.Element {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [Autoplay({ delay: 6_000, stopOnInteraction: false })]
  )
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })
  const { t } = useTranslation(language, 'chapter')

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  const translation = (committee: Committee) =>
    committee.translations.find(
      (t) => t.language_code.substring(0, 2) === language
    )

  return (
    <section
      className='px-2 sm:px-5 md:px-12 h-fit my-10 relative flex flex-col gap-4'
      id='committees'
    >
      <Link
        href={`/${language}/chapter/committees`}
        className='uppercase tracking-wider font-semibold text-2xl sm:text-4xl w-full lg:w-1/2 hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
      >
        {t('committees')}
      </Link>
      <div className='w-full px-4'>
        <div className='overflow-hidden' ref={emblaMainRef}>
          <div className='flex touch-pan-y touch-pinch-zoom'>
            {committees
              .sort((a, b) =>
                a.translations[0].title.localeCompare(b.translations[0].title)
              )
              .map((committee) => (
                <div
                  key={committee.translations[0].title}
                  className='flex-shrink-0 w-full ml-1 basis-[100%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'
                >
                  <Card className='h-full flex flex-col justify-between'>
                    <CardHeader className='flex flex-row flex-wrap items-center gap-4'>
                      <div className='bg-white w-16 h-16 z-10 rounded-md'>
                        <Image
                          src={committee.logo_url}
                          alt={`${committee.translations[0].title} logo`}
                          unoptimized={true} // Logos are SVGs, so they don't need to be optimized
                          width={64}
                          height={64}
                          className='w-auto h-16 aspect-square object-contain p-2'
                        />
                      </div>
                      <div>
                        <CardTitle className='flex items-center gap-3 text-lg sm:text-xl md:text-2xl'>
                          {committee.translations[0].title}
                        </CardTitle>
                        <CardDescription>
                          <Link
                            href={`mailto:${committee.email}`}
                            className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
                          >
                            {committee.email}
                          </Link>
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className='select-none'>
                      <p className='text-xs xs:text-sm text-neutral-700 dark:text-neutral-300'>
                        {translation(committee)?.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link
                          href={`/${language}/chapter/committees/${encodeURIComponent(
                            committee.translations[0].title.toLowerCase()
                          )}`}
                        >
                          {t('readMore')}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
          </div>
        </div>

        <div className='py-2'>
          <div ref={emblaThumbsRef} className='overflow-hidden'>
            <div className='flex gap-2'>
              {committees
                .sort((a, b) =>
                  a.translations[0].title.localeCompare(b.translations[0].title)
                )
                .map((committee, index) => (
                  <div key={committee.translations[0].title}>
                    <Button
                      variant='outline'
                      size='icon'
                      className={`w-16 h-auto aspect-square p-2.5 overflow-visible relative hover:brightness-95 bg-white hover:bg-white ${
                        selectedIndex === index ? 'brightness-95' : ''
                      }`}
                      onClick={() => onThumbClick(index)}
                      title={`${translation(committee)?.title} thumbnail'`}
                    >
                      <Image
                        src={committee.logo_url}
                        alt={`${committee.translations[0].title} logo`}
                        unoptimized={true} // Logos are SVGs, so they don't need to be optimized
                        width={64}
                        height={64}
                        className='w-auto h-full object-contain overflow-visible'
                      />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

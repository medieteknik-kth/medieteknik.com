'use client'

import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Committee from '@/models/Committee'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'
import { JSX, useCallback, useEffect, useState } from 'react'

interface Props {
  language: string
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
  const [_, setSelectedIndex] = useState(0)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({})
  const { t } = useTranslation(language, 'chapter')

  const onThumbClick = (index: number) =>
    useCallback(() => {
      if (!api || !emblaThumbsApi) {
        return
      }
      api.scrollTo(index)
    }, [index])

  const onSelect = useCallback(() => {
    if (!api || !emblaThumbsApi) {
      return
    }
    setSelectedIndex(api.selectedScrollSnap())
    emblaThumbsApi.scrollTo(api.selectedScrollSnap())
  }, [api, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!api || !emblaThumbsApi) {
      return
    }
    onSelect()
    api.on('select', onSelect).on('reInit', onSelect)
  }, [api, onSelect, emblaThumbsApi])

  const translation = (committee: Committee) =>
    committee.translations.find(
      (t) => t.language_code.substring(0, 2) === language
    )

  return (
    <section className='px-4 sm:px-20 h-fit my-10 relative' id='committees'>
      <Link
        href={`/${language}/chapter/committees`}
        className='uppercase tracking-wider font-semibold text-2xl sm:text-4xl w-full lg:w-1/2 block border-b-2 border-yellow-400 pb-4 mb-10 transition-colors text-blue-500 hover:text-yellow-400'
      >
        {t('committees')}
      </Link>
      <div className='w-full mt-10'>
        <Carousel
          className='w-full'
          setApi={setApi}
          opts={{
            loop: true,
            align: 'center',
            watchDrag: true,
          }}
          plugins={[Autoplay({ delay: 5000 })]}
        >
          <CarouselContent className='-ml-4'>
            {committees
              .sort((a, b) =>
                a.translations[0].title.localeCompare(b.translations[0].title)
              )
              .map((committee, index) => (
                <CarouselItem
                  key={index}
                  className='basis-full lg:basis-1/2 xl:basis-1/3 min-h-[400px] pl-4'
                >
                  <Card className='h-full flex flex-col justify-between'>
                    <CardHeader>
                      <CardTitle className='flex flex-col gap-2 text-lg sm:text-xl md:text-2xl'>
                        <Avatar className='bg-white w-16 h-16 z-10'>
                          <AvatarImage
                            src={committee.logo_url}
                            width={64}
                            height={64}
                            className='w-auto h-16 aspect-square object-contain p-2'
                          />
                          <AvatarFallback>
                            <Image
                              src={FallbackImage}
                              alt='Committee Fallback image'
                              width={100}
                              height={100}
                            />
                          </AvatarFallback>
                        </Avatar>
                        {committee.translations[0].title}
                      </CardTitle>
                      <CardDescription>
                        <Link
                          href={`mailto:${committee.email}`}
                          className='text-blue-500 hover:text-yellow-400 text-xs xs:text-sm'
                        >
                          {committee.email}
                        </Link>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='select-none'>
                      <p className='text-xs xs:text-sm text-neutral-700 dark:text-neutral-300'>
                        {translation(committee)?.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link
                          href={`/${language}/chapter/committees/${committee.translations[0].title}`}
                        >
                          {t('readMore')}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious
            title='previous'
            aria-label='previous committee'
            className='hidden md:flex'
          />
          <CarouselNext
            title='next'
            aria-label='next committee'
            className='hidden md:flex'
          />
        </Carousel>

        <div
          ref={emblaThumbsRef}
          className='w-full flex flex-wrap gap-4 justify-center py-2'
        >
          {committees
            .sort((a, b) =>
              a.translations[0].title.localeCompare(b.translations[0].title)
            )
            .map((committee, index) => (
              <Button
                key={index}
                variant='outline'
                size='icon'
                className={`w-16 h-auto aspect-square p-2.5 overflow-visible relative hover:brightness-95 bg-white hover:bg-white ${
                  api?.selectedScrollSnap() === index && 'brightness-95'
                }`}
                onClick={onThumbClick(index)}
                title={translation(committee)?.title + ' thumbnail' || ''}
              >
                <Image
                  src={committee.logo_url}
                  alt={`${committee.translations[0].title} logo`}
                  width={64}
                  height={64}
                  className='w-auto h-full object-contain overflow-visible'
                />
              </Button>
            ))}
        </div>
      </div>
    </section>
  )
}

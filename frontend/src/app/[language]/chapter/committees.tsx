'use client'
import './committees.css'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Committee from '@/models/Committee'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'
import { useCallback, useEffect, useState } from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import Autoplay from 'embla-carousel-autoplay'
import ClassNames from 'embla-carousel-class-names'

interface Props {
  language: string
  committees: Committee[]
}

export default function Committees({ language, committees }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({})

  const onThumbClick = (index: number) =>
    useCallback(() => {
      if (!api || !emblaThumbsApi) {
        return
      }
      api.scrollTo(index)
    }, [api, emblaThumbsApi])

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
  }, [api, onSelect])

  const hasGroupPhoto = (committee: Committee) => !!committee.group_photo_url

  const translation = (committee: Committee) =>
    committee.translations.find(
      (t) => t.language_code.substring(0, 2) === language
    )
  const link = (committee: Committee) =>
    committee.translations.find((t) => t.language_code.substring(0, 2) === 'sv')

  return (
    <section className='px-4 sm:px-20 h-fit my-10 relative' id='tab-committees'>
      <Link
        href={`/${language}/chapter/committees`}
        className='uppercase tracking-wider font-semibold text-2xl sm:text-4xl w-full lg:w-1/2 block border-b-2 border-yellow-400 pb-4 mb-10 transition-colors text-blue-500 hover:text-yellow-400'
      >
        Committees
      </Link>
      <div className='w-full mt-10'>
        <Carousel
          className='carousel w-full'
          setApi={setApi}
          opts={{
            loop: true,
            align: 'center',
            watchDrag: true,
          }}
          plugins={[
            Autoplay({ delay: 5000 }),
            ClassNames({ inView: 'in-view', snapped: 'snapped' }),
          ]}
        >
          <CarouselContent className='flex -pl-4'>
            {committees
              .sort((a, b) =>
                a.translations[0].title.localeCompare(b.translations[0].title)
              )
              .map((committee, index) => (
                <CarouselItem
                  key={index}
                  className='item h-[900px] md:h-[500px] relative rounded-md overflow-hidden ml-4'
                >
                  <div className='blurred w-full h-full backdrop-blur-0 z-20 absolute left-0' />

                  {hasGroupPhoto(committee) && (
                    <div className='rounded-md'>
                      <Image
                        src={committee.group_photo_url || ''}
                        alt={`${committee.translations[0].title} group photo`}
                        width={1000}
                        height={500}
                        className='w-full h-full object-cover absolute'
                      />
                      <div className='w-full h-full bg-black/75 z-10 absolute' />
                    </div>
                  )}
                  <div
                    className={`p-4 h-fit flex flex-col gap-4 ${
                      hasGroupPhoto(committee) && 'text-white'
                    }`}
                  >
                    <Link
                      href={`/${language}/chapter/committees/${
                        link(committee) && link(committee)?.title.toLowerCase()
                      }`}
                      title={translation(committee)?.title + ' page' || ''}
                      className='flex flex-col items-start md:flex-row md:items-center z-10 border-yellow-400 hover:text-yellow-400 pb-2'
                    >
                      <Avatar className='bg-white w-16 h-16 z-10'>
                        <AvatarImage
                          src={committee.logo_url}
                          alt={`${committee.translations[0].title} logo`}
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
                      <p
                        className={`text-lg uppercase font-bold md:ml-4 tracking-wider z-10 text-center md:text-start`}
                      >
                        {translation(committee)?.title}
                      </p>
                    </Link>
                    <div className='z-10 h-fit'>
                      <h3 className='text-lg tracking-wider my-1 font-semibold text-center md:text-start'>
                        Description
                      </h3>
                      <p className='h-fit text-pretty overflow-hidden break-words text-center md:text-start'>
                        {translation(committee)?.description || ''}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious title='previous' aria-label='previous committee' />
          <CarouselNext title='next' aria-label='next committee' />
        </Carousel>
        <div>
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
      </div>
    </section>
  )
}

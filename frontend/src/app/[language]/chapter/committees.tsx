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
    <section
      className='px-20 h-fit max-h-[1080px] my-10 relative'
      id='tab-committees'
    >
      <Link
        href={`/${language}/chapter/committees`}
        className='uppercase tracking-wider font-semibold text-4xl w-1/2 block border-b-2 border-yellow-400 pb-4 mb-10 transition-colors text-blue-500 hover:text-yellow-400'
      >
        Committees
      </Link>
      <div className='w-full mt-10'>
        <Carousel
          className='carousel w-[750px] lg:w-full'
          setApi={setApi}
          opts={{
            loop: true,
            align: 'start',
            watchDrag: false,
          }}
          plugins={[
            //Autoplay({ delay: 5000 }),
            ClassNames({ inView: 'in-view', snapped: 'snapped' }),
          ]}
        >
          <CarouselContent className='flex gap-2 !ml-0'>
            {committees
              .sort((a, b) =>
                a.translations[0].title.localeCompare(b.translations[0].title)
              )
              .map((committee, index) => (
                <CarouselItem
                  key={index}
                  className='item h-[500px] relative rounded-md overflow-hidden !pl-0'
                >
                  <div className='blurred w-full h-full backdrop-blur-sm z-20 absolute left-0' />

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
                    className={`p-4 flex flex-col gap-4 ${
                      hasGroupPhoto(committee) && 'text-white'
                    }`}
                  >
                    <Link
                      href={`/${language}/chapter/committees/${
                        link(committee) && link(committee)?.title.toLowerCase()
                      }`}
                      className='flex items-center z-10  border-yellow-400 hover:text-yellow-400 pb-2'
                    >
                      <Avatar className='bg-white w-16 h-16 z-10'>
                        <AvatarImage
                          src={committee.logo_url}
                          alt={`${committee.translations[0].title} logo`}
                          width={64}
                          height={64}
                          className='w-auto h-16 object-cover p-1.5'
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
                        className={`text-lg uppercase font-bold ml-4 tracking-wider z-10`}
                      >
                        {translation(committee)?.title}
                      </p>
                    </Link>
                    <div className='z-10'>
                      <h3 className='text-lg tracking-wider my-1 font-semibold'>
                        Objective
                      </h3>
                      <p className=''>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Mollitia repellat id corrupti beatae voluptate
                        perspiciatis dicta, dolore maxime quae nesciunt, fugit
                        reprehenderit quaerat. Accusantium esse, sunt eveniet
                        quisquam quae deleniti!
                      </p>

                      <h3 className='text-lg tracking-wider my-1 font-semibold'>
                        Goals
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Mollitia repellat id corrupti beatae voluptate
                        perspiciatis dicta, dolore maxime quae nesciunt, fugit
                        reprehenderit quaerat. Accusantium esse, sunt eveniet
                        quisquam quae deleniti!
                      </p>

                      <h3 className='text-lg tracking-wider my-1 font-semibold'>
                        Daily Activity
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Mollitia repellat id corrupti beatae voluptate
                        perspiciatis dicta, dolore maxime quae nesciunt, fugit
                        reprehenderit quaerat. Accusantium esse, sunt eveniet
                        quisquam quae deleniti!
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
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
                  title='thumb'
                >
                  <Image
                    src={committee.logo_url}
                    alt='img'
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

'use client'
import { StaticImageData } from 'next/image'
import Link from 'next/link'
import ComputerScienceBG from '/public/images/cs.jpg'
import InteractiveMediaBG from '/public/images/imt.jpg'
import ICTBG from '/public/images/ict.jpg'
import MachineLearingBG from '/public/images/ml.jpg'
import SustainableDigitalisationBG from '/public/images/sd.jpg'
import KTH from 'public/images/svg/kth.svg'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import './masters.css'
import ClassNames from 'embla-carousel-class-names'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Section } from '@/components/static/Static'
import { useTranslation } from '@/app/i18n/client'

interface CarouselItem {
  id: number
  title: string
  description: string
  image: StaticImageData
  kthLink: string
  keyAreas: string[]
}

interface Master {
  title: string
  description: string
  kth_link: string
  flags?: {
    flag: string
    description: string
  }[]
  tags: string[]
}

export default function Masters({ language }: { language: string }) {
  const { t } = useTranslation(language, 'education')

  const masters: Master[] = t('masters', { returnObjects: true })

  return (
    <Section
      title={t('master_programs')}
      metadata={{
        background: '#222222',
        textColor: '#ffffff',
      }}
    >
      <div className='w-full flex justify-center'>
        <Carousel
          className='carousel h-full w-7/12 md:w-9/12 py-10'
          opts={{
            loop: true,
            align: 'center',
          }}
          plugins={[ClassNames({ inView: 'in-view', snapped: 'snapped' })]}
        >
          <CarouselContent className='w-full ml-0 xl:-pl-4'>
            {masters.map((item) => (
              <CarouselItem
                key={item.title}
                className='basis-full xl:basis-1/3 relative rounded-md overflow-hidden grid place-items-center pl-0 xl:pl-4'
              >
                <div className='blurred w-full h-full z-20 absolute left-4 rounded-md' />

                <Card className='w-fit h-[900px] md:h-[700px] xl:h-[550px] flex flex-col justify-between'>
                  <CardHeader className='w-fit'>
                    <CardTitle>{item.title}</CardTitle>
                    <div className='flex flex-wrap gap-1'>
                      {item.tags.map((keyArea, index) => (
                        <Badge
                          key={index}
                          variant={
                            index === 0
                              ? 'default'
                              : index > 2
                              ? 'outline'
                              : 'secondary'
                          }
                          className='select-none'
                        >
                          {keyArea}
                        </Badge>
                      ))}{' '}
                    </div>
                  </CardHeader>
                  <CardContent>{item.description}</CardContent>
                  <CardFooter className='flex justify-center sm:justify-start'>
                    <Link
                      href={item.kth_link}
                      target='_blank'
                      className='w-20 sm:w-full h-20 flex items-center justify-center sm:justify-start gap-2 hover:underline underline-offset-4 dark:decoration-yellow-400 decoration-sky-700 border rounded-md px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    >
                      <KTH className='w-10 h-10 rounded-md' />
                      <p className='hidden sm:block'>{t('read_more')}</p>
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='*:stroke-black dark:*:stroke-white' />
          <CarouselNext className='*:stroke-black dark:*:stroke-white' />
        </Carousel>
      </div>
    </Section>
  )
}

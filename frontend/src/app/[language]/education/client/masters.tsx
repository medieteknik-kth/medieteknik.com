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

interface CarouselItem {
  id: number
  title: string
  description: string
  image: StaticImageData
  kthLink: string
  keyAreas: string[]
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: 'Computer Science',
    description:
      'Computer Science is the study of computers and computational systems. Unlike electrical and computer engineers, computer scientists deal mostly with software and software systems; this includes their theory, design, development, and application.',
    image: ComputerScienceBG,
    kthLink: 'https://www.kth.se/en/studies/master/computer-science',
    keyAreas: [
      'AI',
      'Networking and Communication',
      'Security',
      'Data Science',
      'Algorithms and Complexity',
    ],
  },
  {
    id: 2,
    title: 'Interactive Media Technology',
    description:
      "Interactive Media Technology is a two-year master's programme that focuses on Interactive Media, Computer Graphics and Computer Games. The programme offers a broad theoretical foundation in the field of interactive media technology, and the ability to apply this knowledge to create future interactive media.",
    image: InteractiveMediaBG,
    kthLink:
      'https://www.kth.se/en/studies/master/interactive-media-technology',
    keyAreas: [
      'Graphics and Visualisation',
      'Interactive Systems',
      'User Experience',
      'Sound and Music Computing',
    ],
  },
  {
    id: 3,
    title: 'ICT Innovation',
    description:
      "ICT Innovation is a two-year master's programme that focuses on the analysis, design, use and development of complex software systems and services for the needs of industry and society. The programme offers a broad theoretical foundation in the field of software technology and the ability to apply this knowledge to solve real-world problems.",
    image: ICTBG,
    kthLink: 'https://www.kth.se/en/studies/master/ict-innovation/',
    keyAreas: [
      'Marketing and Market Analysis',
      'Consulting and Management',
      'Systems and Software',
      'Entrepreneur',
    ],
  },
  {
    id: 4,
    title: 'Machine Learning',
    description:
      "Machine Learning is a two-year master's programme that focuses on the theoretical foundation of machine learning and computational learning theory, as well as the practical application of machine learning methods to real-world problems.",
    image: MachineLearingBG,
    kthLink: 'https://www.kth.se/en/studies/master/machine-learning/',
    keyAreas: ['Machine Learning', 'AI', 'Optimization', 'Computer Vision'],
  },
  {
    id: 5,
    title: 'Sustainable Digitalisation',
    description:
      'Digitalisation is a powerful driver of societal change; it offers the potential to build resilience for a volatile, uncertain, complex and ambiguous future. But digitalisation can also be problematic if it speeds up unsustainable trends.',
    image: SustainableDigitalisationBG,
    kthLink: 'https://www.kth.se/en/studies/master/sustainable-digitalisation',
    keyAreas: [
      'Sustainability',
      'Digitalisation',
      'Innovation',
      'Strategic Leadership',
    ],
  },
]

export default function Masters() {
  return (
    <Section
      title='Masters'
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
            {carouselItems.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full xl:basis-1/3 relative rounded-md overflow-hidden grid place-items-center pl-0 xl:pl-4'
              >
                <div className='blurred w-full h-full z-20 absolute left-0' />

                <Card className='w-fit h-[900px] md:h-[700px] xl:h-[550px] flex flex-col justify-between'>
                  <CardHeader className='w-fit'>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className='flex flex-wrap gap-3'>
                      {item.keyAreas.map((keyArea, index) => (
                        <Badge
                          key={keyArea}
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
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{item.description}</CardContent>
                  <CardFooter>
                    <Button asChild size='icon' title='Read more at KTH'>
                      <Link
                        href={item.kthLink}
                        target='_blank'
                        className='w-fit'
                      >
                        <KTH className='w-10 h-10 rounded-md brightness-110' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='*:stroke-black' />
          <CarouselNext className='*:stroke-black' />
        </Carousel>
      </div>
    </Section>
  )
}

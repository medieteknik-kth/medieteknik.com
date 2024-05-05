import { StaticImageData } from 'next/image'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Administrativt
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import ValberedningenIcon from 'public/images/committees/valberedningen.png'

// Näringsliv och Kommunikation
import NLGIcon from 'public/images/committees/nlg.png'
import KOMNIcon from 'public/images/committees/komn.png'
import MBDIcon from 'public/images/committees/mbd.png'

// Studiesocialt
import QulturnamndenIcon from 'public/images/committees/qn.png'
import MetadorernaIcon from 'public/images/committees/metadorerna.png'
import MetaspexetIcon from 'public/images/committees/metaspexet.png'
import SpexmastereitIcon from 'public/images/committees/spexm.png'
import FestmastereitIcon from 'public/images/committees/festm.png'
import MediasKlubbmasteriIcon from 'public/images/committees/mkm.png'
import IdrottsnamndenIcon from 'public/images/committees/idrottsnamnden.png'
import MatlagetIcon from 'public/images/committees/matlaget.png'
import SanglederietIcon from 'public/images/committees/sanglederiet.png'
import FilmnamndenIcon from 'public/images/committees/filmnamnden.png'

// Utbildning
import StudienamndenIcon from 'public/images/committees/studienamnden.png'
import InternationalsIcon from 'public/images/committees/internationals.png'
const recruitData:
  | {
      title: string
      daysLeft: number
      image: StaticImageData
    }[]
  | undefined = [
  { title: 'Styrelsen', daysLeft: 20, image: StyrelsenIcon },
  { title: 'Valberedningen', daysLeft: 10, image: ValberedningenIcon },
  { title: 'MKM', daysLeft: 5, image: MediasKlubbmasteriIcon },
  { title: 'Filmnämnden', daysLeft: 4, image: FilmnamndenIcon },
  { title: 'Internationell', daysLeft: 16, image: InternationalsIcon },
  { title: 'Metaspex', daysLeft: 12, image: MetaspexetIcon },
  { title: 'Matlaget', daysLeft: 50, image: MatlagetIcon },
  { title: 'MBD', daysLeft: 2, image: MBDIcon },
  { title: 'Idrottsnämnden', daysLeft: 25, image: IdrottsnamndenIcon },
  { title: 'Metadorerna', daysLeft: 1, image: MetadorernaIcon },
]

export default function Recruiting() {
  if (recruitData === undefined) return <></>

  return (
    <section className='w-full h-fit flex flex-col justify-between px-12 relative mt-10'>
      <h2 className='text-3xl uppercase mb-4'>Currently Recruiting</h2>
      <div className='w-full h-5/6 flex items-center mb-20'>
        <div className='w-full h-full overflow-x-auto'>
          <div className='w-full h-full px-8 py-4 grid auto-rows-max grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8'>
            {recruitData.map((recruit, index) => (
              <Card key={index}>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <div className='flex items-center'>
                    <Avatar className='mr-4 bg-white'>
                      <AvatarImage src={recruit.image.src} />
                      <AvatarFallback>{recruit.title}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{recruit.title}</CardTitle>
                      <CardDescription className='flex items-center mt-1'>
                        <ClockIcon className='w-4 h-4 mr-1' />
                        {recruit.daysLeft} days left
                      </CardDescription>
                    </div>
                  </div>
                  <Button title='Learn More' aria-label='Learn More'>
                    Learn More
                  </Button>
                </CardHeader>
                <CardContent className='text-sm'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Asperiores aut error repellendus quos iure eveniet.
                  Accusantium odit, veniam ratione cumque provident cum aut
                  sapiente qui reiciendis aperiam maiores enim expedita.
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

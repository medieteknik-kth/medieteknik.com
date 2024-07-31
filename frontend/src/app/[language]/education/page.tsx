import Masters from './masters'
import Courses from './courses'
import BG from 'public/images/kth-landskap.jpg'
import KTH from 'public/images/svg/kth.svg'
import { Head, Section } from '@/components/static/Static'
import Link from 'next/link'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Education({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <div className='h-24 bg-black' />
      <Head
        title='Media Technology'
        description='Medieteknikens roll i samhället växer, från nyhetssajter till virtuella miljöer, med potential att både motivera hållbara val och väcka frågor om etik och design.'
        image={BG}
      />
      <div className='absolute left-20 top-96 flex gap-8'>
        <Button
          size={'icon'}
          className='overflow-hidden hover:scale-110 transition-all'
          title='KTH Website (in Swedish)'
          aria-label='KTH Website (in Swedish)'
          asChild
        >
          <Link
            href={`https://www.kth.se/utbildning/civilingenjor/medieteknik/medieteknik-civilingenjor-300-hp-1.4150`}
            target='_blank'
            rel='noreferrer noopenner'
          >
            <KTH className='w-10 h-10 rounded-md' />
          </Link>
        </Button>
        <Button
          variant={'outline'}
          size={'icon'}
          className='overflow-hidden hover:scale-110 transition-all'
          asChild
        >
          <Link href={`/${language}/chapter/committees/internationals`}>
            <Image
              src={
                'https://storage.googleapis.com/medieteknik-static/committees/internationals.svg'
              }
              alt='img'
              width={200}
              height={200}
              className='w-10 h-10'
            />
          </Link>
        </Button>
      </div>

      <Courses params={{ language }} />

      <Masters />

      <Section title='Study Counciling'>
        <div className='h-[420px] flex justify-center items-center'>
          <div className='w-1/4 h-3/4 grid place-items-center'>
            <div className='w-64 h-72 bg-blue-400' />
          </div>
          <div className='w-1/3 h-3/4 flex flex-col justify-center'>
            <p>
              Lena Smedenborn är studievägledare för studenter på
              civilingenjörsprogrammet i medieteknik. Du kan vända dig till
              henne om du har frågor om bland annat studieplanering, kursval,
              studievanor och studieteknik eller återupptag av studier efter
              studieuppehåll.
            </p>
            <div className='grid auto-rows-max *:h-20'>
              <div className='flex items-center'>
                <div className='w-12 h-12 grid place-items-center border-2 border-[#111] rounded-full mr-2'>
                  <EnvelopeIcon className='w-8 h-8' />
                </div>
                <Link
                  href='mailto:svl-media@kth.se'
                  rel='noopener noreferrer'
                  className='text-blue-600 underline-offset-2 hover:underline'
                >
                  svl-media@kth.se
                </Link>
              </div>
              <div className='flex items-center'>
                <div className='w-12 h-12 grid place-items-center border-2 border-[#111] rounded-full mr-2'>
                  <PhoneIcon className='w-8 h-8' />
                </div>
                <p>08-790 84 07</p>
              </div>
              <div className='flex items-center'>
                <div className='w-12 h-12 grid place-items-center border-2 border-[#111] rounded-full mr-2'>
                  <MapPinIcon className='w-8 h-8' />
                </div>
                <p>Rum 1434, Lindstedtsvägen 3, plan 4</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  )
}

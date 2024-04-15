import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Masters from './masters'
import Courses from './courses'
import International from 'public/images/committees/internationals.png'
import BG from 'public/images/kth-landskap.jpg'
import KTH from 'public/images/KTH.jpg'
import { Head, Section } from '@/components/static/Static'
import Link from 'next/link'
import Action from '@/components/cards/Action'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

export default function Education({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <Header params={{ language }} />
      <div className='h-24 bg-[#111]' />
      <Head
        title='Media Technology'
        description='Medieteknikens roll i samhället växer, från nyhetssajter till virtuella miljöer, med potential att både motivera hållbara val och väcka frågor om etik och design.'
        image={BG}
      />
      <Section>
        <div className='w-full h-fit grid place-items-center'>
          <div className='w-[400px] lg:w-[800px] h-fit grid lg:grid-cols-2 auto-rows-max *:h-96 gap-8 mb-8 mt-8'>
            <Action
              title='KTH'
              image={KTH}
              href={[
                'https://www.kth.se/utbildning/civilingenjor/medieteknik/medieteknik-civilingenjor-300-hp-1.4150',
                true,
              ]}
            />

            <Action
              title='International'
              image={International}
              href={['./chapter/committees/international', false]}
            />
          </div>
        </div>
      </Section>

      <Courses />

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

      <Footer params={{ language }} />
    </main>
  )
}

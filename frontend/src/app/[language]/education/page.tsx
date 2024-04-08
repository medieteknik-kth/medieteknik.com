import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Masters from './masters'
import Courses from './courses'
import International from 'public/images/committees/internationals.png'
import BG from 'public/images/kth-landskap.jpg'
import KTH from 'public/images/KTH.jpg'
import { Head, Section } from '@/components/static/Static'
import Link from 'next/link'
import './box.css'
import Action from '@/components/cards/Action'

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
      <Section
        metadata={{ height: '550px' }}
        children={
          <div className='w-full h-4/5 grid place-items-center'>
            <div className='w-[1096px] h-[344px] grid grid-cols-3 grid-rows-1 gap-8'>
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
              <div className='bg-sky-400'>
                <div className='highlight w-full h-full relative'>
                  <Link
                    href='./chapter/albums'
                    className='w-full h-16 bg-black/75 grid place-items-center absolute bottom-0 transition-all'
                  >
                    <h3 className='text-2xl text-white text-center uppercase tracking-wider font-bold'>
                      Albums
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <Courses />

      <Masters />

      <Footer params={{ language }} />
    </main>
  )
}

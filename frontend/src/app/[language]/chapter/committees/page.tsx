import { Head } from '@/components/static/Static'

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

import Image from 'next/image'
import Link from 'next/link'

const AdminProps = {
  title: 'Administrativ',
  data: [
    {
      title: 'Styrelsen',
      icon: StyrelsenIcon,
      link: './committees/styrelsen',
    },
    {
      title: 'Valberedningen',
      icon: ValberedningenIcon,
      link: './committees/valberedningen',
    },
  ],
}

const NLGProps = {
  title: 'Näringsliv och Kommunikation',
  data: [
    {
      title: 'Näringlivsgruppen',
      icon: NLGIcon,
      link: './committees/naringlivsgruppen',
    },
    {
      title: 'Kommunikationsnämnden',
      icon: KOMNIcon,
      link: './committees/kommunikationsnamnden',
    },
    {
      title: 'Medias Branschdag',
      icon: MBDIcon,
      link: './committees/mediasbranschdag',
    },
  ],
}

const StudiesocialProps = {
  title: 'Studiesocialt',
  data: [
    {
      title: 'Qulturnämnden',
      icon: QulturnamndenIcon,
      link: './committees/qulturnamnden',
    },
    {
      title: 'Metadorerna',
      icon: MetadorernaIcon,
      link: './committees/metadorerna',
    },
    {
      title: 'Metaspexet',
      icon: MetaspexetIcon,
      link: './committees/metaspexet',
    },
    {
      title: 'Spexmästeriet',
      icon: SpexmastereitIcon,
      link: './committees/spexmastereit',
    },
    {
      title: 'Festmästeriet',
      icon: FestmastereitIcon,
      link: './committees/festmastereit',
    },
    {
      title: 'Medias Klubbmästeri',
      icon: MediasKlubbmasteriIcon,
      link: './committees/medias-klubbmasteri',
    },
    {
      title: 'Idrottsnämnden',
      icon: IdrottsnamndenIcon,
      link: './committees/idrottsnamnden',
    },
    {
      title: 'Matlaget',
      icon: MatlagetIcon,
      link: './committees/matlaget',
    },
    {
      title: 'Sånglederiet',
      icon: SanglederietIcon,
      link: './committees/sanglederiet',
    },
    {
      title: 'Filmnämnden',
      icon: FilmnamndenIcon,
      link: './committees/filmnamnden',
    },
  ],
}

const UtbildningProps = {
  title: 'Utbildning',
  data: [
    {
      title: 'Studienämnden',
      icon: StudienamndenIcon,
      link: './committees/studienamnden',
    },
    {
      title: 'Internationella',
      icon: InternationalsIcon,
      link: 'https://meta-internationals.mailchimpsites.com',
    },
  ],
}

export default function Committees({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main className='w-screen'>
      <div className='h-24 bg-black' />
      <Head title='Committees' />

      <div className='w-full flex flex-col items-center py-20'>
        <section className='w-1/2 h-[350px] flex flex-col'>
          <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
            {AdminProps.title}
          </h2>
          <div className='w-full h-[200px] grid grid-cols-5 grid-rows-1 gap-8 my-4'>
            {AdminProps.data.map((item, index) => (
              <Link
                href={item.link}
                title={item.title}
                aria-label={item.title}
                key={index}
                {...(item.link.startsWith('http') && {
                  // External link
                  rel: 'noopener noreferrer',
                })}
                className='relative shadow-lg shadow-yellow-400/50 transition-transform hover:scale-110 hover:hover:font-bold'
              >
                <Image
                  src={item.icon.src}
                  alt={`${item.title}icon`}
                  width={100}
                  height={100}
                  className='w-[100px] h-[100px] absolute top-0 left-0 right-0 bottom-0 m-auto'
                />
                <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className='w-1/2 h-[350px] flex flex-col'>
          <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
            {UtbildningProps.title}
          </h2>
          <div className='w-full h-[200px] grid grid-cols-5 grid-rows-1 gap-8 my-4'>
            {UtbildningProps.data.map((item, index) => (
              <Link
                href={item.link}
                title={item.title}
                aria-label={item.title}
                key={index}
                {...(item.link.startsWith('http') && {
                  // External link
                  rel: 'noopener noreferrer',
                  target: '_blank',
                })}
                className='relative shadow-lg shadow-yellow-400/50  transition-transform hover:scale-110 hover:hover:font-bold'
              >
                <Image
                  src={item.icon.src}
                  alt={`${item.title}icon`}
                  width={256}
                  height={256}
                  className='w-[100px] h-[100px] absolute top-0 left-0 right-0 bottom-0 m-auto'
                />
                <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className='w-1/2 h-[350px] flex flex-col'>
          <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
            {NLGProps.title}
          </h2>
          <div className='w-full h-[200px] grid grid-cols-5 grid-rows-1 gap-8 my-4'>
            {NLGProps.data.map((item, index) => (
              <Link
                href={item.link}
                title={item.title}
                aria-label={item.title}
                key={index}
                {...(item.link.startsWith('http') && {
                  // External link
                  rel: 'noopener noreferrer',
                })}
                className='relative shadow-lg shadow-yellow-400/50  transition-transform hover:scale-110 hover:hover:font-bold'
              >
                <Image
                  src={item.icon.src}
                  alt={`${item.title}icon`}
                  width={256}
                  height={256}
                  className='w-[100px] h-[100px] absolute top-0 left-0 right-0 bottom-0 m-auto'
                />
                <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className='w-1/2 h-[650px] flex flex-col'>
          <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
            {StudiesocialProps.title}
          </h2>
          <div className='w-full h-[432px] grid grid-cols-5 grid-rows-2 gap-8 my-4'>
            {StudiesocialProps.data.map((item, index) => (
              <Link
                href={item.link}
                title={item.title}
                aria-label={item.title}
                key={index}
                {...(item.link.startsWith('http') && {
                  // External link
                  rel: 'noopener noreferrer',
                })}
                className='relative shadow-lg shadow-yellow-400/50 transition-transform hover:scale-110 hover:hover:font-bold'
              >
                <Image
                  src={item.icon.src}
                  alt={`${item.title}icon`}
                  width={256}
                  height={256}
                  className='w-[100px] h-[100px] absolute top-0 left-0 right-0 bottom-0 m-auto'
                />
                <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

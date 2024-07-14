import Image, { StaticImageData } from 'next/image'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import MTGNIcon from 'public/images/committees/mtgn.png'
import InternationalIcon from 'public/images/committees/internationals.png'
import Logo from 'public/images/logo.webp'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n'

interface CardElement {
  title: string
  description: string
  icon: StaticImageData
  href: string
  linkText: string
}

export default async function About({ language }: { language: string }) {
  const { t } = await useTranslation(language, 'index')

  const cards: CardElement[] = [
    {
      title: t('chapter.title'),
      description: t('chapter.description'),
      icon: StyrelsenIcon,
      href: language + '/chapter',
      linkText: t('chapter.link_text'),
    },
    {
      title: t('new_students.title'),
      description: t('new_students.description'),
      icon: MTGNIcon,
      href: language + '/education',
      linkText: t('new_students.link_text'),
    },
    {
      title: 'International Students',
      description:
        'Are you an international student? Click above to learn more about META. Our joint coordination between Computer Science and Media Technology programmes at KTH.',
      icon: InternationalIcon,
      href: 'https://meta-internationals.mailchimpsites.com/',
      linkText: t('international_link_text'),
    },
  ]

  return (
    <section className='w-full h-fit desktop:h-[640px] relative bg-white dark:bg-[#111] px-4 lg:px-20 2xl:px-56 py-10 border-t-2 flex flex-col justify-around border-black/75 dark:border-white/75'>
      <Image
        src={Logo.src}
        alt='logo'
        width={280}
        height={280}
        loading='lazy'
        placeholder='empty'
        className='absolute left-8 top-0 bottom-0 my-auto opacity-35 hidden md:block'
      />
      <div className='flex flex-col lg:flex-row justify-between items-center mb-10 desktop:mb-0'>
        <h2 className='text-2xl xs:text-5xl font-bold w-full lg:w-fit py-2 lg:py-0 tracking-wider text-center lg:text-start'>
          {t('about')}
        </h2>
        <div className='w-full mb-2 lg:mb-0 py-2 xl:py-0 lg:w-[450px] desktop:w-[750px] justify-self-center text-md md:text-lg'>
          {t('description')}
        </div>
      </div>
      <div className='flex flex-wrap gap-2 flex-col desktop:flex-row justify-around items-center px-4'>
        {cards.map((card) => (
          <div
            key={card.title}
            className='card w-full lg:w-[720px] desktop:w-[450px] h-64 bg-slate-100 px-8 py-4 rounded-xl flex flex-col justify-between items-center relative'
          >
            <Link
              href={card.href}
              title={card.linkText}
              target={card.href.startsWith('http') ? '_blank' : '_self'}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : ''}
              className='w-full h-fit lg:h-[100px] flex items-center underline-offset-4 text-sky-600 hover:text-sky-700 hover:underline'
            >
              <Image
                src={card.icon.src}
                alt={card.title}
                width={100}
                height={100}
                loading='lazy'
                placeholder='empty'
                className='h-full aspect-square object-cover bg-white rounded-full lg:p-2'
              />
              <h3 className='text-lg md:text-3xl ml-8 h-full tracking-wide grow grid items-center'>
                {card.title}
              </h3>
            </Link>
            <p className='w-full h-[100px] text-sm lg:text-md text-pretty overflow-hidden'>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

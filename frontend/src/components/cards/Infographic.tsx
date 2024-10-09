import Image from 'next/image'
import Link from 'next/link'

interface Props {
  card: Card
}

interface Card {
  title: string
  description: string
  icon: string
  href: string
  linkText: string
}

export default function InfographicCard({ card }: Props) {
  return (
    <div className='w-full lg:w-[720px] desktop:w-[450px] h-64 px-8 py-4 rounded-xl flex flex-col justify-between items-center relative bg-slate-100 dark:bg-[#323232]'>
      <Link
        href={`${card.href}`}
        title={card.linkText}
        target={card.href.startsWith('http') ? '_blank' : '_self'}
        rel={card.href.startsWith('http') ? 'noopener noreferrer' : ''}
        className='w-full h-fit lg:h-[100px] flex flex-col lg:flex-row items-center underline-offset-4 text-sky-600 hover:text-sky-700 hover:underline'
      >
        <Image
          src={card.icon}
          alt=''
          width={100}
          height={100}
          loading='lazy'
          placeholder='empty'
          className='w-16 h-16 lg:w-auto lg:h-full aspect-square object-cover bg-white rounded-full lg:p-2'
        />
        <h3 className='text-lg md:text-3xl ml-2 lg:ml-8 h-full tracking-wide grow grid items-center'>
          {card.title}
        </h3>
      </Link>
      <p className='w-full h-[100px] text-sm lg:text-md text-pretty overflow-hidden'>
        {card.description}
      </p>
    </div>
  )
}

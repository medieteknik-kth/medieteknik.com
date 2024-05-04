import PlaceholderEducationBackground from 'public/images/testbg.jpg'
import PlaceholderChapterBackground from 'public/images/ths_placeholder.jpg'
import PlaceholderInternationalBackground from 'public/images/international_placeholder.jpg'
import Card from '@/components/cards/Card'

const CardStyle = 'w-3/4 h-full relative rounded-t-2xl'

export default function About() {
  return (
    <section className='w-full h-[640px] bg-white flex flex-col justify-evenly items-center'>
      <h2 className='w-full h-fit text-3xl uppercase text-black tracking-wider text-center font-bold border-b-2 border-yellow-400 p-10 pb-4 mb-10'>
        About Media Technology
      </h2>
      <ul className='w-11/12 h-4/5 grid grid-cols-3 grid-rows-1 place-items-center z-10 text-white'>
        <li
          className={CardStyle}
          style={{ boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, .5)' }}
        >
          <Card
            title='International Students'
            description='For international students who want to study in Sweden and become active chapter members. We offer a variety of services to help you get started.'
            href='/'
            image={PlaceholderInternationalBackground}
          />
        </li>
        <li
          className={CardStyle}
          style={{ boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, .5)' }}
        >
          <Card
            title='Chapter'
            description='Want to become an active chapter member? We have a variety of services to help you get started.'
            href='/'
            image={PlaceholderChapterBackground}
          />
        </li>
        <li
          className={CardStyle}
          style={{ boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, .5)' }}
        >
          <Card
            title='Education'
            description='Want to learn more about Media Technology? We have a variety of services to help you get started.'
            href='/'
            image={PlaceholderEducationBackground}
          />
        </li>
      </ul>
    </section>
  )
}

import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import './box.css'
import Link from 'next/link'
import { Head, Section } from '@/components/static/Static'
import Action from '@/components/cards/Action'
import Image from 'next/image'
import StyrelsenImage from 'public/images/committees/styrelsen.png'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import BG from 'public/images/kth-landskap.jpg'

export default function Chapter({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <Header params={{ language }} />
      <div className='h-24 bg-[#111]' />
      <Head
        title='Chapter'
        description="The Chapter's purpose is to satisfy the needs of Media Technology students during their time at KTH."
        image={BG}
      />
      <Section
        title='Quick Access'
        children={
          <div className='w-full h-fit grid place-items-center'>
            <div className='w-[400px] lg:w-[800px] desktop:w-[1600px] h-fit grid lg:grid-cols-2 desktop:grid-cols-4 auto-rows-max *:h-96 gap-8 mb-8 mt-8'>
              <Action
                href={['./chapter/committees', false]}
                title='Committees'
                image={BG}
              />

              <Action
                href={['./chapter/documents', false]}
                title='Documents'
                image={BG}
              />

              <Action
                href={['./chapter/albums', false]}
                title='Albums'
                image={BG}
              />

              <Action
                href={['./chapter/graphical-identity', false]}
                title='Graphical Identity'
                image={BG}
              />
            </div>
          </div>
        }
      />
      <Section
        title='Styrelsen'
        children={
          <div className='w-full h-4/5 flex flex-col justify-around'>
            <div className='w-full h-3/5 grid grid-cols-3 grid-rows-1 gap-8'>
              <div className='grid place-items-center'>
                <Link
                  href='./chapter/committees/styrelsen'
                  className='p-8 rounded-full'
                >
                  <Image
                    src={StyrelsenImage.src}
                    alt='placeholder'
                    width={128}
                    height={128}
                  />
                </Link>
              </div>

              <div className='flex justify-center'>
                <p className='overflow-y-auto'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse elit justo, pulvinar vel diam eu, vulputate
                  malesuada leo. Sed eleifend pharetra magna, id eleifend augue
                  scelerisque et. Praesent pharetra sed lacus non hendrerit.
                  Proin enim ipsum, dignissim sed mollis sed, auctor nec diam.
                  Duis vitae gravida magna. Praesent faucibus orci quis odio
                  sodales, sit amet dignissim lectus ultrices. In hac habitasse
                  platea dictumst. Maecenas rhoncus, orci id eleifend sagittis,
                  justo dui pretium tellus, quis mollis dolor enim vel augue.
                  Proin porttitor eget mauris non placerat. Phasellus bibendum,
                  orci et convallis aliquet, arcu mauris tristique nulla, nec
                  euismod nisl turpis ac enim. Aliquam purus lorem, luctus non
                  quam a, gravida laoreet quam. Curabitur vestibulum tincidunt
                  nibh vel pharetra.
                  <br />
                  <br />
                  Suspendisse tempor ac ligula rhoncus ultrices. Nunc dapibus
                  sit amet dolor nec porta. Ut sollicitudin felis quis nisl
                  scelerisque, quis pharetra purus ultrices. Vivamus neque
                  libero, hendrerit eu vestibulum ac, aliquam sit amet libero.
                  Maecenas hendrerit convallis bibendum. Sed dignissim
                  vestibulum maximus. Aenean tempus enim ut augue rhoncus
                  dignissim. Duis vel varius orci. Donec finibus id enim eget
                  rutrum. Morbi finibus et nunc sit amet consectetur.
                  <br />
                  <br />
                  Vivamus ante sapien, rutrum ornare facilisis in, suscipit ut
                  enim. Pellentesque aliquet nunc et justo pulvinar, mattis
                  posuere nibh rhoncus. Donec nec molestie purus. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames
                  ac turpis egestas. Maecenas convallis purus eget tincidunt
                  fermentum. Nulla bibendum molestie ligula, a finibus nibh
                  efficitur id. Phasellus ac risus nec elit maximus efficitur.
                  Duis mollis faucibus euismod.
                </p>
              </div>
              <div className='flex justify-center'>
                <div className='w-96 flex flex-col'>
                  <h3 className='w-full text-center text-xl uppercase mb-4 pb-2 border-b-2 border-yellow-400'>
                    Members
                  </h3>
                  <div className='h-4/5 overflow-y-auto'>
                    <ul>
                      <li className='flex items-center mb-4'>
                        <div className='w-10 h-10 border-2 border-black rounded-full mr-4' />
                        <div className='flex flex-col'>
                          <p>John Doe</p>
                          <span className='text-xs uppercase tracking-wide'>
                            Chairman
                          </span>
                        </div>
                      </li>

                      <li className='flex items-center mb-4'>
                        <div className='w-10 h-10 border-2 border-black rounded-full mr-4' />
                        <div className='flex flex-col'>
                          <p>John Doe</p>
                          <span className='text-xs uppercase tracking-wide'>
                            Treasurer
                          </span>
                        </div>
                      </li>
                      <li className='flex items-center mb-4'>
                        <div className='w-10 h-10 border-2 border-black rounded-full mr-4' />
                        <div className='flex flex-col'>
                          <p>John Doe</p>
                          <span className='text-xs uppercase tracking-wide'>
                            Secretary
                          </span>
                        </div>
                      </li>
                      <li className='flex items-center mb-4'>
                        <div className='w-10 h-10 border-2 border-black rounded-full mr-4' />
                        <div className='flex flex-col'>
                          <p>John Doe</p>
                          <span className='text-xs uppercase tracking-wide'>
                            Member
                          </span>
                        </div>
                      </li>
                      <li className='flex items-center mb-4'>
                        <div className='w-10 h-10 border-2 border-black rounded-full mr-4' />
                        <div className='flex flex-col'>
                          <p>John Doe</p>
                          <span className='text-xs uppercase tracking-wide'>
                            Member
                          </span>
                        </div>
                      </li>
                      <li className='flex items-center mb-4'>
                        <div className='w-10 h-10 border-2 border-black rounded-full mr-4' />
                        <div className='flex flex-col'>
                          <p>John Doe</p>
                          <span className='text-xs uppercase tracking-wide'>
                            Member
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full h-12 flex justify-center items-center'>
              <div className='w-12 h-12 border-2 border-black rounded-full grid place-items-center'>
                <EnvelopeIcon className='w-8 h-8' />
              </div>
              <Link
                href='mailto:styrelsen@medieteknik.com'
                className='ml-4 text-sky-800'
              >
                styrelsen@medieteknik.com
              </Link>
            </div>
          </div>
        }
      />
      <section className='h-[1080px] border-b-2 border-black'></section>
      <section className='h-[1080px] border-b-2 border-black'></section>
      <Footer params={{ language }} />
    </main>
  )
}

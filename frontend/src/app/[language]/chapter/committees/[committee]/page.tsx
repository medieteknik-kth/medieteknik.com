import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import { GetStaticPaths } from 'next'

/*export async function getStaticPaths() {
  const res = await fetch('https://api.medieteknik.com/committees')
  const committees = await res.json()

  const paths = committees.map((committee: { name: string }) => ({
    params: { committee: committee.name },
  }))

  if (!paths) {
    return {
      paths: [],
      fallback: true,
    }
  }

  return { paths, fallback: blocking }
}*/

export default function Committee({
  params: { language, committee },
}: {
  params: { language: string; committee: string }
}) {
  return (
    <main>
      <Header params={{ language }} />
      <div className='h-24 bg-black' />
      <div className='w-full h-[1080px] mt-12 flex'>
        <div className='w-96 h-full mx-16 flex flex-col justify-around'>
          <div className='flex flex-col items-center'>
            <div className='w-48 h-48 rounded-full border-2 border-black mb-4' />
            <h1 className='uppercase text-3xl tracking-wider'>{committee}</h1>
            <div className='flex'>
              <h2>{committee + '@medieteknik.com'}</h2>
              <ClipboardIcon className='w-5 h-5 ml-2' />
            </div>
          </div>
          <div className='h-3/5' style={{ direction: 'rtl' }}>
            <h3
              className='uppercase text-2xl tracking-wide ml-4 pb-2 border-b-2 border-yellow-400'
              style={{ direction: 'ltr' }}
            >
              Members
            </h3>
            <div className='h-5/6 my-4 relative overflow-hidden overflow-y-auto'>
              <ul
                className='w-full h-fit *:h-[100px] pl-4 absolute'
                style={{ direction: 'ltr' }}
              >
                <li className='flex items-center'>
                  <div className='w-20 h-20 rounded-full border-2 border-black' />
                  <div className='pl-4'>
                    <p className='uppercase text-gray-500 text-sm'>
                      Ordförande
                    </p>
                    <p>Viggo Halvarsson Skoog</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-20 h-20 rounded-full border-2 border-black' />
                  <div className='pl-4'>
                    <p className='uppercase text-gray-500 text-sm'>Position</p>
                    <p>Member 2</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-20 h-20 rounded-full border-2 border-black' />
                  <div className='pl-4'>
                    <p className='uppercase text-gray-500 text-sm'>Position</p>
                    <p>Member 3</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-20 h-20 rounded-full border-2 border-black' />
                  <div className='pl-4'>
                    <p className='uppercase text-gray-500 text-sm'>Position</p>
                    <p>Member 4</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-20 h-20 rounded-full border-2 border-black' />
                  <div className='pl-4'>
                    <p className='uppercase text-gray-500 text-sm'>Position</p>
                    <p>Member 5</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-20 h-20 rounded-full border-2 border-black' />
                  <div className='pl-4'>
                    <p className='uppercase text-gray-500 text-sm'>Position</p>
                    <p>Member 6</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='w-9/12 h-full grid place-items-end'>
          <div className='w-10/12 h-full flex flex-col items-center'>
            <div className='w-[900px] h-[500px] bg-blue-500'></div>
            <p className='w-[1200px] py-12 px-10'>
              Valberedningen har i syfte att valbereda val för speciella
              funktionärsposter för Sektionen för Medieteknik. Den ansvarar även
              för att ta in nomineringar och kandidaturer, bedöma kandidater
              efter utförd intervju och utfärda omdömen till dessa inför
              aktuellt sektionsmöte.
              <br />
              <br />
              Valberedningen arbetar aktivt för att alla val på sektionen skall
              vara demokratiska och för att alla kandidater som valbereds får
              samma bemötande och genomgår samma process. Valberedningens vision
              är att Valberedningen skall verka som ett verktyg för sektionen så
              att både sektionsmötet och kandidaterna är väl förberedda när
              valdagen kommer.
              <br />
              <br />
              Samtliga medlemmar i Valberedningen får även jobba med individuell
              utveckling under sin mandat genom att lära sig mer om hur man
              arbetar förberedande, under och efter en intervju.
            </p>
          </div>
        </div>
      </div>
      <Footer params={{ language }} />
    </main>
  )
}

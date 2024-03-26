import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Masters from './masters'
import Courses from './courses'

export default function Education({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <Header params={{ language }} />
      {/*<div className='h-24 bg-black'></div>*/}
      <div className='h-[720px] bg-[#111] flex flex-col items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-7xl uppercase font-bold text-yellow-400'>
          Media Technology
        </h1>
      </div>
      <section className='w-full h-[320px] border-b-2 border-black'></section>
      <section className='w-full h-[720px] bg-white flex flex-col'>
        <div className='w-full text-center grid place-items-center'>
          <h2 className='uppercase tracking-wider font-semibold text-3xl w-2/4 border-b-2 border-yellow-400 py-8'>
            Description
          </h2>
        </div>

        <div className='w-full h-full flex justify-around items-center'>
          <div className='w-1/3 h-fit rounded-lg text-xl'>
            <p>
              Medieteknik spelar en viktig roll i kommunikationen mellan
              människor och organisationer i hela samhället. Den möjliggör allt
              från nyhetssajter till nya virtuella miljöer – och ger stora
              möjligheter att motivera konsumenter till hållbara val.
              Medieteknik blir en allt större del av vår vardag, och genom
              maskininlärning kan tekniken utvecklas genom att lära sig själv.
              Det väcker frågor om etik kring hur den designas och används.
              Exempelvis diskuteras hur medieteknik kan utformas för att främja
              demokrati, inte vara ett verktyg för så kallade ”fake news”,
              samtidigt som den fortsätter att möjliggöra att människor kommer
              till tals och kan uttrycka sig.
            </p>
          </div>
          <div className='w-1/3 h-[512px] bg-blue-500' />
        </div>
      </section>

      <Courses />

      <Masters />

      <Footer params={{ language }} />
    </main>
  )
}

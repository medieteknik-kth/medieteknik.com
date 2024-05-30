import { Head, Section } from '@/components/static/Static'
import {
  ViewColumnsIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CogIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

const organizationGuidelinesDocs = [
  'Budget',
  'Code of Conduct',
  'Crisis Management Plan',
  'Regulations',
  'Business Plan',
]

export default function Documents({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <div className='h-24 bg-black' />
      <div className='w-full h-24 fixed bg-white top-24 z-20'>
        <div className=''>
          <p>Archived</p>
        </div>
      </div>
      <Head title='Documents' />
      <div className='w-full h-full relative'>
        {/*<div className='sticky w-96 h-[450px] bg-white left-24 top-44 mt-20 border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 flex flex-col items-center justify-between py-4'>
          <div className='w-1/3 h-12 flex items-center justify-around '>
            <div className='w-10 h-10 border-2 border-[#111] grid place-items-center'>
              <ViewColumnsIcon className='w-8 h-8 rotate-90' />
            </div>
            <div className='w-10 h-10 border-2 border-[#111] grid place-items-center'>
              <Squares2X2Icon className='w-8 h-8' />
            </div>
          </div>

          <div className='w-10/12 h-fit relative'>
            <input
              type='text'
              className='w-full h-16 bg-gray-100 pl-2 rounded-xl border-2 border-b-gray-300 border-r-gray-300 border-gray-200 shadow-sm shadow-gray-300 text-lg'
              placeholder='Search for documents...'
            />
            <MagnifyingGlassIcon className='w-8 h-8 absolute right-4 top-4' />
          </div>

          <div className='w-10/12 h-fit'>
            <p className='h-8 text-lg uppercase tracking-wide'>Filter By</p>
            
            <div className='w-full h-fit flex flex-col'>
              <div className='h-fit mb-2 mt-1'>
                <input type='checkbox' className='mr-2' defaultChecked />
                <label className='p-2 font-bold'>Handlingar</label>
              </div>
              <div className='h-fit mb-2'>
                <input type='checkbox' className='mr-2' defaultChecked />
                <label className='p-2 font-bold'>Protokoll</label>
              </div>
              <div className='h-fit mb-2'>
                <input type='checkbox' className='mr-2' defaultChecked />
                <label className='p-2 font-bold'>Blanketter</label>
              </div>
              <div className='h-fit'>
                <input type='checkbox' className='mr-2' defaultChecked />
                <label className='p-2 font-bold uppercase tracking-wide'>
                  Styrdokument
                </label>
              </div>
            </div>
          </div>

          <div className='w-10/12 h-fit'>
            <p className='h-8 text-lg uppercase tracking-wide'>Sort By</p>
            <select className='w-full h-12 border-2 border-b-gray-300 border-r-gray-300 border-gray-200 shadow-sm shadow-gray-300'>
              <option>Upload Date</option>
              <option>Alphabetical</option>
            </select>
          </div>
  </div> */}

        <Section title='Organizational Guidelines' centeredChildren>
          <div className='w-1/2 h-fit grid grid-cols-5 auto-rows-max gap-2 my-10 place-items-center mb-40 *:w-40 *:h-40'>
            <div className='border-2 bg-white border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer z-20'>
              <ChartPieIcon className='w-20 h-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-green-600' />
              <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold z-20'>
                Budget
              </p>
            </div>
            <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
              <KeyIcon className='w-20 h-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-yellow-600' />
              <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold'>
                Code of Conduct
              </p>
            </div>
            <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
              <ExclamationTriangleIcon className='w-20 h-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-red-600' />
              <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold'>
                Crisis Plan
              </p>
            </div>

            <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
              <CogIcon className='w-20 h-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-blue-600' />
              <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold'>
                Regulations
              </p>
            </div>
            <div className='border-2 border-b-gray-300 border-r-gray-300 border-gray-200 rounded-xl shadow-sm shadow-gray-300 relative hover:bg-black/15 hover:cursor-pointer'>
              <BuildingOfficeIcon className='w-20 h-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-gray-800' />
              <p className='w-fit absolute -bottom-8 left-0 right-0 mx-auto text-lg font-bold'>
                Business Plan
              </p>
            </div>
          </div>
        </Section>
        <Section title='Other Documents' centeredChildren>
          <div className='w-1/2 h-fit grid grid-cols-4 auto-rows-max gap-8 my-10 place-items-center *:h-96 *:w-72'>
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
            <div className='bg-black' />
            <div className='bg-gray-300' />
          </div>
        </Section>
      </div>
    </main>
  )
}

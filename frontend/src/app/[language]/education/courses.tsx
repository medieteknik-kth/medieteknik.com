'use client'
import { PieChart } from 'react-minimal-pie-chart'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const data = [
  { title: 'Matematik', value: 22, color: '#1954A6' },
  { title: 'Fysik', value: 3, color: '#008AE6' },
  { title: 'Programmering', value: 5, color: '#DD6EA6' },
  { title: 'Datavetenkap', value: 14, color: '#BA2C73' },
  { title: 'Medieteknik', value: 28, color: '#912259' },
  { title: 'Breddande Färdigheter', value: 13, color: '#FF8000' },
  { title: 'Valbar Kurs', value: 7, color: '#96969C' },
  { title: 'Examensarbete', value: 8, color: '#62626A' },
]

export default function Courses() {
  return (
    <section className='w-full h-[1080px] bg-white flex flex-col'>
      <div className='w-full text-center grid place-items-center'>
        <h2 className='uppercase tracking-wider font-semibold text-3xl w-2/4 border-b-2 border-yellow-400 py-8'>
          Courses
        </h2>
      </div>

      <div className='w-full h-full flex justify-around items-center'>
        <PieChart
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
          labelStyle={(index) => ({
            fill: 'white',
            fontSize: '5px',
            fontFamily: 'sans-serif',
          })}
          labelPosition={87}
          lineWidth={25}
          paddingAngle={5}
          data={data}
          className='w-1/5 h-fit'
        />
        <div className='w-1/5 h-full text-2xl flex justify-start items-center'>
          <ul className='w-full h-full flex flex-col items-center justify-between'>
            {data.map((item, index) => (
              <li
                key={index}
                className='w-full h-20 uppercase tracking-wide p-4 border-2 border-black m-4 rounded-3xl flex items-center'
              >
                <div className='w-full flex justify-between items-center'>
                  <div>
                    <span
                      className='w-4 h-4 inline-block mr-2'
                      style={{ background: item.color }}
                    />
                    {item.title}
                  </div>
                  <ChevronDownIcon className='w-6 h-6' />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

'use client'
import { PieChart } from 'react-minimal-pie-chart'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Section } from '@/components/static/Static'

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
    <Section
      title='Kurser'
      children={
        <div className='w-full h-[820px] flex justify-around items-center'>
          <div className='w-full h-4/5 flex justify-around'>
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
            <div className='w-3/5 h-full text-2xl grid grid-cols-4 grid-rows-2 gap-8 '>
              {data.map((course, index) => (
                <div
                  key={index}
                  className='w-full h-full flex flex-col justify-center items-center px-4 text-center'
                  style={{ backgroundColor: course.color }}
                >
                  <h3 className='text-2xl text-white uppercase font-bold tracking-wider'>
                    {course.title}
                  </h3>
                  <p className='text-white text-center'>{course.value} %</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  )
}

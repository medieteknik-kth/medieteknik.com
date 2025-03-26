'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowRightIcon,
  CheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Props {
  onClickCallback: (template: string) => void
}

export default function SelectTemplate({ onClickCallback }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState('')

  return (
    <>
      <div>
        <p className='text-center text-sm text-muted-foreground'>
          Choose a template to get started with your invoice or expense.
        </p>
        <h1 className='text-3xl font-bold text-center'>Choose a template</h1>
      </div>
      <div className='pb-20'>
        <ul className='w-full h-96 grid grid-cols-2 p-10 gap-8'>
          <li className='h-full place-self-end'>
            <button
              className='h-full aspect-square border rounded-xl flex flex-col justify-center items-center gap-10 px-4 py-6 relative bg-white cursor-pointer'
              type='button'
              onClick={() => setSelectedTemplate('expense')}
              disabled={selectedTemplate === 'expense'}
            >
              <div className='w-8 h-8 border absolute right-4 top-6 rounded-full'>
                <CheckIcon
                  className={`w-8 h-8 bg-yellow-400 rounded-full p-1.5 ${
                    selectedTemplate === 'expense' ? 'opacity-100' : 'opacity-0'
                  } transition-all duration-300`}
                />
              </div>
              <CreditCardIcon className='w-20 h-20' />
              <p className='font-bold text-xl'>Expense</p>
            </button>
          </li>
          <li className='h-full place-self-start'>
            <button
              type='button'
              className='h-full aspect-square border rounded-xl flex flex-col justify-center items-center gap-10 px-4 py-6 relative bg-white cursor-pointer'
              onClick={() => setSelectedTemplate('invoice')}
              disabled={selectedTemplate === 'invoice'}
            >
              <div className='w-8 h-8 border absolute right-4 top-6 rounded-full'>
                <CheckIcon
                  className={`w-8 h-8 bg-yellow-400 rounded-full p-1.5 ${
                    selectedTemplate === 'invoice' ? 'opacity-100' : 'opacity-0'
                  } transition-all duration-300`}
                />
              </div>
              <DocumentTextIcon className='w-20 h-20' />
              <p className='font-bold text-xl'>Invoice</p>
            </button>
          </li>
        </ul>
        <Button
          className='w-full h-16'
          onClick={() => {
            if (onClickCallback) {
              console.log(selectedTemplate)
              onClickCallback(selectedTemplate)
            }
          }}
          disabled={selectedTemplate === ''}
        >
          Next
          <ArrowRightIcon className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </>
  )
}

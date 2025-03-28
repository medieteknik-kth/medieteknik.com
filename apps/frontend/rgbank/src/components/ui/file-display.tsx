import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import type React from 'react'
import { cloneElement, isValidElement } from 'react'

interface Props {
  files: File[]
  preview?: boolean
  children?: React.ReactNode | ((file: File) => React.ReactNode)
}

const calculateFileSize = (size: number) => {
  // Convert bytes to KB, MB, GB, etc.
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let fileSize = size
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}

export default function FileDisplay({ files, preview, children }: Props) {
  return (
    <div className='w-full flex flex-wrap mt-2 gap-2'>
      {files.map((file) => (
        <li
          key={`${file.name}-${file.size}`}
          className={`rounded-md basis-[calc(100%/4-0.5rem/4*3)] px-4 flex items-center justify-between gap-2 bg-white border dark:bg-neutral-800 hover:scale-[101%] transition-transform duration-200 ease-in-out ${preview ? 'aspect-square h-auto pt-4 pb-2' : 'py-2'}`}
        >
          <div
            className={`flex items-center gap-2 ${preview ? 'h-full flex-col' : ''}`}
          >
            {file.name.endsWith('.pdf') ? (
              <DocumentTextIcon className='w-8 h-8 text-red-500' />
            ) : preview ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className='w-full h-auto rounded-md object-cover max-h-96'
              />
            ) : (
              <PhotoIcon className='w-8 h-8 text-blue-500' />
            )}

            <div className={`${preview ? 'self-start mt-auto' : ''}`}>
              <p className='text-sm'>{file.name}</p>
              <p className='text-xs text-muted-foreground'>
                {calculateFileSize(file.size)}
              </p>
            </div>
          </div>

          {children &&
            (typeof children === 'function'
              ? children(file)
              : isValidElement(children)
                ? cloneElement(children as React.ReactElement<{ file: File }>, {
                    file,
                  })
                : children)}
        </li>
      ))}
    </div>
  )
}

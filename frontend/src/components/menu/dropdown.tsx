'use client'
import React from 'react'
import { useState } from 'react'

export type DropdownBlueprint = {
  title: string
  navmenu: { title: string, url: string }[]
}

export default function DropdownMenu({ 
  params 
}: {
  params: DropdownBlueprint
} ) {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }
  const height = params.navmenu.length * 4

  return (
    <div className='w-full h-full flex justify-center items-center hover:cursor-pointer border-b-2 border-transparent hover:border-b-yellow-500' onMouseEnter={toggleOpen} onMouseLeave={toggleOpen}>
      {params.title}
      {open && (
        <div className={`w-60 h-[` + height + `rem] bg-stone-900 text-white absolute top-20 z-10`}>
          {params.navmenu.map((element, index) => {
            return (
              <div key={index} className='w-full h-16 flex items-center justify-center hover:bg-stone-800'>
                {element.title}
              </div>
            )
          })}
        </div>
      )}
    </div>
    
  )
}
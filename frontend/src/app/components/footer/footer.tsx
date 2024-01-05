import React from "react";

const FooterElements = [
  {
    title: 'OM MEDIETEKNIK',
    links: [
      {
        title: 'Vad är Medieteknik?',
        url: '/vad-ar-medieteknik'
      },
      {
        title: 'Kurser',
        url: '/kurser'
      }
    ]
  },
  {
    title: 'KONTAKT',
    links: [
      {
        title: 'Kontakta oss',
        url: '/kontakta-oss'
      },
      {
        title: 'Företag',
        url: '/foretag'
      }
    ]
  },
  {
    title: 'FÖLJ MEDIETEKNIK',
    links: [
      {
        title: 'Facebook',
        url: 'https://www.facebook.com/medieteknik.kth'
      },
      {
        title: 'Instagram',
        url: 'https://www.instagram.com/medieteknik_kth/'
      },
      {
        title: 'LinkedIn',
        url: 'https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/'
      },
      {
        title: 'GitHub',
        url: 'https://www.github.com/medieteknik-kth'
      }
    ]
  }
]

export default function Footer() {
  return (
    <div className='w-full h-80 text-sm bg-stone-900 text-white flex flex-col items-center justify-between'>
      <div className='w-full'>
        <ul className='flex justify-center mt-8'>
          {FooterElements.map((element, index) => {
            return (
              <li key={index} className='mx-16'>
                <h3 className='mb-4 font-semibold'>{element.title}</h3>
                <ul>
                  {element.links.map((link, index) => {
                    return (
                      <li key={index}>
                        <a href={link.url}>{link.title}</a>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
        <p className='mb-8'>© 2024 Sektionen för Medieteknik. Denna hemsida är byggd av studenter vid Medieteknikprogrammet.</p>
      </div>
    )
}
import React from 'react';
import Image from 'next/image';
import Logo from '/public/images/logo.png';

export default function Header () {
    return (
        <header>
            <div className='w-full h-20 flex justify-between'>

            <div className='w-1/12 h-full flex justify-center items-center'>
                <a href='/' className='w-14'>
                    <Image src={Logo.src} alt='Medieteknik Logo' width='56' height='56' />
                </a>
            </div>

            <div className='w-1/2 h-full flex'>
                <ul className='w-1/3 flex justify-between'>
                    <li>Aktuellt</li>
                    <li>Sektionen</li>
                    <li>Utbildning</li>
                    <li>Kontakt</li>
                </ul>
                <div className='w-1/3 h-full flex justify-end items-center mx-8'>
                    Logga In
                </div>
            </div>

            

            </div>
        </header>
    )
}
import React from 'react';
import './Footer.css'
import { LocaleText, translate } from '../../Contexts/LocaleContext';

const Footer = (props) => {

    const footerLinks = [
        {
            title: 'Om medieteknik',
            links: [
                {
                    desc: 'Sektionen',
                    href: '/'
                },
                {
                    desc: 'Utbildningen',
                    href: '/'
                },
            ]
        },
        {
            title: 'Länkar',
            links: [
                {
                    desc: 'Cookies',
                    href: '/'
                },
                {
                    desc: 'Information om webbplatsen',
                    href: '/'
                },
                {
                    desc: 'Annosering',
                    href: '/'
                },
                {
                    desc: 'Kontakt',
                    href: '/'
                },
            ]
        }
    ]

    return (<div className='footer'>
        <div className='footer-cont'>
            {
                footerLinks.map(section =>
                    <div className='footer-cell'>
                        <h6>{section.title}</h6>
                        <div className='footer-cell-cont'>
                            {
                                section.links.map(link =>
                                    <p>
                                        <a href={link.href}>{link.desc}</a>
                                    </p>
                                )
                            }
                        </div>
                    </div>
                )
            }
            <div className='footer-cell'>
                <h6>Kontakt</h6>
                <div className='footer-cell-cont'>
                   <p>
                        Fack vid THS<br/>
                        Drotting Kristinas väg 15<br/>
                        100 44 Stockholm<br/>
                        <br/>
                        info@medieteknik.com
                   </p>
                </div>
            </div>
            <div className='footer-cell'>
                <h6>Följ medieteknik KTH</h6>
                <div className='footer-cell-cont'>
                   <p>
                   </p>
                </div>
            </div>
        </div>
    </div>);
}

export default Footer;
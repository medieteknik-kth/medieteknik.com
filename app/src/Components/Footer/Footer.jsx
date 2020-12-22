import React from 'react';
import './Footer.css'
import { LocaleText, translate } from '../../Contexts/LocaleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = (props) => {

    const footerLinks = [
        {
            title: translate({ se: 'Om medieteknik', en: 'About Media Technology'}),
            links: [
                {
                    desc: translate({ se: 'Vad är medieteknik?', en: 'What is Media Technology?'}),
                    href: '/medieteknik'
                },
                {
                    desc: 'Kurser',
                    href: '/kurser'
                },
            ]
        }
    ]

    return (<div className='footer'>
        <div className='footer-cont'>
            {
                footerLinks.map((section, i) =>
                    <div key={i} className='footer-cell'>
                        <h6>{section.title}</h6>
                        <div className='footer-cell-cont'>
                            {
                                section.links.map((link, i) =>
                                    <p key={i}>
                                        <a href={link.href}>{link.desc}</a>
                                    </p>
                                )
                            }
                        </div>
                    </div>
                )
            }
            <div className='footer-cell'>
                <h6><LocaleText phrase='footer/contact'/></h6>
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
                <h6><LocaleText phrase='footer/follow'/></h6>
                <div className='footer-cell-cont'>
                    <div>
                        <a href='http://www.facebook.com/medieteknik.kth' target='_blank' rel='noopener noreferrer'>
                            <FontAwesomeIcon className='footer-icon' icon={faFacebookF} color="white" size="lg" />
                        </a>
                        <a href='https://www.instagram.com/medieteknik_kth/' target='_blank' rel='noopener noreferrer'>
                            <FontAwesomeIcon className='footer-icon' icon={faInstagram} color="white" size="lg" />
                        </a>
                        <a href='https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/' target='_blank' rel='noopener noreferrer'>
                            <FontAwesomeIcon className='footer-icon' icon={faLinkedinIn} color="white" size="lg" />
                        </a>
                        <a href='https://www.youtube.com/channel/UCfd-63pepDHT9uZku8KbQTA' target='_blank' rel='noopener noreferrer'>
                            <FontAwesomeIcon className='footer-icon' icon={faYoutube} color="white" size="lg" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <p className='copyright'>© {new Date().getFullYear()} Sektionen för Medieteknik.</p>
    </div>);
}

export default Footer;
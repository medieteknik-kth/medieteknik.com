import React from 'react'
import './HomeScreen.scss'
import { LocaleText } from '../../Contexts/LocaleContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const HomeScreen = () => {
    return (
        <div className="home-screen">
            <div className="home-screen-content">
                <div className="home-header">
                    <h2>
                        <LocaleText phrase="landing/welcome" />
                    </h2>
                    <h1 className="medieteknik">
                        <LocaleText phrase="common/media_technology" />
                    </h1>
                    <h3>
                        <LocaleText phrase="common/kth_full" />
                    </h3>
                </div>
            </div>

            <div
                className="home-screen-scroll-button"
                onClick={() => {
                    window.scrollTo({
                        top: window.innerHeight - 80,
                        behavior: 'smooth',
                    })
                }}
            >
                <FontAwesomeIcon icon={faAngleDown} color="#fff" size="3x" />
            </div>
        </div>
    )
}

export default HomeScreen

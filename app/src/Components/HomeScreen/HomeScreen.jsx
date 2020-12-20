import React, { useEffect, useState } from 'react'
import './HomeScreen.scss'

// import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom'
// import { Swiper, Pagination, Autoplay } from 'swiper/js/swiper.esm'
import smoothscroll from 'smoothscroll-polyfill'
// import 'swiper/css/swiper.min.css'

import { LocaleText } from '../../Contexts/LocaleContext'
import Api from '../../Utility/Api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import DefaultHeader from './header.jpg'

// const params = {
//     Swiper,
//     modules: [Pagination, Autoplay],
//     slidesPerView: 1,
//     allowTouchMove: false,
//     autoplay: {
//         delay: 5000,
//         disableOnInteraction: false,
//     },
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//     },
// }

const HomeScreen = () => {
    const [headerImages, setHeaderImages] = useState([])

    //Takes for granted that the header album has id 1
    useEffect(() => {
        // Api.Albums.GetById(1).then((r) => setHeaderImages(r.images))
        smoothscroll.polyfill();
    }, [])

    return (
        <div className="home-screen">
            <div className="hs-swiper">
                <img src={DefaultHeader} />
            </div>
            {/* <ReactIdSwiperCustom {...params} shouldSwiperUpdate>
                {headerImages.length > 0 ? (
                    headerImages.map((image) => (
                        <div className="hs-swiper">
                            <img src={image.url} />
                        </div>
                    ))
                ) : (
                    <div className="hs-swiper">
                        <img src={DefaultHeader} />
                    </div>
                )}
            </ReactIdSwiperCustom> */}
            <div className="hs-content-container">
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
            </div>

            <div className="hs-scroll-container">
                <div
                    className="home-screen-scroll-button"
                    onClick={() => {
                        window.scrollTo({
                            top: window.innerHeight - 80,
                            behavior: 'smooth',
                        })
                    }}
                >
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        color="#fff"
                        size="3x"
                    />
                </div>
            </div>
        </div>
    )
}

export default HomeScreen

import React, { useState, useEffect, useCallback } from 'react'
import 'swiper/css/swiper.min.css'
import './Swiper.css'
import '../Album/Album.css';

import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, Navigation, Pagination } from 'swiper/js/swiper.esm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';

const CustomBuildSwiper = ({albumId, images, videos, viewImage, viewVideo}) => {
    const params = {
        Swiper,
        modules: [Navigation, Pagination],
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {},
    }
    

    return(
        <>
            <ReactIdSwiperCustom {...params} >
                {videos !== undefined ? 
                    videos.map((video, key) => (
                        <div 
                            key={video.id} 
                            className="swiper-slide no-select"
                            onClick={() => viewVideo(key, albumId)}
                        >
                            <div className="album-video-play-icon" style={{"height":"200px"}}>
                                <FontAwesomeIcon 
                                    icon={faPlayCircle} 
                                    color="#f0c900" 
                                    size="4x" 
                                />
                            </div>
                            <img
                                src={video.thumbnail}
                                alt="#"
                                className="img-fluid"
                            />
                        </div>
                    ))  : null
                }

                {images !== undefined && images !== null ? 
                    images.map((image, key) => {
                        return (
                            <div key={key} className='swiper-slide no-select'>
                                <img 
                                    src={image.url} 
                                    alt='#' 
                                    className='img-fluid'  
                                    onClick={() => viewImage(key, albumId)}
                                />
                            </div>
                        )
                    }) : null
                }
            </ReactIdSwiperCustom>
        </>
    )
}
 

export default CustomBuildSwiper;

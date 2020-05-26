import React, { useState, useEffect } from 'react'
import 'swiper/css/swiper.min.css'
import './Swiper.css'
import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, Navigation } from 'swiper/js/swiper.esm';
import useWindowDimensions from '../../../Hooks/useWindowDimensions'
import AlbumModal from '../AlbumModal/AlbumModal';
 
const CustomBuildSwiper = (props) => {
    
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    const params = {
        Swiper,
        modules: [Navigation],
        slidesPerView: 'auto',
        spaceBetween: 30,
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    }

    const viewImage = (image) => {
        setCurrentImage(image)
        setModalOpen(true)
    }
 
    return(
        <>
            { currentImage ? 
                <AlbumModal 
                    image={currentImage.src} 
                    title={currentImage.title}
                    date={currentImage.date}
                    photographer={currentImage.photographer}
                    modalOpen={modalOpen} 
                    setModalOpen={setModalOpen} /> 
                : <></>
            }
            <ReactIdSwiperCustom {...params} >
                {  
                    props.images.map((image, key) => 
                        <div key={key} className='swiper-slide no-select'>
                            <img 
                                src={image.src} 
                                alt='#' 
                                className='img-fluid'  
                                onClick={() => viewImage({src: image.src, title: props.title, date: image.date, photographer: image.photographer })} />
                        </div>)
                }
            </ReactIdSwiperCustom>
        </>
    )
}
 
export default CustomBuildSwiper;

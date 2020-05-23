import React from 'react'
import 'swiper/css/swiper.min.css'
import './Swiper.css'
import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, Navigation } from 'swiper/js/swiper.esm';
import useWindowDimensions from '../../../Hooks/useWindowDimensions'
 
const CustomBuildSwiper = (props) => {

    const windowDimensions = useWindowDimensions();

    const params = {
        Swiper,
        modules: [Navigation],
        rebuildOnUpdate: true,
        
        slidesPerView: windowDimensions.width < 500 ? 1 : windowDimensions.width < 1500 ? 3 : 5,
        spaceBetween: 30,
        calculateHeight: true,
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoHeight: true,
        lazy: {
          loadPrevNext: true,
        },
    }
 
  return(
    <ReactIdSwiperCustom {...params}>
        {props.images.map(image => <div className='swiper-slide' ><img src={image} alt='#' className='img-fluid'/></div>)}
    </ReactIdSwiperCustom>
  )
}
 
export default CustomBuildSwiper;

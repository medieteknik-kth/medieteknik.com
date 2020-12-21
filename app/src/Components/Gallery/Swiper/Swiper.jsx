import React, { useState, useEffect, useCallback } from 'react'
import 'swiper/css/swiper.min.css'
import './Swiper.css'
import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, Navigation, Pagination } from 'swiper/js/swiper.esm';
import useWindowDimensions from '../../../Hooks/useWindowDimensions'
import AlbumModal from '../AlbumModal/AlbumModal';
import AlbumVideoModal from '../AlbumModal/AlbumVideoModal';

const CustomBuildSwiper = ({images, videos, title}) => {
    const [swiperWidth, setSwiperWidth] = useState(300);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageId, setCurrentImageId] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentVideoId, setCurrentVideoId] = useState(0);
    const [isVideo, setIsVideo] = useState(false);

    const params = {
        Swiper,
        modules: [Navigation, Pagination],
        slidesPerView: 'auto',
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {},
    }

    const changeImage = useCallback(event => {
        if (event.key === 'ArrowLeft') {
            viewPreviousImage(currentImageId);
        } else if (event.key === 'ArrowRight') {
            viewNextImage(currentImageId);
        }
    }, [currentImageId])

    useEffect(() => {
        setSwiperWidth(window.innerWidth * 0.8 * 0.8);
        window.addEventListener('keydown', changeImage);
        return () => window.removeEventListener('keydown', changeImage);
    }, [currentImageId])

    const viewPreviousImage = (imageId) => {
        if (imageId > 0) {
            setCurrentImageId(imageId - 1);
            const tempImage = images[imageId - 1]
            setCurrentImage({src: tempImage.url, title: title, date: new Date(tempImage.date), photographer: tempImage.photographer})
        }
    }

    const viewNextImage = (imageId) => {
        if (imageId < images.length - 1) {
            setCurrentImageId(imageId + 1);
            const tempImage = images[imageId + 1]
            setCurrentImage({src: tempImage.url, title: title, date: new Date(tempImage.date), photographer: tempImage.photographer})
        }
    }

    const viewImage = (imageId) => {
        const tempImage = images[imageId];
        setCurrentImage({src: tempImage.url, title: title, date: new Date(tempImage.date), photographer: tempImage.photographer});
        setModalOpen(true);
        setIsVideo(false);
    }

    const viewVideo = (videoId) => {
        const tempVideo = videos[videoId];
        setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
        setModalOpen(true);
        setIsVideo(true);
    };

    const mediaModal = (isVideo ? (
        <AlbumVideoModal
            title={currentVideo.title}
            videoUrl={currentVideo.src}
            date={new Date(currentVideo.date)}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
        />) : (
        <AlbumModal 
            image={currentImage.src} 
            title={currentImage.title}
            date={currentImage.date}
            photographer={currentImage.photographer}
            imageId={currentImageId}
            viewPreviousImage={viewPreviousImage}
            viewNextImage={viewNextImage}
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen} 
        />)
    );
        
 
    return(
        <>
            { currentImage ? mediaModal : null }
            <div style={{"width": `${swiperWidth}px`}} className="">
                <ReactIdSwiperCustom {...params} >
                    {
                        videos.map((video, key) => (
                            <div key={key} className="swiper-slide no-select">
                                <img
                                    src={video.thumbnail}
                                    alt="#"
                                    className="img-fluid"
                                    onClick={() => {
                                        setCurrentVideoId(key);
                                        viewVideo(key);
                                    }}
                                />
                            </div>
                        ))
                    }

                    {  
                        images.map((image, key) => {
                            return (
                                <div key={key} className='swiper-slide no-select'>
                                    <img 
                                        src={image.url} 
                                        alt='#' 
                                        className='img-fluid'  
                                        onClick={() => {
                                            setCurrentImageId(key);
                                            viewImage(key);
                                        }}
                                    />
                                </div>
                            )
                        })
                    }
                </ReactIdSwiperCustom>
            </div>
        </>
    )
}
 

export default CustomBuildSwiper;

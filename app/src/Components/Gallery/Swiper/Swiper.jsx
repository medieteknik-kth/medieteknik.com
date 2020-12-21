import React, { useState, useEffect, useCallback } from 'react'
import 'swiper/css/swiper.min.css'
import './Swiper.css'
import '../Album/Album.css';

import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, Navigation, Pagination } from 'swiper/js/swiper.esm';
import useWindowDimensions from '../../../Hooks/useWindowDimensions'
import AlbumModal from '../AlbumModal/AlbumModal';
import AlbumVideoModal from '../AlbumModal/AlbumVideoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';

const CustomBuildSwiper = ({images, videos, title}) => {
    const [swiperWidth, setSwiperWidth] = useState(300);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageId, setCurrentImageId] = useState(0);
    const [currentImage, setCurrentImage] = useState(images !== undefined ? images[0] : undefined);
    const [currentVideo, setCurrentVideo] = useState(videos !== undefined ? videos[0] : undefined);
    const [currentVideoId, setCurrentVideoId] = useState(0);
    const [isVideo, setIsVideo] = useState(false);
    const [mediaModal, setMediaModal] = useState(null);

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
        setMediaModal(
            <AlbumModal 
                image={tempImage !== undefined && tempImage !== null ? tempImage.src : undefined} 
                title={tempImage !== undefined && tempImage !== null ? tempImage.title : undefined}
                date={tempImage !== undefined && tempImage !== null ? new Date(tempImage.date) : undefined}
                photographer={tempImage !== undefined && tempImage !== null ? tempImage.photographer : undefined}
                imageId={tempImage !== undefined && tempImage !== null ? currentImageId : undefined}
                viewPreviousImage={viewPreviousImage}
                viewNextImage={viewNextImage}
                modalOpen={modalOpen} 
                setModalOpen={setModalOpen} 
            />
        );
    }

    const viewVideo = (videoId) => {
        const tempVideo = videos[videoId];
        setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
        setModalOpen(true);
        setIsVideo(true);
        setMediaModal(
            <AlbumVideoModal
                title={tempVideo !== undefined && tempVideo !== null ? tempVideo.title : undefined}
                videoUrl={tempVideo !== undefined && tempVideo !== null ? tempVideo.src : undefined}
                date={tempVideo !== undefined && tempVideo !== null ? new Date(tempVideo.uploadedAt) : undefined}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        );
    };
        
    return(
        <>
            { currentImage || currentVideo ? mediaModal : null }
            <div style={{"width": `${swiperWidth}px`}} className="">
                <ReactIdSwiperCustom {...params} >
                    {videos !== undefined ? 
                        videos.map((video, key) => (
                            <div 
                                key={video.id} 
                                className="swiper-slide no-select"
                                onClick={() => {
                                    setCurrentVideoId(key);
                                    viewVideo(key);
                                    console.log("Hej1");
                                }}
                            >
                                <div className="album-video-play-icon">
                                    <FontAwesomeIcon 
                                        icon={faPlayCircle} 
                                        color="white" 
                                        size="3x" 
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

                    {images !== undefined ? 
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
                        }) : null
                    }
                </ReactIdSwiperCustom>
            </div>
        </>
    )
}
 

export default CustomBuildSwiper;

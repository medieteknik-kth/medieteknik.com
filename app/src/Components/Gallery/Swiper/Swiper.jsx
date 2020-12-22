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
    // const [swiperWidth, setSwiperWidth] = useState(300);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageId, setCurrentImageId] = useState(0);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentVideoId, setCurrentVideoId] = useState(0);
    const [isVideo, setIsVideo] = useState(false);
    const [mediaModal, setMediaModal] = useState(null);

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

    const changeImage = useCallback(event => {
        if (event.key === 'ArrowLeft') {
            if (isVideo) {
                viewPreviousImage(currentVideoId, 'video');
            } else {
                console.log(currentImageId);
                viewPreviousImage(currentImageId, 'img');
            }
            
        } else if (event.key === 'ArrowRight') {
            if (isVideo) {
                viewNextImage(currentVideoId, 'video');
            } else {
                viewNextImage(currentImageId, 'img');
            }
        }
    }, [currentImageId]);

    useEffect(() => {
        window.addEventListener('keydown', changeImage);
            
        return () => window.removeEventListener('keydown', changeImage);
    }, [currentImageId])

    const viewPreviousImage = (mediaId, mediaType) => {
        if (mediaType === 'img') {
            if (mediaId > 0) {
                setCurrentImageId(mediaId - 1);
                const tempImage = images[mediaId - 1];
                setCurrentImage({src: tempImage.url, title: title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            } else if (videos.length > 0) {
                setCurrentVideoId(videos.length - 1);
                const tempVideo = videos[videos.length - 1];
                setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
                setIsVideo(true);
            }
        } else if (mediaType === 'video') {
            if (mediaId > 0) {
                setCurrentVideoId(mediaId - 1);
                const tempVideo = videos[mediaId - 1];
                setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
                setIsVideo(true);
            }
        }
    }

    const viewNextImage = (mediaId, mediaType) => {
        if (mediaType === 'img') {
            if (mediaId < images.length - 1) {
                setCurrentImageId(mediaId + 1);
                const tempImage = images[mediaId + 1];
                setCurrentImage({src: tempImage.url, title: title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            }
        } else if (mediaType === 'video') {
            if (mediaId < videos.length - 1) {
                setCurrentVideoId(mediaId + 1);
                const tempVideo = videos[mediaId + 1];
                setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
                setIsVideo(true);
            } else if (images.length > 0) {
                setCurrentImageId(0);
                const tempImage = images[0];
                setCurrentImage({src: tempImage.url, title: title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            }
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
    
    const modal = () => (isVideo ? (
        <AlbumVideoModal
            title={currentVideo.title}
            videoUrl={currentVideo.src}
            date={new Date(currentVideo.date)}
            videoId = {currentVideoId}
            numberOfImages = {images.length}
            numberOfVideos = {videos.length}
            viewPreviousImage={viewPreviousImage}
            viewNextImage={viewNextImage}
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen} 
        />
    ) : (
        <AlbumModal 
            image={currentImage.src} 
            title={currentImage.title}
            date={new Date(currentImage.date)}
            photographer={currentImage.photographer}
            imageId={currentImageId}
            numberOfImages = {images.length}
            numberOfVideos = {videos.length}
            viewPreviousImage={viewPreviousImage}
            viewNextImage={viewNextImage}
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen} 
        />
    ))

    return(
        <>
            { currentImage || currentVideo ? modal() : null }
            <ReactIdSwiperCustom {...params} >
                {videos !== undefined ? 
                    videos.map((video, key) => (
                        <div 
                            key={video.id} 
                            className="swiper-slide no-select"
                            onClick={() => {
                                setCurrentVideoId(key);
                                viewVideo(key);
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

                {images !== undefined && images !== null ? 
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
        </>
    )
}
 

export default CustomBuildSwiper;

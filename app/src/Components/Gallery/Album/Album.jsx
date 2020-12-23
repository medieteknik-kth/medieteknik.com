import React, { useState, useEffect, useCallback, useContext } from 'react';
import './Album.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
import AlbumModal from '../AlbumModal/AlbumModal';
import AlbumVideoModal from '../AlbumModal/AlbumVideoModal';
import Api from '../../../Utility/Api';
import useEventListener from "@use-it/event-listener";

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import PreviousPageButton from '../../Common/Buttons/PreviousPageButton/PreviousPageButton';

const Album = () => {
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageId, setCurrentImageId] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentVideoId, setCurrentVideoId] = useState(0);
    const [album, setAlbum] = useState(null);
    const { id } = useParams();
    const { lang } = useContext(LocaleContext);
    const [isVideo, setIsVideo] = useState(false);
    

    const changeImage = useCallback(event => {
        
        if (event.key === 'ArrowLeft') {
            if (isVideo) {
                viewPreviousImage(currentVideoId, 'video');
            } else {
                viewPreviousImage(currentImageId, 'img');
            }
            
        } else if (event.key === 'ArrowRight') {
            if (isVideo) {
                viewNextImage(currentVideoId, 'video');
            } else {
                viewNextImage(currentImageId, 'img');
            }
        }
    }, [currentImageId, currentVideoId, modalOpen, isVideo]);

    useEventListener('keydown', changeImage);

    useEffect(() => {
        Api.Albums.GetById(id).then((album) => {
            setAlbum(album);
            setVideos(album.videos !== null ? album.videos : []);
            setImages(album.images !== null ? album.images : []);
        });
    }, [])

    const viewPreviousImage = (mediaId, mediaType) => {
        if (mediaType === 'img') {
            if (mediaId > 0) {
                setCurrentImageId(mediaId - 1);
                const tempImage = images[mediaId - 1];
                setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
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
                setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
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
                setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            }
        }
    }

    const viewImage = (imageId) => {
        const tempImage = images[imageId];
        setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer})
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

    return (
        album == null ? <div /> : (
        <>
            { currentImage || currentVideo ? modal() : null }
  
            <div className="album-header">
                <h2>{album.title}</h2>
                <h5>{album.date ? new Date(album.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : <></>}</h5>
            </div>
            
            <div className="album-container">
                <PreviousPageButton 
                    linkPath = '/media-gallery'
                    text = {translateToString({
                        se: "Tillbaka till mediagalleri",
                        en: "Back to media gallery",
                        lang
                    })}
                    extraStyle = {{"margin":"0 0 10px 20px"}}
                />
                <div className="album-grid">
                    {album.videos.map((video, key) => (
                        <div
                            key={video.id}
                            className="album-cell no-select"
                            onClick={() => {
                                setCurrentVideoId(key);
                                viewVideo(key);
                            }}
                        >
                            <div className="album-video-play-icon">
                                <FontAwesomeIcon 
                                    icon={faPlayCircle} 
                                    color="#f0c900" 
                                    size="4x" 
                                />
                            </div>
                            <img 
                                src={video.thumbnail} 
                                className="responsive-image" 
                                alt="" 
                            />
                        </div>
                    ))}

                    {album.images.map((image, key) => (
                        <div
                            key={image.url}
                            className="album-cell no-select"
                            onClick={() => {
                                setCurrentImageId(key);
                                viewImage(key);
                            }}
                        >
                        <img src={image.url} className="responsive-image" alt="" />
                    </div>
                    ))}
                </div>
            </div>
        </>
        )
    );
}

export default Album;
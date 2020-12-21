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

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import PreviousPageButton from '../../Common/Buttons/PreviousPageButton/PreviousPageButton';

const Album = () => {
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
            viewPreviousImage(currentImageId);
        } else if (event.key === 'ArrowRight') {
            viewNextImage(currentImageId);
        }
    }, [currentImageId])

    useEffect(() => {
        Api.Albums.GetById(id).then((album) => {
            setAlbum(album);
        });
        window.addEventListener('keydown', changeImage);
        return () => window.removeEventListener('keydown', changeImage);
    }, [currentImageId])

    const viewPreviousImage = (imageId) => {
        if (imageId > 0) {
            setCurrentImageId(imageId - 1);
            const tempImage = album.images[imageId - 1]
            setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer})
        }
    }

    const viewNextImage = (imageId) => {
        if (imageId < album.images.length - 1) {
            setCurrentImageId(imageId + 1);
            const tempImage = album.images[imageId + 1]
            setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer})
        }
    }

    const viewImage = (imageId) => {
        const tempImage = album.images[imageId];
        setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer})
        setModalOpen(true);
        setIsVideo(false);
    }

    const viewVideo = (videoId) => {
        const tempVideo = album.videos[videoId];
        setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
        setModalOpen(true);
        setIsVideo(true);
    };

    const modal = () => (isVideo ? (
        <AlbumVideoModal
            title={currentVideo.title}
            videoUrl={currentVideo.src}
            date={new Date(currentVideo.date)}
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
                                console.log("Hej2");
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
                                console.log(key)
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
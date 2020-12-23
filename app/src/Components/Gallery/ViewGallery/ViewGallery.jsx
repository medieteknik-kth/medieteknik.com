import React, { useContext, useState, useEffect, useCallback } from 'react';
import classes from './ViewGallery.module.scss';
import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import useEventListener from "@use-it/event-listener";

// --- Components ---
import SideMenu from '../SideMenu/SideMenu';
import AlbumPreview from './AlbumPreview/AlbumPreview';
import FilterButton from '../../Common/Buttons/FilterButton/FilterButton';
import AlbumModal from '../AlbumModal/AlbumModal';
import AlbumVideoModal from '../AlbumModal/AlbumVideoModal';

import Api from '../../../Utility/Api';

const ViewGallery = () => {
    const [albums, setAlbums] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const { lang } = useContext(LocaleContext);
    const [mediasSelected, setMediasSelected] = useState({
        "images": false,
        "videos": false
    });
    const [numberOfMediasViewed, setNumberOfMediasViewed] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    // ---
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageId, setCurrentImageId] = useState(0);
    const [currentVideoId, setCurrentVideoId] = useState(0);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentAlbumId, setCurrentAlbumId] = useState(null);
    const [isVideo, setIsVideo] = useState(false);

    const changeImage = useCallback(event => {
        if (event.key === 'ArrowLeft') {
            if (isVideo) {
                viewPreviousImage(currentVideoId, 'video', currentAlbumId);
            } else {
                viewPreviousImage(currentImageId, 'img', currentAlbumId);
            }
            
        } else if (event.key === 'ArrowRight') {
            if (isVideo) {
                viewNextImage(currentVideoId, 'video', currentAlbumId);
            } else {
                viewNextImage(currentImageId, 'img', currentAlbumId);
            }
        }
    }, [currentImageId, currentVideoId, modalOpen, isVideo]);

    useEventListener('keydown', changeImage);

    useEffect(() => {
        Api.Albums.GetAll().then(albums => {
            setAlbums(albums);
        });
    }, []);

    const chosenMediaHandler = (clickedMediaType) => {
        const tempMediasSelected = {...mediasSelected};

        if (tempMediasSelected[clickedMediaType]) {
            tempMediasSelected[clickedMediaType] = false;
            setNumberOfMediasViewed(numberOfMediasViewed - 1);
        } else {
            tempMediasSelected[clickedMediaType] = true;
            setNumberOfMediasViewed(numberOfMediasViewed + 1);
        }

        setMediasSelected(tempMediasSelected);
    }

    const handleSearch = (searchString) => {
        setSearchInput(searchString.toUpperCase());
    }

    const clearMediaTypesHandler = () => {
        setMediasSelected({
            "images": false,
            "videos": false
        });
        setNumberOfMediasViewed(0);
    }

    const closeFilterHandler = () => {
        setShowFilter(false);
    }

    const viewPreviousImage = (mediaId, mediaType, _albumId) => {
        const albumId = _albumId - 1;
        const tempVideos = albums[albumId].videos;
        const tempImages = albums[albumId].images;
        if (mediaType === 'img') {
            if (mediaId > 0) {
                setCurrentImageId(mediaId - 1);
                const tempImage = tempImages[mediaId - 1];
                setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            } else if (tempVideos.length > 0) {
                setCurrentVideoId(tempVideos.length - 1);
                const tempVideo = tempVideos[tempVideos.length - 1];
                setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
                setIsVideo(true);
            }
        } else if (mediaType === 'video') {
            if (mediaId > 0) {
                setCurrentVideoId(mediaId - 1);
                const tempVideo = tempVideos[mediaId - 1];
                setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
                setIsVideo(true);
            }
        }
    }

    const viewNextImage = (mediaId, mediaType, _albumId) => {
        const albumId = _albumId - 1;
        const tempVideos = albums[albumId].videos;
        const tempImages = albums[albumId].images;
        if (mediaType === 'img') {
            if (mediaId < tempImages.length - 1) {
                setCurrentImageId(mediaId + 1);
                const tempImage = tempImages[mediaId + 1];
                setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            }
        } else if (mediaType === 'video') {
            if (mediaId < tempVideos.length - 1) {
                setCurrentVideoId(mediaId + 1);
                const tempVideo = tempVideos[mediaId + 1];
                setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
                setIsVideo(true);
            } else if (tempImages.length > 0) {
                setCurrentImageId(0);
                const tempImage = tempImages[0];
                setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
                setIsVideo(false);
            }
        }
    }

    const viewImage = (imageId, _albumId) => {
        const albumId = _albumId - 1;
        const tempImages = albums[albumId].images;
        const tempImage = tempImages[imageId];
        setCurrentAlbumId(_albumId);
        setCurrentImage({src: tempImage.url, title: tempImage.title, date: new Date(tempImage.date), photographer: tempImage.photographer});
        setModalOpen(true);
        setIsVideo(false);
        setCurrentImageId(imageId);
    }

    const viewVideo = (videoId, _albumId) => {
        const albumId = _albumId - 1;
        const tempVideos = albums[albumId].videos;
        const tempVideo = tempVideos[videoId];
        setCurrentAlbumId(_albumId);
        setCurrentVideo({src: tempVideo.url, title: tempVideo.title, date: new Date(tempVideo.uploadedAt)});
        setModalOpen(true);
        setIsVideo(true);
        setCurrentVideoId(videoId);
    };

    // ---

    let viewImages, viewVideos;

    if (mediasSelected['images'] || numberOfMediasViewed === 0) {
        viewImages = true;
    }

    if (mediasSelected['videos'] || numberOfMediasViewed === 0) {
        viewVideos = true;
    }

    const modal = () => (isVideo ? (
        <AlbumVideoModal
            title={currentVideo.title}
            videoUrl={currentVideo.src}
            date={new Date(currentVideo.date)}
            videoId = {currentVideoId}
            numberOfImages = {albums[currentAlbumId-1].images.length}
            numberOfVideos = {albums[currentAlbumId-1].videos.length}
            viewPreviousImage={viewPreviousImage}
            viewNextImage={viewNextImage}
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen}
            albumId = {currentAlbumId}
        />
    ) : (
        <AlbumModal 
            image={currentImage.src} 
            title={currentImage.title}
            date={new Date(currentImage.date)}
            photographer={currentImage.photographer}
            imageId={currentImageId}
            numberOfImages = {albums[currentAlbumId-1].images.length}
            numberOfVideos = {albums[currentAlbumId-1].videos.length}
            viewPreviousImage={viewPreviousImage}
            viewNextImage={viewNextImage}
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen} 
            albumId = {currentAlbumId}
        />
    ))

    return (
        <>

            { currentImage || currentVideo ? modal() : null }
            <div className={classes.galleryContainer}>
                <FilterButton 
                    colorTheme = "light"
                    onClick = {() => setShowFilter(true)}
                    extraClasses = {[classes.filterButton]}
                />

                <SideMenu 
                    mediasSelected = {mediasSelected}
                    numberOfMediasViewed = {mediasSelected}
                    chosenMediaHandler = {chosenMediaHandler}
                    handleSearch = {handleSearch}
                    clearMediaTypesHandler = {clearMediaTypesHandler}
                    showFilter = {showFilter}
                    closeFilterHandler = {closeFilterHandler}
                />

                {
                    albums == null ? <div /> : (
                        <div className={classes.galleryContent}>
                            {albums.map((album, index) => {
                                let tempImages = viewImages ? album.images : [];
                                let tempVideos = viewVideos ? album.videos : [];
                                let albumName = album.title.toUpperCase();
                                let inSearchResult = albumName.includes(searchInput);

                                if ((tempImages.length > 0 || tempVideos.length > 0) && inSearchResult) {
                                    return (
                                        <AlbumPreview 
                                            key={index}
                                            title={album.title} 
                                            images={tempImages} 
                                            videos={tempVideos}
                                            id={album.id}
                                            viewImage = {viewImage}
                                            viewVideo = {viewVideo}
                                        />
                                    )
                                }
                            })}
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default ViewGallery;
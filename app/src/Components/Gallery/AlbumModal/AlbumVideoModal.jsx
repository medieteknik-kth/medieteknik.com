import React, { useEffect } from 'react';
import Modal from 'react-modal';
import VideoPlayer from '../../Video/VideoPlayer';

import classes from './AlbumModal.module.scss';

import PreviousImageButton from '../../Common/Buttons/PreviousButton/PreviousButton';
import NextImageButton from '../../Common/Buttons/NextButton/NextButton';
import ExitButton from '../../Common/Buttons/ExitButton/ExitButton';

const AlbumVideoModal = ({
    title, 
    date, 
    videoUrl, 
    modalOpen, 
    setModalOpen, 
    videoId, 
    viewPreviousImage, 
    viewNextImage,
    numberOfImages,
    numberOfVideos,
    albumId,
    pauseVideo
    }) => {

    return(
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            className={classes.modal}
            overlayClassName={classes.overlay}
            ariaHideApp={false}
        >
            <div className={classes.imageContainer}>
                <div 
                    onClick = {event => {
                        let isPartOfButton = document.getElementsByClassName(classes.leftButton)[0].contains(event.target);

                        if (!isPartOfButton) {
                            setModalOpen(false);
                        }
                    }}
                    className = {classes.leftButtonContainer}
                >
                    <PreviousImageButton 
                        extraClass={classes.leftButton}
                        disabled = {videoId === 0}
                        onClick = {() => viewPreviousImage(videoId, 'video', albumId)}
                    />
                </div>

                <div>
                    <VideoPlayer 
                        videoUrl={videoUrl}
                        extraStyle = {{
                            width: "75vw"
                        }}
                        pauseVideo = {pauseVideo}
                    />
                    <h5>{`${date.toISOString().split('T')[0]}`}</h5>
                    <h3>{title}</h3>
                </div>
                
                <div 
                    onClick = {event => {
                        let isPartOfButton = document.getElementsByClassName(classes.rightButton)[0].contains(event.target);

                        if (!isPartOfButton) {
                            setModalOpen(false);
                        }
                    }}
                    className = {classes.rightButtonContainer}
                >
                    <NextImageButton 
                        extraClass={classes.rightButton}
                        disabled = {videoId === numberOfVideos - 1 && numberOfVideos === 0}
                        onClick = {() => viewNextImage(videoId, 'video', albumId)}
                    />
                </div>
                
            </div>

            <div onClick = {() => setModalOpen(false)}>
                <ExitButton 
                    extraClass = {classes.exitButton}
                />
            </div>
        </Modal>
    );
}

export default AlbumVideoModal;
import React from 'react';
import Modal from 'react-modal';

import classes from './AlbumModal.module.scss';

import PreviousImageButton from '../../Common/Buttons/PreviousButton/PreviousButton';
import NextImageButton from '../../Common/Buttons/NextButton/NextButton';
import ExitButton from '../../Common/Buttons/ExitButton/ExitButton';

const AlbumModal = ({title, date, photographer, image, modalOpen, setModalOpen, imageId, viewPreviousImage, viewNextImage}) => {
    return(
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            className={classes.modal}
            overlayClassName={classes.overlay}
            ariaHideApp={false}
        >
            <div className={classes.imageContainer}>

                <div onClick = {() => viewPreviousImage(imageId)}>
                    <PreviousImageButton 
                        extraClass={classes.leftButton}
                    />
                </div>

                <div>
                    <img 
                        src={image} 
                        style={{
                            maxWidth: "75vw", 
                            maxHeight: "85vh"
                        }} 
                        alt='' 
                        className='no-select'
                    />
                    <h5>{`${date.toISOString().split('T')[0]}, ${photographer}`}</h5>
                    <h3>{title}</h3>
                </div>
                
                <div onClick = {() => viewNextImage(imageId)}>
                    <NextImageButton 
                        extraClass={classes.leftButton}
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

export default AlbumModal;
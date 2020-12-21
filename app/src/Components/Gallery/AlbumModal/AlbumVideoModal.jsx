import React from 'react';
import Modal from 'react-modal';
import VideoPlayer from '../../Video/VideoPlayer';

import classes from './AlbumModal.module.scss';

const AlbumVideoModal = ({title, date, videoUrl, modalOpen, setModalOpen}) => {
    return(
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            className={classes.modal}
            overlayClassName={classes.overlay}
            ariaHideApp={false}
        >
            <VideoPlayer 
                videoUrl={videoUrl}
                extraStyle = {{
                    width: "75vw"
                }}
            />
            <h5>{`${date.toISOString().split('T')[0]}`}</h5>
            <h3>{title}</h3>
        </Modal>
    );
}

export default AlbumVideoModal;
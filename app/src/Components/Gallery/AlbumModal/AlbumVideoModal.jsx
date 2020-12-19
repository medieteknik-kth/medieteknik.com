import React from 'react';
import Modal from 'react-modal';
import VideoPlayer from '../../Video/VideoPlayer';

const AlbumVideoModal = ({title, date, videoUrl, modalOpen, setModalOpen}) => {
    
    const customStyles = {
        content: {
            padding: 'none',
            border: 'none',
            borderRadius: 0,
            top: 'initial',
            bottom: 'initial',
            left: 'initial',
            right: 'initial',
            color: '#fff',
            background: 'none',

        },
        overlay: {
            zIndex: 2000,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            }
    }

    return(
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            ariaHideApp={false}>
                <VideoPlayer videoUrl={videoUrl} />
                <h5>{`${date.toISOString().split('T')[0]}`}</h5>
                <h3>{title}</h3>
        </Modal>
    );
}

export default AlbumVideoModal;
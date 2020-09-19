import React from 'react'
import Modal from 'react-modal'
import './ErrorModal.scss'
import { LocaleText, translate } from '../../../Contexts/LocaleContext'
import AlertIcon from './alert.svg'
import TimesCircleIcon from './times-circle.svg'

const ErrorModal = ({ message, modalOpen, setModalOpen }) => {
    const customStyles = {
        content: {
            padding: '2em',
            border: 'none',
            borderRadius: 10,
            top: 'initial',
            bottom: 'initial',
            left: 'initial',
            right: 'initial',
            maxWidth: '500px',
        },
        overlay: {
            zIndex: 2000,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className='error-modal-container'>
                <div className='error-modal'>
                    <div
                        className='error-cancel'
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        <img src={TimesCircleIcon} alt='' />
                    </div>
                    <img src={AlertIcon} alt='' />
                    <h3>
                        <LocaleText phrase='error/oops' />
                    </h3>
                    <p>{message.en ? translate(message) : message}</p>
                </div>
                <div
                    className='error-dismiss'
                    onClick={() => setModalOpen(!modalOpen)}
                >
                    <p>
                        <LocaleText phrase='error/dismiss' />
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default ErrorModal

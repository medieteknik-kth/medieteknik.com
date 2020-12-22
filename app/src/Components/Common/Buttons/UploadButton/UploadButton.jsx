import React from 'react';
import classes from './UploadButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const UploadButton = ({colorTheme, onClick, extraClasses}) => {
    let buttonClasses;

    if (extraClasses !== undefined) {
        buttonClasses = [...extraClasses];
    } else {
        buttonClasses = [];
    }
    if (colorTheme === 'light') {
        buttonClasses = [...buttonClasses, classes.lightButton];
    } else {
        buttonClasses = [...buttonClasses, classes.darkButton];
    }


    return (
        <div className={buttonClasses.join(" ")} onClick={onClick} >
            <FontAwesomeIcon icon={faUpload} />
        </div>
    )
}

export default UploadButton;
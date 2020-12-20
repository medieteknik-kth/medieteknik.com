import React from 'react';
import classes from './PreviousButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PreviousButton = ({extraClass, extraStyle}) => {
    return (
        <div 
            className={extraClass === undefined ? classes.Button : [extraClass, classes.Button].join(" ")}
            style={extraStyle}
        >
            <FontAwesomeIcon icon={faArrowLeft} />
        </div>
    )
}

export default PreviousButton;
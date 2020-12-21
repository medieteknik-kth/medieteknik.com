import React from 'react';
import classes from './PreviousButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PreviousButton = ({extraClass, extraStyle, disabled, onClick}) => {
    let buttonStyling = classes.Button;

    if (disabled) {
        buttonStyling = classes.disabledButton;
    }

    return (
        <div 
            className={extraClass === undefined ? buttonStyling : [extraClass, buttonStyling].join(" ")}
            style={extraStyle}
            onClick = {onClick}
        >
            <FontAwesomeIcon icon={faArrowLeft} />
        </div>
    )
}

export default PreviousButton;
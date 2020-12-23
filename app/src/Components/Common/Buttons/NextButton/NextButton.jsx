import React from 'react';
import classes from './NextButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const NextButton = ({extraClass, extraStyle, disabled, onClick}) => {
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
            <FontAwesomeIcon icon={faArrowRight} />
        </div>
    )
}

export default NextButton;
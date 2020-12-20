import React from 'react';
import classes from './NextButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const NextButton = ({extraClass, extraStyle}) => {
    return (
        <div 
            className={extraClass === undefined ? classes.Button : [extraClass, classes.Button].join(" ")}
            style={extraStyle}
        >
            <FontAwesomeIcon icon={faArrowRight} />
        </div>
    )
}

export default NextButton;
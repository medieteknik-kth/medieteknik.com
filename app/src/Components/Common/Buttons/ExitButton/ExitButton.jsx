import React from 'react';
import classes from './ExitButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ExitButton = ({extraClass, extraStyle}) => {
    return (
        <div 
            className={extraClass === undefined ? classes.Button : [extraClass, classes.Button].join(" ")}
            style={extraStyle}
        >
            <FontAwesomeIcon icon={faTimes} />
        </div>
    )
}

export default ExitButton;
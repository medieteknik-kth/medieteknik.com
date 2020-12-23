import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './PreviousPageButton.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const PreviousPageButton = ({linkPath, text, extraClass, extraStyle}) => {
    return (
        <NavLink 
            to={linkPath} 
            className={extraClass === undefined ? classes.backButton : [classes.backButton, extraClass].join(" ")}
            style={extraStyle}
        >
            <FontAwesomeIcon icon={faArrowLeft} />
            {` ${text}`}
        </NavLink>
    )
}

export default PreviousPageButton;
import React from 'react';

import classes from './RedTextButton.module.scss';

const RedTextButton = ({text, onClick, extraStyle}) => {
    return (
        <div 
            onClick={onClick}
            className = {classes.Button}
            style={extraStyle}
        >
            <span>{text}</span>
        </div>
    )
}

export default RedTextButton;
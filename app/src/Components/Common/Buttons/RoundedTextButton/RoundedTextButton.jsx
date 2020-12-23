import React from 'react';
import classes from './RoundedTextButton.module.scss';

const RoundedButton = ({text, onClick, extraClass, extraStyle}) => {
    return (
        <button 
            className={extraClass === undefined ? classes.RoundedButton : [classes.RoundedButton, extraClass].join(" ")} 
            onClick={onClick}
            style={extraStyle}
        >
            {text}
        </button>
    )
}
export default RoundedButton;
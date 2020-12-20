import React from 'react';
import classes from './RoundedTextButton.module.scss';

const RoundedButton = (props) => {
    return (
        <button className={classes.RoundedButton} onClick={props.onClick}>
            {props.children}
        </button>
    )
}
export default RoundedButton;
import React from 'react';
import classes from './ButtonRasmus.module.css';

const Button = (props) => {
    return (
        <button className={classes.button} onClick={props.onClick}>
            {props.children}
        </button>
    )
}
export default Button;
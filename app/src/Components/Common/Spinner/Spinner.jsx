import React from 'react';
import classes from './Spinner.module.css';

const Spinner = () => {

    return (
        <div className={classes.spinnerContainer}>
            <div className={classes.spinner} />
        </div>
    )
}

export default Spinner;
import React from 'react';

import classes from './checkbox.module.scss';

const Checkbox = ({name, isChecked, checkboxHandler, colorTheme}) => {
    let searchClass;


    if (colorTheme == 'dark') {
        searchClass = classes.darkStyling;
    } else if (colorTheme == 'light') {
        searchClass = classes.lightStyling;
    }

    return (
        <label 
            className = {searchClass} 
            key = {name}
        >
            <input
                name={name}
                type="checkbox"
                checked={isChecked}
                onChange={() => checkboxHandler(name)}
            />

            <span className={classes.checkmark}></span>
            <span className={classes.text}>{name}</span>
            <br />
        </label>
    )
}

export default Checkbox;
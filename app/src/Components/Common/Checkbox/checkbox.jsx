import React from 'react';

import classes from './checkbox.module.scss';

const Checkbox = ({name, isChecked, checkboxHandler, colorTheme}) => {
    let searchClass;

    if (colorTheme == 'dark') {
        searchClass = classes.darkStyling;
    } else if (colorTheme == 'light') {
        searchClass = classes.lightStyling;
    }
    // console.log()
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
            {name}
            <br />
        </label>
    )
}

export default Checkbox;
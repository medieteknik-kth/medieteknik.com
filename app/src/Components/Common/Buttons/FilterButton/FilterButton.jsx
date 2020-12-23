import React from 'react';
import classes from './FilterButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterButton = ({colorTheme, onClick, extraClasses}) => {
    let buttonClasses;

    if (extraClasses !== undefined) {
        buttonClasses = [...extraClasses];
    } else {
        buttonClasses = [];
    }
    if (colorTheme === 'light') {
        buttonClasses = [...buttonClasses, classes.lightButton];
    } else {
        buttonClasses = [...buttonClasses, classes.darkButton];
    }


    return (
        <div className={buttonClasses.join(" ")} onClick={onClick} >
            <FontAwesomeIcon icon={faFilter} />
        </div>
    )
}

export default FilterButton;
import React from 'react';

import classes from './SortOrderSelector.module.css';
import dropdownClasses from '../DropdownButtonStyle.module.css';
import EmptyArrowDown from '../../Assets/Arrows/Empty-arrow-down.svg';

const SortOrderSelector = (props) => {
    let dropdownTitle = '';

    if (props.orderValue === "falling") {
        dropdownTitle = 'Fallande';
    } else {
        dropdownTitle = 'Stigande';
    }

    return (
        <div className={[dropdownClasses.sortByStyledBoxContainer, dropdownClasses.dropdown].join(' ')}>
            <div className={[dropdownClasses.sortByStyledBox, dropdownClasses.sortDirectionClass, classes.orderByStyledBox].join(' ')}>
                {dropdownTitle}
                <img src={EmptyArrowDown} alt="Arrow"/>
            </div>

            <div className = {dropdownClasses.dropdownContentOrder}>
                <p onClick = {() => props.sortOrderChangedHandler("falling")}>
                    Fallande
                </p>

                <p onClick = {() => props.sortOrderChangedHandler("rising")}>
                    Stigande
                </p>
            </div>
        </div>
    );
};

export default SortOrderSelector;
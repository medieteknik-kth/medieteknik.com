import React from 'react';

import classes from './SortOrderSelector.module.css';
import dropdownClasses from '../DropdownButtonStyle.module.css';
import EmptyArrowDown from '../../Assets/Arrows/Empty-arrow-down.svg';

const SortOrderSelector = (props) => {

    return (
        <div className={[dropdownClasses.sortByStyledBoxContainer, dropdownClasses.dropdown, props.addClass].join(' ')}>
            <div className={[dropdownClasses.sortByStyledBox].join(' ')}>
                {props.orderValue === "falling" ? 'Fallande' : 'Stigande'}
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
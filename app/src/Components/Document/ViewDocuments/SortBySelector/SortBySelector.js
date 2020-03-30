import React from 'react';

import dropdownClasses from '../DropdownButtonStyle.module.css';
import classes from './SortBySelector.module.css';
import EmptyArrowDown from '../../Assets/Arrows/Empty-arrow-down.svg';

const SortBySelector = (props) => {
    let dropdownTitle = '';

    if (props.sortValue === "dateStart" || props.sortValue === "date") {
        dropdownTitle = 'Uppladdningsdatum';
    } else if (props.sortValue === "type") {
        dropdownTitle = 'Typ';
    } else if (props.sortValue === "publisher") {
        dropdownTitle = 'Uppladdat av';
    } else if (props.sortValue === "alphabetical") {
        dropdownTitle = 'Dokumentnamn';
    }

    return (
        <div className={[dropdownClasses.sortByStyledBoxContainer, dropdownClasses.dropdown, props.addClass].join(' ')}>
            <div className={[dropdownClasses.sortByStyledBox, dropdownClasses.SortByClass].join(' ')}>
                {dropdownTitle}
                <img src={EmptyArrowDown} alt="Arrow"/>
            </div>

            <div className = {dropdownClasses.dropdownContent}>
                <p onClick = {() => props.sortByChangedHandler("alphabetical")}>
                    Dokumentnamn
                </p>

                <p onClick = {() => props.sortByChangedHandler("type")}>
                    Typ
                </p>

                <p onClick = {() => props.sortByChangedHandler("publisher")}>
                    Uppladdat av
                </p>

                <p onClick = {() => props.sortByChangedHandler("date")}>
                    Uppladdningsdatum
                </p>
            </div>
        </div>
    );
};

export default SortBySelector;
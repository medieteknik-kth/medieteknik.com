import React, { useContext } from 'react';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

import dropdownClasses from '../DropdownButtonStyle.module.css';
import classes from './SortBySelector.module.css';
import EmptyArrowDown from '../../Assets/Arrows/Empty-arrow-down.svg';

const SortBySelector = (props) => {
    const { lang } = useContext(LocaleContext)

    let dropdownTitle = '';

    if (props.sortValue === "dateStart") {
        dropdownTitle = translateToString({
            se: 'Sortera efter',
            en: 'Sort by',
            lang,
        });
    } else if (props.sortValue === "date") {
        dropdownTitle = translateToString({
            se: 'Uppladdningsdatum',
            en: 'Publish date',
            lang,
        });
    } else if (props.sortValue === "publisher") {
        dropdownTitle = translateToString({
            se: 'Publicerat av',
            en: 'Published by',
            lang,
        });
    } else if (props.sortValue === "alphabetical") {
        dropdownTitle = translateToString({
            se: 'Dokumentnamn',
            en: 'Document name',
            lang,
        });
    }

    return (
        <div className={[dropdownClasses.sortByStyledBoxContainer, dropdownClasses.dropdown, props.addClass].join(' ')}>
            <div className={[dropdownClasses.sortByStyledBox, dropdownClasses.SortByClass].join(' ')}>
                {dropdownTitle}
                <img src={EmptyArrowDown} alt="Arrow"/>
            </div>

            <div className = {dropdownClasses.dropdownContent}>
                <p onClick = {() => props.sortByChangedHandler("alphabetical")}>
                    {translateToString({
                        se: 'Dokumentnamn',
                        en: 'Document name',
                        lang,
                    })}
                </p>

                <p onClick = {() => props.sortByChangedHandler("publisher")}>
                    {translateToString({
                        se: 'Publicerat av',
                        en: 'Published by',
                        lang,
                    })}
                </p>

                <p onClick = {() => props.sortByChangedHandler("date")}>
                    {translateToString({
                        se: 'Uppladdningsdatum',
                        en: 'Publish date',
                        lang,
                    })}
                </p>
            </div>
        </div>
    );
};

export default SortBySelector;
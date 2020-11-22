import React, { useContext } from 'react';


import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

// --- Komponenter ---
import dropdownClasses from '../DropdownButtonStyle.module.css';
import classes from './CategoriesFilter.module.css';
import EmptyArrowDown from '../../Assets/Arrows/Empty-arrow-down.svg';
import Checkbox from '../../../Common/Checkbox/checkbox';


const CategoriesFilter = (props) => {
    const { lang } = useContext(LocaleContext);
    return (
        <div className={[dropdownClasses.sortByStyledBoxContainer, dropdownClasses.dropdown, props.addClass].join(' ')}>
            <div className={[dropdownClasses.sortByStyledBox, classes.filterClass, props.addClass].join(' ')}>
                {translateToString({
                        se: 'Filtrera',
                        en: 'Filter',
                        lang,
                })}
                <img src={EmptyArrowDown} alt="Arrow"/>
            </div>

            <div className = {dropdownClasses.dropdownContentCats}>
                <div className={classes.buttonContainer}>
                    <div 
                        className={classes.checkButtonClearCat} 
                        onClick = {props.clearCategoriesFilterHandler}
                    >
                        {translateToString({
                            se: 'Rensa',
                            en: 'Clear',
                            lang,
                        })}
                    </div>
                </div>
                
                {
                    props.categories.map(category => (
                        <Checkbox 
                            name = {category}
                            checked = {props.categoriesToShow[category]}
                            checkboxHandler = {props.categoriesFilterChangeHandler}
                            colorTheme = 'light'
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default CategoriesFilter;
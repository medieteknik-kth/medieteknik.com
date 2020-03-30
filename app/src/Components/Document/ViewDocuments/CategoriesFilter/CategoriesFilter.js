import React from 'react';

import dropdownClasses from '../DropdownButtonStyle.module.css';
import classes from './CategoriesFilter.module.css';
import EmptyArrowDown from '../../Assets/Arrows/Empty-arrow-down.svg';

const CategoriesFilter = (props) => {
    return (
        <div className={[dropdownClasses.sortByStyledBoxContainer, dropdownClasses.dropdown].join(' ')}>
            <div className={[dropdownClasses.sortByStyledBox, classes.filterClass].join(' ')}>
                Filtrera
                <img src={EmptyArrowDown} alt="Arrow"/>
            </div>

            <div className = {dropdownClasses.dropdownContentCats}>
                <div className={classes.buttonContainer}>
                    <div 
                        className={classes.checkButtonClearCat} 
                        onClick = {props.clearCategoriesFilterHandler}
                    >
                        Rensa
                    </div>
                </div>
                
                {
                    props.categories.map(category => (
                        <label 
                            className = {classes.container} 
                            key = {category}
                        >
                            <input
                                name={category}
                                type="checkbox"
                                
                                checked={props.categoriesToShow[category]}
                                onChange={() => props.categoriesFilterChangeHandler(category)}
                            />
                            
                            <span className={classes.checkmark}></span>
                            {category}
                            <br />
                        </label>
                    ))
                }
            </div>
        </div>
    )
}

export default CategoriesFilter;
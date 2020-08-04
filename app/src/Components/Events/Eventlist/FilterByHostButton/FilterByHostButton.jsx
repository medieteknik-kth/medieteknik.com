import React from 'react';

import classes from './FilterByHostButton.module.css';

import FilterByHost from '../FilterByHost/FilterByHost';

import EmptyArrowDown from '../../../Document/Assets/Arrows/Empty-arrow-down.svg';

const FilterByHostButton = (props) => {
    return (
         <div className={[classes.dropdown, props.filterButtonclass].join(' ')}>
            <div className={[classes.buttonContainer].join(' ')}>
                Filtrera efter värd
                <img src={EmptyArrowDown} alt="Arrow"/>
            </div>

            <div className = {classes.dropdownContent}>
                <FilterByHost 
                    hosts = {props.hosts}
                    hostsShown = {props.hostsShown}
                    hostsFilterChangeHandler = {props.hostsFilterChangeHandler}
                    clearHostsFilterHandler = {props.clearHostsFilterHandler}
                />
            </div>
        </div>
    )
}

export default FilterByHostButton;
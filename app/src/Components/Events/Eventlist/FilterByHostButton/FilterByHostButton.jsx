import React, { useContext } from 'react';

import classes from './FilterByHostButton.module.css';

import FilterByHost from '../FilterByHost/FilterByHost';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

import EmptyArrowDown from '../../../Document/Assets/Arrows/Empty-arrow-down.svg';



const FilterByHostButton = (props) => {
    const { lang } = useContext(LocaleContext);

    return (
         <div className={[classes.dropdown, props.filterButtonclass].join(' ')}>
            <div className={[classes.buttonContainer].join(' ')}>
                
                {translateToString({
                    se: 'Filtrera efter värd',
                    en: 'Filter by host',
                    lang,
                })}
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
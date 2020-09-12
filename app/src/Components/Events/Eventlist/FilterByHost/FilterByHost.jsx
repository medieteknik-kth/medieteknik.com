import React, { useContext } from 'react';

import classes from './FilterByHost.module.css';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

const FilterByHost = (props) => {
    const { lang } = useContext(LocaleContext);

    return (
        <div className={classes.FilterByHost} >
            <div className={classes.filterByHostcontainer}>
                <div className={classes.buttonContainer}>
                    <div 
                        className={classes.checkButtonClearCat} 
                        onClick = {props.clearHostsFilterHandler}
                    >
                        {translateToString({
                            se: 'Rensa',
                            en: 'Clear',
                            lang,
                        })}
                    </div>
                </div>

                {
                    props.hosts.map(host => (
                        <label 
                            className = {classes.container} 
                            key = {host}
                        >
                            <input
                                name={host}
                                type="checkbox"
                                
                                checked={props.hostsShown[host]}
                                onChange={() => props.hostsFilterChangeHandler(host)}
                            />
                            
                            <span className={classes.checkmark}></span>
                            {host}
                            <br />
                        </label>
                    ))
                }
            </div>
        </div>
    )
}

export default FilterByHost;
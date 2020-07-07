import React, { useState } from 'react';

import classes from './FilterByHost.module.css';

const FilterByHost = (props) => {

    console.log(props.hostsShown);

    return (
        <div className={classes.FilterByHost} >
            <div className={classes.filterByHostcontainer}>
                <div className={classes.buttonContainer}>
                    <div 
                        className={classes.checkButtonClearCat} 
                        onClick = {props.clearHostsFilterHandler}
                    >
                        Rensa
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
import React from 'react';
import classes from './FilterButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const FilterButton = () => {
    return (
        <div className={classes.Button}>
            <FontAwesomeIcon icon={faTrashAlt} />
        </div>
    )
}

export default FilterButton;
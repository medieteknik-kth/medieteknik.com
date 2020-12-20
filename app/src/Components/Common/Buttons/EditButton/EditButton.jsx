import React from 'react';
import classes from './EditButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditButton = () => {
    return (
        <div className={classes.Button}>
            <FontAwesomeIcon icon={faEdit} />
        </div>
    )
}

export default EditButton;
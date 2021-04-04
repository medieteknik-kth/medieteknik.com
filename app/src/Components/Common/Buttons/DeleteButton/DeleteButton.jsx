import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import classes from './DeleteButton.module.scss';

const DeleteButton = ({ deleteHandler }) => (
  <div className={classes.Button} onClick={deleteHandler}>
    <FontAwesomeIcon icon={faTrashAlt} />
  </div>
);

export default DeleteButton;

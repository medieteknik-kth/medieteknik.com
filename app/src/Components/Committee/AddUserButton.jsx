import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UserCard from '../UserCard/UserCard';

import './AddUserButton.css';

export default function AddUserButton({ added }) {
  const didPressAddButton = () => {
    added();
  };

  return (
    <div>
      <button type="button" className="addUserButtonContainer" onClick={didPressAddButton}>
        <FontAwesomeIcon icon={faPlus} color="black" size="lg" />
      </button>
    </div>
  );
}

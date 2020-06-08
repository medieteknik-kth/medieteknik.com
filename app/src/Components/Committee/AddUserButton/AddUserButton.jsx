import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import './AddUserButton.css';

export default function AddUserButton({ addedUser }) {
  const [isAdding, setIsAdding] = useState(false);

  const didPressAddButton = () => {
    setIsAdding(true);
  };

  return (
    <div>
      {isAdding ? <div className="addUserButtonContainer"><input type="text" /></div> : (
        <button type="button" className="addUserButtonContainer" onClick={didPressAddButton}>
          <FontAwesomeIcon icon={faPlus} color="black" size="lg" />
        </button>
      )}
    </div>
  );
}

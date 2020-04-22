import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UserCard from '../UserCard/UserCard';

import './AddUserButton.css';

export default function AddUserButton({ addedUser }) {
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState({
    firstName: '', lastName: '', email: '', profilePicture: '/static/profiles/default.png',
  });

  const didPressAddButton = () => {
    setIsAdding(true);
  };

  return (
    <div>
      {isAdding
        ? (
          <UserCard
            user={user}
            subtitle=""
            email=""
            editing
            didEdit={(newUser) => {
              setUser(newUser);
              if (addedUser) {
                addedUser(newUser);
              }
            }}
            deleteable
            didDelete={() => {
              setIsAdding(false);
            }}
          />
        ) : (
          <button type="button" className="addUserButtonContainer" onClick={didPressAddButton}>
            <FontAwesomeIcon icon={faPlus} color="black" size="lg" />
          </button>
        )}
    </div>
  );
}

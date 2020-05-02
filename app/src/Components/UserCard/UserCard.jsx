import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import UserCardTextbox from './UserCardTextbox.jsx';

import './UserCard.css';

export default function UserCard({
  user, subtitle, email, editing, didEdit, deleteable, didDelete,
}) {
  const [activeUser, setActiveUser] = useState(user);

  return (
    <div className="userCard">
      {deleteable ? (
        <button
          type="button"
          className="userCardDeleteButton"
          onClick={() => {
            if (didDelete) {
              didDelete(user);
            }
          }}
        >
          <FontAwesomeIcon icon={faMinusCircle} color="black" size="xs" />
        </button>
      ) : <span />}
      <img
        className="userImage"
        src={activeUser.profilePicture}
        alt={`${activeUser.firstName} ${activeUser.lastName}`}
      />
      <div className="userCardBanner">
        <UserCardTextbox
          user={activeUser}
          subtitle={subtitle}
          email={email}
          editing={editing}
          didChange={(newUser) => {
            setActiveUser(newUser);
            if (didEdit) {
              didEdit(newUser);
            }
          }}
        />
      </div>
    </div>
  );
}

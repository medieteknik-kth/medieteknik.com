import React, { useState } from 'react';
import Select from 'react-select';

import './UserCard.css';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

export default function UserCard({
  user, subtitle, email, canEdit, didRemove,
}) {
  const [activeUser, setActiveUser] = useState(user);

  return (
    <div className="userCard">
      {canEdit
        ? (
          <button type="button" className="removeUserButton" onClick={() => { didRemove(); }}>
            <FontAwesomeIcon icon={faUserMinus} color="black" size="lg" />
          </button>
        )
        : <span />}
      <img
        className="userImage"
        src={activeUser.profilePicture}
        alt={`${activeUser.firstName} ${activeUser.lastName}`}
      />
      <div className="userCardBanner">
        <div className="userCardContent">
          <div className="userCardTitle userCardBannerHeader">
            {`${activeUser.firstName} ${activeUser.lastName}`}
          </div>
          <div className="userCardBannerSubheader">
            <div>
              <div className="userCardBannerSubheader">
                <div className="userCardSubtitle">{subtitle}</div>
              </div>
              <div className="userCardBannerSubheader">
                <div className="userCardSubtitle">{email || activeUser.email}</div>
              </div>
            </div>
            <div>
              { activeUser.facebook ? <a href={activeUser.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="white" size="lg" /></a> : <div />}
              { activeUser.linkedin ? <a href={activeUser.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="white" size="lg" /></a> : <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

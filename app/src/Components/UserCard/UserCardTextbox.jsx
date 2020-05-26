import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import Autosuggest from 'react-autosuggest';

import Api from '../../Utility/Api';

import './UserCardTextbox.css';

export default function UserCardTextbox({
  user, subtitle, email,
}) {
  return (
    <div className="userCardContent">
      <div className="userCardTitle userCardBannerHeader">
        {`${user.firstName} ${user.lastName}`}
      </div>
      <div className="userCardBannerSubheader">
        <div>
          <div className="userCardBannerSubheader">
            <div className="userCardSubtitle">{subtitle}</div>
          </div>
          <div className="userCardBannerSubheader">
            <div className="userCardSubtitle">{email || user.email}</div>
          </div>
        </div>
        <div>
          { user.facebook ? <a href={user.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="white" size="lg" /></a> : <div />}
          { user.linkedin ? <a href={user.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="white" size="lg" /></a> : <div />}
        </div>
      </div>
    </div>
  );
}

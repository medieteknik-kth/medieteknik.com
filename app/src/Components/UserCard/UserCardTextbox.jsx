import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import Autosuggest from 'react-autosuggest';

import Api from '../../Utility/Api';

import './UserCardTextbox.css';

export default function UserCardTextbox({
  user, subtitle, email, editing, didChange
}) {
  const [currentUser, setCurrentUser] = useState(user);
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState((
    (user.firstName == '' && user.lastName) == ''
      ? ''
      : `${user.firstName} ${user.lastName}`));
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (editing) {
      Api.Users.GetAll()
        .then((data) => {
          setUsers(data);
        });
    }
  }, []);

  const onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    setSuggestions(inputLength === 0 ? [] : users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      return fullName.toLowerCase().search(inputValue) !== -1;
    }));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setCurrentUser(suggestion);
    if (didChange) {
      didChange(suggestion);
    }
  };

  const getSuggestionValue = (user) => `${user.firstName} ${user.lastName}`;

  const renderSuggestion = (suggestion) => (
    <span>{`${suggestion.firstName} ${suggestion.lastName}`}</span>
  );

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const inputProps = {
    placeholder: 'Förnamn Efternamn',
    value,
    onChange,
    className: 'userCardTitle userCardTextboxInput',
  };

  return (
    <div className="userCardContent">
      <div className="userCardTitle userCardBannerHeader">
        { editing ? (
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        ) : `${currentUser.firstName} ${currentUser.lastName}`}
      </div>
      <div className="userCardBannerSubheader">
        <div>
          <div className="userCardBannerSubheader">
            <div className="userCardSubtitle">{subtitle}</div>
          </div>
          <div className="userCardBannerSubheader">
            <div className="userCardSubtitle">{email || currentUser.email}</div>
          </div>
        </div>
        <div>
          { currentUser.facebook ? <a href={currentUser.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="white" size="lg" /></a> : <div />}
          { currentUser.linkedin ? <a href={currentUser.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="white" size="lg" /></a> : <div />}
        </div>
      </div>
    </div>
  );
}

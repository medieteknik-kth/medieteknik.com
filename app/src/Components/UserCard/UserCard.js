import React from 'react';
import UserCardTextbox from './UserCardTextbox.js';

import './UserCard.css';

class UserCard extends React.Component {
  render() {
    return (
      <div className="userCard">
        <img
          className="userImage"
          src={this.props.user.profile_picture}
          alt={`${this.props.user.first_name} ${this.props.user.last_name}`}
        />
        <div className="userCardBanner">
          <UserCardTextbox user={this.props.user} subtitle={this.props.subtitle} email={this.props.email} />
        </div>
      </div>
    );
  }
}

export default UserCard;

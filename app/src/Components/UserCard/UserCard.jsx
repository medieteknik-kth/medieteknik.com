import React, { PropTypes } from "react";
import UserCardTextbox from "./UserCardTextbox.jsx";

import "./UserCard.css";

export default function UserCard({ user, subtitle, email }) {
  return (
    <div className="userCard">
      <img
        className="userImage"
        src={user.profilePicture}
        alt={`${user.firstName} ${user.lastName}`}
      />
      <div className="userCardBanner">
        <UserCardTextbox user={user} subtitle={subtitle} email={email} />
      </div>
    </div>
  );
}

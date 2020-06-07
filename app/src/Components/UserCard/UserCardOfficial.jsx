import React, { PropTypes } from "react";
import "./UserCardOfficial.css";

export default function UserCardOfficial({ user, subtitle, email }) {
  return (
    <div className="userCardOfficial">
      <div className="titleBox">
        <h4 className="titleHeader">{subtitle}</h4>
      </div>
      <img
        className="userImageOfficial"
        src={user.profilePicture}
        alt={`${user.firstName} ${user.lastName}`}
      />
      <div className="userName">{`${user.firstName} ${user.lastName}`}</div>
    </div>
  );
}

import React, { useState } from "react";
import UserCardTextbox from "./UserCardTextbox.jsx";

import "./UserCard.css";

export default function UserCard({
  user, subtitle, email,
}) {
  const [activeUser, setActiveUser] = useState(user);

  return (
    <div className="userCard">
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
        />
      </div>
    </div>
  );
}

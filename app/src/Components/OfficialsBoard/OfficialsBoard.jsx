import React, { useState, useEffect } from "react";
import UserCard from "../UserCard/UserCard";
import Api from "../../Utility/Api";

import "./OfficialsBoard.css";

export default function OfficialsBoard() {
  const [officials, setOfficials] = useState([]);

  useEffect(() => {
    Api.Officials.GetAll().then(data => {
      setOfficials(data);
    });
  }, []);

  return (
    <div>
      {officials.map(official => (
        <div className="userList">
          <UserCard
            key={official.user.id}
            user={official.user}
            subtitle={official.post.name}
            email={official.post.email}
          />
        </div>
      ))}
    </div>
  );
}

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
  const official_title = [];

  officials.map(official =>
    !official_title.includes(official.post.category)
      ? official_title.push(official.post.category)
      : null
  );

  return (
    <div>
      {official_title.map(title => (
        <div>
          <h3 className="officialHeader">{title}</h3>

          <div className="userList">
            {officials
              .filter(official => official.post.category === title)
              .map(official => (
                <UserCard
                  key={official.user.id}
                  user={official.user}
                  subtitle={official.post.name}
                  email={official.post.email}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

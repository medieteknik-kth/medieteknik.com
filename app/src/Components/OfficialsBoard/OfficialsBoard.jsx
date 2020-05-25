import React, { useState, useEffect } from "react";
import UserCardOfficial from "../UserCard/UserCardOfficial";
import Api from "../../Utility/Api";

import "./OfficialsBoard.css";

export default function OfficialsBoard() {
  const [officials, setOfficials] = useState([]);

  useEffect(() => {
    Api.Officials.GetAll().then((data) => {
      setOfficials(data);
    });
  }, []);

  //Used for setting titles for category
  const titles = [];
  officials.map((official) =>
    !titles.includes(official.post.category)
      ? titles.push(official.post.category)
      : null
  );

  //Used for mapping emails to correct category
  let emails = [];
  officials.map((official) => {
    var email_obj = {};
    console.log("official.post", official.post.category);
    email_obj.category = `${official.post.category}`;
    email_obj.email = `${
      official.post.email
        ? `${official.post.email}`
        : "medieteknik@medieteknik.com"
    }`;
    emails.push(email_obj);
  });

  //an array of unique objects, used for mapping category with mail in render
  let unique = [...new Set(emails.map((itm) => JSON.stringify(itm)))].map((i) =>
    JSON.parse(i)
  );

  return (
    <div id="officialsBoard">
      <div className="officialsBoardHeader">Funktionärer</div>
      {titles.map((title) => (
        <div id="officialCategory">
          <h3 className="committeeHeader">{title}</h3>
          <h4 className="committeeMail" id="committeeMail">
            {unique.map((item) => {
              if (item.category === title) {
                return `${item.email}`;
              }
            })}
          </h4>

          <div className="userListOfficial">
            {officials
              .filter((official) => official.post.category === title)
              .map((official) => (
                <UserCardOfficial
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

import React, { useState, useEffect } from 'react';
import UserCard from '../UserCard/UserCard';

import './OfficialsList.css';

export default function OfficialsList() {
  const [committees, setCommittees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/committee').then((response) => response.json())
      .then((data) => {
        setCommittees(data);
      });
  });

  return (
    <div>
      {committees.map((committee) => (
        <div>
          <h2 className="committeeHeader">{committee.name}</h2>
          <div className="userList">
            {committee.posts.map((post) => (
              post.users.map((user) => (
                <UserCard key={user.id} user={user} subtitle={post.name} email={post.officials_email} />
              ))
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

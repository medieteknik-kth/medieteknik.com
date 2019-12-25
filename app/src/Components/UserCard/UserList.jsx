import React, { useState, useEffect } from 'react';
import UserCard from './UserCard.jsx';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/user').then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  });

  return (
    <div className="userList">
      {users.map((user) => <UserCard key={user.id} user={user} />)}
    </div>
  );
}

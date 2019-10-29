import React from "react";
import "./style.css";
import UserCard from "./UserCard.js";

function App() {
  return (
    <div className="userList">
      <UserCard id={1} />
      <UserCard id={1} />
      <UserCard id={1} />
    </div>
  );
}

export default App;

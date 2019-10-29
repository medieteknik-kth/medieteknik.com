import React from "react";
import "./style.css";
import UserCard from "./UserCard.js";
import UserForm from "./UserForm.js";

function App() {
  return (
    <div className="userList">
      <UserCard id={1} />
      <UserCard id={1} />
      <UserCard id={1} />
      <UserForm />
    </div>
  );
}

export default App;

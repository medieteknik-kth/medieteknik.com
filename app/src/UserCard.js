import React from "react";
import UserCardTextbox from "./UserCardTextbox.js";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }

  componentDidMount() {
    fetch("/api/user/" + this.props.id)
      .then(response => response.json())
      .then(data => {
        this.setState({ user: data });
      });
  }
  render() {
    return (
      <div className="userCard">
        <div className="userImage" />
        <UserCardTextbox user={this.state.user} />
      </div>
    );
  }
}

export default UserCard;

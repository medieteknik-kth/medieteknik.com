import React from "react";
import UserCardTextbox from "./UserCardTextbox.js";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }

    render() {
        return <div class="userCard">
            <img class="userImage" src={this.props.user.profile_picture} alt={this.props.user.first_name + " " + this.props.user.last_name} />
            <div class="userCardBanner">
                <UserCardTextbox user={this.props.user} />
            </div>
        </div>;
    }
}

export default UserCard;

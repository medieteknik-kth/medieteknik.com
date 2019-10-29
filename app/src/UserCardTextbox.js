import React from "react";
class UserCardTextbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>
          {this.props.user.first_name} {this.props.user.last_name}
        </h3>
        <p>Email: {this.props.user.email}</p>
        <img
          className="socialmediaIcon"
          src="facebook-icon.png"
          href={this.props.user.facebook}
        />
        <img
          className="socialmediaIcon"
          src="linkedin-icon.png"
          href={this.props.user.linkedin}
        />
      </div>
    );
  }
}

export default UserCardTextbox;

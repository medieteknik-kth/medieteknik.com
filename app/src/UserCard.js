import React from "react";
import UserCardTextbox from "./UserCardTextbox.js";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }

    componentDidMount() {
        fetch("/api/user/" + this.props.id).then(response => response.json())
        .then(data => {
            this.setState({user: data});
        });
    }
    render() {
        return <div class="userCard">
            <img class="userImage" src={this.state.user.profile_picture} alt="Profile Picture" />
            <div class="userCardBanner">
                <div class="userCardContent">
                    <div class="text-header userCardBannerHeader">{this.state.user.first_name} {this.state.user.last_name}</div>
                    <div class="userCardBannerSubheader">
                        <div class="text-subheader userCardSubtitle">Öfverphös</div>
                        <UserCardTextbox user={this.state.user} />
                    </div>
                    <div class="userCardBannerSubheader">
                        <div class="text-subheader userCardSubtitle">jeslundq@kth.se</div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default UserCard;

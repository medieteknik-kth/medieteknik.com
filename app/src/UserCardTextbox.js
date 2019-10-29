import React from "react";
class UserCardTextbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div class="userCardContent">
            <div class="text-header userCardBannerHeader">{this.props.user.first_name} {this.props.user.last_name}</div>
            <div class="userCardBannerSubheader">
                <div>
                    <div class="userCardBannerSubheader">
                        <div class="text-subheader userCardSubtitle">Öfverphös</div>
                    </div>
                    <div class="userCardBannerSubheader">
                        <div class="text-subheader userCardSubtitle">jeslundq@kth.se</div>
                    </div>
                </div>
                <div>
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
            </div>
      </div>
    );
  }
}

export default UserCardTextbox;

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

class UserCardTextbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let posts = this.props.user.officials_post;
    let subtitle = "";

    console.log(this.props.user);
    if (posts.length > 0) {
        subtitle = posts[0].name;
    }

    return (
        <div class="userCardContent">
            <div class="text-title userCardBannerHeader">{this.props.user.first_name} {this.props.user.last_name}</div>
            <div class="userCardBannerSubheader">
                <div>
                    <div class="userCardBannerSubheader">
                        <div class="text-subtitle userCardSubtitle">{subtitle}</div>
                    </div>
                    <div class="userCardBannerSubheader">
                        <div class="text-subtitle userCardSubtitle">{this.props.user.email}</div>
                    </div>
                </div>
                <div>
                    { this.props.user.facebook ? <a href={this.props.user.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="white" size="lg" /></a> : <div></div>}
                    { this.props.user.linkedin ? <a href={this.props.user.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="white" size="lg" /></a> : <div></div>}
                </div>
            </div>
      </div>
    );
  }
}

export default UserCardTextbox;

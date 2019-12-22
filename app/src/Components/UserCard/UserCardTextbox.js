import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


class UserCardTextbox extends React.Component {
  render() {
    // let posts = this.props.user.committee_post;
    const { subtitle } = this.props;

    return (
      <div className="userCardContent">
        <div className="userCardTitle userCardBannerHeader">
          {this.props.user.first_name}
          {' '}
          {this.props.user.last_name}
        </div>
        <div className="userCardBannerSubheader">
          <div>
            <div className="userCardBannerSubheader">
              <div className="userCardSubtitle">{subtitle}</div>
            </div>
            <div className="userCardBannerSubheader">
              <div className="userCardSubtitle">{this.props.email ? this.props.email : this.props.user.email}</div>
            </div>
          </div>
          <div>
            { this.props.user.facebook ? <a href={this.props.user.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="white" size="lg" /></a> : <div />}
            { this.props.user.linkedin ? <a href={this.props.user.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="white" size="lg" /></a> : <div />}
          </div>
        </div>
      </div>
    );
  }
}

export default UserCardTextbox;

import React from 'react';
import UserCard from '../UserCard/UserCard.js';

import './OfficialsList.css';

class OfficialsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
    };
  }

  componentDidMount() {
    fetch('/api/committee').then((response) => response.json())
      .then((data) => {
        this.setState({ committees: data });
      });
  }

  render() {
    return (
      <div>
        {this.state.committees.map((committee, i) => (
          <div>
            <h2 className="committeeHeader">{committee.name}</h2>
            <div className="userList">
              {committee.posts.map((post, j) => post.users.map((user, k) => <UserCard key={k} user={user} subtitle={post.name} email={post.officials_email} />))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default OfficialsList;

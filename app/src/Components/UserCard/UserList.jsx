import React from 'react';
import UserCard from './UserCard.jsx';
import UserForm from './UserForm.jsx';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    fetch('/api/user').then((response) => response.json())
      .then((data) => {
        this.setState({ users: data });
      });
  }

  render() {
    return (
      <div className="userList">
        {this.state.users.map((value, index) => <UserCard key={index} user={value} />)}
      </div>
    );
  }
}

export default UserList;

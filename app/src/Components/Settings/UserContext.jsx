import React, { createContext } from 'react';

const UserContext = createContext({
    loggedin: false,
    user: {},
    login: () => {},
    logout: () => {},
});

export class UserProvider extends React.Component {
  login = () => {
      window.location.replace("/api/login?service=" + encodeURIComponent(window.location));
  }

  logout = () => {
      window.location.replace("/api/logout?service=" + encodeURIComponent(window.location));
  }

  componentDidMount() {
      fetch("/api/current_user").then(response => response.json())
      .then(data => {
          if (data.loggedin == true) {
              this.setState({loggedin: true, user: data.user});

              if (data.new_user) {
                  window.location.replace("/user/first");
              }
          }
      });
  }

  state = {
      loggedin: false,
      user: {},
      login: this.login,
      logout: this.logout
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export const UserConsumer = UserContext.Consumer;

import React, { createContext, useState, useEffect } from 'react';

import Api, { API_BASE_URL } from '../Utility/Api';

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState(null);

  const login = () => {
    window.location.replace(`${API_BASE_URL}login?service=${window.location.href}`);
  };

  const logout = () => {
    window.location.replace(`${API_BASE_URL}logout`);
  };

  useEffect(() => {
    Api.Authenticate().then((response) => {
      if (response.authenticated) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>{props.children}</UserContext.Provider>
  );
};

export default UserProvider;

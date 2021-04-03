import React, { createContext, useState, useEffect } from 'react';

import Api from '../Utility/Api';

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const storedToken = window.localStorage.getItem('authtoken');
  if (storedToken != null && token == null) {
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }

  const logout = () => {
    window.localStorage.removeItem('authtoken');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token != null) {
      window.localStorage.setItem('authtoken', token);
      Api.Authenticate(token).then((response) => {
        if (response.authenticated) {
          if (user == null || user.id !== response.user.id) {
            setUser(response.user);
          }
        } else {
          setUser(null);
        }
      }).catch((error) => {
        console.error(error);
        setUser(null);
      });
    } else {
      logout();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setToken, logout }}>{props.children}</UserContext.Provider>
  );
};

export default UserProvider;

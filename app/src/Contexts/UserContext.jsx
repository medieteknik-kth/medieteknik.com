import React, { createContext, useState, useEffect } from 'react';

import Api, { API_BASE_URL } from '../Utility/Api';

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const storedToken = window.localStorage.getItem('user_token');
  if (storedToken != null) {
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }

  if (token != null) {
    Api.Authenticate(token).then((response) => {
      if (response.authenticated) {
        window.localStorage.setItem('user_token', token);
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
  }

  const logout = () => {
    window.localStorage.removeItem('user_token');
    setToken(null);
    setUser(null);
    window.location.replace(`${API_BASE_URL}logout`);
  };

  return (
    <UserContext.Provider value={{ user, setToken, logout }}>{props.children}</UserContext.Provider>
  );
};

export default UserProvider;

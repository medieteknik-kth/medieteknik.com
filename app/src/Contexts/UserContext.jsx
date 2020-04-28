import React, { createContext, useState, useEffect } from 'react';

import Api from '../Utility/Api';

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState(null);

  const setToken = (token) => {
    Api.Authenticate(token).then((response) => {
      console.log(response);
      if (response.authenticated) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <UserContext.Provider value={{ user, setToken }}>{props.children}</UserContext.Provider>
  );
};

export default UserProvider;

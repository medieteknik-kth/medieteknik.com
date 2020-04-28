import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../Contexts/UserContext';
import { API_BASE_URL } from '../../Utility/Api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Login() {
  const [hasCapturedToken, setHasCapturedToken] = useState(false);
  const { user, setToken } = useContext(UserContext);
  const query = useQuery();

  const token = query.get('token');
  if (token && !hasCapturedToken) {
    setToken(token);
    setHasCapturedToken(true);
  }

  const login = () => {
    window.location.replace(`${API_BASE_URL}cas?origin=${window.location.href}`);
  };

  const logout = () => {
    window.location.replace(`${API_BASE_URL}logout`);
  };

  return (
    <div>
      <p>{user ? <p>Inloggad som {user.firstName} <a onClick={() => { logout(); }}>Logga ut</a></p> : <a onClick={() => { login(); }}>Logga in</a>}</p>
    </div>
  );
}

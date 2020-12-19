import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LocaleText } from '../../Contexts/LocaleContext';
import { UserContext } from '../../Contexts/UserContext';
import { API_BASE_URL } from '../../Utility/Api';

import './Login.scss';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Login() {
  const [hasCapturedToken, setHasCapturedToken] = useState(false);
  const { user, setToken, logout } = useContext(UserContext);
  const query = useQuery();

  const token = query.get('token');
  if (token && !hasCapturedToken) {
    setToken(token);
    setHasCapturedToken(true);
  }

  const login = () => {
    window.location.replace(`${API_BASE_URL}cas?origin=${window.location.href}`);
  };

  const loginMethods = [
    {
      name: 'KTH',
      logo: '/kth_logo.png',
      enabled: false,
      redirect: '',
    },
    {
      name: 'Google Workspace',
      logo: '/logo.png',
      enabled: true,
      redirect: '',
    },
  ];

  return (
    <div className="loginPage">
      <h1><LocaleText phrase="login/header" /></h1>
      <div className="loginMethodList">
        {
        loginMethods.map((method) => (
          <button type="button" className={`loginMethodContainer ${method.enabled ? '' : 'disabled'}`}>
            <img src={method.logo} alt={method.name} />
            <div>
              <p>{method.name}</p>
              {method.enabled ? <span /> : <p className="subtitle"><LocaleText phrase="login/disabled" /></p>}
            </div>
          </button>
        ))
        }
        <p><LocaleText phrase="login/kth-disabled-message" /></p>
      </div>
      {/* <p>{user ? <p>Inloggad som {user.firstName} <a onClick={() => { logout(); }}>Logga ut</a></p> : <a onClick={() => { login(); }}>Logga in</a>}</p> */}
    </div>
  );
}

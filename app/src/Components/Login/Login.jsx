import React from 'react';
import { LocaleText } from '../../Contexts/LocaleContext';
import { useLogin } from 'react-admin';

import './Login.scss';

export default function Login() {
  const login = useLogin();

  const loginMethods = [
    {
      name: 'KTH',
      logo: '/kth_logo.png',
      enabled: true,
      handler: login,
    },
  ];

  return (
      <div className="loginPage">
        <h1><LocaleText phrase="login/header" /></h1>
        <div className="loginMethodList">
          {
      loginMethods.map((method) => (
        <button type="button" onClick={() => { if (method.enabled) { method.handler(); } }} className={`loginMethodContainer ${method.enabled ? '' : 'disabled'}`}>
          <img src={method.logo} alt={method.name} />
          <div>
            <p>{method.name}</p>
            {method.enabled ? <span /> : <p className="subtitle"><LocaleText phrase="login/disabled" /></p>}
          </div>
        </button>
      ))
      }
        </div>
      </div>
  );
}

import React, { useContext } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { LocaleText, translate } from '../../Contexts/LocaleContext';
import { UserContext } from '../../Contexts/UserContext';
import LoggedInPage from './LoggedInPage';

import './Login.scss';

export default function Login() {
  const { user, setToken } = useContext(UserContext);

  const googleSuccess = (res) => {
    const { tokenId } = res;
    setToken(tokenId);
  };

  const googleFailure = (res) => {
    const { error } = res;
    if (error !== 'popup_closed_by_user') {
      alert(translate({ se: 'Kunde inte logga in.', en: 'Could not log in.' }));
    }
  };

  const { signIn } = useGoogleLogin({
    clientId: '881584931454-ankmp9jr660l8c1u91cbueb4eaqeddbt.apps.googleusercontent.com',
    onSuccess: googleSuccess,
    onFailure: googleFailure,
    hostedDomain: 'medieteknik.com',
    cookiePolicy: 'single_host_origin',
  });

  const loginMethods = [
    {
      name: 'KTH',
      logo: '/kth_logo.png',
      enabled: false,
      handler: null,
    },
    {
      name: 'Google Workspace',
      logo: '/logo.png',
      enabled: true,
      handler: signIn,
    },
  ];

  return (
    user !== null
      ? <LoggedInPage />
      : (
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
            <p><LocaleText phrase="login/kth-disabled-message" /></p>
          </div>
        </div>
      )
  );
}

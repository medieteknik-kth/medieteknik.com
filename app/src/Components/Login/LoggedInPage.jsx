import React, { useContext } from 'react';
import { LocaleText } from '../../Contexts/LocaleContext';
import { UserContext } from '../../Contexts/UserContext';

import './Login.scss';


export default function LoggedInPage() {
  const { user, logout } = useContext(UserContext);
  return (
    <div className="loginPage">
      <h1>
        <LocaleText phrase="login/logged-in" />
      </h1>
      <p>{user.email}</p><br />
      <a onClick={logout} className="logoutButton"><LocaleText phrase="login/logout" /></a>
    </div>
  );
}

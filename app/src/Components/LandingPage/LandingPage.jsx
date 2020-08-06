import React from 'react';

import './LandingPage.css';

import { LocaleText } from '../../Contexts/LocaleContext';
import ErrorModal from '../Common/ErrorModal/ErrorModal';
import { useState } from 'react';

export default function LandingPage() {
  const [error, setError] = useState(true)
  return (
    <div className="landing-page">
      <ErrorModal modalOpen={error} setModalOpen={setError} message={"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}/>
      <div className="landing-header">
        <h2 className="landing-text"><LocaleText phrase="landing/welcome"/></h2>
        <h1 className="medieteknik"><LocaleText phrase="common/media_technology"/></h1>
        <h3 className="landing-text"><LocaleText phrase="common/kth_full"/></h3>
      </div>
      <div className="landing-info">
        <h3><LocaleText phrase="landing/what_is"/></h3>
          <div className="landing-grid">
            <div className="grid_item">
              <h4><LocaleText phrase="landing/the_chapter"/></h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div className="grid-item">
              <h4><LocaleText phrase="landing/the_program"/></h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
      </div>
    </div>
  );
}

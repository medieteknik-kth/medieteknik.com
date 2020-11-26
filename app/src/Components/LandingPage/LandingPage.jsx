import React from 'react';

import './LandingPage.scss';

import { LocaleText } from '../../Contexts/LocaleContext';
import HomeScreen from '../HomeScreen/HomeScreen';
import Feed from '../Feed/Feed';
import InstagramFeed from '../InstagramFeed/InstagramFeed';

export default function LandingPage() {
  return (
    <div className="landing-page" >
      <HomeScreen/>
      <div className="landing-info" id="landing-info">
        <h3><span><LocaleText phrase="landing/what_is"/></span></h3>
          <div className="landing-grid">
            <div>
              <h4><span><LocaleText phrase="landing/the_chapter"/></span></h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div>
              <h4><span><LocaleText phrase="landing/the_program"/></span></h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
      </div>
      
      <Feed/>
          <div className="landing-info">
            <h3><span><LocaleText phrase="landing/on_instagram"/></span></h3>
            <InstagramFeed/>
          </div>
    </div>
  );
}

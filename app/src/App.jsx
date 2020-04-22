import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'circular-std';
import 'normalize.css';
import './Components/Common/Typography.css';
import './Components/Common/Content.css';

import MainMenu from './Components/MainMenu/MainMenu';
import LandingPage from './Components/LandingPage/LandingPage';
import NotFound from './Components/NotFound/NotFound';
import OfficialsBoard from './Components/OfficialsBoard/OfficialsBoard';
import Settings from './Components/Settings/Settings';
import Documents from './Components/Document/Document';
import CommitteeList from './Components/Committee/CommitteeList';
import PageManager from './Components/Page/PageManager';
import { UserContext } from './Contexts/UserContext';
import { LocaleContext } from './Contexts/LocaleContext';

export default function App() {
  return (
    <Router>
      <Switch>
        <LocaleContext.Provider value="sv">
          <UserContext.Provider value="">
            <Route exact path="/">
              <MainMenu transparent />
              <LandingPage />
            </Route>
            <Route path="/officials">
              <MainMenu />
              <OfficialsBoard />
            </Route>
            <Route path="/settings">
              <MainMenu />
              <Settings />
            </Route>
            <Route path="/documents">
              <MainMenu />
              <Documents />
            </Route>
            <Route path="/committees">
              <MainMenu />
              <CommitteeList />
            </Route>
            <Route path="/pages">
              <MainMenu />
              <PageManager />
            </Route>
            <Route match="*">
              <NotFound />
            </Route>
          </UserContext.Provider>
        </LocaleContext.Provider>
      </Switch>
    </Router>
  );
}

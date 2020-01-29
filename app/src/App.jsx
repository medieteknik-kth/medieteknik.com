import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'circular-std';
import 'normalize.css';
import './Components/Common/Typography.css';

import MainMenu from './Components/MainMenu/MainMenu';
import LandingPage from './Components/LandingPage/LandingPage';
import NotFound from './Components/NotFound/NotFound';
import OfficialsList from './Components/OfficialsBoard/OfficialsBoard';
import Settings from './Components/Settings/Settings';
import Document from './Components/Documents/Document';
import CommitteeList from './Components/Committee/CommitteeList';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainMenu transparent />
          <LandingPage />
        </Route>
        <Route path="/officials">
          <MainMenu />
          <OfficialsList />
        </Route>
        <Route path="/settings">
          <MainMenu />
          <Settings />
        </Route>
        <Route path="/documents">
          <MainMenu />
          <Document />
        </Route>
        <Route path="/committees">
          <MainMenu />
          <CommitteeList />
        </Route>
        <Route match="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

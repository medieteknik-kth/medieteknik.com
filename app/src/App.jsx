import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'circular-std';
import 'normalize.css';
import './Components/Common/Typography.css';

import MainMenu from './Components/MainMenu/MainMenu';
import LandingPage from './Components/LandingPage/LandingPage';
import NotFound from './Components/NotFound/NotFound';
import OfficialsList from './Components/OfficialsList/OfficialsList';
import Settings from './Components/Settings/Settings';
import Documents from './Components/Document/Document';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainMenu transparent />
          <LandingPage />
        </Route>
        <Route exact path="/officials">
          <MainMenu />
          <OfficialsList />
        </Route>
        <Route exact path="/settings">
          <MainMenu />
          <Settings />
        </Route>
        <Route exact path="/documents">
          <MainMenu />
          <Documents />
        </Route>
        <Route match="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

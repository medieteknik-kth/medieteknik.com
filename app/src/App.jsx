import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'circular-std';
import 'normalize.css';
import './Components/Common/Typography.css';
import './Components/Common/Content.css';

import PageWithMainMenu from './Components/MainMenu/MainMenu';
import LandingPage from './Components/LandingPage/LandingPage';
import NotFound from './Components/NotFound/NotFound';
import OfficialsBoard from './Components/OfficialsBoard/OfficialsBoard';
import Settings from './Components/Settings/Settings';
import Documents from './Components/Document/Document';
import CommitteeList from './Components/Committee/CommitteeList';
import PageManager from './Components/Page/PageManager';
import UserProvider from './Contexts/UserContext';
import Login from './Components/Login/Login';
import Post from './Components/Post/Post';
import Feed from './Components/Feed/Feed';
import LocaleProvider from './Contexts/LocaleContext';

export default function App() {
  return (
    <Router>
      <LocaleProvider>
        <UserProvider>
          <Switch>
            <Route exact path="/">
              <PageWithMainMenu><LandingPage /></PageWithMainMenu>
            </Route>
            <Route exact path="/login">
              <PageWithMainMenu><Login /></PageWithMainMenu>
            </Route>
            <Route path="/officials">
              <PageWithMainMenu><OfficialsBoard /></PageWithMainMenu>
            </Route>
            <Route path="/settings">
              <PageWithMainMenu><Settings /></PageWithMainMenu>
            </Route>
            <Route path="/documents">
              <PageWithMainMenu><Documents /></PageWithMainMenu>
            </Route>
            <Route path="/committees">
              <PageWithMainMenu><CommitteeList /></PageWithMainMenu>
            </Route>
            <Route path="/pages">
              <PageWithMainMenu><PageManager /></PageWithMainMenu>
            </Route>
            <Route path="/feed">
              <PageWithMainMenu><Feed /></PageWithMainMenu>
            </Route>
            <Route path="/posts/:id">
              <PageWithMainMenu><Post /></PageWithMainMenu>
            </Route>
            <Route match="*">
              <PageWithMainMenu><NotFound /></PageWithMainMenu>
            </Route>
          </Switch>
        </UserProvider>
      </LocaleProvider>
    </Router>
  );
}

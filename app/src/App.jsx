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
              <MainMenu transparent />
              <LandingPage />
            </Route>
            <Route exact path="/login">
              <MainMenu/>
              <Login />
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
            <Route path="/feed">
              <MainMenu />
              <Feed />
            </Route>
            <Route path="/posts/:id">
              <MainMenu />
              <Post />
            </Route>
            <Route match="*">
              <NotFound />
            </Route>
          </Switch>
        </UserProvider>
      </LocaleProvider>
    </Router>
  );
}

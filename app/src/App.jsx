import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import 'circular-std';
import 'normalize.css';
import './Components/Common/Typography.css';
import './Components/Common/Content.css';

import PageWithMainMenu from './Components/MainMenu/MainMenu';
import LandingPage from './Components/LandingPage/LandingPage';
import OfficialsBoard from './Components/OfficialsBoard/OfficialsBoard';
import Settings from './Components/Settings/Settings';
import Documents from './Components/Document/Document';
import CommitteeList from './Components/Committee/CommitteeList/CommitteeList';
import PageManager from './Components/Page/PageManager';
import UserProvider from './Contexts/UserContext';
import Login from './Components/Login/Login';
import Post from './Components/Post/Post';
import Event from './Components/Event/event';
import Feed from './Components/Feed/Feed';
import LocaleProvider from './Contexts/LocaleContext';
import Playground from './Components/Playground/Playground';
import Footer from './Components/Footer/Footer';
import Gallery from './Components/Gallery/Gallery';
import Album from './Components/Gallery/Album/Album';
import Page from './Components/Page/Page';
import Spinner from './Components/Common/Spinner/Spinner';
import Profile from './Components/Profile/profile';

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
            <Route path="/spinner">
              <PageWithMainMenu><Spinner /></PageWithMainMenu>
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
            <Route path="/events/:id">
              <PageWithMainMenu><Event /></PageWithMainMenu>
            </Route>
            <Route path="/playground">
              <PageWithMainMenu><Playground /></PageWithMainMenu>
            </Route>
            <Route path="/gallery">
              <PageWithMainMenu><Gallery /></PageWithMainMenu>
            </Route>
            <Route path="/album/:id">
              <PageWithMainMenu><Album /></PageWithMainMenu>
            </Route>
            <Route path="/user">
              <PageWithMainMenu><Profile/></PageWithMainMenu>
            </Route>
            <Route
              path="/:pageSlug"
              render={(props) => <PageWithMainMenu><Page key={props.location.pathname} /></PageWithMainMenu>}
            />
          </Switch>
          <Footer/>
        </UserProvider>
      </LocaleProvider>
    </Router>
  );
}

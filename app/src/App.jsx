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
import Document from './Components/Documents/Document';
import CommitteeList from './Components/Committee/CommitteeList';
import PageManager from './Components/Page/PageManager'
import Post from './Components/Post/Post';
import ProfileCard from './Components/Common/ProfileCard/ProfileCard';

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
          <OfficialsBoard />
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
        <Route path="/pages">
          <MainMenu />
          <PageManager />
        </Route>
        <Route path="/post">
          <MainMenu />
          <Post post={
            {
              title: "Sök hemsideprojektet",
              date: "28 JANUARI 2020 | KL. 04:20 ",
              img: "https://i.ytimg.com/vi/KEkrWRHCDQU/maxresdefault.jpg",
              body: "..Morbi id est pulvinar, congue dolor eu, aliquet enim. Mauris dapibus, lorem at tristique mattis, enim ligula elementum lacus, ut volutpat orci sapien at massa. Nulla at ligula ultrices, mattis sem eu, tincidunt ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam pharetra porttitor purus. Vestibulum mattis, sapien ac dictum accumsan, magna massa luctus arcu, sit amet fermentum leo tortor a orci. Curabitur blandit, erat ut ullamcorper maximus, justo ligula interdum enim, a dignissim metus turpis a metus. Integer et magna nec eros posuere mattis. Fusce enim metus, semper quis elementum at, viverra quis ligula. Phasellus consectetur sem mattis tortor commodo tristique. Proin fringilla dolor vitae felis mattis, fermentum varius elit dictum. Aliquam nec elit nisi. Aenean mollis fringilla justo, in lacinia dui tincidunt sit amet.",
              btnDesc: "till ansökan",
              tags: ["hacker", "projekt"],
              userId: 1,
            }
          }/>
        </Route>
        <Route match="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

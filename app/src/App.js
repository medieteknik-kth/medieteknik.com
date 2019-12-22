import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import "circular-std";
import "normalize.css";
import "./Components/Common/Typography.css"

import MainMenu from "./Components/MainMenu/MainMenu.js"
import LandingPage from "./Components/LandingPage/LandingPage.js"
import NotFound from "./Components/NotFound/NotFound.js"
import OfficialsList from "./Components/OfficialsList/OfficialsList.js"
import Settings from "./Components/Settings/Settings.js"
import Document from "./Components/Documents/Document.js"

function App() {
    return <Router>
        <Switch >
            <Route exact path="/" >
                <MainMenu />
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
                <Document />
            </Route>
            <Route match="*">
                <NotFound />
            </Route>
        </Switch >
    </Router>
}

export default App;
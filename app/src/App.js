import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import "circular-std";
import "normalize.css";
import "./Components/Common/Typography.css"

import MainMenu from "./Components/MainMenu/MainMenu.js"
import LandingPage from "./Components/LandingPage/LandingPage.js"

function App() {
    return <Router>
        <Switch >
            <Route exact path="/" >
                <MainMenu />
                <LandingPage />
            </Route>
            <Route exact path="/test" >
                <h1>Header 1</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus luctus, sem et fermentum congue, ex augue dignissim leo, et convallis ligula purus quis magna. Etiam suscipit dictum libero sed iaculis. Aliquam elementum malesuada eros, a egestas est efficitur nec. Phasellus sollicitudin placerat odio id hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam fringilla mi ac felis bibendum, in lobortis libero tempus. Mauris odio nulla, auctor id aliquam et, facilisis ultrices dui. Ut nunc dolor, ornare vitae tempor at, mollis in ante. Praesent dictum at leo in aliquet. Proin finibus pretium maximus. Vivamus consequat scelerisque nibh eget porta. Aenean tempus sagittis viverra. Nam id neque id nisi laoreet fringilla et commodo nunc. In fringilla diam nec ullamcorper finibus.</p>
                <h2>Header 2</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus luctus, sem et fermentum congue, ex augue dignissim leo, et convallis ligula purus quis magna. Etiam suscipit dictum libero sed iaculis. Aliquam elementum malesuada eros, a egestas est efficitur nec. Phasellus sollicitudin placerat odio id hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam fringilla mi ac felis bibendum, in lobortis libero tempus. Mauris odio nulla, auctor id aliquam et, facilisis ultrices dui. Ut nunc dolor, ornare vitae tempor at, mollis in ante. Praesent dictum at leo in aliquet. Proin finibus pretium maximus. Vivamus consequat scelerisque nibh eget porta. Aenean tempus sagittis viverra. Nam id neque id nisi laoreet fringilla et commodo nunc. In fringilla diam nec ullamcorper finibus.</p>
                <h3>Header 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus luctus, sem et fermentum congue, ex augue dignissim leo, et convallis ligula purus quis magna. Etiam suscipit dictum libero sed iaculis. Aliquam elementum malesuada eros, a egestas est efficitur nec. Phasellus sollicitudin placerat odio id hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam fringilla mi ac felis bibendum, in lobortis libero tempus. Mauris odio nulla, auctor id aliquam et, facilisis ultrices dui. Ut nunc dolor, ornare vitae tempor at, mollis in ante. Praesent dictum at leo in aliquet. Proin finibus pretium maximus. Vivamus consequat scelerisque nibh eget porta. Aenean tempus sagittis viverra. Nam id neque id nisi laoreet fringilla et commodo nunc. In fringilla diam nec ullamcorper finibus.</p>
                <h4>Header 4</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus luctus, sem et fermentum congue, ex augue dignissim leo, et convallis ligula purus quis magna. Etiam suscipit dictum libero sed iaculis. Aliquam elementum malesuada eros, a egestas est efficitur nec. Phasellus sollicitudin placerat odio id hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam fringilla mi ac felis bibendum, in lobortis libero tempus. Mauris odio nulla, auctor id aliquam et, facilisis ultrices dui. Ut nunc dolor, ornare vitae tempor at, mollis in ante. Praesent dictum at leo in aliquet. Proin finibus pretium maximus. Vivamus consequat scelerisque nibh eget porta. Aenean tempus sagittis viverra. Nam id neque id nisi laoreet fringilla et commodo nunc. In fringilla diam nec ullamcorper finibus.</p>
            </Route>
        </Switch >
    </Router>
}

export default App;
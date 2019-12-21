import React from "react";

import "./LandingPage.css"

class LandingPage extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        return <div className="startpage">
            <div className="start_picture">
                <h2 className="start_text">VÄLKOMMEN TILL</h2>
                <h1 className="start_text_medieteknik">MEDIETEKNIK</h1>
                <h3 className="start_text">KUNGLIGA TEKNISKA HÖGSKOLAN</h3>
            </div>
            <div className="start_info_container">
                <h3>VAD ÄR MEDIETEKNIK?</h3>
                <div className="medieteknik_container">
                    <div className="grid-container">
                        <div className="grid_item">
                            <h4>SEKTIONEN</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                        <div className="grid-item">
                            <h4>UTBILDNINGEN</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default LandingPage;

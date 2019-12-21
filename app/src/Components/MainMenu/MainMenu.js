import React from "react";
import logo from './logo.png';
import logo_vit from './logo_vit.png'
import search_icon from './search_icon.svg'
import login_icon from './login_icon.svg'
import eng_icon from './eng_icon.svg'

import './MainMenu.css';

class MainManu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isTop: true
        }

        document.addEventListener('scroll', () => {
            const isTop = window.scrollY < 100;
            if (isTop !== this.state.isTop) {
                this.setState({ isTop })
            }
        });
    }

    componentDidMount() {
    }

    render() {
        //Finds all headers from the backend (This is not implemented yet though...)
        let header = [{ name: "AKTUELLT" }, { name: "SEKTIONEN", links: [{ name: "Nämnder och projekt", link: "#4" }, { name: "Styrelsen", link: "#5" }, { name: "Dokument", link: "#6" }, { name: "Sektionsmedlemmar", link: "#6" }, { name: "Bokningar/Boka META", link: "#6" }] }, { name: "UTBILDNINGEN", links: [{ name: "Vad är medieteknik?", link: "#7" }, { name: "Antagning", link: "#8" }, { name: "Kurser", link: "#9" }, { name: "Masterprogrammet", link: "#9" }, { name: "Studievägledning", link: "#9" }, { name: "Utlandsstudier", link: "#9" }, { name: "Studenträtt", link: "#9" }] }, { name: "KONTAKT", links: [{ name: "Samarbete", link: "#7" }, { name: "Annonsering", link: "#8" }, { name: "Funktionärer", link: "#9" }, { name: "Styrelsen", link: "#9" }] }]
        //Creates the headers for the menu and their dropdowns. Saves in the variable buttons
        let buttons = header.map((item, key) =>
            <div className="dropdown" key={key}>
                <button className="dropbtn">{item.name}</button>
                {item.links ? <div className="dropdown-content">
                    {item.links.map((item, key) =>
                        <a key={key} href={item.link}>{item.name}</a>)}
                </div> :
                    null}

            </div>);
        return (
            <div className={this.state.isTop ? 'container top' : 'container down' /* Changes the styling class depending on whether we are at the top or scrolled down*/}
                style={{ transition: '1s ease' }}>
                <div className="inner_container">
                    <div className="container-left" style={{ transition: '1s ease' }}>
                        {/* changes the logo depending on scroll */}
                        <img src={logo} className={this.state.isTop ? "logo" : "logo hidden_logo"} />
                        <img src={logo_vit} className={this.state.isTop ? "logo hidden_logo" : "logo"} />
                    </div>
                    <div className="container-right">
                        { // Shows the headers that were created earlier in render()
                            buttons}
                        <button className="dropbtn">
                            <img alt="svgImg" src={search_icon} className="search_icon" />
                        </button>
                        {/*Måste ha rätt icon!!!*/}
                        <button className="dropbtn">
                            <img alt="svgImg" src={login_icon} className="login_icon" />
                        </button>
                        <button className="dropbtn">
                            <img alt="svgImg" src={eng_icon} className="eng_icon" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainManu;
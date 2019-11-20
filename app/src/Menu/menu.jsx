import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from './logo.png';
import logo_vit from './logo_vit.png'
import './menu.css';

//This file creates the top navbar (or menu)

class Menu extends Component {
    state = {
        isTop: true, // Sets to true since we start at the top of the page when creating the file
      };

      componentDidMount() {
          //The stuff below is to calculate whether the user is at the top of the page or has scrolled down
        document.addEventListener('scroll', () => {
          const isTop = window.scrollY < 100;
          if (isTop !== this.state.isTop) {
              this.setState({ isTop })
          }
        });
      }
      
    render() {
        //Finds all headers from the backend (This is not implemented yet though...)
        let header = [{ name: "AKTUELLT"}, { name: "SEKTIONEN", links: [{ name: "Nämnder och projekt", link: "#4" }, { name: "Styrelsen", link: "#5" }, { name: "Dokument", link: "#6" }, { name: "Sektionsmedlemmar", link: "#6" }, { name: "Bokningar/Boka META", link: "#6" }] }, { name: "UTBILDNINGEN", links: [{ name: "Vad är medieteknik?", link: "#7" }, { name: "Antagning", link: "#8" }, { name: "Kurser", link: "#9" }, { name: "Masterprogrammet", link: "#9" }, { name: "Studievägledning", link: "#9" }, { name: "Utlandsstudier", link: "#9" }, { name: "Studenträtt", link: "#9" }] }, { name: "KONTAKT", links: [{ name: "Samarbete", link: "#7" }, { name: "Annonsering", link: "#8" }, { name: "Funktionärer", link: "#9" }, { name: "Styrelsen", link: "#9" }] }]
        //Creates the headers for the menu and their dropdowns. Saves in the variable buttons
        console.log("header: ", header)
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
                            <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjAiIGhlaWdodD0iMjAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTcyLjI0LDEwLjMyYy0zMi4yNjM0NCwwIC01OC40OCwyNi4yMTY1NiAtNTguNDgsNTguNDhjMCwzMi4yNjM0NCAyNi4yMTY1Niw1OC40OCA1OC40OCw1OC40OGMxMi43NjU2MywwIDI0LjU2Mzc1LC00LjExMTg3IDM0LjE4NSwtMTEuMDcyNWw0NS4yNTc1LDQ1LjE1bDkuNjc1LC05LjY3NWwtNDQuNzIsLTQ0LjgyNzVjOC43ODgxMywtMTAuMjM5MzcgMTQuMDgyNSwtMjMuNTI5MDYgMTQuMDgyNSwtMzguMDU1YzAsLTMyLjI2MzQ0IC0yNi4yMTY1NiwtNTguNDggLTU4LjQ4LC01OC40OHpNNzIuMjQsMTcuMmMyOC41NDEyNSwwIDUxLjYsMjMuMDU4NzUgNTEuNiw1MS42YzAsMjguNTQxMjUgLTIzLjA1ODc1LDUxLjYgLTUxLjYsNTEuNmMtMjguNTQxMjUsMCAtNTEuNiwtMjMuMDU4NzUgLTUxLjYsLTUxLjZjMCwtMjguNTQxMjUgMjMuMDU4NzUsLTUxLjYgNTEuNiwtNTEuNnoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==" />
                        </button>
                        {/*Måste ha rätt icon!!!*/}
                        <button className="dropbtn">LOGIN</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;

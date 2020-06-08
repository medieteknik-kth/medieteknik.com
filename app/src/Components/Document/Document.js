import React, { Component } from 'react';
import './ViewDocuments/ViewDocuments.js';
import ViewDocuments from './ViewDocuments/ViewDocuments.js';
import PublishDocument from './PublishDocument/PublishDocument.js';
import classes from './Document.module.css';
import Button from './ViewDocuments/Assets/ButtonRasmus';

// Att göra:
// - Kolla upp hur FormData fungerar
// - Ladda upp dokument
// - Dokumenttitel (Anta dokumentnamn först)
// - Välj dokumenttyp
// - Namn, efternamn och datum väljs automatiskt
// - Fixa konstig loga
// - Ladda upp knapp
// - Fixa två knappar så att man kan switcha mellan att kolla på dokument och att ladda upp dokument


class Document extends Component {
    constructor() {
        super();

        this.state = {
            viewCardsview: true,
            propUserFunkis: false // Ska komma som prop
        }
    }
    
    render() {
        return (
            <div>
                 {/* <Button onClick={() => {
                     
                     this.setState({viewCardsview: !this.state.viewCardsview});
                 }}>{this.state.viewCardsview ? 'Ladda upp dokument +' : 'Bläddra bland dokument'}</Button> */}

                <h2 className={classes.secHeader}>{this.state.viewCardsview ? 'Dokument' : 'Ladda upp dokument'}</h2>
                {
                    this.state.viewCardsview ? 
                    <ViewDocuments userIsFunkis = {this.state.propUserFunkis} /> : 
                    <PublishDocument />
                }
            </div>
        )
    }
}

export default Document;
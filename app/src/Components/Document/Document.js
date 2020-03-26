import React, { Component } from 'react';
import './ViewDocuments.js';
import ViewDocuments from './ViewDocuments.js';
import PublishDocument from './PublishDocument.js';
import classes from './DocumentContainer.module.css';

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
            viewCardsview: false
        }
    }

    viewModeHandler = () => {
        if (!this.state.viewCardsview) {
            this.setState({
                viewCardsview: true
            })
        }
    }

    uploadModeHandler = () => {
        if (this.state.viewCardsview) {
            this.setState({
                viewCardsview: false
            })
        }
    }

    render() {
        return (
            <div>
                <div className={classes.buttonContainer} onClick={this.uploadModeHandler}>
                    <div 
                        className={!this.state.viewCardsview ? classes.selected : classes.notSelected}
                    >Ladda upp</div>

                    <div onClick = {this.viewModeHandler}
                        className={this.state.viewCardsview ? classes.selected : classes.notSelected}
                    >Bläddra</div>
                </div>
                

                {
                    this.state.viewCardsview ? 
                    <ViewDocuments /> : 
                    <PublishDocument />
                }
            </div>
        )
    }
}

export default Document;
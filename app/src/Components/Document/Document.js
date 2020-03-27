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
            viewCardsview: false,
            propUserFunkis: true // Ska komma som prop
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
        if (this.state.viewCardsview && this.state.propUserFunkis) {
            this.setState({
                viewCardsview: false
            })
        }
    }

    render() {
        let publishDocumentsClass;
        let viewDocumentsClass;

        if (!this.state.viewCardsview) {
            publishDocumentsClass = classes.selected;
        } else {
            publishDocumentsClass = classes.notSelected;
        }

        if (this.state.viewCardsview) {
            viewDocumentsClass = classes.selected;
        } else {
            viewDocumentsClass = classes.notSelected;
        }

        if (!this.state.propUserFunkis) {
            publishDocumentsClass = classes.disabled;
            viewDocumentsClass = classes.selectedOnly;
        }

        return (
            <div>
                <div className={classes.buttonContainer} >
                    <div 
                        className = {publishDocumentsClass} 
                        onClick = {this.uploadModeHandler}
                    >Ladda upp</div>

                    <div 
                        className = {viewDocumentsClass}
                        onClick = {this.viewModeHandler}
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
import React, { Component } from 'react';
import './Document.css';
import './ViewDocuments.js'
import ViewDocuments from './ViewDocuments.js';
import PublishDocument from './PublishDocument.js'


// Att göra:
// - Kolla upp hur FormData fungerar
// - Ladda upp dokument
// - Dokumenttitel (Anta dokumentnamn först)
// - Välj dokumenttyp
// - Namn, efternamn och datum väljs automatiskt
// - Fixa konstig loga
// - Ladda upp knapp


class Document extends Component {
    constructor() {
        super();

        this.state = {
            viewCardsview: true
        }
    }

    render() {
        return (
            <div>
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
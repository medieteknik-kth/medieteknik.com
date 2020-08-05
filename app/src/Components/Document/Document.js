import React, { useState } from 'react';
import './ViewDocuments/ViewDocuments.js';
import classes from './Document.module.css';


// --- KOMPONENTER ---
import Button from './ViewDocuments/Assets/ButtonRasmus';
import ViewDocuments from './ViewDocuments/ViewDocuments.js';
import PublishDocument from './PublishDocument/PublishDocument.js';

const Document = props => {
    const [viewDocuments, setViewDocuments] = useState(true);
    const [propUserIsFunkis, setPropUserIsFunkis] = useState(true);

    return (
        <div>
                 <Button onClick={() => {
                     setViewDocuments(!viewDocuments);
                 }}>{viewDocuments ? 'Ladda upp dokument +' : 'Bläddra bland dokument'}</Button>

                <h2 className={classes.secHeader}>{viewDocuments ? 'Dokument' : 'Ladda upp dokument'}</h2>
                {
                    viewDocuments ? 
                    <ViewDocuments userIsFunkis = {propUserIsFunkis} /> : 
                    <PublishDocument />
                }
            </div>
    )
}

export default Document;
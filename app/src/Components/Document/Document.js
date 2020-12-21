import React, { useState, useContext } from 'react';
import './ViewDocuments/ViewDocuments.js';
import classes from './Document.module.css';

import {
    LocaleContext,
    translateToString,
} from '../../Contexts/LocaleContext'


// --- KOMPONENTER ---
import Button from './ViewDocuments/Assets/ButtonRasmus';
import ViewDocuments from './ViewDocuments/ViewDocuments.js';
import PublishDocument from './PublishDocument/PublishDocument.js';

const Document = props => {
    const [viewDocuments, setViewDocuments] = useState(true);
    const [propUserIsFunkis, setPropUserIsFunkis] = useState(true);
    const { user } = useContext(UserContext);

    const { lang } = useContext(LocaleContext);
    translateToString({
        se: 'Dokument',
        en: 'Document',
        lang,
    })

    return (
        <div>
            { user !== null && user.isOfficial ?
                <Button onClick={() => {
                    setViewDocuments(!viewDocuments);
                }}>{viewDocuments ?
                    translateToString({
                        se: 'Ladda upp dokument +',
                        en: 'Publish document +',
                        lang,
                    }) : 
                    translateToString({
                        se: 'Bläddra bland dokument',
                        en: 'Browse documents',
                        lang,
                    })
                }</Button>

                <h2 className={classes.secHeader}>{viewDocuments ?
                    translateToString({
                        se: 'Dokument',
                        en: 'Document',
                        lang,
                    }) : 
                    translateToString({
                        se: 'Ladda upp dokument',
                        en: 'Publish document',
                        lang,
                    })
                }</h2>
                {
                    viewDocuments ? 
                    <ViewDocuments userIsFunkis = {propUserIsFunkis} /> : 
                    <PublishDocument />
                }
            </div>
    )
}

export default Document;
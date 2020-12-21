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
import SwitchButton from '../Common/Buttons/RoundedTextButton/RoundedTextButton';

const Document = props => {
    const [viewDocuments, setViewDocuments] = useState(true);
    const [propUserIsFunkis, setPropUserIsFunkis] = useState(true);

    const { lang } = useContext(LocaleContext);
    translateToString({
        se: 'Dokument',
        en: 'Document',
        lang,
    })

    return (
        <>
            <SwitchButton 
                text = {viewDocuments ? 
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
                } 
                onClick = {() => setViewDocuments(!viewDocuments)}
                extraClass = {classes.switchButton}
            />

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
        </>
    )
}

export default Document;
import React, {useContext} from 'react';
import classes from './DocumentCard.module.css';
import DocumentPreview from './DocumentPreview/DocumentPreview';
import {LocaleContext, translateToString} from "../../../../../Contexts/LocaleContext";

export default function DocumentCard(props) {
    const { lang } = useContext(LocaleContext);

    let docTypeString = props.doctype.map((tag) => translateToString({...tag.title, lang})).join(', ');

    return (
        <div className={classes.cardContainer}>
            <h5>{docTypeString}</h5>

            <div className={classes.docCards}>
                <div className={classes.textContent}>
                    
                    <h4>{props.headingText}</h4>
                    <p>{props.publishDate}</p>
                </div>
                <DocumentPreview thumbnail={props.thumbnail} className={classes.thumbnail} />
            </div>
        </div>
        
    );
}



import React from 'react';
import classes from './DocumentCard.module.css';
import DocumentPreview from './DocumentPreview/DocumentPreview';

const documentCard = (props) => {
    return (
        <div className={classes.docCards}>
            <h5>{props.doctype}</h5>
            <h3>{props.headingText}</h3>
            <p>Uppladdat: {props.publishDate}</p>
            <p>Av: {props.publisher}</p>
            <DocumentPreview pdfFile = {props.pdfFile} />
        </div>
    );
}

export default documentCard;



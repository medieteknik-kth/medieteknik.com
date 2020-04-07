import React from 'react';
import classes from './DocumentCard.module.css';
import DocumentPreview from './DocumentPreview/DocumentPreview';

const documentCard = (props) => {
    return (
        <div className={classes.docCards}>
            <div className={classes.textContent}>
                <h5>{props.doctype}</h5>
                <h3>{props.headingText}</h3>
                <p>Uppladdat: {props.publishDate}</p>
                <p>Av: {props.publisher}</p>
            </div>
            <DocumentPreview thumbnail = {props.thumbnail} className={classes.thumbnail} />
        </div>
    );
}

export default documentCard;



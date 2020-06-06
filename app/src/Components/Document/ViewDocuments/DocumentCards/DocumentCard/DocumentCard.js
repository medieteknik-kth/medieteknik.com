import React from 'react';
import classes from './DocumentCard.module.css';
import DocumentPreview from './DocumentPreview/DocumentPreview';

const documentCard = (props) => {
    return (
        <div>
            <h5>{props.doctype}</h5>

            <div className={classes.docCards}>
                <div className={classes.textContent}>
                    
                    <h4>{props.headingText}</h4>
                    <p>{props.publishDate} | {props.publisher}</p>
                </div>
                <DocumentPreview thumbnail={props.thumbnail} className={classes.thumbnail} />
            </div>
        </div>
        
    );
}

export default documentCard;



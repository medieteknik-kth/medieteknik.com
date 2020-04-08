import React from 'react';

import DocumentCard from './DocumentCard/DocumentCard';
import classes from './DocumentCards.module.css';

const DocumentCards = (props) => {
    let documentsToRender = [];

    if (props.zeroCategoriesSelected) {
        documentsToRender = props.documents
            .filter(doc => doc.displayCard);
    } else {
        documentsToRender = props.documents
            .filter(_document => {
                let renderDocument = false;
                _document.doctags.forEach(documentTag => {
                    if (props.categoriesToShow.includes(documentTag.trim())) {
                        renderDocument = true;
                    }
                })
                return renderDocument;
            })
            .filter(doc => doc.displayCard);
    }

    return (
        <div className={classes.DocumentCards}>
            {
                documentsToRender.map(doc => (
                    <DocumentCard
                        doctypeId = {doc.doctypeId}
                        doctype = {doc.doctags.toString()}
                        headingText = {doc.headingText}
                        publisher = {doc.publisher}
                        publishDate = {
                            doc.publishDate.getFullYear() + "-" + 
                            ((doc.publishDate.getMonth() + 1) < 10 ? `0${(doc.publishDate.getMonth() + 1)}` : (doc.publishDate.getMonth() + 1)) + "-" + 
                            (doc.publishDate.getDate() < 10 ? `0${doc.publishDate.getDate()}` : doc.publishDate.getDate())
                        }
                        thumbnail = {doc.thumbnail}
                        key = {doc.publishDate}
                    />
                )) 
            }
        </div>
    )
};

export default DocumentCards;
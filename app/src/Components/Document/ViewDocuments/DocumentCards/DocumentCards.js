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
            .filter(category => props.categoriesToShow[category.doctype])
            .filter(doc => doc.displayCard);
    }

    return (
        <div className={classes.DocumentCards}>
            {
                documentsToRender.map(doc => (
                    <DocumentCard
                        doctypeId = {doc.doctypeId}
                        doctype = {doc.doctype === 'Motioner' ? 'Motion' : doc.doctype}
                        headingText = {doc.headingText}
                        publisher = {doc.publisher}
                        publishDate = {
                            doc.publishDate.getFullYear() + "-" + 
                            ((doc.publishDate.getMonth() + 1) < 10 ? `0${(doc.publishDate.getMonth() + 1)}` : (doc.publishDate.getMonth() + 1)) + "-" + 
                            (doc.publishDate.getDate() < 10 ? `0${doc.publishDate.getDate()}` : doc.publishDate.getDate())
                        }
                        pdfFile = {doc.pdfFile}
                        key = {doc.publishDate}
                    />
                )) 
            }
        </div>
    )
};

export default DocumentCards;
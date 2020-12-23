import React from 'react';

import DocumentCard from './DocumentCard/DocumentCard';
import classes from './DocumentCards.module.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

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
                    if (props.categoriesToShow.includes(documentTag.title.toString().trim())) {
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
                    <a href={doc.filename} target="_blank">
                        <DocumentCard
                            doctypeId = {doc.itemId}
                            doctype = {doc.doctags}
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
                    </a>
                )) 
            }
        </div>
    )
};

export default DocumentCards;
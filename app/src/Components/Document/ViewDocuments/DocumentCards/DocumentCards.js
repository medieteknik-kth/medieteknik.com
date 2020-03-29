import React from 'react';

import DocumentCard from '../DocumentCard/DocumentCard';
import classes from './DocumentCards.module.css';

const DocumentCards = (props) => {
    return (
        <div className={classes.DocumentCards}>
            {
                props.documents.filter(doc => doc.displayCard).map(doc => (
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
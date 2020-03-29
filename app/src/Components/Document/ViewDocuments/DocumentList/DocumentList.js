import React from 'react';

import DocumentCard from '../DocumentCard/DocumentCard';
import classes from './DocumentList.module.css';

const DocumentList = (props) => {
    return (
        <div className={classes.DocumentList}>
            {
                props.documents.filter(category => this.state.shown[category.doctype]).filter(doc => doc.displayCard).map(doc => (
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
                    />
                ))
            }
        </div>
    )
};

export default DocumentList;
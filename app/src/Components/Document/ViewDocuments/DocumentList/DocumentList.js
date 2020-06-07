import React from 'react';

import classes from './DocumentList.module.css';

const DocumentList = (props) => {
    let documentsToRender = [];

    if (props.zeroCategoriesSelected) {
        documentsToRender = props.documents
            .filter(doc => doc.displayCard);
    } else {
        documentsToRender = props.documents
            .filter(_document => {
                let renderDocument = false;
                _document.doctags.forEach(documentTag => {
                    if (props.categoriesToShow.includes(documentTag.toString().trim())) {
                        renderDocument = true;
                    }
                })
                return renderDocument;
            })
            .filter(doc => doc.displayCard);
    }

    return (
        <div className={classes.DocumentList}>              
            <table>
                <thead>
                    <tr>
                        <th className={classes.catParam}>
                            Dokumentnamn
                        </th>
                        <th>
                            Typ 
                        </th>
                        <th className={classes.catParam}>
                            Publicerat av 
                        </th>
                        <th className={classes.catParam}>
                            Publiceringssdatum
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        documentsToRender.map(document => {
                            let docTypeString = document.doctags.join(', ');

                            return (
                                <tr key={document.docId}>
                                    <td>{document.headingText}</td>
                                    <td>{docTypeString}</td>
                                    <td>{document.publisher}</td>
                                    <td>
                                        {
                                            document.publishDate.getFullYear() + "-" + 
                                            ((document.publishDate.getMonth() + 1) < 10 ? `0${(document.publishDate.getMonth() + 1)}` : (document.publishDate.getMonth() + 1)) + "-" + 
                                            (document.publishDate.getDate() < 10 ? `0${document.publishDate.getDate()}` : document.publishDate.getDate())
                                        }
                                    </td>
                                </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};


export default DocumentList;
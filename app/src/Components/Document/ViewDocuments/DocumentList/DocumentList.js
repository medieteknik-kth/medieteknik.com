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


    let documentNameOrderValueClass;
    let publisherOrderValueClass;
    let dateOrderValueClass;

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
                        documentsToRender.map(category => (
                            <tr key={category.docId}>
                                <td>{category.headingText}</td>
                                <td>{category.doctags.toString()}</td>
                                <td>{category.publisher}</td>
                                <td>
                                    {
                                        category.publishDate.getFullYear() + "-" + 
                                        ((category.publishDate.getMonth() + 1) < 10 ? `0${(category.publishDate.getMonth() + 1)}` : (category.publishDate.getMonth() + 1)) + "-" + 
                                        (category.publishDate.getDate() < 10 ? `0${category.publishDate.getDate()}` : category.publishDate.getDate())
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};


export default DocumentList;
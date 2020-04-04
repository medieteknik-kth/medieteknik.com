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
                    if (props.categoriesToShow.includes(documentTag.trim())) {
                        renderDocument = true;
                    }
                })
                return renderDocument;
            })
            .filter(doc => doc.displayCard);
    }


    let documentNameOrderValueClass;
        let typeOrderValueClass;
        let publisherOrderValueClass;
        let dateOrderValueClass;

        if (props.orderValue === "falling") {
            documentNameOrderValueClass = classes.arrowDown;
            typeOrderValueClass = classes.arrowDown;
            publisherOrderValueClass = classes.arrowDown;
            dateOrderValueClass = classes.arrowDown;
        } else {
            documentNameOrderValueClass = classes.arrowUp;
            typeOrderValueClass = classes.arrowUp;
            publisherOrderValueClass = classes.arrowUp;
            dateOrderValueClass = classes.arrowUp;
        }

        if (props.sortValue === "alphabetical") {
            if (typeOrderValueClass === classes.arrowDown) {
                documentNameOrderValueClass = classes.arrowDownSelected
            } else {
                documentNameOrderValueClass = classes.arrowUpSelected
            }
        } else if (props.sortValue === "publisher") {
            if (publisherOrderValueClass === classes.arrowDown) {
                publisherOrderValueClass = classes.arrowDownSelected
            } else {
                publisherOrderValueClass = classes.arrowUpSelected
            }
        } else if (props.sortValue === "date") {
            if (dateOrderValueClass === classes.arrowDown) {
                dateOrderValueClass = classes.arrowDownSelected
            } else {
                dateOrderValueClass = classes.arrowUpSelected
            }
        }

    return (
        <div className={classes.DocumentList}>              
            <table>
                <thead>
                    <tr>
                        <th onClick = {props.handleOrderChangeHeadAlphabetical} className={classes.catParam}>
                            Dokumentnamn
                            <i className={documentNameOrderValueClass}></i>
                        </th>
                        <th>
                            Typ 
                        </th>
                        <th onClick = {props.handleOrderChangeHeadPublisher} className={classes.catParam}>
                            Uppladdat av 
                            <i className={publisherOrderValueClass}></i>
                        </th>
                        <th onClick = {props.handleOrderChangeHeadDate} className={classes.catParam}>
                            Uppladdningsdatum
                            <i className={dateOrderValueClass}></i>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        documentsToRender.map(category => (
                            <tr key={category.publishDate}>
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
                                <td>
                                    <div className = {classes.downloadButtonCircle}>
                                        <i className = {classes.downloadButtonArrow}></i>
                                    </div>
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
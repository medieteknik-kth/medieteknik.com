import React, { useContext } from 'react';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext'

import classes from './DocumentList.module.css';
import { API_BASE_URL } from '../../../../Utility/Api';

const DocumentList = (props) => {
    const { lang } = useContext(LocaleContext)

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
        <div className={classes.DocumentList}>              
            <table>
                <thead>
                    <tr>
                        <th className={classes.catParam}>
                            {translateToString({
                                se: 'Dokumentnamn',
                                en: 'Document name',
                                lang,
                            })}
                        </th>
                        <th>
                            {translateToString({
                                se: 'Typ',
                                en: 'Type',
                                lang,
                            })}
                        </th>
                        <th className={classes.catParam}>
                            {translateToString({
                                se: 'Publicerat av',
                                en: 'Published by',
                                lang,
                            })}
                        </th>
                        <th className={classes.catParam}>
                            
                            {translateToString({
                                se: 'Publiceringssdatum',
                                en: 'Publish date',
                                lang,
                            })}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        documentsToRender.map(document => {
                            let docTypeString = document.doctags.map((tag) => tag.title).join(', ');

                            return (
                                <tr key={document.docId}>
                                    <td><a href={API_BASE_URL + `documents/${document.filename}`} target="_blank">{document.headingText}</a></td>
                                    <td><a href={API_BASE_URL + `documents/${document.filename}`} target="_blank">{docTypeString}</a></td>
                                    <td><a href={API_BASE_URL + `documents/${document.filename}`} target="_blank">{document.publisher}</a></td>
                                    <td>
                                        <a href={API_BASE_URL + `documents/${document.filename}`} target="_blank">
                                            {
                                                document.publishDate.getFullYear() + "-" + 
                                                ((document.publishDate.getMonth() + 1) < 10 ? `0${(document.publishDate.getMonth() + 1)}` : (document.publishDate.getMonth() + 1)) + "-" + 
                                                (document.publishDate.getDate() < 10 ? `0${document.publishDate.getDate()}` : document.publishDate.getDate())
                                            }
                                        </a>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};


export default DocumentList;
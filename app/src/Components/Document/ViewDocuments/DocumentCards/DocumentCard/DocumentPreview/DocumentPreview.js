import React from 'react';

import { Document, Page, pdfjs } from 'react-pdf';
import classes from './DocumentPreview.module.css';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentPreview = (props) => (
    <div className={classes.pdfContainer}>
        <a href={`localhost:5000/documents/${props.filename}`}>
        <Document
            file={ {url:`localhost:5000/documents/${props.pdfFile}`}}
        >
            <Page pageNumber={1} width={200} />
        </Document>
        </a>
    </div>
   
);

export default DocumentPreview;


import React from 'react';

import classes from './DocumentPreview.module.css';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/umd/Page/AnnotationLayer.css';

const DocumentPreview = (props) => (
    <div className={classes.thumbnailContainer}>
        <img src={props.thumbnail} width='200'/>
    </div>
)
        
export default DocumentPreview;


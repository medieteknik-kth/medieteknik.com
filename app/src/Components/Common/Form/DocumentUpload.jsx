import React from 'react'
import './DocumentUpload.css'
import { LocaleText } from '../../../Contexts/LocaleContext'
import Button from '../Button/Button';

const DocumentUpload = ({onUpload, onChangeFile, document}) => {      
    return (<div className='doc-upload-cont'>
        <div className='document-upload' onClick={onUpload} style={{backgroundImage: document ? `url(${document})` : '' }}>
            { document ?
                <></>
                : <div className='upload-text'>
                    <LocaleText phrase='form/add_document'/>
                </div> 
            }
        </div>
        <div className={` doc-button-cont ${document ? 'display': ''}`}>    
            <Button onClick={onChangeFile}>
                <LocaleText phrase='form/change_file'/>
            </Button>
        </div>
    </div>);
}

export default DocumentUpload;
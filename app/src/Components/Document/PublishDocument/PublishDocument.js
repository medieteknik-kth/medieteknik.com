/* eslint-disable quotes */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import classes from './PublishDocument.module.css';
import Api from '../../../Utility/Api';

// --- Komponenter ---
import Dropdown from '../../Common/Form/Dropdown';
import Input from '../../Common/Form/Input';
import YellowDocumentUpload from '../../Common/Form/YellowDocumentUpload';


const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const categories = [
    "Styrelsemötesprotokoll",
    "SM-protokoll",
    "Blanketter",
    "Mallar",
    "Budget/Ekonomi",
    "Policys/Reglemente/Stadgar",
    "Fakturor",
    "Övrigt"
];

const PublishDocuments = (props) => {
    const formInput = useRef(); //använd en ref för att hålla koll på form genom stateändringar
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedDocType, setSelectedDoctype] = useState([]);
    const [docTitle, setDocTitle] = useState("");
    const [docAuthor, setDocAuthor] = useState("");
    const [docFile, setDocFile] = useState(null);
    const [docThumbnail, setDocThumbnail] = useState(null);
    const [clearFormCounter, setClearFormCounter] = useState(0);

    useEffect(() => {
        fetch(API_BASE_URL + 'document_tags')
            .then(response => response.json())
            .then(jsonObject => {
                const tempCategoriesList = jsonObject.map( categoryObject => categoryObject.title)
                setCategoriesList(tempCategoriesList);
            });
            
    }, []);

    const publishDocumentApi = (formData) => {
        return fetch(API_BASE_URL + 'documents', {
            method: 'POST',
            body: formData,
        });
    }

    const submitFormHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(formInput.current);

        const tagsList = selectedDocType;

        // Skicka information till backend
        formData.append("tags", JSON.stringify({ 0: tagsList }))
        formData.append("thumbnail", docThumbnail);
        formData.append("documentFile", docFile);
        formData.append("documentAuthor", docAuthor);
        formData.append("title", docTitle);
        publishDocumentApi(formData);

        // setClearFormCounter gör så att den valda filen tas bort när man trycker på ladda upp
        setClearFormCounter(clearFormCounter + 1);

        document.getElementById('publishDocForm').reset();
    }

    return (
        <>
            <div className={classes.Publish}>
                <form
                    method="post"
                    encType="multipart/form-data"
                    action="localhost:5000/documents"
                    onSubmit={submitFormHandler}
                    ref={formInput}
                    id = 'publishDocForm'
                >
                    <div className={classes.formContainer}>
                        <div className={classes.leftFormContainer}>
                            <p>Dokumenttitel</p>
                            <Input
                                placeholder = "Dokumenttitel"
                                onChange = {e => setDocTitle(e.target.value)}
                            />

                            <p>Dokumenttyp</p>
                            <div className={classes.DocTypeDropdown}>
                                <Dropdown 
                                    options = {[
                                        {label: "Välj dokumenttyp", value:null},
                                        ...categoriesList.map(cat => ({label: cat, value: cat}))
                                    ]}
                                    onChange = {(option) => setSelectedDoctype(option.value)}
                                />
                            </div>

                            <p>Ditt namn</p>
                            <Input
                                placeholder = "Ditt namn"
                                onChange = {e => setDocAuthor(e.target.value)}
                            />
                        </div>

                        <div className={classes.rightFormContainer}>
                            <YellowDocumentUpload
                                onChange={(uploadedDocument, thumbnail) => {
                                    setDocFile(uploadedDocument)
                                    setDocThumbnail(thumbnail)
                                }}
                                clearFormCounter = {clearFormCounter}
                            />
                        </div>

                        
                    </div>

                    <button type="submit">Ladda upp</button>
                </form>
            </div>
        </>
    )
}

export default PublishDocuments;
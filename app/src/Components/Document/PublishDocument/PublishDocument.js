/* eslint-disable quotes */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import classes from './PublishDocument.module.css';
import Api from '../../../Utility/Api';

// --- Komponenter ---
import Dropdown from '../../Common/Form/Dropdown';
import Input from '../../Common/Form/Input';

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

export default function PublishDocuments() {
    const formInput = useRef(); //använd en ref för att hålla koll på form genom stateändringar
    let fileUpload = null;
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedDocType, setSelectedDoctype] = useState([]);
    const [docTitle, setDocTitle] = useState("");

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

        const tagsList = selectedDocType

        // Här läggs taggarna in för det första (och enda) dokumentet som skickas med
        formData.append("tags", JSON.stringify({ 0: tagsList }))

        // --- PDF-Thumbnail ---
        let fileReader = new FileReader();

        fileReader.readAsArrayBuffer(fileUpload.files[0])
        
        fileReader.onload = () => {
            let typedArray = new Uint8Array(fileReader.result);
            let pdfHandle = pdfjs.getDocument(typedArray);
            
            pdfHandle.promise
                .then(pdf => {
                    pdf.getPage(1).then(firstPage => {
                        let thumbnailCanvas = document.createElement('canvas');
                        let context = thumbnailCanvas.getContext("2d");
                        let viewport = firstPage.getViewport(3); // getViewport(scale, angle)
                        thumbnailCanvas.width = viewport.width;
                        thumbnailCanvas.height = viewport.height;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        }

                        let renderPageTask = firstPage.render(renderContext);

                        renderPageTask.promise
                            .then(() => {
                                const thumbnailImage = thumbnailCanvas.toDataURL();
                                formData.append("thumbnail", thumbnailImage);
                            })
                            .then(() => publishDocumentApi(formData)
                            .then((response) => response.json())
                            .then((result) => {
                                console.log('Success:', result);
                                // console.log(formData.getAll("thumbnail")[0])
                                console.log(formData.getAll("tags")[0])
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            }));
                    });
                })
                .catch(error => {
                    console.log('Något gick fel! Nedan ser du vilket error som uppstod.')
                    console.log(error)
                })
        }

        document.getElementById('publishDocForm').reset();
    }

    return (
        <React.Fragment>
            <div className={classes.Publish}>
                <form
                    method="post"
                    encType="multipart/form-data"
                    action="localhost:5000/documents"
                    onSubmit={submitFormHandler}
                    ref={formInput}
                    id = 'publishDocForm'
                >
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
                            // options = {[{label: "Hej", value: "Hej"}]}
                            // options = {categoriesListForDropDown}
                            onChange = {(option) => setSelectedDoctype(option.value)}
                        />
                    </div>

                    <p>Fil</p>
                    <input
                        type="file"
                        name="file"
                        ref={(ref) => fileUpload = ref}
                    />

                    <p>Ditt namn</p>
                    <input
                        type="text"
                        name="publisher"
                    />

                    <button type="submit">Ladda upp</button>
                </form>
            </div>
        </React.Fragment>
    )
}
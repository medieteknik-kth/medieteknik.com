/* eslint-disable quotes */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import classes from './PublishDocument.module.css';
import Api from '../../../Utility/Api';

// Att göra:
// - Kolla upp hur FormData fungerar
// - Ladda upp dokument
// - Dokumenttitel (Anta dokumentnamn först)
// - Välj dokumenttyp
// - Namn, efternamn och datum väljs automatiskt
// - Fixa konstig loga
// - Ladda upp knapp

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
    const [categoriesToUse, setCategoriesToUse] = useState({});

    // const [categoriesToUse, setCategoriesToUse] = useState({
    //     "Styrelsemötesprotokoll": false,
    //     "SM-protokoll": false,
    //     "Blanketter": false,
    //     "Mallar": false,
    //     "Budget/Ekonomi": false,
    //     "Policys/Reglemente/Stadgar": false,
    //     "Fakturor": false,
    //     "Övrigt": false
    // })



    useEffect(() => {
        fetch(API_BASE_URL + 'document_tags')
            .then(response => response.json())
            .then(jsonObject => {
                const tempCategoriesToUseArray = jsonObject.map( categoryObject => [categoryObject.title, false])
                const tempCategoriesToUseObject = Object.fromEntries(tempCategoriesToUseArray);

                setCategoriesList(jsonObject);
                setCategoriesToUse(tempCategoriesToUseObject);
            });
    }, []);

    const publishDocumentApi = (formData) => {
        console.log(`[Api.js] formData:`);
        console.log(formData instanceof FormData);
        console.log(API_BASE_URL + 'documents')
        return fetch(API_BASE_URL + 'documents', {
            method: 'POST',
            body: formData,
        });
    }

    const submitFormHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(formInput.current);

        const tagsList = categoriesList
            .filter(categoryObject => categoriesToUse[categoryObject.title])
            .map(categoryObject => categoryObject.title)

        // Här läggs taggarna in för det första (och enda) dokumentet som skickas med
        formData.append("tags", JSON.stringify({ 0: tagsList }))

        publishDocumentApi(formData)
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

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
                        let viewport = firstPage.getViewport(0.36); // getViewport(scale, angle)
                        thumbnailCanvas.width = 200;
                        thumbnailCanvas.height = 200;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        }

                        let renderPageTask = firstPage.render(renderContext);

                        renderPageTask.promise
                            .then(() => {
                                const thumbnailImage = thumbnailCanvas.toDataURL();
                                formData.append("thumbnail", thumbnailImage);

                                const linkElement = document.createElement('a');
                                linkElement.href = thumbnailImage;
                                linkElement.download = "thumbnail.png";
                                linkElement.click();
                            })
                    });
                })
                .catch(error => {
                    console.log('Något gick fel! Nedan ser du vilket error som uppstod.')
                    console.log(error)
                })
        }
    }

    const categoriesFilterChangeHandler = (category) => {
        setCategoriesToUse({
            ...categoriesToUse,
            [category]: !categoriesToUse[category], // brackets runt säger att det ska vara värdet av dena här variabeln
        })
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
                >
                    <div>
                        <label><strong>Dokumenttitel</strong> </label>
                        <input
                            name="title"
                        />
                    </div>

                    <div>
                        <label><strong>Dokumenttaggar</strong> </label>
                        <div className={classes.categoriesTags}>
                            {
                                categoriesList.map(category => (
                                    <label
                                        className={classes.container}
                                        key={category.title}
                                    >
                                        <input
                                            name={category.title}
                                            type="checkbox"

                                            checked={categoriesToUse[category]}
                                            onChange={() => categoriesFilterChangeHandler(category.title)}
                                        />

                                        <span className={classes.checkmark}></span>
                                        {category.title}
                                    </label>
                                ))
                            }
                        </div>

                    </div>

                    <div>
                        <label><strong>Fil</strong> </label>
                        <input
                            type="file"
                            name="file"
                            ref={(ref) => fileUpload = ref}
                        />
                    </div>

                    <div>
                        <label><strong>Ditt namn</strong> </label>
                        <input
                            type="text"
                            name="publisher"
                        />
                    </div>

                    <button type="submit">Ladda upp</button>
                </form>
            </div>
        </React.Fragment>
    )
}
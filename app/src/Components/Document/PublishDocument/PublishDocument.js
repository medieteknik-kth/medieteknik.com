/* eslint-disable quotes */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';

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
    const fileInput = React.useRef(); //använd en ref för att hålla koll på form genom stateändringar
    const [categoriesList, setCategoriesList] = useState([]);

    const [categoriesToUse, setCategoriesToUse] = useState({
        "Styrelsemötesprotokoll": false,
        "SM-protokoll": false,
        "Blanketter": false,
        "Mallar": false,
        "Budget/Ekonomi": false,
        "Policys/Reglemente/Stadgar": false,
        "Fakturor": false,
        "Övrigt": false
    })

    useEffect(() => {
        fetch(API_BASE_URL + 'document_tags')
            .then(response => response.json())
            .then(jsonObject => {
                console.log(jsonObject);
                setCategoriesList(jsonObject);
                // const categoryState = {jsonObject.map( obj => obj.title: false)}
                // Fixa så att den nya listan lägger till kategorier dynamiskt

                //setCategoriesToUse(//categoryState)
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
        console.log(fileInput.current)
        const formData = new FormData(fileInput.current);

        const tagsList = categories.filter(category => {
            return categoriesToUse[category];
        })

        console.log(tagsList)

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
    }

    const categoriesFilterChangeHandler = (category) => {
        setCategoriesToUse({
            ...categoriesToUse,
            [category]: !categoriesToUse[category], // brackets runt säger att det ska vara värdet av dena här variabeln
        })
    }

    return (
        <div className={classes.Publish}>
            <form
                method="post"
                encType="multipart/form-data"
                action="localhost:5000/documents"
                onSubmit={submitFormHandler}
                ref={fileInput}
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
    )
}
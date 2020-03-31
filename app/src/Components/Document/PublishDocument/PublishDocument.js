import React, { useState } from 'react';

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

    const publishDocumentApi = (formData) => {
        console.log(`[Api.js] formData:`);
        console.log( formData instanceof FormData);
        console.log(API_BASE_URL + 'documents')
        return fetch(API_BASE_URL + 'documents', {
            method: 'POST',
            body: formData,
        });
    }

    const submitFormHandler = (event) => {
        event.preventDefault();
        console.log('Hej02')
        console.log(fileInput.current)
        const formData = new FormData(fileInput.current);

        const tagsList = categories.filter(category => {
            return categoriesToUse[category];
        })

        console.log(tagsList)
        
        //TODO: fixa så att tags appendas dynamiskt, förslagsvis genom att splitta på komman
        //det verkar som att sidan bara stödjer en fil i taget, så plonka bara in arrayn som value för 0
        formData.append("tags", JSON.stringify({0: tagsList}))

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
                            categories.map(category => (
                                <label 
                                    className = {classes.container} 
                                    key = {category}
                                >
                                    <input
                                        name={category}
                                        type="checkbox"
                                        
                                        checked={categoriesToUse[category]}
                                        onChange={() => categoriesFilterChangeHandler(category)}
                                    />
                                    
                                    <span className={classes.checkmark}></span>
                                    {category}
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

                <button type="submit">Ladda upp</button>
            </form>
        </div>
    )
}
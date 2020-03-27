import React, { useState } from 'react';

import classes from './PublishDocument.module.css';
import Api from '../../Utility/Api';

// Att göra:
// - Kolla upp hur FormData fungerar
// - Ladda upp dokument
// - Dokumenttitel (Anta dokumentnamn först)
// - Välj dokumenttyp
// - Namn, efternamn och datum väljs automatiskt
// - Fixa konstig loga
// - Ladda upp knapp



export default function PublishDocuments() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('2020-03-27 11:45:52.914672');
    const [fileName, setFileName] = useState('abc123.pdf');


    const submitFormHandler = (event) => {
        event.preventDefault();

        const formData = new FormData();
        const fileField = document.querySelector('input[type="file"]');

        formData.append('title', title);
        formData.append('filename', fileField.files[0]);

        console.log(formData.get('title'))
        console.log(formData.get('filename'))

        Api.Documents.PublishDocument(formData)
            .then((response) => console.log(response))//response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const changeTitleHandler = (event) => {
        setTitle(event.target.value)
    }

    return (
        <div className={classes.Publish}>
            <form 
                method="post" 
                encType="multipart/form-data" 
                action="http://localhost:5000/documents"
                onSubmit={submitFormHandler}
            >
                <div>
                    <label>Titel </label>
                    <input
                        name="title"
                        onChange = {changeTitleHandler}
                    />
                </div>
                
                <div>
                    <label>Dokumenttyp </label>
                    <input
                        name="tag"
                    />
                </div>

                <div>
                    <label>Fil </label>
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
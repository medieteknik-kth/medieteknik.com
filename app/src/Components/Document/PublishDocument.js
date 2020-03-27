import React from 'react';

import classes from './PublishDocument.module.css';

// Att göra:
// - Kolla upp hur FormData fungerar
// - Ladda upp dokument
// - Dokumenttitel (Anta dokumentnamn först)
// - Välj dokumenttyp
// - Namn, efternamn och datum väljs automatiskt
// - Fixa konstig loga
// - Ladda upp knapp

export default function PublishDocuments() {
    return (
        <div className={classes.Publish}>
            <form 
                method="post" 
                encType="multipart/form-data" 
                action="http://localhost:5000/documents"
                //onSubmit={e => e.preventDefault()}
            >
                <div>
                    <label>Rubrik </label>
                    <input
                        name="title"
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
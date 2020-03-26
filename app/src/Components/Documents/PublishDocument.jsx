import React from 'react';
import './Document.css';

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
            <div>
            <form method="get" encType="multipart/form-data" action="http://localhost:5000/documents">
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
            
                <input type="submit" value="Submit" />
                </form>
            </div>
        )
}
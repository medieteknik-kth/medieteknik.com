import React from 'react';
import classes from './CreateEvent.module.css';

const createEvent = (props) => {
    return (
        <div className={classes.formContainer}>
            <h2>Skapa nytt event</h2>
            <form id="createEventForm">
                <div>
                    <label for="fname">Titel</label><br />
                    <input type="text" />
                </div>

                <div>
                    <label for="fname">Beskrivning</label><br />
                    <textarea rows="4" cols="20" name="comment" form="createEventForm"></textarea>
                </div>

                <div>
                    <label for="fname">Eventbild</label><br />
                    <input type="file" id="myfile" name="myfile" />
                </div>

                <div>
                    <button type="submit" className={classes.submitButton}>Publicera event</button>
                </div>
            </form>

            
        </div>
    )
}

export default createEvent;
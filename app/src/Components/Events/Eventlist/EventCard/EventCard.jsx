import React, { useState } from 'react';

import classes from './EventCard.module.css';

// --- Icons ---
import dateAndTimeIcon from '../EventListAssets/dateTimeIcon.png';
import locationIcon from '../EventListAssets/locationIcon.png';

const daysList = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
const monthsList = [
    "Januari",
    "Februari",
    "Mars",
    "April", 
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December"
];

const EventCard = (props) => {

    let startDate = props.eventStart.getDate();
    let startDay = daysList[props.eventStart.getDay()];
    let startMonth = monthsList[props.eventStart.getMonth()];
    let startYear = props.eventStart.getFullYear();

    let startHour = props.eventStart.getHours() < 10 ? "0" + props.eventStart.getHours() : props.eventStart.getHours();
    let startMinute = props.eventStart.getMinutes() < 10 ? "0" + props.eventStart.getMinutes() : props.eventStart.getMinutes();
    let endHour = props.eventEnd.getHours() < 10 ? "0" + props.eventEnd.getHours() : props.eventEnd.getHours();
    let endMinute = props.eventEnd.getMinutes() < 10 ? "0" + props.eventEnd.getMinutes() : props.eventEnd.getMinutes();

    return (
        <div className={classes.EventCard} >
            <h5>{props.title}</h5>

            <div className= {classes.eventPresentationContainer}>
                <div className={classes.imageContainer}>
                    <img src={props.coverPhoto} />
                </div>

                <div className={classes.infoContainer} >
                    <div className={classes.textInfoContainer}>
                        <div className={classes.iconContainer}>
                            <img src={dateAndTimeIcon} />
                        </div>
                        
                        <p>{startDate} {startMonth} {startYear}, {startHour}:{startMinute}–{endHour}:{endMinute}</p>
                    </div>

                    <div className={classes.textInfoContainer}>
                        <div className={classes.iconContainer}>
                            <img src={locationIcon} />
                        </div>
                        
                        <p>{props.location}</p>
                    </div>

                    <div className={classes.textInfoContainer}>
                        <div className={classes.iconContainer}>
                            <img src={props.hostLogo} />
                        </div>
                        
                        <p>{props.host}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard;
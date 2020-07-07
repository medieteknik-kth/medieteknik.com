import React, { useState } from 'react';

import classes from './EventCard.module.css';

// --- Icons ---
import dateAndTimeIcon from '../EventListAssets/dateTimeIcon.png';
import locationIcon from '../EventListAssets/locationIcon.png';

const daysList = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
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

    // --- Event date info ---
    let startDate = props.eventStart.getDate();
    let startDay = daysList[props.eventStart.getDay()];
    let startMonth = monthsList[props.eventStart.getMonth()];
    let startYear = props.eventStart.getFullYear();
    let datePresentation = `${startDate} ${startMonth} ${startYear}`;

    // --- Event time info ---
    let startHour = props.eventStart.getHours() < 10 ? "0" + props.eventStart.getHours() : props.eventStart.getHours();
    let startMinute = props.eventStart.getMinutes() < 10 ? "0" + props.eventStart.getMinutes() : props.eventStart.getMinutes();
    let endHour = props.eventEnd.getHours() < 10 ? "0" + props.eventEnd.getHours() : props.eventEnd.getHours();
    let endMinute = props.eventEnd.getMinutes() < 10 ? "0" + props.eventEnd.getMinutes() : props.eventEnd.getMinutes();

    // --- Event is within a week ---
    let timeDifference = props.eventStart - Date.now();
    let daysDifference = timeDifference / (1000 * 3600 * 24);

    // --- Calculate yesterdays timestamps ---
    let dateNow = new Date();
    let yesterdayEndTime = Date.now() - (dateNow.getMinutes() * 60 * 1000) - (dateNow.getHours() * 60 * 60 * 1000);
    let yesterdayStartTime = yesterdayEndTime - (24 * 60 * 60 * 1000);
    let eventWasYesterday = (yesterdayStartTime < props.eventStart.getTime() && props.eventStart.getTime() < yesterdayEndTime);

    // --- Calculate tomorrows timestamps ---
    let tomorrowStartTime = Date.now() + ((60 - dateNow.getMinutes()) * 60 * 1000) + ((23 - dateNow.getHours()) * 60 * 60 * 1000);
    let tomorrowsEndTime = tomorrowStartTime + (24 * 60 * 60 * 1000);
    let eventIsTomorrow = (tomorrowStartTime < props.eventStart.getTime() && props.eventStart.getTime() < tomorrowsEndTime);

    // --- Calculate todays timestamps ---
    let todaysStartTime = yesterdayEndTime;
    let todaysEndTime = tomorrowStartTime;
    let eventIsToday = (todaysStartTime < props.eventStart.getTime() && props.eventStart.getTime() < todaysEndTime);

    if (eventWasYesterday) {
        datePresentation = "Igår";
    } else if (eventIsTomorrow) {
        datePresentation = "Imorgon";
    } else if (eventIsToday) {
        datePresentation = "Idag";
    } else if (daysDifference < 7) {
        datePresentation = startDay
    }

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
                        
                        <p>{datePresentation}, {startHour}:{startMinute}–{endHour}:{endMinute}</p>
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
import React, { useState, useContext } from 'react';

import classes from './CurrentEvents.module.css';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

import EventCard from '../EventCard/EventCard';
import { Link } from 'react-router-dom';

const CurrentEvents = (props) => {
    const { lang } = useContext(LocaleContext);
    let eventsToShowList = props.eventsToShow;

    if (!props.numberOfHostsSelected == 0) {
        eventsToShowList = eventsToShowList.filter(event => {
            return props.hostsShown[event.host]
        })
    }

    let eventsThisWeek = eventsToShowList.filter(event => {
        let timeDifference = event.eventStart - Date.now();
        let daysDifference = timeDifference / (1000 * 3600 * 24);

        return daysDifference <= 7;
    })

    let eventsAfterThisWeek = eventsToShowList.filter(event => {
        let timeDifference = event.eventStart - Date.now();

        let daysDifference = timeDifference / (1000 * 3600 * 24);


        return daysDifference > 7;
    })

    return (
        <div className={[classes.CurrentEvents, props.eventDisplayClass].join(" ")}>
            <div className={classes.eventsThisWeek}>
                <h4>
                    {translateToString({
                        se: 'Denna vecka',
                        en: 'This week',
                        lang,
                    })}
                </h4>

                <div className = {classes.CurrentEventsContainer} >
                    {
                        eventsThisWeek.map(event => (
                            <Link to={`/events/${event.id}`}>
                                <EventCard 
                                    title = {event.title} 
                                    coverPhoto = {event.coverPhoto}
                                    hostLogo = {event.hostLogo}
                                    eventStart = {event.eventStart}
                                    eventEnd = {event.eventEnd}
                                    location = {event.location}
                                    host = {event.host}
                                />
                            </Link>
                        ))
                    }
                </div>
            </div>

            <div className={classes.eventsAfterThisWeek}>
                <h4>
                    {translateToString({
                        se: 'Kommande',
                        en: 'Upcoming',
                        lang,
                    })}
                </h4>

                <div className = {classes.CurrentEventsContainer} >
                    {
                        eventsAfterThisWeek.map(event => (
                            <a href="#">
                                <EventCard 
                                    title = {event.title} 
                                    coverPhoto = {event.coverPhoto}
                                    hostLogo = {event.hostLogo}
                                    eventStart = {event.eventStart}
                                    eventEnd = {event.eventEnd}
                                    location = {event.location}
                                    host = {event.host}
                                />
                            </a>
                        ))
                    }
                </div>
            </div>
            
        </div>
    )
}

export default CurrentEvents;
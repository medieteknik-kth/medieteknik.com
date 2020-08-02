import React, { useState } from 'react';

import classes from './PreviousEvents.module.css';

import EventCard from '../EventCard/EventCard';
import { Link } from 'react-router-dom';

const PreviousEvents = (props) => {
    let eventsToShowList = props.eventsToShow;

    if (!props.numberOfHostsSelected == 0) {
        eventsToShowList = eventsToShowList.filter(event => {
            return props.hostsShown[event.host]
        })
    }

    return (
        <div className={[classes.PreviousEvents, props.eventDisplayClass].join(" ")} >
            <h4>Denna vecka</h4>

            {
                eventsToShowList.map(event => (
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
    )
}

export default PreviousEvents;
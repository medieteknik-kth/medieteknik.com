import React from 'react';
import './FeedCard.css'
import { NavLink } from 'react-router-dom';
import Api from '../../../Utility/Api.js'
import { LocaleText, localeDate } from '../../../Contexts/LocaleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faCalendar } from '@fortawesome/free-solid-svg-icons';

const EventCard = (props) => {
    const getFormattedDay = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();

        return day
    }

    const getFormattedMonth = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.toLocaleString('default', { month: 'short' });
        return month
    }


    return (
        <div className='feed-card-container'>
            <div className='feed-card'>
                <NavLink to={props.path}>
                    <div className='feed-card-img' style={{ backgroundImage: `url('${Api.Images(props.headerImage)}')` }} />
                </NavLink>
                <div className='feed-card-text'>

                    <NavLink to={props.path}>
                        <h3>{props.title}</h3>
                    </NavLink>
                    <h4><FontAwesomeIcon icon={faCalendar}/> {localeDate(props.date)}</h4>
                    <h4>
                        <FontAwesomeIcon icon={faMapMarker} /> {props.location}
                    </h4>
                    <p>
                        {props.body}
                    </p>
                    <h5 className='feed-tags'>
                        <LocaleText phrase='feed/tags' />
                        {props.tags.map(tag =>
                            <span key={tag.id}> #{tag.title}</span>
                        )}
                    </h5>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
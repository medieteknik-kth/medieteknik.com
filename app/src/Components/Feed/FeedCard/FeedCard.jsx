import React from 'react';
import { NavLink } from 'react-router-dom';
import Api from '../../../Utility/Api.js'
import { LocaleText, translate } from '../../../Contexts/LocaleContext';
import PostCard from './PostCard';
import EventCard from './EventCard';

export const itemTypes = {
    POST: "post",
    EVENT: "event"
}

// return a suitable component based on the type of feed item
const FeedCard = ({feedItem}) => {
    switch(feedItem.type){
        
        case itemTypes.POST:
            return (<PostCard
            key={feedItem.id}
                    path={'/posts/' + feedItem.id}
                    title={translate(feedItem.title)}
                    date={feedItem.date}
                    body={translate({ se: feedItem.body.se.trunc(250), en: feedItem.body.en ? feedItem.body.en.trunc(250) : '' })}
                    headerImage={feedItem.header_image}
                    tags={feedItem.tags} />)
        
        case itemTypes.EVENT:
            return (<EventCard
                key={feedItem.id}
                        path={'/events/' + feedItem.event_id}
                        title={translate(feedItem.title)}
                        date={feedItem.date}
                        body={translate({se: feedItem.description.se.trunc(250), en: feedItem.description.en ? feedItem.description.en.trunc(250): ''})}
                        headerImage={feedItem.header_image}
                        tags={feedItem.tags} 
                        location={feedItem.location}/>)
        default:
            return (<h1>unkown type</h1>)
    }
}

export default FeedCard;
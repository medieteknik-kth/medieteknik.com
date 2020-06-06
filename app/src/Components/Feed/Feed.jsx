import React, { useState, useEffect } from 'react';
import './Feed.css'
import Api from '../../Utility/Api.js'
import FeedCard, {itemTypes} from './FeedCard/FeedCard.jsx';
import { LocaleText, translate } from '../../Contexts/LocaleContext';




const Feed = (props) => {

    const [cont, setCont] = useState();

    useEffect(() => {
        // Fetch events and posts
        Promise.all([
            Api.Posts.GetAll(),
            Api.Events.GetAll()
        ]).then(([posts, events]) => {
            events.map( e => e.type = itemTypes.EVENT);
            posts.map( p => p.type = itemTypes.POST)
            // combine posts and events into array, sorted by date
            // this only works because javascript is a very wonky language
            // that doesn't care about types as long as both things are objects
            let combo = [...posts, ...events].sort((a,b) => a.date - b.date)
            setCont(combo)
        });

    }, []);

    String.prototype.trunc =
        function (n, useWordBoundary) {
            if (this.length <= n) { return this; }
            var subString = this.substr(0, n - 1);
            return (useWordBoundary
                ? subString.substr(0, subString.lastIndexOf(' '))
                : subString) + "...";
        };

    return (<div className='feed-container'>
        <h1><LocaleText phrase='feed/header' /></h1>
        <div className='feed-cards'>
            {cont ? cont.map(post =>
                <FeedCard feedItem={post}/>
            ) : <></>}
        </div>
    </div>);
}

export default Feed;
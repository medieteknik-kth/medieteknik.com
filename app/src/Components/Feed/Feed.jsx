import React, { useState, useEffect } from 'react';
import './Feed.css'
import Api from '../../Utility/Api.js'
import FeedCard, { feedTypes } from './FeedCard/FeedCard.jsx';
import { LocaleText, translate } from '../../Contexts/LocaleContext';
import Spinner from '../Common/Spinner/Spinner.jsx';

const Feed = (props) => {

    const [cont, setCont] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch events and posts
        Promise.all([
            Api.Posts.GetAll(),
            Api.Events.GetAll()
        ]).then(([posts, events]) => {
            events.map( e => e.type = feedTypes.EVENT);
            posts.map( p => p.type = feedTypes.POST)
            // combine posts and events into array, sorted by date
            // this only works because javascript is a very wonky language
            // that doesn't care about types as long as both things are objects
            let combo = [...posts, ...events].sort((a,b) => new Date(b.date) - new Date(a.date))
            setCont(combo)
            setIsLoading(false)
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
        <h2><LocaleText phrase='feed/header'/></h2>
        { isLoading ? <Spinner/> :
            <div className='feed-cards'>
                { cont ? cont.map((post, i) =>
                    <FeedCard
                        key={`${post.id}_${i}`}
                        type={post.type}
                        path={`${post.type === feedTypes.POST ? '/posts/' : '/events/'}${post.id}`}
                        title={translate(post.title)}
                        date={post.type === feedTypes.EVENT ? post.event_date : post.date}
                        location={post.location ?? null}
                        body={translate({ se: post.body.se.replace(/<\/?[^>]+(>|$)/g, "").trunc(250), en: post.body.en ? post.body.en.replace(/<\/?[^>]+(>|$)/g, "").trunc(250) : '' })}
                        headerImage={post.header_image}
                        tags={post.tags} />
                ) : <></> }
            </div> 
        }
    </div>);
}

export default Feed;
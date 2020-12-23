import React, { useState, useEffect } from 'react';
import './Feed.scss'
import Api from '../../Utility/Api.js'
import FeedCard, { feedTypes } from './FeedCard/FeedCard.jsx';
import { LocaleText, translate } from '../../Contexts/LocaleContext';
import Spinner from '../Common/Spinner/Spinner.jsx';
import Button from '../Document/ViewDocuments/Assets/ButtonRasmus';
import { Link, useHistory } from 'react-router-dom';

const Feed = (props) => {

    const [cont, setCont] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();

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
        {props.landingTitle ? <h3 className='landing-title'><span><LocaleText phrase='feed/header'/></span></h3> : <h1><LocaleText phrase='feed/header'/></h1>}
        {/* {!props.landingTitle ? <Button onClick={() => history.push("/eventList")}>Kommande event</Button> : <span />} */}
        { isLoading ? <Spinner/> :
        <div>
            <div className='feed-cards'>
                { cont ? cont.slice(0, props.landingTitle ? 6 : cont.length).map((post, i) =>
                    <FeedCard
                        key={`${post.id}_${i}`}
                        type={post.type}
                        path={`${post.type === feedTypes.POST ? '/posts/' : '/events/'}${post.id}`}
                        title={translate(post.title)}
                        date={post.type === feedTypes.EVENT ? post.event_date : post.date}
                        location={post.location ?? null}
                        body={post.body}
                        headerImage={post.header_image}
                        tags={post.tags}
                        committee={post.committee} />
                ) : <></> }
            </div>
            <div className="show-more">
                {props.landingTitle ? <Link to="/feed" className="link"><LocaleText phrase="landing/show_more" /></Link> : <span />}
            </div>
        </div>
        }
    </div>);
}

export default Feed;
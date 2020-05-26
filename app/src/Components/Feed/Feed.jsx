import React, { useState, useEffect } from 'react';
import './Feed.css'
import Api from '../../Utility/Api.js'
import FeedCard from './FeedCard/FeedCard.jsx';
import { LocaleText, translate } from '../../Contexts/LocaleContext';

const Feed = (props) => {

    const [cont, setCont] = useState();
    
    useEffect(() => {
      Api.Posts.GetAll()
        .then((data) => {
            setCont(data);
        });
    }, []);

    String.prototype.trunc =
    function(n,useWordBoundary){
        if (this.length <= n) { return this; }
        var subString = this.substr(0, n-1);
        return (useWordBoundary 
           ? subString.substr(0, subString.lastIndexOf(' ')) 
           : subString) + "...";
    };

    return (<div className='feed-container'>
            <h1><LocaleText phrase='feed/header'/></h1>
            <div className='feed-cards'>
                {cont ? cont.map(post =>
                    <FeedCard 
                        key={post.id}
                        path={'/posts/'+post.id}
                        title={translate(post.title)}
                        date={post.date}
                        body={translate({ se: post.body.se.trunc(250), en: post.body.en ? post.body.en.trunc(250) : '' })}
                        headerImage={post.header_image}
                        tags={post.tags}/>
                ): <></>}
            </div>
        </div>);
}

export default Feed;
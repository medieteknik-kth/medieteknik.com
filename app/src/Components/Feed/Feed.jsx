import React, { useState, useEffect } from 'react';
import './Feed.css'
import Api from '../../Utility/Api.js'
import FeedCard from './FeedCard/FeedCard.jsx';
import { LocaleText } from '../../Contexts/LocaleContext';

const Feed = (props) => {

    const [cont, setCont] = useState();
    
    useEffect(() => {
      Api.Posts.GetAll()
        .then((data) => {
            setCont(data);
        });
    }, []);


    return (
        <div className='feed-container'>
            <h1><LocaleText phrase='feed/header'/></h1>
            <div className='feed-cards'>
                {cont ? cont.map(post =>
                    <FeedCard 
                        key={post.id}
                        path={'/posts/'+post.id}
                        title={post.title}
                        date={post.date}
                        body={post.body}
                        headerImage={post.header_image}
                        tags={post.tags}/>
                ): <></>}
            </div>
        </div>
        );
}

export default Feed;
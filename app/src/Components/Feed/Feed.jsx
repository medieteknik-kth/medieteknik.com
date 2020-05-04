import React, { useState, useEffect } from 'react';
import './Feed.css'
import Api from '../../Utility/Api.js'
import FeedCard from './FeedCard/FeedCard.jsx';
import { LocaleText } from '../../Contexts/LocaleContext';
import Dropdown from '../Common/Form/Dropdown';
import FormTitle from '../Common/Form/FormTitle';
import Input from '../Common/Form/Input';

const Feed = (props) => {

    const [cont, setCont] = useState();
    
    useEffect(() => {
      Api.Posts.GetAll()
        .then((data) => {
            setCont(data);
        });
    }, []);


    return (<div style={{backgroundColor: '#f0f0f0', height: '100vh'}}>
        <FormTitle>Hej</FormTitle>
        <Input  onChange={(e)=> console.log(e.target.value)}></Input>
        <Dropdown options={[{label: 'Hje', value: 'OK'}]} onChange={(value)=> console.log(value)}/></div>/*
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
        </div>*/
        );
}

export default Feed;
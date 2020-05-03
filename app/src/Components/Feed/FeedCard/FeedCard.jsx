import React from 'react';
import './FeedCard.css'
import { NavLink } from 'react-router-dom';
import Api from '../../../Utility/Api.js'
import { LocaleText } from '../../../Contexts/LocaleContext';

const FeedCard = (props) => {

    String.prototype.trunc =
     function(n,useWordBoundary){
         if (this.length <= n) { return this; }
         var subString = this.substr(0, n-1);
         return (useWordBoundary 
            ? subString.substr(0, subString.lastIndexOf(' ')) 
            : subString) + "...";
    };

    return (
        <div className='feed-card-container'>
            <div className='feed-card'>
                <NavLink to={props.path}>
                    <div className='feed-card-img' style={{backgroundImage: `url('${Api.Images(props.headerImage)}')`}}/>
                </NavLink>
                <div className='feed-card-text'>
                    <NavLink to={props.path}>
                        <h3>{props.title}</h3>
                    </NavLink>
                    <h4>{props.date}</h4>
                    <p>
                        {props.body.trunc(250)}
                    </p>
                    <h5 className='feed-tags'>
                    <LocaleText phrase='feed/tags'/>
                    {props.tags.map(tag=>
                        <span key={tag.id}> #{tag.title}</span>
                    )}
                    </h5>
                </div>
            </div>
        </div>
    );
}

export default FeedCard;
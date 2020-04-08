import React from 'react';
import './Post.css'
import YellowButton from '../Common/YellowButton/YellowButton'
import ProfileCard from '../Common/ProfileCard/ProfileCard';

const Post = (props) => {
    return <div className='post-container'>
      <div className='post-content-cont'>
        <h5 className='post-go-back'>
          Tillbaka till inlägg
        </h5>
        <div className='post-content'>
          <div className='post-header'>
            <h1>{props.post.title}</h1>
            <h5>{props.post.date}</h5>
          </div>
          <img src={props.post.img}/>
          <p>
            {props.post.body}
          </p>
          <YellowButton>{props.post.btnDesc}</YellowButton>
          <div className='post-footer'>
            <h5>Taggar:
              {props.post.tags.map(tag=>
                <span className='post-tag'> #{tag}</span>
              )}
            </h5>
            <ProfileCard userId={props.post.userId}/>
          </div>
        </div>
      </div>
    </div>
}

export default Post;
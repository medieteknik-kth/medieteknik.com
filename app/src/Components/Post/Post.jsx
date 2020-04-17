import React, { useState, useEffect } from 'react';
import './Post.css'
import ProfileCard from '../Common/ProfileCard/ProfileCard';
import { useParams } from 'react-router-dom';
import Api from '../../Utility/Api.js'

const Post = (props) => {

    const { id } = useParams();
    const [post, setPost] = useState();
    
    useEffect(() => {
      Api.Posts.GetById(id)
        .then((data) => {
          setPost(data);
        });
    }, []);

    return (post ? <div className='post-container'>
      <div className='post-content-cont'>
        <h5 className='post-go-back'>
          Tillbaka till inlägg
        </h5>
        <div className='post-content'>
          <div className='post-header'>
            <h1>{post.title}</h1>
            <h5>{`${post.date} ${post.edited.slice(-1)[0] ? '(edited ' + post.edited.slice(-1)[0].date + ')' : ''}`}</h5>
          </div>
          { post.header_image ? 
            <div className='img-container'>
              <img src={Api.Images(post.header_image)}/>
            </div>
            : <></>
          }
          <p className='post-body'>
            {post.body}
          </p>
          <div className='post-footer'>
            <ProfileCard userId={post.user_id} committeeId={post.committee_id} />
          </div>
        </div>
      </div>
    </div> : <></> )
}

export default Post;
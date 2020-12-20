import React, { useState, useEffect, useContext } from 'react';
import './Post.css';
import { useParams, NavLink } from 'react-router-dom';
import ProfileCard from '../Common/ProfileCard/ProfileCard';
import Api from '../../Utility/Api.js';
import {
  LocaleText,
  LocaleContext,
  translate,
  translateToString,
} from '../../Contexts/LocaleContext';
import BasePage from '../Page/BasePage';
import Article from '../Common/Article/Article';

const Post = (props) => {
  const { id } = useParams();
  const [post, setPost] = useState();
  const { lang } = useContext(LocaleContext);

  useEffect(() => {
    Api.Posts.GetById(id).then((data) => {
      setPost(data);
    });
  }, []);

  return post ? (
    <Article title={translate(post.title)} linkPath="/feed" backLabelPhrase="feed/post/go_back">
      <div className="post-content">
        {post.header_image ? (
          <div className="img-container">
            <img src={post.header_image} alt={translate(post.title)} />
          </div>
        ) : (
          <></>
        )}
        <p className="post-body">
          <BasePage
            onChange={() => {}}
            initialContent={translateToString({
              ...post.body,
              lang,
            })}
          />
        </p>
        <div className="post-footer">
          <h5>
            <LocaleText phrase="feed/published" />
            {' '}
            {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h5>
          <div className="post-tags">
            <h5>
              {post.tags.length > 0 ? (
                <>
                  <LocaleText phrase="feed/tags" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="post-tag"
                    >
                      {' '}
#
                      {tag.title}
                    </span>
                  ))}
                </>
              ) : (
                <></>
              )}
            </h5>
          </div>
          <ProfileCard
            userId={post.user_id}
            committeeId={post.committee_id}
          />
        </div>
      </div>
    </Article>
  ) : (
    <></>
  );
};

export default Post;

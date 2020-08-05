import React, { useState, useEffect, useContext } from 'react'
import './Post.css'
import ProfileCard from '../Common/ProfileCard/ProfileCard'
import { useParams, NavLink } from 'react-router-dom'
import Api from '../../Utility/Api.js'
import {
    LocaleText,
    LocaleContext,
    translate,
    translateToString,
} from '../../Contexts/LocaleContext'
import BasePage from '../Page/BasePage'

const Post = (props) => {
    const { id } = useParams()
    const [post, setPost] = useState()
    const { lang } = useContext(LocaleContext)

    useEffect(() => {
        Api.Posts.GetById(id).then((data) => {
            setPost(data)
        })
    }, [])

    return post ? (
        <div className="post-container">
            <div className="post-content-cont">
                <div className="post-over">
                    <h5 className="post-go-back">
                        <NavLink to="/feed">
                            <LocaleText phrase="feed/post/go_back" />
                        </NavLink>
                    </h5>
                </div>
                <div className="post-content">
                    <div className="post-header">
                        <h1>{translate(post.title)}</h1>
                        <h5>{post.date}</h5>
                    </div>
                    {post.header_image ? (
                        <div className="img-container">
                            <img src={Api.Images(post.header_image)} />
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
                                                #{tag.title}
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
            </div>
        </div>
    ) : (
        <></>
    )
}

export default Post

import React from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleText, localeDate } from '../../../Contexts/LocaleContext'
import './FeedCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker, faCalendar } from '@fortawesome/free-solid-svg-icons'
import Api from '../../../Utility/Api.js'

export const feedTypes = {
    POST: 'post',
    EVENT: 'event',
}

const FeedCard = (props) => {
    return (
        <NavLink to={props.path}>
            <div className="feed-card-container">
                <div className="feed-card">
                    <div
                        className="feed-card-img"
                        style={{
                            backgroundImage: `url('${Api.Images(
                                props.headerImage
                            )}')`,
                        }}
                    />
                    <div className="feed-card-text">
                        <h4>{props.title}</h4>
                        {props.type === feedTypes.EVENT ? (
                            <>
                                <h5>
                                    <FontAwesomeIcon icon={faCalendar} />{' '}
                                    {localeDate(props.date)}
                                </h5>
                                <h5>
                                    <FontAwesomeIcon icon={faMapMarker} />{' '}
                                    {props.location}
                                </h5>
                            </>
                        ) : (
                            <h5>{localeDate(props.date)}</h5>
                        )}
                        <p>{props.body}</p>
                        {props.type === feedTypes.POST ? (
                            <h6 className="feed-rb">-</h6>
                        ) : (
                            <></>
                        )}
                        <h5 className="feed-tags">
                            {props.tags.length > 0 ? (
                                <>
                                    <LocaleText phrase="feed/tags" />
                                    {props.tags.map((tag) => (
                                        <span key={tag.title}>
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
                </div>
            </div>
        </NavLink>
    )
}

export default FeedCard

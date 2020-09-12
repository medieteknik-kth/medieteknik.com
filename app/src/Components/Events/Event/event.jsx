import React, { useState, useEffect, useContext } from 'react'
import './event.css'
import ProfileCard from '../../Common/ProfileCard/ProfileCard'
import { useParams, NavLink } from 'react-router-dom'
import Api from '../../../Utility/Api'
import {
    LocaleText,
    translate,
    localeDate,
    translateToString,
    LocaleContext,
} from '../../../Contexts/LocaleContext'
import CommitteeCard from '../../Common/CommitteeCard/CommitteeCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker, faClock } from '@fortawesome/free-solid-svg-icons'
import BasePage from '../../Page/BasePage'

const Event = ({}) => {
    const { id } = useParams()
    const [event, setEvent] = useState()
    const { lang } = useContext(LocaleContext)

    useEffect(() => {
        Api.Events.GetById(id).then((event) => setEvent(event))
    }, [])

    const getTime = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return event ? (
        <div className="event-container">
            <div className="event-content-container">
                <div className="event-over">
                    <h5 className="event-back">
                        <NavLink to="/feed">
                            <LocaleText phrase="feed/post/go_back" />
                        </NavLink>
                    </h5>
                </div>
                <div className="event-content">
                    <div className="event-header">
                        <h2>{translate(event.title)}</h2>
                        <h5>{localeDate(event.date)}</h5>
                        <h5>
                            <FontAwesomeIcon icon={faClock} />{' '}
                            {getTime(event.date)}
                        </h5>
                        <h5>
                            <FontAwesomeIcon icon={faMapMarker} />{' '}
                            {event.location}
                        </h5>
                    </div>
                    {event.header_image ? (
                        <div className="img-container">
                            <img src={Api.Images(event.header_image)} />
                        </div>
                    ) : (
                        <></>
                    )}
                    <p className="event-description">
                        <BasePage
                            onChange={() => {}}
                            initialContent={translateToString({
                                ...event.body,
                                lang,
                            })}
                        />
                    </p>
                    <div className="event-footer">
                        <div className="event-tags">
                            <h5>
                                {event.tags.length > 0 ? (
                                    <>
                                        <LocaleText phrase="feed/tags" />
                                        {event.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="event-tag"
                                            >
                                                #{tag.title}
                                            </span>
                                        ))}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </h5>
                        </div>
                        {event.committee_id ? (
                            <CommitteeCard committeeId={event.committee_id} />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    )
}
export default Event

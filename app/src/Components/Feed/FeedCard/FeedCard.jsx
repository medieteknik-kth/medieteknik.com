import React from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleText, localeDate } from '../../../Contexts/LocaleContext'
import './FeedCard.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMarker, faPizzaSlice } from '@fortawesome/free-solid-svg-icons'
import Api from '../../../Utility/Api.js'
import CalendarIcon from '../../Common/Form/Assets/form-date.png'
import LocationIcon from '../../Common/Form/Assets/form-location.svg'

export const feedTypes = {
    POST: 'post',
    EVENT: 'event',
}

const FeedCard = (props) => {
    const getPreCard = () => {
        switch (props.type) {
            case feedTypes.EVENT:
                return { title: 'Event', icon: faPizzaSlice }
                break
            default:
                return { title: 'Inlägg', icon: faMarker }
                break
        }
    }
    console.log(props)

    return (
        <NavLink to={props.path}>
            <div className="feed-card-pre">
                <p className="feed-card-title">{getPreCard().title}</p>
                {/* <div className="feed-card-tag">
                    <FontAwesomeIcon
                        icon={getPreCard().icon}
                        color={'#f0c900'}
                        size="lg"
                    />
                </div> */}
            </div>
            <div className="feed-card-container">
                <div className="feed-card">
                    <div
                        className="feed-card-img"
                        style={{
                            backgroundImage: `url('${
                                props.headerImage
                            }')`,
                        }}
                    />
                    <div className="feed-card-text">
                        <h4>{props.title}</h4>
                        {props.type === feedTypes.EVENT ? (
                            <div className="feed-card-attr">
                                <p>
                                    <img src={CalendarIcon} alt="" />
                                    {localeDate(props.date)}
                                </p>
                                <p>
                                    <img src={LocationIcon} alt="" />
                                    {props.location}
                                </p>
                                <p>
                                    {props.committee ? (
                                        <>
                                            <img
                                                src={props.committee.logo}
                                                alt=""
                                            />
                                            {props.committee.name}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </p>
                            </div>
                        ) : (
                            <p className="feed-card-desc">{props.body}</p>
                        )}
                        {props.type === feedTypes.POST ? (
                            <h6 className="feed-rb">-</h6>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default FeedCard

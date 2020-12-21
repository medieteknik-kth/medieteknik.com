import React, { useState, useEffect, useContext } from 'react';
import './event.css';
import { useParams, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faClock } from '@fortawesome/free-solid-svg-icons';
import ProfileCard from '../../Common/ProfileCard/ProfileCard';
import Api from '../../../Utility/Api';
import {
  LocaleText,
  translate,
  localeDate,
  translateToString,
  LocaleContext,
} from '../../../Contexts/LocaleContext';
import CommitteeCard from '../../Common/CommitteeCard/CommitteeCard';
import BasePage from '../../Page/BasePage';
import Article from '../../Common/Article/Article';

const Event = ({}) => {
  const { id } = useParams();
  const [event, setEvent] = useState();
  const { lang } = useContext(LocaleContext);

  useEffect(() => {
    Api.Events.GetById(id).then((event) => setEvent(event));
  }, []);

  const getTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(lang === 'en' ? 'en-US' : 'sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return event ? (
    <Article title={translate(event.title)} linkPath="/feed" backLabelPhrase="feed/post/go_back">
      <div className="event-content">
        {event.header_image ? (
          <div className="img-container">
            <img src={event.header_image} />
          </div>
        ) : (
          <></>
        )}
        <div className="event-header">
          <h5>{localeDate(event.date)}</h5>
          <h5>
            <FontAwesomeIcon icon={faClock} />
            {' '}
            {getTime(event.date)}
          </h5>
          <h5>
            <FontAwesomeIcon icon={faMapMarker} />
            {' '}
            {event.location}
          </h5>
        </div>
        <p className="event-description">
          <BasePage
            onChange={() => {}}
            initialContent={JSON.parse(translateToString({
              ...event.body,
              lang,
            }))}
          />
        </p>
        <div className="event-footer">
          <h5>
            <LocaleText phrase="feed/published" />
            {' '}
            {new Date(event.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'sv-SE', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </h5>
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
            userId={event.user_id}
            committeeId={event.committee_id}
          />
        </div>
      </div>
    </Article>
  ) : (
    <></>
  );
};
export default Event;

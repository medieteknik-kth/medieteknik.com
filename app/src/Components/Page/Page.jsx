import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';
import BasePage from './BasePage';
import Api from '../../Utility/Api';
import NotFound from '../NotFound/NotFound';
import { UserContext } from '../../Contexts/UserContext';
import { LocaleContext } from '../../Contexts/LocaleContext';

import './Page.css';

export default function Page() {
  const { pageSlug } = useParams();
  const [page, setPage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(null);

  const { user } = useContext(UserContext);
  const { lang } = useContext(LocaleContext);

  useEffect(() => {
    Api.Pages.GetById(pageSlug).then((data) => {
      setPage(data);
    }).catch(() => {
      setNotFound(true);
    });
  }, []);

  const noContent = (notFound ? <NotFound /> : <div />);

  const onChange = (newContent) => {
    setContent(newContent);
  };

  const didPressEditButton = () => {
    if (isEditing) {
      Api.Pages.Update(page.id, {
        content_sv: JSON.stringify(content),
        published: true,
      });
    }

    setIsEditing(!isEditing);
  };

  return (
    <div>
      { user !== null
        ? (
          <button type="button" className="committeePageEditButton" onClick={didPressEditButton}>
            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} color="black" size="lg" />
          </button>
        )
        : <div />}
      <div className="pageContainer">
        { page !== null
          ? <BasePage initialContent={page !== null ? JSON.parse(lang === 'se' ? page.content_sv : page.content_en) : ''} isEditing={isEditing} onChange={onChange} />
          : noContent}
      </div>
    </div>
  );
}

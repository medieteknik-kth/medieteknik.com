import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';
import BasePage from './BasePage';
import Api from '../../Utility/Api';
import NotFound from '../NotFound/NotFound';
import { UserContext } from '../../Contexts/UserContext';
import { LocaleContext } from '../../Contexts/LocaleContext';
import Spinner from '../Common/Spinner/Spinner';

import './Page.css';
import CommitteeMemberList from '../Committee/CommitteeMemberList/CommitteeMemberList';

export default function Page() {
  const { pageSlug } = useParams();
  const [page, setPage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(UserContext);
  const { lang } = useContext(LocaleContext);

  useEffect(() => {
    Api.Pages.GetById(pageSlug).then((data) => {
      setIsLoading(false);
      setPage(data);
    }).catch(() => {
      setIsLoading(false);
      setNotFound(true);
    });
  }, []);

  const noContent = (notFound ? <div className="pageContent"><NotFound /></div> : <div />);

  const onChange = (newContent) => {
    setContent(newContent);
  };

  const didPressEditButton = () => {
    if (isEditing && content != null) {
      setIsLoading(true);
      Api.Pages.Update(page.id, {
        content_sv: JSON.stringify(content),
        published: true,
      }).then((data) => {
        const editedPage = page;
        editedPage.content_sv = JSON.stringify(content);
        setIsLoading(false);
        setIsEditing(false);
        setPage(editedPage);
      }).catch((error) => {
        if (error.status === 401) {
          alert((lang === 'se' ? "Du får inte redigera denna sida. Kontakta webmaster@medieteknik.com om något inte stämmer!" : "You are not allowed to edit this page. Contact webmaster@medieteknik.com if something is not right!"));
        }
        else {
          alert((lang === 'se' ? "Kunde inte spara sida." : "Could not save page."));
        }

        const editedPage = page;
        editedPage.content_sv = JSON.stringify(content);
        setIsLoading(false);
        setIsEditing(true);
        setPage(editedPage);
      });
    }

    setIsEditing(!isEditing);
  };

  return (
    <div>
      { isLoading ? <div style={{ marginTop: '150px' }}><Spinner /></div>
        : (
          <div>
            { user !== null
              ? (
                <button type="button" className="pageEditButton" onClick={didPressEditButton}>
                  <FontAwesomeIcon icon={isEditing ? faSave : faEdit} color="black" size="lg" />
                </button>
              )
              : <div />}
            <div className="pageContainer">
              { page !== null
                ? (
                  <div>
                    { page.image !== null ? <img src={page.image} alt={page.title} className="pageImage" /> : <div /> }
                    { page.committee !== null
                      ? (
                        <div className="committeePageLogoContainer">
                          <img className="committeePageLogo" alt={page.committee.name} src={page.committee.logo} />
                        </div>
                      )
                      : <span /> }
                    <div className="pageContent">
                      <BasePage
                        initialContent={page !== null ? JSON.parse(lang === 'se' ? page.content_sv : page.content_en) : ''}
                        isEditing={isEditing}
                        onChange={onChange}
                      />
                      {
                  page.committee !== null ? <CommitteeMemberList posts={page.committee.posts} /> : <span />
                }
                    </div>
                  </div>
                )
                : noContent}
            </div>
          </div>
        )}
    </div>
  );
}

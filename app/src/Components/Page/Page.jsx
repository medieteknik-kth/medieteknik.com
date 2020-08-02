import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Prompt } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave, faEdit, faImage, faTrash,
} from '@fortawesome/free-solid-svg-icons';
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
  const [newHeader, setNewHeader] = useState(null);
  const [hasClearedImage, setHasClearedImage] = useState(false);

  const { user } = useContext(UserContext);
  const { lang } = useContext(LocaleContext);

  const onBeforeUnload = (event) => {
    if (isEditing) {
      event.preventDefault();
      event.returnValue = (lang === 'se' ? 'Du har osparade ändrigar.' : 'You have unsaved changes.');
    }
  };

  useEffect(() => {
    Api.Pages.GetById(pageSlug).then((data) => {
      setIsLoading(false);
      setPage(data);
    }).catch(() => {
      setIsLoading(false);
      setNotFound(true);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [isEditing]);

  const noContent = (notFound ? <div className="pageContent"><NotFound /></div> : <div />);

  const onChange = (newContent) => {
    setContent(newContent);
  };

  const didPressEditButton = () => {
    if (isEditing && (content != null || newHeader != null || hasClearedImage)) {
      setIsLoading(true);
      const dataToSend = {
        published: true,
      };

      if (content != null) {
        dataToSend.content_sv = JSON.stringify(content);
      } else {
        dataToSend.content_sv = page.content_sv;
      }

      if (newHeader != null) {
        dataToSend.image = newHeader;
      } else {
        dataToSend.image = page.image;
      }

      if (hasClearedImage) {
        dataToSend.image = null;
      }

      Api.Pages.Update(page.id, dataToSend).then((data) => {
        const editedPage = page;
        editedPage.content_sv = dataToSend.content_sv;
        editedPage.image = dataToSend.image;
        setIsLoading(false);
        setIsEditing(false);
        setHasClearedImage(false);
        setPage(editedPage);
      }).catch((error) => {
        if (error.status === 401) {
          alert((lang === 'se' ? 'Du får inte redigera denna sida. Kontakta webmaster@medieteknik.com om något inte stämmer!' : 'You are not allowed to edit this page. Contact webmaster@medieteknik.com if something is not right!'));
        } else {
          alert((lang === 'se' ? 'Kunde inte spara sida.' : 'Could not save page.'));
        }

        const editedPage = page;
        editedPage.content_sv = dataToSend.content_sv;
        editedPage.image = dataToSend.image;
        setIsLoading(false);
        setIsEditing(true);
        setHasClearedImage(false);
        setPage(editedPage);
      });
    }

    setIsEditing(!isEditing);
  };

  const didSelectNewImage = (event) => {
    const { files } = event.target;
    if (files && files.length) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setNewHeader(fileReader.result);
        setHasClearedImage(false);
      };
      fileReader.readAsDataURL(files[0]);
    }
  };

  const didPressRemoveImageButton = () => {
    if (window.confirm((lang === 'se' ? 'Är du säker att du vill ta bort bilden?' : 'Are you sure you want to remove the image?'))) {
      setHasClearedImage(true);
      setNewHeader(null);
    }
  };

  const hasImage = page !== null && (page.image !== null || newHeader !== null) && !hasClearedImage;

  return (
    <div>
      <Prompt when={isEditing && (content != null || newHeader != null || hasClearedImage)} message={lang === 'se' ? 'Du har osparade ändrigar.' : 'You have unsaved changes.'} />
      { isLoading ? <div style={{ marginTop: '150px' }}><Spinner /></div>
        : (
          <div>
            { page !== null && user !== null
              ? (
                <button type="button" className="pageEditButton" onClick={didPressEditButton}>
                  <FontAwesomeIcon icon={isEditing ? faSave : faEdit} color="black" size="lg" />
                </button>
              )
              : <div />}
            { page !== null && page.committee !== null && !hasImage ? <div style={{ marginTop: '200px' }} /> : <div />}
            <div className="pageContainer">
              { page !== null
                ? (
                  <div>
                    {isEditing
                      ? (
                        <div>
                          <input id="imageHeaderUpload" type="file" onChange={didSelectNewImage} />
                          <label htmlFor="imageHeaderUpload" className="pageEditButton pageEditImageButton">
                            <FontAwesomeIcon icon={faImage} color="black" size="lg" />
                          </label>
                          { hasImage
                            ? (
                              <button type="button" className="pageEditButton pageRemoveImageButton" onClick={didPressRemoveImageButton}>
                                <FontAwesomeIcon icon={faTrash} color="black" size="lg" />
                              </button>
                            )
                            : <div />}
                        </div>
                      )
                      : <span /> }
                    { hasImage ? <img src={newHeader == null ? page.image : newHeader} alt={page.title} className="pageImage" /> : <div /> }
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

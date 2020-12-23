import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LocaleText } from '../../Contexts/LocaleContext';
import { UserContext } from '../../Contexts/UserContext';
import Api from '../../Utility/Api';

import './NotFound.scss';

export default function NotFound() {
  const { pageSlug } = useParams();
  const { user } = useContext(UserContext);

  const pageName = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);

  const createNewPage = () => {
    Api.Pages.Create({
      title: pageName,
      published: true,
    }).then(() => {
      window.location.reload();
    }).error((error) => {
      console.error(error);
    });
  };

  return (
    <div className="notFoundContainer">
      <h1><LocaleText phrase="page/page_not_found" /></h1>
      { user !== null && user.currentTerms[0].user.isAdmin
        ? (
          <a className="createNewPageButton" onClick={createNewPage}>
            <LocaleText phrase="page/create-page" />
            {` "${pageName}"`}
          </a>
        )
        : <span />}
    </div>
  );
}

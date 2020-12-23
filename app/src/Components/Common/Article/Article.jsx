import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { LocaleText } from '../../../Contexts/LocaleContext';

import './Article.scss';
import { useHistory } from 'react-router-dom';

export default function Article({
  title, children, linkPath, backLabelPhrase,
}) {
  const history = useHistory();

  return (
    <div className="articleContainer">
      <h1>{title}</h1>
      <article>
        { linkPath !== undefined
          ? (
            <button type="button" onClick={() => history.push(linkPath)} className="backButton">
              <FontAwesomeIcon icon={faArrowLeft} />
              {' '}
              <LocaleText phrase={backLabelPhrase !== undefined ? backLabelPhrase : 'common/back'} />
            </button>
          )
          : <span />}
        <div className="articleContent">{children}</div>
      </article>
    </div>
  );
}

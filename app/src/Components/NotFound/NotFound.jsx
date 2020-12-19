import React from 'react';
import { LocaleText } from '../../Contexts/LocaleContext';

import './NotFound.scss';

export default function NotFound() {
  return (
    <div className="notFoundContainer">
      <h1><LocaleText phrase="page/page_not_found" /></h1>
    </div>
  );
}

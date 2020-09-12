import React from 'react';
import { LocaleText } from '../../Contexts/LocaleContext';

export default function NotFound() {
  return (
    <div>
      <h2><LocaleText phrase="page/page_not_found" /></h2>
    </div>
  );
}

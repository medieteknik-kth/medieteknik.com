import React from 'react';
import { LocaleText } from '../../Contexts/LocaleContext';

export default function NotFound() {
  return (
    <div>
      <h1><LocaleText phrase="common/page_not_found" /></h1>
    </div>
  );
}

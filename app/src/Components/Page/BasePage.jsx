import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './BasePage.scss';

export default function BasePage({initialContent, isEditing, onChange}) {
  const didEditText = (_content, _delta, _source, editor) => {
    onChange(editor.getContents());
  };

  return (
    <ReactQuill theme="snow" className={isEditing ? 'base-page editorIsEditing' : 'base-page'} defaultValue={initialContent} onChange={didEditText} readOnly={!isEditing} />
  );
}

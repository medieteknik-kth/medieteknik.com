import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './Page.css';

export default function Page({initialContent, isEditing, onChange}) {
  const didEditText = (_content, _delta, _source, editor) => {
    onChange(editor.getContents());
  };

  return (
    <ReactQuill theme="snow" className={isEditing ? 'editorIsEditing' : ''} defaultValue={initialContent} onChange={didEditText} readOnly={!isEditing} />
  );
}

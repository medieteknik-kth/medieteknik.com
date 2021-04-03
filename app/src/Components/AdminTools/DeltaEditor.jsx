import React, { useEffect, useState } from 'react';
import {
  useInput,
} from 'react-admin';
import ReactQuill from 'react-quill';

export default function DeltaEditor(props) {
  const {
    input: { value, onChange },
  } = useInput(props);

  let parsedValue;
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    parsedValue = '';
  }


  return (
    <ReactQuill
      theme="snow"
      defaultValue={parsedValue}
      onChange={(_content, _delta, _source, editor) => onChange(JSON.stringify(editor.getContents()))}
    />
  );
}

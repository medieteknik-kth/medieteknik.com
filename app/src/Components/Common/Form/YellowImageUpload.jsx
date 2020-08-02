import React from 'react';
import './YellowImageUpload.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const YellowImageUpload = ({onChange}) => {
  const [file, setFile] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const _handleImageChange = (e) => {
    e.preventDefault()

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setFile(file);
      setPreviewUrl(reader.result);
      onChange(file)
    };

    if(file) reader.readAsDataURL(file);
  };

  const _clearImage = () => {
    setFile('');
    setPreviewUrl('');
  };

  return (
    <div className='yellow-image-upload'>
      <div
        className='image-upload-box'
        style={{ backgroundImage: `url('${previewUrl}')` }}
      >
        {file ? (
          <div className='cancel-image-upload'>
            <label for='file-upload'></label>
            <span>
              <FontAwesomeIcon
                size='2x'
                icon={faTimes}
                color='#f0c900'
                onClick={_clearImage}
              />
            </span>
          </div>
        ) : (
          <label for='file-upload'>
            <FontAwesomeIcon size='2x' icon={faPlus} color='#f0c900' />
          </label>
        )}
      </div>
      <input
        id='file-upload'
        type='file'
        onChange={_handleImageChange}
      />
    </div>
  );
};

export default YellowImageUpload;

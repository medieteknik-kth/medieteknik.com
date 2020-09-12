import React, { Fragment, useEffect, useState } from 'react';
import './Gallery.css';
import AlbumPreview from './AlbumPreview/AlbumPreview';
import { LocaleText } from '../../Contexts/LocaleContext';

import Api from '../../Utility/Api';


const Gallery = () => {
  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    Api.Albums.GetAll().then((albums) => {
        setAlbums(albums);
    });
  }, []);

  return (
    (albums == null ? <div />
      : (
        <div>
          <div className="gallery-header">
            <h2>
              <LocaleText phrase="gallery/gallery_header" />
            </h2>
          </div>
          <div className="gallery-content">
            {albums.map((album, index) => <AlbumPreview key={index} title={album.title} images={album.images} />)}
          </div>
        </div>
      ))
  );
};

export default Gallery;

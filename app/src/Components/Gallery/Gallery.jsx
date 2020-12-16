import React, { Fragment, useEffect, useState } from 'react';
import classes from './Gallery.module.scss';
import AlbumPreview from './AlbumPreview/AlbumPreview';

import SideMenu from './SideMenu/sideMenu';

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
        <div className={classes.Gallery}>
            <SideMenu />
            {(albums == null ? <div /> : 
                (
                    <div>
                        <div className={classes.galleryHeader}>
                            <h2>
                                <LocaleText phrase="gallery/gallery_header" />
                            </h2>
                        </div>
                        <div className={classes.galleryContent}>
                            {albums.map((album, index) => <AlbumPreview key={index} title={album.title} images={album.images} />)}
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default Gallery;

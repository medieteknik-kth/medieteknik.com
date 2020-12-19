import React, { useContext, useState, useEffect } from 'react';
import classes from './ViewGallery.module.scss';
import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import SideMenu from '../SideMenu/sideMenu';
import AlbumPreview from './AlbumPreview/AlbumPreview';

import Api from '../../../Utility/Api';

const ViewGallery = () => {
    const [albums, setAlbums] = useState(null);
    const { lang } = useContext(LocaleContext);

    useEffect(() => {
        Api.Albums.GetAll().then((albums) => {
            setAlbums(albums);
        });
    }, []);

    return (
        <div className={classes.galleryContainer}>
            <SideMenu />
            {(albums == null ? <div /> : 
                (
                    <div className={classes.galleryContent}>
                        {albums.map((album, index) => <AlbumPreview key={index} title={album.title} images={album.images} videos={album.videos} />)}
                    </div>
                ))
            }
        </div>
    )
    
}

export default ViewGallery;
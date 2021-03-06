import React, { useEffect, useState, useContext } from 'react';
import classes from './Gallery.module.scss';

import {
    LocaleContext,
    translateToString,
} from '../../Contexts/LocaleContext';

import { UserContext } from '../../Contexts/UserContext';

import SwitchButton from '../Common/Buttons/RoundedTextButton/RoundedTextButton';
import AlbumUpload from './AlbumUpload/AlbumUpload';
import ViewGallery from './ViewGallery/ViewGallery';

const Gallery = () => {
    
    const [viewGallery, setViewGallery] = useState(true);
    const { lang } = useContext(LocaleContext);
    const { user } = useContext(UserContext);


    return (
        <div className={classes.Gallery}>
        { user !== null ?
            <SwitchButton 
                onClick={() => {
                    setViewGallery(!viewGallery);
                }}
                extraClass={classes.switchButton}
                text = {
                    viewGallery ? 
                        translateToString({
                            se: 'Ladda upp +',
                            en: 'Upload +',
                            lang,
                        }) 
                    : 
                        translateToString({
                            se: 'Bläddra',
                            en: 'Browse',
                            lang,
                        })
                }
            />
        : <span /> }

            <h2>
                {
                    viewGallery ?
                        translateToString({
                            se: 'Mediagalleri',
                            en: 'Media Gallery',
                            lang,
                        }) 
                    : 
                        translateToString({
                            se: 'Ladda upp bilder & filmer',
                            en: 'Upload images & videos',
                            lang,
                        })
                }
            </h2>
            
            {viewGallery ? <ViewGallery /> : <AlbumUpload />}
        </div>
    )
};

export default Gallery;

import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import classes from './AlbumPreview.module.scss';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

import CustomBuildSwiper from '../../Swiper/Swiper';
import { NavLink } from 'react-router-dom';
import TextButton from '../../../Common/Buttons/RoundedTextButton/RoundedTextButton';

const AlbumPreview = (props) => {
    const { lang } = useContext(LocaleContext);
    const history = useHistory();

    return (<div style={{paddingBottom: '2em'}}>
        <div className={classes.albumHeaderContainer}>
            <NavLink to={`/album/${props.id}`}>
                <span className={classes.albumHeader}>
                    {props.title}
                </span>
            </NavLink>

            <TextButton 
                text = {translateToString({
                    se: 'Öppna album',
                    en: 'Open album',
                    lang,
                })}
                onClick = {() => history.push(`album/${props.id}`)}
                extraStyle = {{"height":"1.5rem"}}
            />
        </div>
        
        <CustomBuildSwiper 
            images={props.images}
            videos={props.videos}
            title={props.title}
            viewImage = {props.viewImage}
            viewVideo = {props.viewVideo}
            albumId = {props.id}
        />
    </div>);
}

export default AlbumPreview;
import React from 'react';
import classes from './AlbumPreview.module.scss';

import CustomBuildSwiper from '../../Swiper/Swiper';
import { NavLink } from 'react-router-dom';
import TextButton from '../../../Common/Buttons/RoundedTextButton/RoundedTextButton';

const AlbumPreview = (props) => {
    return (<div style={{paddingBottom: '2em'}}>
        <div>
            <NavLink to={`/album/${props.id}`}>
                <h3 className={classes.albumHeader}>
                    {props.title}
                </h3>
            </NavLink>

            <TextButton 
            
            />
        </div>
        
        
        <CustomBuildSwiper 
            title={props.title} 
            images={props.images}
        />
    </div>);
}

export default AlbumPreview;
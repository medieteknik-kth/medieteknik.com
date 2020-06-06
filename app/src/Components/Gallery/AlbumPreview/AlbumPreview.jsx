import React from 'react';
import CustomBuildSwiper from '../Swiper/Swiper';
import { NavLink } from 'react-router-dom';

const AlbumPreview = (props) => {
    return (<div style={{paddingBottom: '2em'}}>
        <NavLink to='/album/1'>
            <h3>{props.title}</h3>
        </NavLink>
        <CustomBuildSwiper title={props.title} images={props.images}/>
    </div>);
}

export default AlbumPreview;
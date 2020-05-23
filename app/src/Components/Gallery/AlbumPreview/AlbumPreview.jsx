import React from 'react';
import './AlbumPreview.css'
import CustomBuildSwiper from '../Swiper/Swiper';

const AlbumPreview = (props) => {
    return (<div className='album-preview'>
                <h3>{props.title}</h3>
                <CustomBuildSwiper images={props.images}/>
            </div>);
}

export default AlbumPreview;
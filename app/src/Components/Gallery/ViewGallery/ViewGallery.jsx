import React, { useContext, useState, useEffect } from 'react';
import classes from './ViewGallery.module.scss';
import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';


// --- Components ---
import SideMenu from '../SideMenu/SideMenu';
import AlbumPreview from './AlbumPreview/AlbumPreview';
import FilterButton from '../../Common/Buttons/FilterButton/FilterButton';

import Api from '../../../Utility/Api';

const ViewGallery = () => {
    const [albums, setAlbums] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const { lang } = useContext(LocaleContext);
    const [mediasSelected, setMediasSelected] = useState({
        "images": false,
        "videos": false
    });
    const [numberOfMediasViewed, setNumberOfMediasViewed] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        Api.Albums.GetAll().then((albums) => {
            setAlbums(albums);
            console.log(albums);
        });
    }, []);

    const chosenMediaHandler = (clickedMediaType) => {
        const tempMediasSelected = {...mediasSelected};

        if (tempMediasSelected[clickedMediaType]) {
            tempMediasSelected[clickedMediaType] = false;
            setNumberOfMediasViewed(numberOfMediasViewed - 1);
        } else {
            tempMediasSelected[clickedMediaType] = true;
            setNumberOfMediasViewed(numberOfMediasViewed + 1);
        }

        setMediasSelected(tempMediasSelected);
    }

    const handleSearch = (searchString) => {
        setSearchInput(searchString.toUpperCase());
    }

    const clearMediaTypesHandler = () => {
        setMediasSelected({
            "images": false,
            "videos": false
        });
        setNumberOfMediasViewed(0);
    }

    const closeFilterHandler = () => {
        setShowFilter(false);
    }


    // ---

    let viewImages, viewVideos;

    if (mediasSelected['images'] || numberOfMediasViewed === 0) {
        viewImages = true;
    }

    if (mediasSelected['videos'] || numberOfMediasViewed === 0) {
        viewVideos = true;
    }

    return (
        <div className={classes.galleryContainer}>
            <FilterButton 
                colorTheme = "light"
                onClick = {() => setShowFilter(true)}
                extraClasses = {[classes.filterButton]}
            />

            <SideMenu 
                mediasSelected = {mediasSelected}
                numberOfMediasViewed = {mediasSelected}
                chosenMediaHandler = {chosenMediaHandler}
                handleSearch = {handleSearch}
                clearMediaTypesHandler = {clearMediaTypesHandler}
                showFilter = {showFilter}
                closeFilterHandler = {closeFilterHandler}
            />

            {
                albums == null ? <div /> : (
                    <div className={classes.galleryContent}>
                        {albums.map((album, index) => {
                            let tempImages = viewImages ? album.images : [];
                            let tempVideos = viewVideos ? album.videos : [];
                            let albumName = album.title.toUpperCase();
                            let inSearchResult = albumName.includes(searchInput);

                            if ((tempImages.length > 0 || tempVideos.length > 0) && inSearchResult) {
                                return (
                                    <AlbumPreview 
                                        key={index}
                                        title={album.title} 
                                        images={tempImages} 
                                        videos={tempVideos}
                                        id={album.id}
                                    />
                                )
                            }
                        })}
                    </div>
                )
            }
        </div>
    )
    
}

export default ViewGallery;
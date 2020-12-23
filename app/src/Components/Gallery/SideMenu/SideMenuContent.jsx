import React, { useContext } from 'react';
import classes from './SideMenu.module.scss';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import fireIcon from '../../../Resources/Icons/fire.svg';
import albumIcon from '../../../Resources/Icons/album.svg';

// --- Components ---
import ClearButton from '../../Common/Buttons/RedTextButton/RedTextButton';
import SearchField from '../../Common/SearchField/searchField';
import ScrollableContainer from '../../Common/ScrollableContainer/scrollableContainer';
import Checkbox from '../../Common/Checkbox/checkbox';



const SideMenuContent = ({
        chosenMediaHandler, 
        mediasSelected,
        numberOfMediasViewed, 
        handleSearch,
        clearMediaTypesHandler
    }) => {
    const { lang } = useContext(LocaleContext);

    return (
        <>
            <SearchField 
                swedishPlaceholder = "Sök efter album"
                englishPlaceholder = "Search for album"
                colorTheme = "dark"
                handleSearch = {handleSearch}
            />

            {/* <ul style={{"marginTop":"20px"}}>
                <li>
                    <img src={fireIcon} /> 
                    {translateToString({
                        se: "Senaste",
                        en: "Latest",
                        lang
                    })}
                </li>
                
                <li>
                    <img src={albumIcon} /> 
                    {translateToString({
                        se: "Sparat",
                        en: "Saved",
                        lang
                    })}
                </li>
            </ul> */}

            <h4>
                {translateToString({
                    se: "Mediatyp",
                    en: "Media type",
                    lang
                })}
            </h4>

            <div className={classes.mediaType}>
                <Checkbox 
                    name = {translateToString({
                        se: "Bilder",
                        en: "Images",
                        lang
                    })}
                    isChecked = {mediasSelected["images"]}
                    checkboxHandler = {() => chosenMediaHandler("images")}
                    colorTheme = "light"
                />

                <Checkbox 
                    name = {translateToString({
                        se: "Filmer",
                        en: "Videos",
                        lang
                    })}
                    isChecked = {mediasSelected["videos"]}
                    checkboxHandler = {() => chosenMediaHandler("videos")}
                    colorTheme = "light"
                />

                <ClearButton 
                    onClick={clearMediaTypesHandler}
                    text = {translateToString({
                        se: "Rensa",
                        en: "Clear",
                        lang
                    })}
                    extraStyle = {{"marginTop": "5px"}}
                />
            </div>

            {/* <h4>
                {translateToString({
                    se: "Spellistor",
                    en: "Playlists",
                    lang
                })}
            </h4>
            
            <ScrollableContainer height = "138px">
                <ul>
                    {playllists.map(playlist => <li key={playlist}><a>{playlist}</a></li>)}
                </ul>
            </ScrollableContainer>
            
            <h4>
                {translateToString({
                    se: "Mottagningen",
                    en: "The Reception",
                    lang
                })}
            </h4>

            <ScrollableContainer height = "107px">
                <ul>
                    {receptions.map(playlist => <li key={playlist}><a>{playlist}</a></li>)}
                </ul>
            </ScrollableContainer>

            <h4>
                {translateToString({
                    se: "Nämnder",
                    en: "Committees",
                    lang
                })}
            </h4>

            <ScrollableContainer height = "107px">
                <ul>
                    {committees.map(committee => (
                        <Checkbox 
                            name = {committee}
                            isChecked = {mediasSelected[committee]}
                            checkboxHandler = {() => chosenCommitteesHandler(committee)}
                            colorTheme = "light"
                        />
                    ))}
                </ul>
            </ScrollableContainer> */}
        </>
    )
}

export default SideMenuContent;
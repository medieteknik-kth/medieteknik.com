import React, { useContext, useState, useEffect } from 'react';

import classes from './sideMenu.module.scss';
import SearchField from '../../Common/SearchField/searchField';

import fireIcon from '../../../Resources/Icons/fire.svg';
import albumIcon from '../../../Resources/Icons/album.svg';
import Checkbox from '../../Common/Checkbox/checkbox';
import SideMenuContainer from '../../Common/SideMenuContainer/sideMenuContainer';

import { committees } from '../../Common/utility';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import ScrollableContainer from '../../Common/ScrollableContainer/scrollableContainer';

const SideMenu = (props) => {
    const { lang } = useContext(LocaleContext);

    const [mediasSelected, setMediasSelected] = useState({
        "images": true,
        "videos": true
    })
    const [mediasViewed, setMediasViewed] = useState(2);
    
    const [committeesSelected, setCommitteesSelected] = useState({});
    const [committeesViewed, setCommitteesViewed] = useState(0);

    const [playllists, setPlaylists] = useState([
        "Haloweengasquen 2020",
        "nØg 2019",
        "Frackgasquen 2019",
        "Bossegasquen 2018",
        "MVA 2019",
        "Gasque #1",
        "Gasque #2",
        "Gasque #3",
        "Gasque #4",
        "Gasque #6",
        "Gasque #4",
        "Gasque #4",
        "Gasque #4"
    ]);

    const [receptions, setReceptions] = useState([
        "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2014", "2013", "2012", "2011", "2010", 
        "2009", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"
    ]);

    useEffect(() => {
        let tempCommitteesSelected = {};

        committees.forEach(committee => {
            tempCommitteesSelected[committee] = false;
        });

        setCommitteesSelected(tempCommitteesSelected);
    }, []);


    const handleContentSearch = (searchInput) => {
        console.log(searchInput)
    }

    const chosenMediaHandler = (clickedMediaType) => {
        const tempMediasSelected = {...mediasSelected};

        if (tempMediasSelected[clickedMediaType]) {
            tempMediasSelected[clickedMediaType] = false;
            setMediasViewed(mediasViewed - 1);
        } else {
            tempMediasSelected[clickedMediaType] = true;
            setMediasViewed(mediasViewed + 1);
        }

        setMediasSelected(tempMediasSelected);
    }

    const chosenCommitteesHandler = (clickedCommittee) => {
        const tempCommitteesSelected = {...committeesSelected};

        if (tempCommitteesSelected[clickedCommittee]) {
            tempCommitteesSelected[clickedCommittee] = false;
            setCommitteesViewed(committeesViewed - 1);
        } else {
            tempCommitteesSelected[clickedCommittee] = true;
            setCommitteesViewed(committeesViewed + 1);
        }

        setCommitteesSelected(tempCommitteesSelected);
    } 

    return (
        <SideMenuContainer>
            <SearchField 
                swedishPlaceholder = "Sök efter innehåll"
                englishPlaceholder = "Search for content"
                colorTheme = "dark"
                handleSearch = {handleContentSearch}
            />

            <ul style={{"marginTop":"20px"}}>
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
            </ul>

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
            </div>

            <h4>
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
            </ScrollableContainer>
        </SideMenuContainer>
    )
}

export default SideMenu;
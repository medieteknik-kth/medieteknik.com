import React, { useContext, useState, useEffect } from 'react';

import classes from './SideMenu.module.scss';



import SideMenuContainer from '../../Common/SideMenuContainer/sideMenuContainer';
import SideMenuModalContainer from '../../Common/SideMenuModalContainer/sideMenuModalContainer';

import SideMenuContent from './SideMenuContent';

import { committees } from '../../Common/utility';


const SideMenu = ({
        chosenMediaHandler, 
        mediasSelected,
        numberOfMediasViewed, 
        handleSearch,
        clearMediaTypesHandler,
        showFilter,
        closeFilterHandler
    }) => {


    const [committeesSelected, setCommitteesSelected] = useState({});
    const [committeesViewed, setCommitteesViewed] = useState(0);


    // const [playllists, setPlaylists] = useState([
    //     "Haloweengasquen 2020",
    //     "nØg 2019",
    //     "Frackgasquen 2019",
    //     "Bossegasquen 2018",
    //     "MVA 2019",
    //     "Gasque #1",
    //     "Gasque #2",
    //     "Gasque #3",
    //     "Gasque #4",
    //     "Gasque #6",
    //     "Gasque #4",
    //     "Gasque #4",
    //     "Gasque #4"
    // ]);

    // const [receptions, setReceptions] = useState([
    //     "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2014", "2013", "2012", "2011", "2010", 
    //     "2009", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"
    // ]);

    // useEffect(() => {
    //     let tempCommitteesSelected = {};

    //     committees.forEach(committee => {
    //         tempCommitteesSelected[committee] = false;
    //     });

    //     setCommitteesSelected(tempCommitteesSelected);
    // }, []);

    // const chosenCommitteesHandler = (clickedCommittee) => {
    //     const tempCommitteesSelected = {...committeesSelected};

    //     if (tempCommitteesSelected[clickedCommittee]) {
    //         tempCommitteesSelected[clickedCommittee] = false;
    //         setCommitteesViewed(committeesViewed - 1);
    //     } else {
    //         tempCommitteesSelected[clickedCommittee] = true;
    //         setCommitteesViewed(committeesViewed + 1);
    //     }

    //     setCommitteesSelected(tempCommitteesSelected);
    // }
    

    return (
        <div>
            <SideMenuContainer extraClasses = {[classes.sideMenu]}>
                <SideMenuContent 
                    chosenMediaHandler = {chosenMediaHandler}
                    mediasSelected = {mediasSelected}
                    numberOfMediasViewed = {numberOfMediasViewed} 
                    handleSearch = {handleSearch}
                    clearMediaTypesHandler = {clearMediaTypesHandler}
                />
            </SideMenuContainer>

            <SideMenuModalContainer 
                extraClasses = {[classes.sideMenuModal]}
                show = {showFilter}
                closeModalHandler = {closeFilterHandler}
            >
                <SideMenuContent 
                    chosenMediaHandler = {chosenMediaHandler}
                    mediasSelected = {mediasSelected}
                    numberOfMediasViewed = {numberOfMediasViewed} 
                    handleSearch = {handleSearch}
                    clearMediaTypesHandler = {clearMediaTypesHandler}
                />
            </SideMenuModalContainer>
        </div>
    )
}

export default SideMenu;

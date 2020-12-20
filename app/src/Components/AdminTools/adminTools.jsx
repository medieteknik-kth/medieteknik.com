import React, { useContext } from 'react';
import classes from './adminTools.module.scss';

import SideMenuContainer from '../Common/SideMenuContainer/sideMenuContainer';
import SearchField from '../Common/SearchField/searchField';
import Table from '../Common/Table/table';

import {
    LocaleContext,
    translateToString,
} from '../../Contexts/LocaleContext';

const AdminTools = () => {
    const { lang } = useContext(LocaleContext);

    const handleToolsSearch = (searchInput) => {
        console.log(searchInput);
    }

    return (
        <div className={classes.AdminTools}>
            <h2>
                
                {translateToString({
                            se: "Admin Verktyg",
                            en: "Admin Tools",
                            lang
                        })}
            </h2>

            <div className={classes.adminContainer}>
                <SideMenuContainer extraClass={classes.sideMenu}>
                    <SearchField 
                        swedishPlaceholder = "Sök"
                        englishPlaceholder = "Search"
                        colorTheme = "dark"
                        handleSearch = {handleToolsSearch}
                    />

                    <h4 style = {{"paddingTop":"20px"}}>
                        {translateToString({
                            se: "Startsida",
                            en: "Start page",
                            lang
                        })}
                    </h4>
                    <ul style={{"marginTop":"0px"}}>
                        <li>Bildspel</li>
                        <li>Sektionen</li>
                        <li>Utbildningen</li>
                    </ul>

                    <h4 style = {{"paddingTop":"20px"}}>
                        {translateToString({
                            se: "Innehåll",
                            en: "Content",
                            lang
                        })}
                    </h4>
                        <ul style={{"marginTop":"0px"}}>
                            <li>Inlägg</li>
                            <li>Event</li>
                            <li>Dokument</li>
                            <li>Media</li>
                            <li>Nämnder</li>
                            <li>Funktionärer</li>
                        </ul>
                </SideMenuContainer>

                <div className={classes.adminContent}>
                    <Table 
                        allowRowDelete = {true}
                        allowRowEdit = {true}
                    />
                </div>
            </div>
            
        </div>
        
    )
}

export default AdminTools;
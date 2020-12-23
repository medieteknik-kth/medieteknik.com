import React from 'react';
import classes from './DocumentSideMenu.module.scss';

import SideMenuContainer from '../../../Common/SideMenuContainer/sideMenuContainer';
import SideMenuModalContainer from '../../../Common/SideMenuModalContainer/sideMenuModalContainer';
import SideMenuContent from './DocumentSideMenuContent';

const DocumentSideMenu = ({
        handleSearch,
        closeFilterHandler,
        showFilter
    }) => {

    return (
        <>
            <SideMenuContainer extraClasses = {[classes.sideMenu]}>
                <SideMenuContent 
                    handleSearch = {handleSearch}
                />
            </SideMenuContainer>

            <SideMenuModalContainer 
                extraClasses = {[classes.sideMenuModal]}
                show = {showFilter}
                closeModalHandler = {closeFilterHandler}
            >
                <SideMenuContent 
                    handleSearch = {handleSearch}
                />
            </SideMenuModalContainer>
        </>
    )
}

export default DocumentSideMenu;
import React from 'react';
import classes from './DocumentSideMenu.module.scss';

import SideMenuContainer from '../../../Common/SideMenuContainer/sideMenuContainer';
import SideMenuModalContainer from '../../../Common/SideMenuContainer/sideMenuModalContainer';
import SideMenuContent from './DocumentSideMenuContent';

const DocumentSideMenu = ({
        handleSearch,
        closeFilterHandler,
        showFilter,
        screenWidth,
        cardsViewSelected,
        listViewSelected,
        setListViewSelected,
        setCardsViewSelected,
        sortByChangedHandler,
        sortValue,
        categoriesFromServer,
        categoriesShown,
        categoriesFilterChangeHandler,
        clearCategoriesFilterHandler,
    }) => {

    return (
        <>
            <SideMenuContainer extraClasses = {[classes.sideMenu]}>
                <SideMenuContent 
                    handleSearch = {handleSearch}
                    screenWidth={screenWidth}
                    cardsViewSelected={cardsViewSelected}
                    listViewSelected={listViewSelected}
                    setListViewSelected={setListViewSelected}
                    setCardsViewSelected={setCardsViewSelected}
                    sortByChangedHandler={sortByChangedHandler}
                    sortValue={sortValue}
                    categoriesFromServer={categoriesFromServer}
                    categoriesShown={categoriesShown}
                    categoriesFilterChangeHandler={categoriesFilterChangeHandler}
                    clearCategoriesFilterHandler={clearCategoriesFilterHandler}
                />
            </SideMenuContainer>

            <SideMenuModalContainer 
                extraClasses = {[classes.sideMenuModal]}
                show = {showFilter}
                closeModalHandler = {closeFilterHandler}
            >
                <SideMenuContent 
                    handleSearch = {handleSearch}
                    screenWidth={screenWidth}
                    cardsViewSelected={cardsViewSelected}
                    listViewSelected={listViewSelected}
                    setListViewSelected={setListViewSelected}
                    setCardsViewSelected={setCardsViewSelected}
                    sortByChangedHandler={sortByChangedHandler}
                    sortValue={sortValue}
                    categoriesFromServer={categoriesFromServer}
                    categoriesShown={categoriesShown}
                    categoriesFilterChangeHandler={categoriesFilterChangeHandler}
                    clearCategoriesFilterHandler={clearCategoriesFilterHandler}
                />
            </SideMenuModalContainer>
        </>
    )
}

export default DocumentSideMenu;
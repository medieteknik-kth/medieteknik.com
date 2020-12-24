import React, {useContext, useState } from 'react';

import classes from './DocumentSideMenu.module.scss';
import SearchField from '../../../Common/SearchField/searchField';
import SortBySelector from '../SortBySelector/SortBySelector';
import CategoriesFilter from '../CategoriesFilter/CategoriesFilter';
import Checkbox from '../../../Common/Checkbox/checkbox';
import ClearButton from '../../../Common/Buttons/RedTextButton/RedTextButton';
import RadioButton from '../../../Common/RadioButton/RadioButton';

import listViewIconSelected from '../Assets/list_view_selected.png';
import gridViewIconSelected from '../Assets/grid_view_selected.png';
import listViewIcon from '../Assets/list_view.png';
import gridViewIcon from '../Assets/grid_view.png';

import {
    LocaleContext,
    translateToString,
} from '../../../../Contexts/LocaleContext';

const DocumentSideMenuContent = ({
        handleSearch, 
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

    console.log(sortValue)
    const { lang } = useContext(LocaleContext);

    return (
        <>
            <div className={classes.viewSelected}>
                <div className={classes.tooltipGrid}>
                    <img 
                        src={cardsViewSelected ? gridViewIconSelected : gridViewIcon}
                        className={cardsViewSelected ? classes.createCardsViewLogoSelected : classes.createCardsViewLogo}
                        onClick={() => {
                            if(!cardsViewSelected) {
                                setListViewSelected(!listViewSelected);
                                setCardsViewSelected(!cardsViewSelected);
                            }
                        }}
                    />
                    <span>
                        {translateToString({
                            se: 'Gallerivy',
                            en: 'Gallery',
                            lang,
                        })}
                    </span>
                </div> 
                        
                <div className={classes.tooltipList}>
                    <img 
                        src={listViewSelected ? listViewIconSelected : listViewIcon}
                        className={listViewSelected ? classes.createListViewLogoSelected : classes.createListViewLogo}
                        onClick={() => {
                            if(!listViewSelected) {
                                setListViewSelected(!listViewSelected);
                                setCardsViewSelected(!cardsViewSelected);
                            }
                        }}
                    />
                    <span>
                        {translateToString({
                            se: 'Listvy',
                            en: 'List',
                            lang,
                        })}
                    </span>
                </div>
            </div>
            
            <SearchField 
                colorTheme = 'dark'
                handleSearch = {handleSearch}
                swedishPlaceholder = 'Sök efter dokument'
                englishPlaceholder = 'Search for documents'
            />

            <h4>
                {translateToString({
                    se: "Dokumentkategori",
                    en: "Document category",
                    lang
                })}
            </h4>

            <div className={classes.mediaType}>
                {
                    categoriesFromServer.map(category => (
                        <Checkbox 
                            name = {category}
                            isChecked = {categoriesShown[category]}
                            checkboxHandler = {categoriesFilterChangeHandler}
                            colorTheme = 'light'
                        />
                    ))
                }

                <ClearButton 
                    onClick={clearCategoriesFilterHandler}
                    text = {translateToString({
                        se: "Rensa",
                        en: "Clear",
                        lang
                    })}
                    extraStyle = {{"marginTop": "5px"}}
                />
            </div>

            <h4>
                {translateToString({
                    se: "Sortera dokument",
                    en: "Sort documents",
                    lang
                })}
            </h4>
            
            <div className={classes.mediaType}>
                <RadioButton 
                    name = {translateToString({
                        se: 'Uppladdningsdatum',
                        en: 'Publish date',
                        lang,
                    })}
                    isChecked = {sortValue === 'dateStart' || sortValue === 'date'}
                    checkboxHandler = {() => sortByChangedHandler("date")}
                    colorTheme = 'light'
                />

                <RadioButton 
                    name = {translateToString({
                        se: 'Dokumentnamn',
                        en: 'Document name',
                        lang,
                    })}
                    isChecked = {sortValue === 'alphabetical'}
                    checkboxHandler = {() => sortByChangedHandler("alphabetical")}
                    colorTheme = 'light'
                />

                <RadioButton 
                    name = {translateToString({
                        se: 'Publicerat av',
                        en: 'Published by',
                        lang,
                    })}
                    isChecked = {sortValue === 'publisher'}
                    checkboxHandler = {() => sortByChangedHandler("publisher")}
                    colorTheme = 'light'
                />

                
            </div>
        </>
    )
}

export default DocumentSideMenuContent;
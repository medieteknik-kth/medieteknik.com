import React, { useState, useEffect, useRef, useContext } from 'react';

import classes from './ViewDocuments.module.css';
import {quickSort} from '../../../Utility/SortDocuments.js';


// --- BILDER/IKONER ---
import listViewIconSelected from './Assets/list_view_selected.png';
import gridViewIconSelected from './Assets/grid_view_selected.png';
import listViewIcon from './Assets/list_view.png';
import gridViewIcon from './Assets/grid_view.png';
import sampleThumbnail1 from '../Assets/testThumbnail1.png';
import sampleThumbnail2 from '../Assets/testThumbnail2.png';

// --- KOMPONENTER ---
import Spinner from '../../Common/Spinner/Spinner.jsx';
import SortOrderSelector from './SortOrderSelector/SortOrderSelector';
import SortBySelector from './SortBySelector/SortBySelector';
import DocumentCards from './DocumentCards/DocumentCards';
import DocumentList from './DocumentList/DocumentList';
import CategoriesFilter from './CategoriesFilter/CategoriesFilter';
import SearchField from '../../Common/SearchField/searchField';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext'


const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

const ViewDocuments = (props) => {
        // --- Refs ---
        const searchInput = useRef(null);

        // --- States ---
        const [categoriesShown, setCategoriesShown] = useState({})
        const [categoryTagsSelected, setCategoryTagsSelected] = useState([])
        const [sortValue, setSortValue] = useState('dateStart')
        const [cardsViewSelected, setCardsViewSelected] = useState(true)
        const [listViewSelected, setListViewSelected] = useState(false)
        const [categoriesViewed, setCategoriesViewed] = useState(0)
        const [screenWidth, setScreenWidth] = useState(window.innerWidth)
        const [documentsFromServer, setDocumentsFromServer] = useState([])
        const [categoriesFromServer, setCategoriesFromServer] = useState([])
        const [isLoading, setIsLoading] = useState(true)

        const { lang } = useContext(LocaleContext)

        useEffect(() => {
            window.addEventListener('resize', handleResize);

            fetch(API_BASE_URL + 'document_tags')
            .then(response => response.json())
            .then(jsonObject => {
                let categoriesListTemp = [];
                let categoriesShownTemp = {};
                jsonObject.map(categoryObject => {
                    categoriesListTemp = [...categoriesListTemp, categoryObject.title];
                    categoriesShownTemp[categoryObject.title] = false;
                })

                setCategoriesFromServer(categoriesListTemp);
                setCategoriesShown(categoriesShownTemp);
            });

            let documentsFromServerTemp = [];

            fetch(API_BASE_URL + 'documents')
                .then(response => response.json())
                .then(jsonObject => {
                    jsonObject.documents.map(doc => {
                        let publishYear = parseInt(doc.date.slice(0, 4));
                        let publishMonth = parseInt(doc.date.slice(5, 7)) - 1;
                        let publishDay = parseInt(doc.date.slice(8, 10));

                        fetch(API_BASE_URL + `thumbnails/${doc.thumbnail}`)
                            .then(thumbnail => {
                                let docObject = {
                                    docId: doc.itemId,
                                    doctags: doc.tags,
                                    headingText: doc.title,
                                    publisher: '',
                                    publishDate: new Date(publishYear, publishMonth, publishDay),
                                    displayCard: true,
                                    thumbnail: thumbnail,
                                    filename: doc.filename
                                }
                                
                                documentsFromServerTemp = [...documentsFromServerTemp, docObject];
                                documentsFromServerTemp = quickSort(documentsFromServerTemp, 'date', 'falling');

                                setDocumentsFromServer(documentsFromServerTemp);
                            })
                    })

                    setIsLoading(false);
                });
        }, [])
        
    const handleResize = () => {
        setScreenWidth(window.innerWidth);

        if (window.innerWidth < 900) {
            setCardsViewSelected(true);
            setListViewSelected(false);
        }
    }

    const categoriesFilterChangeHandler = (category) => {
        const categoriesKeysList = Object.keys(categoriesShown);

        let categoriesSelected = categoriesKeysList.filter(categoryKey => {
            return categoriesShown[categoryKey]
        })

        if (!categoriesShown[category]) {
            setCategoriesViewed(categoriesViewed + 1)
            categoriesSelected.push(category)
        } else {
            setCategoriesViewed(categoriesViewed - 1)
            categoriesSelected = categoriesSelected.filter(_category => _category !== category)
        }
        
        setCategoriesShown({
            ...categoriesShown,
            [category]: !categoriesShown[category], // brackets runt säger att det ska vara värdet av dena här variabeln
        });

        setCategoryTagsSelected(categoriesSelected);
    }

    const handleSearch = (newSearchString) => {
        console.log(newSearchString)

        if (typeof newSearchString == 'string') {
            let searchVal = newSearchString;
            let filteredString = searchVal.toUpperCase()
    
            let tempSearchArray = documentsFromServer.filter(doc => {
                let dateString = doc.publishDate.getFullYear() + "-" + 
                ((doc.publishDate.getMonth() + 1) < 10 ? `0${(doc.publishDate.getMonth() + 1)}` : (doc.publishDate.getMonth() + 1)) + "-" + 
                (doc.publishDate.getDate() < 10 ? `0${doc.publishDate.getDate()}` : doc.publishDate.getDate())
    
                if(doc.headingText.toUpperCase().indexOf(filteredString) > -1 || doc.publisher.toUpperCase().indexOf(filteredString) > -1 || dateString.indexOf(filteredString) > -1) {
                    doc.displayCard = true
                } else {
                    doc.displayCard = false
                }
                
                return(doc)
            })
    
            setDocumentsFromServer(tempSearchArray);
        }
    }

    const clearCategories = () => {
        let categoriesShownClearTemp = {};

        categoriesFromServer.forEach(cat => {
            categoriesShownClearTemp[cat] = false;
        })

        console.log(categoriesShownClearTemp)
        setCategoriesShown(categoriesShownClearTemp);
    }

    const clearCategoriesFilterHandler = () => {
        setCategoriesViewed(0);
        clearCategories();
    }

    const sortByChangedHandler = (sortType) => {
        setSortValue(sortType);

        if (sortType === 'date') {
            let sortedTempArr = quickSort(documentsFromServer, sortType, 'falling');
            setDocumentsFromServer(sortedTempArr);
        } else {
            let sortedTempArr = quickSort(documentsFromServer, sortType, 'rising');
            setDocumentsFromServer(sortedTempArr);
        }
    }

    return (
        <div className={classes.firstFlexContainer}>
            <div className={classes.main}>
                <div className={classes.headerRow}>
                    <div className={classes.searchParameters}>
                        <SortBySelector
                            sortByChangedHandler = {sortByChangedHandler}
                            sortValue = {sortValue}
                            addClass = {classes.sortByStyle}
                        />

                        <CategoriesFilter 
                            categories = {categoriesFromServer} 
                            categoriesToShow = {categoriesShown}
                            categoriesFilterChangeHandler = {categoriesFilterChangeHandler}
                            clearCategoriesFilterHandler = {clearCategoriesFilterHandler}
                            addClass = {classes.dropdownFilterStyle}
                            userIsFunkis = {props.userIsFunkis}
                        />
                        
                        <SearchField 
                            handleSearch = {handleSearch}
                            swedishPlaceholder = 'Sök efter dokument'
                            englishPlaceholder = 'Search for document'
                            colorTheme = 'light'
                        />
                    </div>

                    <div className={classes.viewSelected}>
                        {screenWidth >= 900 ? 
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
                            </div> : null}
                                    
                        {screenWidth >= 900 ?
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
                            </div> : null}
                    </div>
                </div>
                
                {isLoading ? <Spinner /> :
                    (cardsViewSelected ?
                        <DocumentCards 
                            documents={documentsFromServer}
                            categoriesToShow={categoryTagsSelected}
                            zeroCategoriesSelected = {categoriesViewed === 0}
                        />
                    :
                        <DocumentList 
                            documents = {documentsFromServer}
                            categoriesToShow = {categoryTagsSelected}
                            zeroCategoriesSelected = {categoriesViewed === 0}
                        />)
                }
            </div>
        </div>
    );
}

export default ViewDocuments;
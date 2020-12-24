import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';

import classes from './ViewDocuments.module.css';
import {quickSort} from '../../../Utility/SortDocuments.js';


// --- BILDER/IKONER ---

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
import DocumentSideMenu from './SideMenu/DocumentSideMenu';

import FilterButton from '../../Common/Buttons/FilterButton/FilterButton';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

import useEventListener from "@use-it/event-listener";



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
        const [screenWidth, setScreenWidth] = useState(window.innerWidth);
        const [documentsFromServer, setDocumentsFromServer] = useState([])
        const [categoriesFromServer, setCategoriesFromServer] = useState([])
        const [isLoading, setIsLoading] = useState(true);

        const { lang } = useContext(LocaleContext);

        // ---
        const [showFilter, setShowFilter] = useState(false);

        const closeFilterHandler = () => {
            setShowFilter(false);
        }

        useEffect(() => {
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

                        let docObject = {
                            docId: doc.itemId,
                            doctags: doc.tags,
                            headingText: doc.title,
                            publisher: '',
                            publishDate: new Date(publishYear, publishMonth, publishDay),
                            displayCard: true,
                            thumbnail: doc.thumbnail,
                            filename: doc.filename
                        }
                        
                        documentsFromServerTemp = [...documentsFromServerTemp, docObject];
                        documentsFromServerTemp = quickSort(documentsFromServerTemp, 'date', 'falling');

                        setDocumentsFromServer(documentsFromServerTemp);
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

    useEventListener('resize', handleResize);

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
        if (typeof newSearchString == 'string') {
            let searchVal = newSearchString;
            let filteredString = searchVal.toUpperCase();
    
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
        <div className={classes.main}>
            <DocumentSideMenu 
                handleSearch = {handleSearch}
                closeFilterHandler = {closeFilterHandler}
                showFilter = {showFilter}
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
            <div className={classes.documentsContainer}>
                <FilterButton 
                    colorTheme = 'light'
                    extraStyle={{"marginBottom":"10px"}}
                    extraClasses = {[classes.filterButton]}
                    onClick={() => setShowFilter(true)}
                />
                {isLoading ? <Spinner /> :
                    (cardsViewSelected ?
                        <DocumentCards 
                            // documents={documentsFromServer}
                            documents={[
                                documentsFromServer[0], 
                                documentsFromServer[0], 
                                documentsFromServer[0],
                                documentsFromServer[0],
                                documentsFromServer[0],
                                documentsFromServer[0],  
                                documentsFromServer[0]
                            ]}
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
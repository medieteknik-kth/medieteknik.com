import React, { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';

import classes from './ViewDocuments.module.css';
import {quickSort} from '../../../Utility/SortDocuments.js';

import DocumentCards from './DocumentCards/DocumentCards';
import DocumentList from './DocumentList/DocumentList';
import CategoriesFilter from './CategoriesFilter/CategoriesFilter';

import sampleThumbnail1 from '../Assets/testThumbnail1.png';
import sampleThumbnail2 from '../Assets/testThumbnail2.png';
import SortBySelector from './SortBySelector/SortBySelector';
import SortOrderSelector from './SortOrderSelector/SortOrderSelector';
    
import gridViewIcon from './Assets/grid_view.png';

import listViewIcon from './Assets/list_view.png';
import gridViewIconSelected from './Assets/grid_view_selected.png';
import listViewIconSelected from './Assets/list_view_selected.png';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

// Att göra:
// 1. Gör så att gallerivy presenteras som ett grid

class ViewDocuments extends Component {
    constructor() {
        super();
        window.addEventListener('resize', this.handleResize);

        this.state = {
            categoriesShown: {},
            categoryTagsSelected: [],

            sortValue: 'dateStart',
            orderValue: 'rising',

            cardsViewSelected: false,
            listViewSelected: true,

            query: '',

            catsViewed: 0,
            screenWidth: window.innerWidth,

            documentsFromServer: [],
            categoriesFromServer: []
        };

        fetch(API_BASE_URL + 'document_tags')
            .then(response => response.json())
            .then(jsonObject => {
                let categoriesListTemp = [];
                let categoriesShownTemp = {};

                jsonObject.map(categoryObject => {
                    categoriesListTemp = [...categoriesListTemp, categoryObject.title];
                    categoriesShownTemp[categoryObject.title] = false;
                })


                this.setState({
                    categoriesFromServer: categoriesListTemp,
                    categoriesShown: categoriesShownTemp
                });
            });

        let documentsFromServerTemp = [];

        fetch(API_BASE_URL + 'documents')
            .then(response => response.json())
            .then(jsonObject => {
                jsonObject.documents.map(doc => {
                    let publishYear = parseInt(doc.date.slice(0, 4));
                    let publishMonth = parseInt(doc.date.slice(5, 7)) - 1;
                    let publishDay = parseInt(doc.date.slice(8, 10));


                    fetch(API_BASE_URL + `get_image?path=../static/thumbnails/${doc.thumbnail}`)
                        .then(thumbnail => {
                            let docObject = {
                                docId: doc.itemId,
                                doctags: doc.tags,
                                headingText: doc.title,
                                publisher: '',
                                publishDate: new Date(publishYear, publishMonth, publishDay),
                                displayCard: true,
                                thumbnail: thumbnail
                            }
        
                            documentsFromServerTemp = [...documentsFromServerTemp, docObject];
                            documentsFromServerTemp = quickSort(documentsFromServerTemp, 'date', 'falling');
                            this.setState({documentsFromServer: documentsFromServerTemp});
                        })
                })
            });
        
  
        this.handleOrderChangeHeadAlphabetical = this.handleOrderChangeHeadAlphabetical.bind(this);
        this.handleOrderChangeHeadDate = this.handleOrderChangeHeadDate.bind(this);
        this.handleOrderChangeHeadPublisher = this.handleOrderChangeHeadPublisher.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.clearCat = this.clearCat.bind(this);
    }

    
    
    
    handleResize = () => {
        this.setState({
            screenWidth: window.innerWidth
        })

        if (window.innerWidth < 900) {
            this.setState({
                cardsViewSelected: true,
                listViewSelected: false
            })
        }
    }

    categoriesFilterChangeHandler = (category) => {
        const categoriesKeysList = Object.keys(this.state.categoriesShown);

        let categoriesSelected = categoriesKeysList.filter(categoryKey => {
            return this.state.categoriesShown[categoryKey]
        })

        if (!this.state.categoriesShown[category]) {
            this.setState({catsViewed: this.state.catsViewed + 1});
            categoriesSelected.push(category)
        } else {
            this.setState({catsViewed: this.state.catsViewed - 1})
            categoriesSelected = categoriesSelected.filter(_category => _category !== category)
        }
        
        this.setState({
            categoriesShown: {
                ...this.state.categoriesShown,
                [category]: !this.state.categoriesShown[category], // brackets runt säger att det ska vara värdet av dena här variabeln
            },
            categoryTagsSelected: categoriesSelected
        })
    }

    handleOrderChangeHeadAlphabetical = () => {
        if (this.state.sortValue !== 'alphabetical') {
            this.setState({sortValue: "alphabetical"});
            
            this.setState({documentsFromServer: quickSort(this.state.documentsFromServer, "alphabetical", 'falling')});
        }
    }

    handleOrderChangeHeadDate = () => {
        if (this.state.sortValue !== 'date') {
            this.setState({sortValue: "date"});
            this.setState({documentsFromServer: quickSort(this.state.documentsFromServer, "date", 'falling')});
        } 
    }

    handleOrderChangeHeadPublisher = () => {
        if (this.state.sortValue !== 'publisher') {
            this.setState({sortValue: "publisher"});
            this.setState({documentsFromServer: quickSort(this.state.documentsFromServer, "publisher", 'rising')});
        } 
    }

    handleSearch = () => {
        let searchVal = this.search.value
        let filteredString = searchVal.toUpperCase()
        this.setState({query: this.search.value})
    
        let tempSearchArray = this.state.documentsFromServer.filter(doc => {
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

        this.setState({documentsFromServer: tempSearchArray})
    }


    clearCat = () => {
        let categoriesShownClearTemp = {};

        this.state.categoriesFromServer.map(cat => {
            categoriesShownClearTemp[cat] = false;
        })

        this.setState({
            categoriesShown: categoriesShownClearTemp,
            categoriesShownList: []
        })
    }

    clearCategoriesFilterHandler = () => {
        this.setState({catsViewed: 0})
        this.clearCat()
    }

    sortByChangedHandler = (sortType) => {
        this.setState({sortValue: sortType})

        if (sortType === 'date') {
            let sortedTempArr = quickSort(this.state.documentsFromServer, sortType, 'falling');
            this.setState({documentsFromServer: sortedTempArr});
        } else {
            let sortedTempArr = quickSort(this.state.documentsFromServer, sortType, 'rising');
            this.setState({documentsFromServer: sortedTempArr});
            console.log(sortedTempArr);
        }
    }

    
    render() {
        return (
            <div className={classes.firstFlexContainer}>
                <div className={classes.main}>
                   

                    <h2>Dokument</h2>

                    <div className={classes.headerRow}>
                        <div className={classes.searchParameters}>
                            <SortBySelector
                                sortByChangedHandler = {this.sortByChangedHandler}
                                sortValue = {this.state.sortValue}
                                addClass = {classes.sortByStyle}
                            />

                            {/* <SortOrderSelector 
                                sortOrderChangedHandler = {this.sortOrderChangedHandler}
                                orderValue =  {this.state.orderValue}
                                addClass = {classes.sortOrderStyle}
                            /> */}

                            <CategoriesFilter 
                                categories = {this.state.categoriesFromServer} 
                                categoriesToShow = {this.state.categoriesShown}
                                categoriesFilterChangeHandler = {this.categoriesFilterChangeHandler}
                                clearCategoriesFilterHandler = {this.clearCategoriesFilterHandler}
                                addClass = {classes.dropdownFilterStyle}
                                userIsFunkis = {this.props.userIsFunkis}
                            />

                            <input
                                className={classes.searchDoc}
                                type="text"
                                onKeyUp={this.handleSearch}
                                name="name"
                                placeholder="Sök efter dokument"
                                ref = {input => this.search = input}
                            />

                            
                        </div>

                        <div className={classes.viewSelected}>
                            {this.state.screenWidth >= 900 ? 
                                <div className={classes.tooltipGrid}>
                                    <img 
                                        src={this.state.cardsViewSelected ? gridViewIconSelected : gridViewIcon}
                                        className={this.state.cardsViewSelected ? classes.createCardsViewLogoSelected : classes.createCardsViewLogo}
                                        onClick={() => {
                                            if(!this.state.cardsViewSelected) {
                                                this.setState({listViewSelected: !this.state.listViewSelected})
                                                this.setState({cardsViewSelected: !this.state.cardsViewSelected})
                                            }
                                        }}
                                    />
                                    <span>Gallerivy</span>
                                </div> : null}
                                        
                            {this.state.screenWidth >= 900 ?
                                <div className={classes.tooltipList}>
                                    <img 
                                        src={this.state.listViewSelected ? listViewIconSelected : listViewIcon}
                                        className={this.state.listViewSelected ? classes.createListViewLogoSelected : classes.createListViewLogo}
                                        onClick={() => {
                                            if(!this.state.listViewSelected) {
                                                this.setState({listViewSelected: !this.state.listViewSelected})
                                                this.setState({cardsViewSelected: !this.state.cardsViewSelected})
                                            }
                                        }}
                                    />
                                    <span>Listvy</span>
                                </div> : null}
                        </div>
                    </div>
                    
                    {
                        this.state.cardsViewSelected ?
                            <DocumentCards 
                                documents={this.state.documentsFromServer}
                                categoriesToShow={this.state.categoryTagsSelected}
                                zeroCategoriesSelected = {this.state.catsViewed === 0}
                            />
                        :
                            <DocumentList 
                                documents = {this.state.documentsFromServer}
                                categoriesToShow = {this.state.categoryTagsSelected}
                                zeroCategoriesSelected = {this.state.catsViewed === 0}
                            />
                    }
                </div>
            </div>
          );
    }
}

export default ViewDocuments;
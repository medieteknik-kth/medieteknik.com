import React, { Component } from 'react';
import classes from './ViewDocuments.module.css';
import {quickSort} from '../../../libaries/SortDocuments.js';

import DocumentCards from './DocumentCards/DocumentCards';
import DocumentList from './DocumentList/DocumentList';
import CategoriesFilter from './CategoriesFilter/CategoriesFilter';

import samplePDF from '../Assets/test.pdf';
import samplePDF2 from '../Assets/test2.pdf';
import SortBySelector from './SortBySelector/SortBySelector';
import SortOrderSelector from './SortOrderSelector/SortOrderSelector';


class ViewDocuments extends Component {
    constructor() {
        super();
        window.addEventListener('resize', this.handleResize);

        this.cards = [
            {
                doctypeId: 0,
                doctags: [' Motioner'],
                headingText: 'Budgetförslag MBD',
                publisher: 'Rasmus Rudling',
                publishDate: new Date(2019, 8, 27),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 1,
                doctags: [' Motioner'],
                headingText: 'Lägg ned spelnörderiet',
                publisher: 'Jesper Lundqvist',
                publishDate: new Date(2019, 10, 3),
                displayCard: true,
                pdfFile: samplePDF2
            },

            {
                doctypeId: 2,
                doctags: [' SM-handlingar'],
                headingText: 'SM#4 17/18',
                publisher: 'Oliver Kamruzzaman',
                publishDate: new Date(2017, 4, 14),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 3,
                doctags: [' Valkompass'],
                headingText: 'SM#4 16/17',
                publisher: 'Disa Gillner',
                publishDate: new Date(2016, 5, 28),
                displayCard: true,
                pdfFile: samplePDF2
            },

            {
                doctypeId: 4,
                doctags: [' Budget'],
                headingText: 'NLG 19/20',
                publisher: 'Sandra Larsson',
                publishDate: new Date(2019, 5, 28),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 5,
                doctags: [' Policies', ' Övrigt', ' Blanketter'],
                headingText: 'Alkohol på TB:s',
                publisher: 'Oliver Kamruzzaman',
                publishDate: new Date(2019, 7, 13),
                displayCard: true,
                pdfFile: samplePDF2
            },

            {
                doctypeId: 6,
                doctags: [' Blanketter'],
                headingText: 'SBA-blankett',
                publisher: 'Moa Engquist',
                publishDate: new Date(2019, 2, 10),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 7,
                doctags: [' Övrigt'],
                headingText: 'MKM:s beerpongregler',
                publisher: 'Moa Engquist',
                publishDate: new Date(2018, 7, 9),
                displayCard: true,
                pdfFile: samplePDF2
            }
        ]

        this.categories = [
            "Motioner",
            "SM-handlingar",
            "Valkompass",
            "Budget",
            "Policies",
            "Blanketter",
            "Fakturor",
            "Övrigt"
        ];

        this.state = {
            shown: {
                "Motioner": false,
                "SM-handlingar": false,
                "Valkompass": false,
                "Budget": false,
                "Policies": false,
                "Blanketter": false,
                "Fakturor": false,
                "Övrigt": false
            },
            categoryTagsSelected: [],

            sortValue: 'date',
            orderValue: 'falling',

            cardsViewSelected: window.innerWidth >= 845 ? false : true,
            listViewSelected: window.innerWidth >= 845 ? true : false,
            // cardsViewSelected: true,
            // listViewSelected: false,

            query: '',

            catsViewed: 0,
            screenWidth: window.innerWidth
        };
  
        this.handleOrderChangeHeadAlphabetical = this.handleOrderChangeHeadAlphabetical.bind(this);
        this.handleOrderChangeHeadDate = this.handleOrderChangeHeadDate.bind(this);
        this.handleOrderChangeHeadPublisher = this.handleOrderChangeHeadPublisher.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.clearCat = this.clearCat.bind(this);

        this.cards = quickSort(this.cards, this.state.sortValue, this.state.orderValue);
    }

    handleOrderChangeHeadAlphabetical = () => {
        if (this.state.sortValue !== 'alphabetical') {
            this.setState({sortValue: "alphabetical"});
            this.cards = quickSort(this.cards, "alphabetical", this.state.orderValue);
        } else if (this.state.orderValue === 'falling') {
            this.setState({orderValue: 'rising'})
            this.cards = quickSort(this.cards, "alphabetical", 'rising');
        } else {
            this.setState({orderValue: 'falling'})
            this.cards = quickSort(this.cards, "alphabetical", 'falling');
        }
    }
    
    handleResize = () => {
        this.setState({
            screenWidth: window.innerWidth
        })

        if (window.innerWidth < 845) {
            this.setState({
                cardsViewSelected: true,
                listViewSelected: false
            })
        }
    }

    categoriesFilterChangeHandler = (category) => {
        const categoriesKeysList = Object.keys(this.state.shown);

        let categoriesSelected = categoriesKeysList.filter(categoryKey => {
            return this.state.shown[categoryKey]
        })

        if (!this.state.shown[category]) {
            this.setState({catsViewed: this.state.catsViewed + 1});
            categoriesSelected.push(category)
        } else {
            this.setState({catsViewed: this.state.catsViewed - 1})
            categoriesSelected = categoriesSelected.filter(_category => _category !== category)
        }
        
        this.setState({
            shown: {
                ...this.state.shown,
                [category]: !this.state.shown[category], // brackets runt säger att det ska vara värdet av dena här variabeln
            },
            categoryTagsSelected: categoriesSelected
        })

    }

    handleOrderChangeHeadDate = () => {
        if (this.state.sortValue !== 'date') {
            this.setState({sortValue: "date"});
            this.cards = quickSort(this.cards, "date", this.state.orderValue);
        } else if (this.state.orderValue === 'falling') {
            this.setState({orderValue: 'rising'})
            this.cards = quickSort(this.cards, "date", 'rising');
        } else {
            this.setState({orderValue: 'falling'})
            this.cards = quickSort(this.cards, "date", 'falling');
        }
    }

    handleOrderChangeHeadPublisher = () => {
        if (this.state.sortValue !== 'publisher') {
            this.setState({sortValue: "publisher"});
            this.cards = quickSort(this.cards, "publisher", this.state.orderValue);
        } else if (this.state.orderValue === 'rising') {
            this.setState({orderValue: 'falling'})
            this.cards = quickSort(this.cards, "publisher", 'falling');
        } else {
            this.setState({orderValue: 'rising'})
            this.cards = quickSort(this.cards, "publisher", 'rising');
        }
    }

    handleSearch = () => {
        let searchVal = this.search.value
        let filteredString = searchVal.toUpperCase()
        this.setState({query: this.search.value})
        
        
        this.cards = this.cards.filter(doc => {
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
    }


    
    clearCat = () => {
        this.setState({
            shown: {
                "Motioner": false,
                "SM-handlingar": false,
                "Valkompass":false,
                "Budget": false,
                "Policies": false,
                "Blanketter": false,
                "Övrigt": false
            },
            categoriesShownList: []
        })
    }

    clearCategoriesFilterHandler = () => {
        this.setState({catsViewed: 0})
        this.clearCat()
    }

    sortByChangedHandler = (sortType) => {
        this.setState({sortValue: sortType})
        this.cards = quickSort(this.cards, sortType, this.state.orderValue);
    }

    sortOrderChangedHandler = (sortOrder) => {
        this.setState({orderValue: sortOrder})
        this.cards = quickSort(this.cards, this.state.sortValue, sortOrder);
    }
    
    render() {
        return (
            <div className={classes.firstFlexContainer}>
                <div className={classes.main}>
                    <div className={classes.headerRow + " " + classes.bottomBorder}>
                        <div className={classes.viewSelected}>
                            {this.state.screenWidth >= 845 ? <i
                                className = {this.state.cardsViewSelected ? classes.createCardsViewLogoSelected : classes.createCardsViewLogo}
                                onClick={() => {
                                    if(!this.state.cardsViewSelected) {
                                        this.setState({listViewSelected: !this.state.listViewSelected})
                                        this.setState({cardsViewSelected: !this.state.cardsViewSelected})
                                    }
                                }}
                            >
                                <div>
                                    <div className = {this.state.cardsViewSelected ? classes.smallSquareSelected : classes.smallSquare}></div>
                                    <div className = {this.state.cardsViewSelected ? classes.smallSquareSelected : classes.smallSquare}></div>
                                </div>
                                
                                <div>
                                    <div className = {this.state.cardsViewSelected ? classes.smallSquareSelected : classes.smallSquare}></div>
                                    <div className = {this.state.cardsViewSelected ? classes.smallSquareSelected : classes.smallSquare}></div>
                                </div>
                            </i> : null}

                            {this.state.screenWidth >= 845 ? <i
                                className = {this.state.listViewSelected ? classes.createListViewLogoSelected : classes.createListViewLogo}
                                onClick={() => {
                                    if(!this.state.listViewSelected) {
                                        this.setState({listViewSelected: !this.state.listViewSelected})
                                        this.setState({cardsViewSelected: !this.state.cardsViewSelected})
                                    }
                                }}
                            >
                                <div className = {classes.bulletRow}>
                                    <div className = {this.state.listViewSelected ? classes.bulletSelected : classes.bullet}></div>
                                    <div className = {this.state.listViewSelected ? classes.anonymusTextSelected : classes.anonymusText}></div>
                                </div>

                                <div className = {classes.bulletRow}>
                                    <div className = {this.state.listViewSelected ? classes.bulletSelected : classes.bullet}></div>
                                    <div className = {this.state.listViewSelected ? classes.anonymusTextSelected : classes.anonymusText}></div>
                                </div>
                                
                                <div className = {classes.bulletRow}>
                                    <div className = {this.state.listViewSelected ? classes.bulletSelected : classes.bullet}></div>
                                    <div className = {this.state.listViewSelected ? classes.anonymusTextSelected : classes.anonymusText}></div>
                                </div>
                            </i> : null}
                        </div>
                        
                        <div className={classes.textItemsInRightHeader}>
                            <SortBySelector 
                                sortByChangedHandler = {this.sortByChangedHandler}
                                sortValue = {this.state.sortValue}
                                addClass = {classes.sortByStyle}
                            />

                            <SortOrderSelector 
                                sortOrderChangedHandler = {this.sortOrderChangedHandler}
                                orderValue =  {this.orderValue}
                                addClass = {classes.sortOrderStyle}
                            />
                        </div>

                        <CategoriesFilter 
                            categories = {this.categories} 
                            categoriesToShow = {this.state.shown}
                            categoriesFilterChangeHandler = {this.categoriesFilterChangeHandler}
                            clearCategoriesFilterHandler = {this.clearCategoriesFilterHandler}
                            addClass = {classes.dropdownFilterStyle}
                        />

                        <input
                            className={classes.searchDoc}
                            type="text"
                            onKeyUp={this.handleSearch}
                            name="name"
                            placeholder="Sök efter dokument.."
                            ref = {input => this.search = input}
                        />
                    </div>
                    
                    {
                        this.state.cardsViewSelected ?
                            <DocumentCards 
                                documents={this.cards}
                                categoriesToShow={this.state.categoryTagsSelected}
                                zeroCategoriesSelected = {this.state.catsViewed === 0}
                            />
                        :
                            <DocumentList 
                                documents = {this.cards}
                                categoriesToShow = {this.state.categoryTagsSelected}
                                zeroCategoriesSelected = {this.state.catsViewed === 0}
                                orderValue = {this.state.orderValue}
                                sortValue = {this.state.sortValue}
                                handleOrderChangeHeadAlphabetical = {this.handleOrderChangeHeadAlphabetical}
                                handleOrderChangeHeadPublisher = {this.handleOrderChangeHeadPublisher}
                                handleOrderChangeHeadDate = {this.handleOrderChangeHeadDate}
                            />
                    }
                </div>
            </div>
          );
    }
}

export default ViewDocuments;
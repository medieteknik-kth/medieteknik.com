import React, { Component } from 'react';
import classes from './ViewDocuments.module.css';
import {quickSort} from '../../../libaries/SortDocuments.js';

import DocumentCards from './DocumentCards/DocumentCards';
import DocumentList from './DocumentList/DocumentList';

import EmptyArrowDown from '../Assets/Arrows/Empty-arrow-down.svg';

import samplePDF from '../Assets/test.pdf';
import samplePDF2 from '../Assets/test2.pdf';


class ViewDocuments extends Component {
    constructor() {
        super();
        window.addEventListener('resize', this.handleResize);

        this.cards = [
            {
                doctypeId: 0,
                doctype: 'Motioner',
                headingText: 'Budgetförslag MBD',
                publisher: 'Rasmus Rudling',
                publishDate: new Date(2019, 8, 27),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 1,
                doctype: 'Motioner',
                headingText: 'Lägg ned spelnörderiet',
                publisher: 'Jesper Lundqvist',
                publishDate: new Date(2019, 10, 3),
                displayCard: true,
                pdfFile: samplePDF2
            },

            {
                doctypeId: 2,
                doctype: 'SM-handlingar',
                headingText: 'SM#4 17/18',
                publisher: 'Oliver Kamruzzaman',
                publishDate: new Date(2017, 4, 14),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 3,
                doctype: 'Valkompass',
                headingText: 'SM#4 16/17',
                publisher: 'Disa Gillner',
                publishDate: new Date(2016, 5, 28),
                displayCard: true,
                pdfFile: samplePDF2
            },

            {
                doctypeId: 4,
                doctype: 'Budget',
                headingText: 'NLG 19/20',
                publisher: 'Sandra Larsson',
                publishDate: new Date(2019, 5, 28),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 5,
                doctype: 'Policies',
                headingText: 'Alkohol på TB:s',
                publisher: 'Oliver Kamruzzaman',
                publishDate: new Date(2019, 7, 13),
                displayCard: true,
                pdfFile: samplePDF2
            },

            {
                doctypeId: 6,
                doctype: 'Blanketter',
                headingText: 'SBA-blankett',
                publisher: 'Moa Engquist',
                publishDate: new Date(2019, 2, 10),
                displayCard: true,
                pdfFile: samplePDF
            },

            {
                doctypeId: 7,
                doctype: 'Övrigt',
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
                "Övrigt": false
            },

            sortValue: 'dateStart',
            orderValue: 'falling',

            // cardsViewSelected: window.innerWidth >= 800 ? false : true,
            // listViewSelected: window.innerWidth >= 800 ? true : false,
            cardsViewSelected: true,
            listViewSelected: false,

            query: '',

            catsViewed: 0,
            screenWidth: window.innerWidth
        };
  
        this.handleOrderChangeHeadAlphabetical = this.handleOrderChangeHeadAlphabetical.bind(this);
        this.handleOrderChangeHeadDate = this.handleOrderChangeHeadDate.bind(this);
        this.handleOrderChangeHeadPublisher = this.handleOrderChangeHeadPublisher.bind(this);
        this.handleOrderChangeHeadType = this.handleOrderChangeHeadType.bind(this);
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

        if (window.innerWidth < 800) {
            this.setState({
                cardsViewSelected: true,
                listViewSelected: false
        })
        }
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

    handleOrderChangeHeadType = () => {
        if (this.state.sortValue !== 'type') {
            this.setState({sortValue: "type"});
            this.cards = quickSort(this.cards, "type", this.state.orderValue);
        } else if (this.state.orderValue === 'rising') {
            this.setState({orderValue: 'falling'})
            this.cards = quickSort(this.cards, "type", 'falling');
        } else {
            this.setState({orderValue: 'rising'})
            this.cards = quickSort(this.cards, "type", 'rising');
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
        console.log(filteredString)
        this.setState({query: this.search.value})
        
        
        this.cards = this.cards.filter(doc => {
            let dateString = doc.publishDate.getFullYear() + "-" + 
            ((doc.publishDate.getMonth() + 1) < 10 ? `0${(doc.publishDate.getMonth() + 1)}` : (doc.publishDate.getMonth() + 1)) + "-" + 
            (doc.publishDate.getDate() < 10 ? `0${doc.publishDate.getDate()}` : doc.publishDate.getDate())

            if(doc.headingText.toUpperCase().indexOf(filteredString) > -1 || doc.doctype.toUpperCase().indexOf(filteredString) > -1 || doc.publisher.toUpperCase().indexOf(filteredString) > -1 || dateString.indexOf(filteredString) > -1) {
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
            }
        })
    }
    
    render() {
        

        return (
            <div className={classes.firstFlexContainer}>
                <div className={classes.main}>
                    <div className={classes.headerRow + " " + classes.bottomBorder}>
                        <div className={classes.viewSelected}>
                            {this.state.screenWidth >= 800 ? <i
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

                            {this.state.screenWidth >= 800 ? <i
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
                            <div className={classes.sortByStyledBoxContainer + " " + classes.dropdown}>
                                <div className={classes.sortByStyledBox + " " + classes.SortByClass}>
                                    <div>
                                        {this.state.sortValue === "dateStart" ? 'Sortera efter' : ''}
                                        {this.state.sortValue === "date" ? 'Uppladdningsdatum' : ''}
                                        {this.state.sortValue === "type" ? 'Typ' : ''}
                                        {this.state.sortValue === "publisher" ? 'Uppladdat av' : ''}
                                        {this.state.sortValue === "alphabetical" ? 'Dokumentnamn' : ''} 
                                    </div>
                                    <img src={EmptyArrowDown} alt="Arrow"/>
                                </div>

                                <div className = {classes.dropdownContent}>
                                    <p 
                                        onClick = {() => {
                                            this.setState({sortValue: "alphabetical"})
                                            this.cards = quickSort(this.cards, "alphabetical", this.state.orderValue);
                                        }}>
                                        Dokumentnamn
                                    </p>

                                    <p 
                                        onClick = {() => {
                                            this.setState({sortValue: "type"})
                                            this.cards = quickSort(this.cards, "type", this.state.orderValue);
                                        }}>
                                        Typ
                                    </p>
                                        
                                    <p 
                                        onClick = {() => {
                                            this.setState({sortValue: "publisher"})
                                            this.cards = quickSort(this.cards, "publisher", this.state.orderValue);
                                        }}>
                                        Uppladdat av
                                    </p>

                                    <p 
                                        onClick = {() => {
                                            this.setState({sortValue: "date"})
                                            this.cards = quickSort(this.cards, "date", this.state.orderValue);
                                        }}>
                                        Uppladdningsdatum
                                    </p>
                                </div>
                            </div>

                            <div className={classes.sortByStyledBoxContainer + " " + classes.dropdown}>
                                <div className={classes.sortByStyledBox + " " + classes.orderByStyledBox + " " + classes.sortDirectionClass}>
                                    <div>
                                        {this.state.orderValue === "falling" ? 'Fallande' : ''}
                                        {this.state.orderValue === "rising" ? 'Stigande' : ''} 
                                    </div>
                                    <img src={EmptyArrowDown} alt="Arrow"/>
                                </div>

                                <div className = {classes.dropdownContentOrder}>
                                    <p 
                                        onClick = {() => {
                                            this.setState({orderValue: "falling"})
                                            this.cards = quickSort(this.cards, this.state.sortValue, "falling");
                                        }}>
                                        Fallande
                                    </p>

                                    <p 
                                        onClick = {() => {
                                            this.setState({orderValue: "rising"})
                                            this.cards = quickSort(this.cards, this.state.sortValue, "rising");
                                        }}>
                                        Stigande
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={classes.sortByStyledBoxContainer + " " + classes.dropdown}>
                                <div className={classes.sortByStyledBox + " " + classes.orderByStyledBox + " " + classes.filterClass}>
                                    <div>
                                        Filtrera
                                    </div>
                                    <img src={EmptyArrowDown} alt="Arrow"/>
                                </div>

                                <div className = {classes.dropdownContentCats}>
                                    <div>
                                        <div className={classes.buttonContainer}>
                                            <div 
                                                className={classes.checkButtonClearCat} 
                                                onClick = {() => {
                                                    this.setState({catsViewed: 0})
                                                    this.clearCat()
                                                }}
                                            >
                                                Rensa
                                            </div>
                                        </div>

                                        {
                                            this.categories.map(category => (
                                                <label className={classes.container} key = {category}>
                                                    <input
                                                        name={category}
                                                        type="checkbox"
                                                        
                                                        checked={this.state.shown[category]}
                                                        onChange = {() => null}
                                                        onClick={() => {
                                                            
                                                            this.state.shown[category] === false ? this.setState({catsViewed: this.state.catsViewed + 1}) : this.setState({catsViewed: this.state.catsViewed - 1})
                                                            this.setState({
                                                                shown: {
                                                                    ...this.state.shown,
                                                                    [category]: !this.state.shown[category], // brackets runt säger att det ska vara värdet av dena här variabeln
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    
                                                    <span className={classes.checkmark}></span>
                                                    {category}
                                                    <br />
                                                </label>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

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
                                categoriesToShow={this.state.shown}
                                zeroCategoriesSelected = {this.state.catsViewed === 0}
                            />
                        :
                            <DocumentList 
                                documents = {this.cards}
                                categoriesToShow = {this.state.shown}
                                zeroCategoriesSelected = {this.state.catsViewed === 0}
                                orderValue = {this.state.orderValue}
                                sortValue = {this.state.sortValue}
                                handleOrderChangeHeadAlphabetical = {this.handleOrderChangeHeadAlphabetical}
                                handleOrderChangeHeadType = {this.handleOrderChangeHeadType}
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
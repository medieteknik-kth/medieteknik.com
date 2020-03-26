import React, { Component } from 'react';
import classes from './Document.module.css';
import './DocumentCard.js';
import {quickSort} from '../libaries/SortDocuments.js';
import DocumentCard from './DocumentCard.js';
import EmptyArrowDown from './Arrows/Empty-arrow-down.svg';

// Att göra:
// - Använd object för att göra preview


class ViewDocuments extends Component {
    constructor() {
        super();

        this.cards = [
            {
                doctypeId: 0,
                doctype: 'Motioner',
                headingText: 'Budgetförslag MBD',
                publisher: 'Rasmus Rudling',
                publishDate: new Date(2019, 8, 27),
                displayCard: true
            },

            {
                doctypeId: 1,
                doctype: 'Motioner',
                headingText: 'Lägg ned spelnörderiet',
                publisher: 'Jesper Lundqvist',
                publishDate: new Date(2019, 10, 3),
                displayCard: true
            },

            {
                doctypeId: 2,
                doctype: 'SM-handlingar',
                headingText: 'SM#4 17/18',
                publisher: 'Oliver Kamruzzaman',
                publishDate: new Date(2017, 4, 14),
                displayCard: true
            },

            {
                doctypeId: 3,
                doctype: 'Valkompass',
                headingText: 'SM#4 16/17',
                publisher: 'Disa Gillner',
                publishDate: new Date(2016, 5, 28),
                displayCard: true
            },

            {
                doctypeId: 4,
                doctype: 'Budget',
                headingText: 'NLG 19/20',
                publisher: 'Sandra Larsson',
                publishDate: new Date(2019, 5, 28),
                displayCard: true
            },

            {
                doctypeId: 5,
                doctype: 'Policies',
                headingText: 'Alkohol på TB:s',
                publisher: 'Oliver Kamruzzaman',
                publishDate: new Date(2019, 7, 13),
                displayCard: true
            },

            {
                doctypeId: 6,
                doctype: 'Blanketter',
                headingText: 'SBA-blankett',
                publisher: 'Moa Engquist',
                publishDate: new Date(2019, 2, 10),
                displayCard: true
            },

            {
                doctypeId: 7,
                doctype: 'Övrigt',
                headingText: 'MKM:s beerpongregler',
                publisher: 'Moa Engquist',
                publishDate: new Date(2018, 7, 9),
                displayCard: true
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

            cardsViewSelected: false,
            listViewSelected: true,

            query: '',

            catsViewed: 0
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

        let documentNameOrderValueClass;
        let typeOrderValueClass;
        let publisherOrderValueClass;
        let dateOrderValueClass;

        if (this.state.orderValue === "falling") {
            documentNameOrderValueClass = classes.arrowDown;
            typeOrderValueClass = classes.arrowDown;
            publisherOrderValueClass = classes.arrowDown;
            dateOrderValueClass = classes.arrowDown;
        } else {
            documentNameOrderValueClass = classes.arrowUp;
            typeOrderValueClass = classes.arrowUp;
            publisherOrderValueClass = classes.arrowUp;
            dateOrderValueClass = classes.arrowUp;
        }

        if (this.state.sortValue === "alphabetical") {
            if (typeOrderValueClass === classes.arrowDown) {
                documentNameOrderValueClass = classes.arrowDownSelected
            } else {
                documentNameOrderValueClass = classes.arrowUpSelected
            }
        } else if (this.state.sortValue === "type") {
            if (typeOrderValueClass === classes.arrowDown) {
                typeOrderValueClass = classes.arrowDownSelected
            } else {
                typeOrderValueClass = classes.arrowUpSelected
            }
        } else if (this.state.sortValue === "publisher") {
            if (publisherOrderValueClass === classes.arrowDown) {
                publisherOrderValueClass = classes.arrowDownSelected
            } else {
                publisherOrderValueClass = classes.arrowUpSelected
            }
        } else if (this.state.sortValue === "date") {
            if (dateOrderValueClass === classes.arrowDown) {
                dateOrderValueClass = classes.arrowDownSelected
            } else {
                dateOrderValueClass = classes.arrowUpSelected
            }
        }

        return (
            <div className={classes.firstFlexContainer}>
                <div className={classes.main}>
                    <div className={classes.headerRow + " " + classes.bottomBorder}>
                        <div className={classes.viewSelected}>
                            <i
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
                            </i>

                            <i
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
                            </i>
                        </div>
                        
                        <div className={classes.textItemsInRightHeader}>
                            <div className={classes.sortByStyledBoxContainer + " " + classes.dropdown}>
                                <div className={classes.sortByStyledBox}>
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
                                <div className={classes.sortByStyledBox + " " + classes.orderByStyledBox}>
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
                                <div className={classes.sortByStyledBox + " " + classes.orderByStyledBox}>
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
                                                <label className={classes.container}>
                                                    <input
                                                        name={category}
                                                        type="checkbox"
                                                        
                                                        checked={this.state.shown[category]}
                                                        
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
                    
                    
                    <div className={classes.documentList}>
                        {
                            this.state.cardsViewSelected ?
                                this.state.catsViewed === 0 ? 
                                    this.cards.filter(doc => doc.displayCard).map(doc => (
                                            <DocumentCard
                                                doctypeId = {doc.doctypeId}
                                                doctype = {doc.doctype === 'Motioner' ? 'Motion' : doc.doctype}
                                                headingText = {doc.headingText}
                                                publisher = {doc.publisher}
                                                publishDate = {
                                                    doc.publishDate.getFullYear() + "-" + 
                                                    ((doc.publishDate.getMonth() + 1) < 10 ? `0${(doc.publishDate.getMonth() + 1)}` : (doc.publishDate.getMonth() + 1)) + "-" + 
                                                    (doc.publishDate.getDate() < 10 ? `0${doc.publishDate.getDate()}` : doc.publishDate.getDate())
                                                }
                                            />
                                    )) :
                                    this.cards.filter(category => this.state.shown[category.doctype]).filter(doc => doc.displayCard).map(doc => (
                                            <DocumentCard
                                                doctypeId = {doc.doctypeId}
                                                doctype = {doc.doctype === 'Motioner' ? 'Motion' : doc.doctype}
                                                headingText = {doc.headingText}
                                                publisher = {doc.publisher}
                                                publishDate = {
                                                    doc.publishDate.getFullYear() + "-" + 
                                                    ((doc.publishDate.getMonth() + 1) < 10 ? `0${(doc.publishDate.getMonth() + 1)}` : (doc.publishDate.getMonth() + 1)) + "-" + 
                                                    (doc.publishDate.getDate() < 10 ? `0${doc.publishDate.getDate()}` : doc.publishDate.getDate())
                                                }
                                            />
                                    )) 
                                
                                :

                                <div className={classes.docList}>              
                                    <table>
                                        <thead>
                                            <tr>
                                                <th onClick = {this.handleOrderChangeHeadAlphabetical} className={classes.catParam}>
                                                    Dokumentnamn
                                                    <i className={documentNameOrderValueClass}></i>
                                                </th>
                                                <th onClick = {this.handleOrderChangeHeadType} className={classes.catParam}>
                                                    Typ 
                                                    <i className={typeOrderValueClass}></i>
                                                </th>
                                                <th onClick = {this.handleOrderChangeHeadPublisher} className={classes.catParam}>
                                                    Uppladdat av 
                                                    <i className={publisherOrderValueClass}></i>
                                                </th>
                                                <th onClick = {this.handleOrderChangeHeadDate} className={classes.catParam}>
                                                    Uppladdningsdatum
                                                    <i className={dateOrderValueClass}></i>
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                this.state.catsViewed === 0 ?
                                                    this.cards.filter(doc => doc.displayCard).map(category => (
                                                        <tr>
                                                            <td>{category.headingText}</td>
                                                            <td>{category.doctype === 'Motioner' ? 'Motion' : category.doctype}</td>
                                                            <td>{category.publisher}</td>
                                                            <td>
                                                                {
                                                                    category.publishDate.getFullYear() + "-" + 
                                                                    ((category.publishDate.getMonth() + 1) < 10 ? `0${(category.publishDate.getMonth() + 1)}` : (category.publishDate.getMonth() + 1)) + "-" + 
                                                                    (category.publishDate.getDate() < 10 ? `0${category.publishDate.getDate()}` : category.publishDate.getDate())
                                                                }
                                                            </td>
                                                            <td>
                                                                <div className = {classes.downloadButtonCircle}>
                                                                    <i className = {classes.downloadButtonArrow}></i>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                :

                                                this.cards.filter(category => this.state.shown[category.doctype]).filter(doc => doc.displayCard).map(category => (
                                                    <tr>
                                                        <td>{category.headingText}</td>
                                                        <td>{category.doctype === 'Motioner' ? 'Motion' : category.doctype}</td>
                                                        <td>{category.publisher}</td>
                                                        <td>
                                                            {
                                                                category.publishDate.getFullYear() + "-" + 
                                                                ((category.publishDate.getMonth() + 1) < 10 ? `0${(category.publishDate.getMonth() + 1)}` : (category.publishDate.getMonth() + 1)) + "-" + 
                                                                (category.publishDate.getDate() < 10 ? `0${category.publishDate.getDate()}` : category.publishDate.getDate())
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className = {classes.downloadButtonCircle}>
                                                                <i className = {classes.downloadButtonArrow}></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                        }
                    </div>
                </div>
            </div>
          );
    }
}

export default ViewDocuments;
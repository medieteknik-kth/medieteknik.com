import React, { Component } from 'react';
import './Document.css';
import './DocumentCard.js'
import {quickSort} from '../../Utility/SortDocuments.js'
import DocumentCard from './DocumentCard.js';
import EmpyArrowDown from './Arrows/Empty-arrow-down.svg';

// Att göra:
// - Använd object för att göra preview


class Document extends Component {
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
        return (
            <div className="flex-container-1">
                <div className="main">
                    <div className="header-row bottom-border">
                        <div className="view-selected">
                            <i
                                className = {this.state.cardsViewSelected ? "create-cards-view-logo-selected" : "create-cards-view-logo"}
                                onClick={() => {
                                    if(!this.state.cardsViewSelected) {
                                        this.setState({listViewSelected: !this.state.listViewSelected})
                                        this.setState({cardsViewSelected: !this.state.cardsViewSelected})
                                    }
                                }}
                            >
                                <div>
                                    <div className = {this.state.cardsViewSelected ? "small-square-selected" : "small-square"}></div>
                                    <div className = {this.state.cardsViewSelected ? "small-square-selected" : "small-square"}></div>
                                </div>
                                
                                <div>
                                    <div className = {this.state.cardsViewSelected ? "small-square-selected" : "small-square"}></div>
                                    <div className = {this.state.cardsViewSelected ? "small-square-selected" : "small-square"}></div>
                                </div>
                            </i>

                            <i
                                className = {this.state.listViewSelected ? "create-list-view-logo-selected" : "create-list-view-logo"}
                                onClick={() => {
                                    if(!this.state.listViewSelected) {
                                        this.setState({listViewSelected: !this.state.listViewSelected})
                                        this.setState({cardsViewSelected: !this.state.cardsViewSelected})
                                    }
                                }}
                            >
                                <div className = "bullet-row">
                                    <div className = {this.state.listViewSelected ? "bullet-selected" : "bullet"}></div>
                                    <div className = {this.state.listViewSelected ? "anonymus-text-selected" : "anonymus-text"}></div>
                                </div>

                                <div className = "bullet-row">
                                    <div className = {this.state.listViewSelected ? "bullet-selected" : "bullet"}></div>
                                    <div className = {this.state.listViewSelected ? "anonymus-text-selected" : "anonymus-text"}></div>
                                </div>
                                
                                <div className = "bullet-row">
                                    <div className = {this.state.listViewSelected ? "bullet-selected" : "bullet"}></div>
                                    <div className = {this.state.listViewSelected ? "anonymus-text-selected" : "anonymus-text"}></div>
                                </div>
                            </i>
                        </div>
                        
                        <div className="text-items-in-right-header">
                            <div className="sortByStyledBoxContainer dropdown">
                                <div className="sortByStyledBox">
                                    <div>
                                        {this.state.sortValue === "dateStart" ? 'Sortera efter' : ''}
                                        {this.state.sortValue === "date" ? 'Uppladdningsdatum' : ''}
                                        {this.state.sortValue === "type" ? 'Typ' : ''}
                                        {this.state.sortValue === "publisher" ? 'Uppladdat av' : ''}
                                        {this.state.sortValue === "alphabetical" ? 'Dokumentnamn' : ''} 
                                    </div>
                                    <img src={EmpyArrowDown} alt="Arrow"/>
                                </div>

                                <div className = "dropdown-content">
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

                            <div className="sortByStyledBoxContainer dropdown">
                                <div className="sortByStyledBox orderByStyledBox">
                                    <div>
                                        {this.state.orderValue === "falling" ? 'Fallande' : ''}
                                        {this.state.orderValue === "rising" ? 'Stigande' : ''} 
                                    </div>
                                    <img src={EmpyArrowDown} alt="Arrow"/>
                                </div>

                                <div className = "dropdown-content-order">
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

                        <div className="sortByStyledBoxContainer dropdown">
                                <div className="sortByStyledBox orderByStyledBox">
                                    <div>
                                        Filtrera
                                    </div>
                                    <img src={EmpyArrowDown} alt="Arrow"/>
                                </div>

                                <div className = "dropdown-content-cats">
                                    <div>
                                        <div className="buttonContainer">
                                            <div 
                                                className="checkButtonClearCat" 
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
                                                <label className="container">
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
                                                    
                                                    <span className="checkmark"></span>
                                                    {category}
                                                    <br />
                                                </label>
                                            ))
                                        }

                                    </div>
                                    
                                </div>
                            </div>

                        <input
                            id="searchDoc"
                            type="text"
                            onKeyUp={this.handleSearch}
                            name="name"
                            placeholder="Sök efter dokument.."
                            ref = {input => this.search = input}
                        />
                    </div>
                    
                    
                    <div className="document-list">
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

                                <div className="doc-list">              
                                    <table>
                                        <thead>
                                            <tr>
                                                <th onClick = {this.handleOrderChangeHeadAlphabetical} className="cat-param">
                                                    Dokumentnamn 
                                                    <i className={(this.state.orderValue === "falling" ? "arrow-down" : "arrow-up") + (this.state.sortValue === "alphabetical" ? "-selected" : "")}></i>
                                                </th>
                                                <th onClick = {this.handleOrderChangeHeadType} className="cat-param">
                                                    Typ 
                                                    <i className={(this.state.orderValue === "falling" ? "arrow-down" : "arrow-up") + (this.state.sortValue === "type" ? "-selected" : "")}></i>
                                                </th>
                                                <th onClick = {this.handleOrderChangeHeadPublisher} className="cat-param">
                                                    Uppladdat av 
                                                    <i className={(this.state.orderValue === "falling" ? "arrow-down" : "arrow-up") + (this.state.sortValue === "publisher" ? "-selected" : "")}></i>
                                                </th>
                                                <th onClick = {this.handleOrderChangeHeadDate} className="cat-param">
                                                    Uppladdningsdatum
                                                    <i className={(this.state.orderValue === "falling" ? "arrow-down" : "arrow-up") + (this.state.sortValue === "date" || this.state.sortValue === "dateStart" ? "-selected" : "")}></i>
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
                                                                <div className = "download-btn-circle">
                                                                    <i className = "download-btn-arrow"></i>
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
                                                            <div className = "download-btn-circle">
                                                                <i className = "download-btn-arrow"></i>
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

export default Document;
import React, { Component } from 'react';
import classes from './Document.module.css';

class DocumentCard extends Component {
    render() {
        return (
            <div className={classes.docCards}>
                <h5>{this.props.doctype}</h5>
                <h3>{this.props.headingText}</h3>
                <p>Uppladdat: {this.props.publishDate}</p>
                <p>Av: {this.props.publisher}</p>

                <div className = {classes.downloadBtnCircle}>
                    <i className = {classes.downloadBtnArrow}></i>
                </div>
            </div>
        );
    }
}

export default DocumentCard;
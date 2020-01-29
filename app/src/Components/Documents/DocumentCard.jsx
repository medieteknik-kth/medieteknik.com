import React, { Component } from 'react';

class DocumentCard extends Component {
    render() {
        return (
            <div className={'doc-cards'}>
                <b>{this.props.doctype}</b>
                <h2>{this.props.headingText}</h2>
                <p>Uppladdat: {this.props.publishDate}</p>
                <p>Av: {this.props.publisher}</p>

                <div className = "download-btn-circle">
                    <i className = "download-btn-arrow"></i>
                </div>
            </div>
        );
    }
}

export default DocumentCard;
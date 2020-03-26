import React, { Component } from 'react';

class PublishDocuments extends Component {
    render() {
        return (
            <div>
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>Förnamn </label>
                    <input
                        id="forName"
                        type="text"
                        name="name"
                        placeholder="Förnamn"
                        ref = {input => this.search = input}
                    />
                </div>
                
                <div>
                    <label>Efternamn </label>
                    <input
                        id="surName"
                        type="text"
                        name="name"
                        placeholder="Efternamn"
                        ref = {input => this.search = input}
                    />
                </div>
               



                <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}

export default PublishDocuments;
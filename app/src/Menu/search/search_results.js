//Gör filter och sorterar det som hämtas efter filter
import React, { Component } from "react";
import User from './search_users';
import Commitee from './search_commitees';
import Post from './search_posts';
import Document from './search_documents';

class Search extends Component {
    state = {
        results: [],            //Alla sökresultat
        displayable_results: [],        //Sökresultat som ska visas beroende på filter
        filters: ["users", "commitees", "posts", "documents"],      //Alla existerande filter
        active_filters: []          //Alla aktiva filter
    };

    //Tar emot alla sökresultat från menyn
    componentDidMount() { //Ändra så att den får in new_search_results sen!! Ändra den till component did receive props sen!
        let new_search_results = {      //Detta är bara ett hårdkodat exempel på sökresultat
            "users": [
                {
                    "alumni": null,
                    "email": "jeslundq@kth.se",
                    "facebook": "https://www.facebook.com/jesperlndqvist",
                    "first_name": "Jespeer",
                    "frack_name": "Joppe",
                    "id": 1,
                    "kth_id": null,
                    "kth_year": 2016,
                    "last_name": "Lundqvist",
                    "linkedin": "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/",
                    "officials_post": [
                        {
                            "committee_id": 1,
                            "end_date": null,
                            "id": 1,
                            "name": "haaj",
                            "officials_email": null,
                            "start_date": null
                        },
                        {
                            "committee_id": 1,
                            "end_date": null,
                            "id": 2,
                            "name": "val",
                            "officials_email": null,
                            "start_date": null
                        }
                    ],
                    "profile_picture": "false"
                }
            ],
            "commitees": [
                {
                  "id": 1, 
                  "name": "MKMKMKMKH\u00c4STEN HETER F\u00d6L", 
                  "posts": [
                    {
                      "committee_id": 1, 
                      "end_date": null, 
                      "id": 1, 
                      "name": "haaj", 
                      "officials_email": null, 
                      "start_date": null
                    }, 
                    {
                      "committee_id": 1, 
                      "end_date": null, 
                      "id": 2, 
                      "name": "val", 
                      "officials_email": null, 
                      "start_date": null
                    }
                  ]
                }
              ],
            "posts": [
                {
                    "committee_id": 1,
                    "end_date": null,
                    "id": 1,
                    "name": "haaj",
                    "officials_email": null,
                    "start_date": null
                }
            ],
            "documents": [
                {
                  "itemId": 1, 
                  "tags": [
                    2, 
                    3
                  ], 
                  "title": "PROTOKOLLLLLA IN DET H\u00c4R"
                }
              ]
        }
        this.setState({ results: new_search_results }) //Ändra detta till new_search_results när vi faktiskt skickar in värden från sökrutan
        if (this.state.active_filters) {
            //Visa filtrerade resultat (dvs sätt displayable_results)
            this.filter_results(new_search_results) //Gå in i funktionen filter_results() som filtrerar alla resultat
        }
        else {
            //Om inga aktiva filter sätt alla resultat till displayable_results
            this.setState({ displayable_results: new_search_results })
        }
    }

    //Filtrerar alla resultat efter aktiva filter
    filter_results = () => {
        let new_search_results = this.state.results
        let filtered_results = {};
        this.state.active_filters.map((filter) =>   //Gå igenom alla aktiva filter och lägg till resultat i filtered_results
            filtered_results[filter] = new_search_results[filter]
        );
        this.setState({ displayable_results: filtered_results }) //Sätt filtrerade resultat till displayable_results
    }

    handleInputChange = (event) => {
        let old_filters = this.state.active_filters
        if (event.target.checked) {
            old_filters.push(event.target.name)
            this.setState({active_filters: old_filters})
        }
        else {
            for( var i = 0; i < old_filters.length; i++){ 
                if ( old_filters[i] === event.target.name) {
                  old_filters.splice(i, 1); 
                  this.setState({active_filters: old_filters})
                }
             }
        }
        this.filter_results()
    }

    render() {
        let displayed_users
        let displayed_commitees
        let displayed_posts
        let displayed_documents

        if (this.state.displayable_results["users"]) {
            displayed_users = <div><h4>Users</h4> {this.state.displayable_results["users"].map((user) => <User key={user.id} user={user} />)}</div>
        }

        if (this.state.displayable_results["commitees"]) {
            displayed_commitees = <div> <h4>Commitees</h4> {this.state.displayable_results["commitees"].map((commitee) => <Commitee key={commitee.id} commitee={commitee} />)} </div>
        }

        if (this.state.displayable_results["posts"]) {
            displayed_posts = <div> <h4>Posts</h4> {this.state.displayable_results["posts"].map((post) => <Post key={post.id} post={post} />)}</div>
        }

        if (this.state.displayable_results["documents"]) {
            displayed_documents = <div> <h4>Documents</h4> {this.state.displayable_results["documents"].map((document) => <Document key={document.id} document={document} />)}</div>
        }

        return (
            <div className="search">
                <div className="filters">
                    <form>
                        <label>
                            Users
                    <input type="checkbox" name="users" onChange={this.handleInputChange} />
                        </label>
                        <label>
                            Commitees
                    <input type="checkbox" name="commitees" onChange={this.handleInputChange}/>
                        </label>
                        <label>
                            Posts
                    <input type="checkbox" name="posts" onChange={this.handleInputChange}/>
                        </label>
                        <label>
                            Documents
                    <input type="checkbox" name="documents" onChange={this.handleInputChange}/>
                        </label>
                    </form>
                </div>
                <div className="results_container">
                    {displayed_users}
                    {displayed_commitees}
                    {displayed_posts}
                    {displayed_documents}
                </div>
            </div>
        );
    }
}

export default Search;

import React from 'react';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {} };
    }

    componentDidMount() {
        fetch("http://localhost:5000/user/1").then(response => response.json())
        .then(data => {
            this.setState({user: data});
        });
    }

    render() {
        return <div>
            <h1>{this.state.user.first_name} {this.state.user.last_name}</h1>
            <p>Email: {this.state.user.email}</p>
            <p>Fracknamn: {this.state.user.frack_name}</p>
            <p>Började på KTH: {this.state.user.kth_year}</p>
            <p><a href={this.state.user.facebook}>Facebook</a> - <a href={this.state.user.linkedin}>LinkedIn</a></p>
        </div>;
    }
}

export default User;

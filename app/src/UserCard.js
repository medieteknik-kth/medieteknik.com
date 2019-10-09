import React from 'react';

class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {} };
    }

    componentDidMount() {
        fetch("/api/user/" + this.props.id).then(response => response.json())
        .then(data => {
            this.setState({user: data});
        });
    }

    render() {
        return <div class="userCard">
            <h1>{this.state.user.first_name} {this.state.user.last_name}</h1>
            <p>Email: {this.state.user.email}</p>
            <p>Fracknamn: {this.state.user.frack_name}</p>
            <p>Började på KTH: {this.state.user.kth_year}</p>
            <p><a href={this.state.user.facebook}>Facebook</a> - <a href={this.state.user.linkedin}>LinkedIn</a></p>
        </div>;
    }
}

export default UserCard;

import React, { Component } from "react";

class User extends Component {
constructor(props) {
    super(props)
    console.log(props.user)
}
    componentWillReceiveProps(user) { //Se över om denna funktion behövs
        console.log("hej")
        console.log(user)
    }
    render() {
        return (
            <div>
                <h6>Namn: {this.props.user.first_name} {this.props.user.last_name} ({this.props.user.frack_name})</h6>
            </div>
        );
    }
}

export default User;

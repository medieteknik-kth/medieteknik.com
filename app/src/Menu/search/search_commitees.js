import React, { Component } from "react";

class Commitee extends Component {
constructor(props) {
    super(props)
    console.log(props.commitee)
}
    componentWillReceiveProps(commitee) { //Se över om denna funktion behövs
        console.log("hej")
        console.log(commitee)
    }
    render() {
        return (
            <div>
                <h6>Namn: </h6>
            </div>
        );
    }
}

export default Commitee;

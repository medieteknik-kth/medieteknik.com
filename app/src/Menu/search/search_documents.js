import React, { Component } from "react";

class Document extends Component {
constructor(props) {
    super(props)
    console.log(props.document)
}
    componentWillReceiveProps(document) { //Se över om denna funktion behövs
        console.log("hej")
        console.log(document)
    }
    render() {
        return (
            <div>
                <h6>Namn: </h6>
            </div>
        );
    }
}

export default Document;

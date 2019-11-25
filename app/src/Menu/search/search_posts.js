import React, { Component } from "react";

class Post extends Component {
    constructor(props) {
        super(props)
        console.log(props.post)
    }
    componentWillReceiveProps(post) { //Se över om denna funktion behövs
        console.log("hej")
        console.log(post)
    }
    render() {
        return (
            <div>
                <h6>Namn: {this.props.post.name}</h6>
            </div>
        );
    }
}

export default Post;

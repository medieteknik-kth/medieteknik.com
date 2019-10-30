import React from "react";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "" };
  }
  render() {
    let header = "";
    if (this.state.username) {
      header = <h1>Redigera din profil</h1>;
    } else {
      header = "";
    }
    return (
      <form>
        {header}
        <p>Namn: </p>
        <input type="text" onChange={this.myChangeHandler} placeholder="Namn" />
        <p>Efternamn: </p>
        <input
          type="text"
          onChange={this.myChangeHandler}
          placeholder="Efternamn"
        />
        <p>Email: </p>
        <input
          type="text"
          onChange={this.myChangeHandler}
          placeholder="Email"
        />
        <p>Facebook: </p>
        <input
          type="text"
          onChange={this.myChangeHandler}
          placeholder="Facebook"
        />
        <p>Linkedin: </p>
        <input
          type="text"
          onChange={this.myChangeHandler}
          placeholder="Linkedin"
        />
      </form>
    );
  }
}

/* ReactDOM.render(<MyForm />, document.getElementById('root')); */

export default UserForm;

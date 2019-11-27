import React from "react";
import { UserConsumer } from "./UserContext.js";
import "./componentsCSS/UserFormTest.css";
import ImageUpload from "./ImageUpload.js";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // var d = new Date();
    var year = new Date().getFullYear();

    return (
      <UserConsumer>
        {({ user }) => (
          <React.Fragment>
            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input type="text" className="effect-2" />
              <span className="focus-border"></span>
            </form>
          </React.Fragment>
        )}
      </UserConsumer>
    );
  }
}
export default UserForm;

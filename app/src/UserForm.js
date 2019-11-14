import React from "react";
import { UserConsumer } from "./UserContext.js";
import "./componentsCSS/UserForm.css";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <UserConsumer>
        {({ user }) => (
          <React.Fragment>
            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="text"
                pattern=".+"
                required
                placeholder="First Name"
                value={user.first_name}
              />
              <label>Last Name</label>
            </form>
            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="text"
                pattern=".+"
                required
                placeholder="Last Name"
                value={user.last_name}
              />
              <label>First Name</label>
            </form>

            <input class="submitButton" type="submit" value="Submit" />
          </React.Fragment>
        )}
      </UserConsumer>
    );
  }
}
export default UserForm;

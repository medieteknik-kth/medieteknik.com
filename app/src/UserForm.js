import React from "react";
import { UserConsumer } from "./UserContext.js";
import "./componentsCSS/UserForm.css";
import ImageUpload from "./ImageUpload.js";

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
                /* pattern="[A-Za-z]{99}" */
                required
                placeholder="First Name"
                value={user.first_name}
                title="First names contains only of letters"
              />
              <label>First Name</label>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="text"
                /* pattern="[A-Za-z]{99}" */
                required
                placeholder="Last Name"
                value={user.last_name}
                title="Last names contains only of letters"
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
                placeholder="Frack Name"
                value={user.frack_name}
              />
              <label>Frack Name</label>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="text"
                required
                placeholder="Link to Facebook"
                value={user.facebook}
              />
              <label>Link to Facebook</label>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="text"
                required
                placeholder="Link to LinkedIn"
                value={user.linkedin}
              />
              <label>Link to LinkedIn</label>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="numbers"
                /* pattern="[1-2][0-9]{3}" */
                required
                placeholder="Antagningsår KTH"
                value={user.kth_name}
                title="The year you started KTH, on the form YYYY"
              />
              <label>Antagningsår KTH</label>
            </form>

            <input type="reset" value="Reset" />
            <p>Alumni</p>
            <input
              className="alumniCheckbox"
              type="radio"
              name="alumni"
              value={user.alumni}
              placeholder="Alumni"
            />

            <p>Bild:</p>
            <ImageUpload />
          </React.Fragment>
        )}
      </UserConsumer>
    );
  }
}
export default UserForm;

import React from "react";
import { UserConsumer } from "./UserContext.js";
import "./componentsCSS/UserForm.css";
import ImageUpload from "./ImageUpload.js";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var year = new Date().getFullYear();

    return (
      <UserConsumer>
        {({ user }) => (
          <div id="userFormContainer">
            <span class="userFormContainerHeader">FORMULÄR</span>
            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                className="input-req"
                type="text"
                pattern="[\p{L}\s-]{1,99}"
                required
                value={user.first_name}
                title="Namn innehåller bara bokstäver t.ex 'Leif' "
              />
              <label className="floating-label-req">NAMN</label>
              <span className="focus-border"></span>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                className="input-req"
                type="text"
                pattern="[\p{L}\s-]{1,99}"
                required
                value={user.last_name}
                title="Efternamn innehåller bara bokstäver t.ex 'Mediasson' "
              />
              <label className="floating-label-req">EFTERNAMN</label>
              <span className="focus-border"></span>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="text"
                className="input-not-req"
                placeholder=" "
                value={user.frack_name}
                title="Ej obligatorisk, visas som namn för phösare under mottagningen."
              />
              <label className="floating-label-non-req">FRACKNAMN</label>
              <span className="focus-border"></span>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="url"
                placeholder=" "
                className="inputURL"
                value={user.facebook}
              />
              <label className="URLfloating-label">FACEBOOK</label>
              <span className="focus-border"></span>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="url"
                placeholder=" "
                className="inputURL"
                value={user.linkedin}
              />
              <label className="URLfloating-label">LINKEDIN</label>
              <span className="focus-border"></span>
            </form>

            <form
              className="field"
              method="POST"
              action={"/api/user/" + user.id}
            >
              <input
                type="number"
                className="input-req"
                name="points"
                min="1999"
                max={year}
                step="1"
                required
                title="Året du startade KTH, på formen YYYY"
              />
              <label className="floating-label-req">ANTAGNINGSÅR </label>
              <span className="focus-border"></span>
            </form>

            <input type="reset" value="Reset" />
            <br />
            <p>Alumni</p>

            <input
              className="alumniCheckbox"
              type="checkbox"
              value="alumni"
              checked
              name="alumni"
              value={user.alumni}
              placeholder="Alumni"
            />
            <p>Bild:</p>
            <ImageUpload />
          </div>
        )}
      </UserConsumer>
    );
  }
}
export default UserForm;

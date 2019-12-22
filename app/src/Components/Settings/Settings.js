import React from "react";
import { UserConsumer } from "./UserContext.js";
import "./UserForm.css";
import ImageUpload from "../Common/Form/ImageUpload.js";

class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var year = new Date().getFullYear();

    return (
          <div id="userFormContainer">
            <span class="userFormContainerHeader">FORMULÄR</span>
            <form method="POST"
            enctype="multipart/form-data"
            >
            <div
              className="field"
            >
              <input
                className="input-req"
                type="text"
                pattern="[\p{L}\s-]{1,99}"
                required
                title="Namn innehåller bara bokstäver t.ex 'Leif' "
              />
              <label className="floating-label-req">NAMN</label>
              <span className="focus-border"></span>
            </div>

            <div
              className="field"
            >
              <input
                className="input-req"
                type="text"
                pattern="[\p{L}\s-]{1,99}"
                required
                title="Efternamn innehåller bara bokstäver t.ex 'Mediasson' "
              />
              <label className="floating-label-req">EFTERNAMN</label>
              <span className="focus-border"></span>
            </div>

            <div
              className="field"
            >
              <input
                type="text"
                className="input-not-req"
                placeholder=" "
                title="Ej obligatorisk, visas som namn för phösare under mottagningen."
              />
              <label className="floating-label-non-req">FRACKNAMN</label>
              <span className="focus-border"></span>
            </div>

            <div
              className="field"
            >
              <input
                type="url"
                placeholder=" "
                className="inputURL"
              />
              <label className="URLfloating-label">FACEBOOK</label>
              <span className="focus-border"></span>
            </div>

            <div
              className="field"
            >
              <input
                type="url"
                placeholder=" "
                className="inputURL"
              />
              <label className="URLfloating-label">LINKEDIN</label>
              <span className="focus-border"></span>
            </div>

            <div
              className="field"
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
            </div>

            <input type="reset" value="Reset" />
            <br />
            <p>Alumni</p>

            <input
              className="alumniCheckbox"
              type="checkbox"
              value="alumni"
              checked
              name="alumni"
              placeholder="Alumni"
            />
            <p>Bild:</p>
            <ImageUpload name="profile_picture" />
            <input type="submit" value="Spara" />
            </form>
          </div>
    );
  }
}
export default Settings;

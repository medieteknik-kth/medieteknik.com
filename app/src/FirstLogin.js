import React from "react";
import { UserConsumer } from "./UserContext.js";

class FirstLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <UserConsumer>
        {({ user }) => (
          <form
            class="firstLoginForm text-bg"
            method="POST"
            action={"/api/user/" + user.id}
          >
            <div style={{ padding: "10px" }}>
              <h1 class="text-title">
                Det ser ut som att det är första gången du loggar in.
              </h1>
              <h2 class="text-subtitle">
                Fyll i lite information om dig själv!
              </h2>
            </div>
            {/*<h3 class="text-subtitle">Förnamn:</h3>*/}
            <input
              type="text"
              name="first_name"
              class="firstLoginFormInput"
              placeholder="Namn"
            />
            {/*<h3 class="text-subtitle">Efternamn:</h3> */}
            <input
              type="text"
              name="last_name"
              class="firstLoginFormInput"
              placeholder="Efternamn"
            />
            {/*<h3 class="text-subtitle">Email:</h3>*/}
            <input
              type="text"
              name="email"
              class="firstLoginFormInput"
              placeholder="Email"
            />
            {/*<h3 class="text-subtitle">Året du började på KTH:</h3> */}
            <input
              type="text"
              name="kth_year"
              class="firstLoginFormInput"
              placeholder="Året du började KTH"
            />
            <br />
            <br />
            <input
              type="hidden"
              name="redirect"
              value={window.location.origin}
            />
            <input type="submit" value="Spara!" class="firstLoginFormButton" />
          </form>
        )}
      </UserConsumer>
    );
  }
}

export default FirstLogin;

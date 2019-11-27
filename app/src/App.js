import React from "react";
import "./style.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import UserList from "./UserList.js";
import UserForm from "./UserForm.js";
import FirstLogin from "./FirstLogin.js";
import { UserProvider, UserConsumer } from "./UserContext.js";

function App() {
  return (
    <Router>
      <UserProvider>
        <Switch>
          <Route exact path="/">
            <div>
              <UserConsumer>
                {({ loggedin, user, login, logout }) =>
                  loggedin ? (
                    <p>
                      Inloggad som {user.first_name} {user.last_name}.{" "}
                      <button onClick={logout}>Logga ut</button>
                    </p>
                  ) : (
                    <p>
                      Inte inloggad. <button onClick={login}>Logga in</button>
                    </p>
                  )
                }
              </UserConsumer>
            </div>
            <UserList />
          </Route>
          <Route path="/user/edit">
            <UserForm />
          </Route>
          <Route path="/user/first">
            <FirstLogin />
          </Route>
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;

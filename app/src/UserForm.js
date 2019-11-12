import React from "react";
import { UserConsumer } from "./UserContext.js";
import ImageUpload  from "./ImageUpload.js";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <UserConsumer>
        {({ user }) => (
          <form method="POST" action={"/api/user/" + user.id}>
            
            <p>First name:</p>
            <input type="text" name="first_name" value={user.first_name} />
            
            <p>Last name:</p>
            <input type="text" name="last_name" value={user.last_name} />
            
            <p>Fracknamn:</p>
            <input type="text" name="frack_name" value={user.frack_name} />
            
            <p>Facebook</p>
            <input type="text" name="facebook" value={user.facebook} />
            
            <p>LinkedIn:</p>
            <input type="text" name="linkedin" value={user.linkedin} />
            
            <p>Året du började på KTH: </p>
            <input type="number" name="kth_year" value={user.kth_name} />

            <p>Alumn:</p>
            <input type="checkbox" name="alumni" value={user.alumni} />

            <p>Bild:</p>
            <ImageUpload/>
            
            <input type="submit" value="Submit" />



          </form>
        )}
      </UserConsumer>
    );
  }
}
export default UserForm;

import React from 'react';
import { UserConsumer } from './UserContext.js';

class UserForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UserConsumer>
            { ({ user }) => <form method="POST" action={"/api/user/" + user.id}>
                    <p>First name:</p>
                    <input type="text" name="first_name" value={user.first_name} />
                    <p>Last name:</p>
                    <input type="text" name="last_name" value={user.last_name} />
                    <input type="submit" value="Submit" />
                </form>
            }
            </UserConsumer>
        );
    }
}

export default UserForm;

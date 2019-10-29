import React from 'react'; 

class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: ''};
    }
    render() {
        let header = '';
        if (this.state.username) {
            header = <h1>Redigera din profil</h1> 
        }  else { 
            header = '';
        }
        return (
            <form>
                {header}
                <p>Namn: </p>
                <input 
                type='text'
                onChange={this.myChangeHandler}
                />
            </form>
        );
    }
}

/* ReactDOM.render(<MyForm />, document.getElementById('root')); */

export default UserForm; 
import React, { useState, useEffect } from 'react';
import './ProfileCard.css'
import Api from '../../../Utility/Api.js'

const ProfileCard = (props) => {

    const [user, setUser] = useState({profilePicture: '', firstName: '', lastName: ''});

    useEffect(() => {
        Api.Users.GetById(props.userId)
          .then((data) => {
            setUser(data);
          });
    }, []);

    return (
        <div className='profile-card'>
            <img src={user.profilePicture}/>
            <div className='profile-details'>
                <h4 className='profile-name'>{user.firstName + ' ' + user.lastName}</h4>
                <h5 className='profile-title'>Insert committee here</h5>
            </div>
        </div>
    );
}

export default ProfileCard;
import React, { useState, useEffect } from 'react';
import './ProfileCard.css'
import Api from '../../../Utility/Api.js'

const ProfileCard = (props) => {

    const [user, setUser] = useState({profilePicture: '', firstName: '', lastName: ''});
    const [committee, setCommittee] = useState({name: ''});

    useEffect(() => {
        Api.Users.GetById(props.userId)
          .then((data) => {
            setUser(data);
          });

        Api.Committees.GetById(props.committeeId)
        .then((data) => {
            setCommittee(data);
        });
    }, []);

    return (
        <div className='profile-card'>
            <img src={Api.Images(user.profilePicture)}/>
            <div className='profile-details'>
                <h4 className='profile-name'>{user.firstName + ' ' + user.lastName}</h4>
                <h5 className='profile-title'>{committee.name}</h5>
            </div>
        </div>
    );
}

export default ProfileCard;
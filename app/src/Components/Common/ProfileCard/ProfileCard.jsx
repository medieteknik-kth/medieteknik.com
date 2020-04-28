import React, { useState, useEffect } from 'react';
import './ProfileCard.css'
import Api from '../../../Utility/Api.js'
import { NavLink } from 'react-router-dom';

const ProfileCard = (props) => {

    const [user, setUser] = useState({profilePicture: '', firstName: '', lastName: ''});
    const [committee, setCommittee] = useState({id: 0, name: ''});

    useEffect(() => {
        Api.Users.GetById(props.userId)
          .then((data) => {
            setUser(data);
          });

        if(props.committeeId) {
            Api.Committees.GetById(props.committeeId)
            .then((data) => {
                setCommittee(data);
            });
        }
    }, []);

    return (
        <div className='profile-card'>
            <img src={Api.Images(user.profilePicture)}/>
            <div className='profile-details'>
                <h4 className='profile-name'>{user.firstName + ' ' + user.lastName}</h4>
                <NavLink to={`/committees/${committee.id}`}>
                    <h5 className='profile-title'>{committee.name}</h5>
                </NavLink>
            </div>
        </div>
    );
}

export default ProfileCard;
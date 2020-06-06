import React, { useState, useEffect } from 'react';
import Api from '../../../Utility/Api'
import { NavLink } from 'react-router-dom';
import './CommitteeCard.css'

const CommitteeCard = ({committeeId}) => {
    const [committee, setCommittee] = useState({committeePicture: '', name: ''})

    useEffect(() =>{
        Api.Committees.GetById(committeeId)
        .then(data => setCommittee(data));
    }, []);

    return (
        <div className="committee-card">
            <img src={Api.Images(committee.logo)}/>
            <div className="comittee-details">
                <NavLink to={`/committees/${committee.id}`}>
                    <h5 className="committee-title">{committee.name}</h5>
                </NavLink>
                <p>
                    {committee.description}
                </p>
            </div>
        </div>
    )
}

export default CommitteeCard;
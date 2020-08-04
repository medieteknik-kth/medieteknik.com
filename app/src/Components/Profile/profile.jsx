import React, { useState, useContext } from 'react';
import Api, { API_BASE_URL } from '../../Utility/Api'
import { UserContext } from '../../Contexts/UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import './profile.css'

const Profile = (props) => {
    const { user, updateUser } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [frackName, setFrackName] = useState(user.frackName)
    const [facebook, setFacebook] = useState(user.facebook)
    const [linkedIn, setLinkedIn] = useState(user.linkedin)
    const [alumni, setAlumni] = useState(user.alumni)

    const onFormSubmit = () => {
        let fd = new FormData()
        if (firstName) fd.append('first_name', firstName)
        if (lastName) fd.append('last_name', lastName)
        if (frackName) fd.append('frack_name', frackName)
        if (linkedIn) fd.append('linkedin', linkedIn)
        if (facebook) fd.append('facebook', facebook)
        Api.Users.Update(user.id, fd, window.localStorage.getItem('user_token'), false).then(() => {
            // toggle editing to off
            setIsEditing(false)
            updateUser()
        })
    }

    return (
        <div className="parent">
            {user ?
                (<div className="profile-container">
                    <div className="info-container">
                        {isEditing ? <div>
                            <h3>Redigera profil</h3>
                            <div className="field">
                                <label className="floating-label-req">Förnamn</label>
                                <input
                                    className="input-req"
                                    required
                                    value={firstName}
                                    pattern="[a-zA-Z0-9\s]+"
                                    onChange={v => setFirstName(v.target.value)}
                                />

                                <span className="focus-border" />
                            </div>
                            <div
                                className="field"
                            >

                                <label className="floating-label-req">Efternamn</label>
                                <input
                                    className="input-req"
                                    type="text"
                                    pattern="[a-zA-Z0-9\s]+"
                                    required
                                    value={lastName}
                                    onChange={v => setLastName(v.target.value)}
                                />
                                <span className="focus-border" />
                            </div>
                            <div
                                className="field"
                            >
                                <label className="floating-label-non-req">Fracknamn</label>

                                <input
                                    type="text"
                                    className="input-not-req"
                                    placeholder=" "
                                    value={frackName}
                                    placeholder="fracknamn"
                                    onChange={v => setFrackName(v.target.value)}
                                />
                                <span className="focus-border" />
                            </div>
                            <div
                                className="field"
                            >
                                <label className="URLfloating-label">Facebook-länk</label>
                                <input
                                    type="url"
                                    placeholder=" "
                                    className="inputURL"
                                    value={facebook}
                                    onChange={v => setFacebook(v.target.value)}
                                    placeholder="länk till din facebook-profil"
                                />

                                <span className="focus-border" />
                            </div>

                            <div
                                className="field"
                            >
                                <label className="URLfloating-label">Linkedin-länk</label>
                                <input
                                    type="url"
                                    placeholder=" "
                                    className="inputURL"
                                    value={linkedIn}
                                    onChange={v => setLinkedIn(v.target.value)}
                                    placeholder="länk till din linkedin-profil"
                                />

                                <span className="focus-border" />
                            </div>
                            <br />

                            {/*
                            The endpoint doesn't allow updating alumni status, commenting this one out for now 
                            <input
                                className="alumniCheckbox"
                                type="checkbox"
                                value="alumni"
                                defaultChecked={alumni}
                                name="alumni"
                                placeholder="Alumni"
                                onChange={() => setAlumni(!alumni)}
                            /> */}
                        </div> : <div>

                                <h1>{user.firstName} {user.lastName}</h1>
                                {user.frackName ? <p>Även känd som <b>{user.frackName}</b></p> : <></>}
                                <div>
                                    {user.facebook ? <a href={user.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="black" size="lg" /></a> : <div />}
                                    {user.linkedin ? <a href={user.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="black" size="lg" /></a> : <div />}
                                </div>
                            </div>}
                    </div>
                    <div className="picture-container">
                        <img
                            className="userImage"
                            src={user.profilePicture}
                            alt={`${user.firstName} ${user.lastName}`}
                        />
                    </div>
                    <button className="submitButton" onClick={() => isEditing ? onFormSubmit() : setIsEditing(!isEditing)}>{isEditing ? "spara ändringar" : "Redigera profil"}</button>
                </div>)
                :
                (<div>
                    <p> No user logged in!</p>
                </div>)}
        </div>
    )
}

export default Profile
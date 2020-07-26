import React, { useState, useContext } from 'react';
import Api, { API_BASE_URL } from '../../Utility/Api'
import { UserContext } from '../../Contexts/UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import './profile.css'

const Profile = (props) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [frackName, setFrackName] = useState(user.frackName)
    const [facebook, setFacebook] = useState(user.facebook)
    const [linkedIn, setLinkedIn] = useState(user.linkedin)
    const [alumni, setAlumni] = useState(user.alumni)
    console.log(user)

    const onFormSubmit = () => {
        let fd = new FormData()
        fd.append('first_name', firstName)
        fd.append('last_name', lastName)
        fd.append('frack_name', frackName)
        fd.append('linkedin', linkedIn)
        fd.append('facebook', facebook)
        Api.Users.Update(user.id, fd, window.localStorage.getItem('user_token'), false)
    }

    return (
        user ?
            (<div className="profile-container">
                <div className="info-container">
                    {isEditing ? <div>
                            <div className="field">
                                <input
                                    className="input-req"
                                    required
                                    value={firstName}
                                    pattern="[\p{L}\s-]{1,99}"
                                    onChange={v => setFirstName(v.target.value)}
                                />
                                <label className="floating-label-req">Förnamn</label>
                                <span className="focus-border" />
                            </div>
                            <div
                                className="field"
                            >
                                <input
                                    className="input-req"
                                    type="text"
                                    pattern="[\p{L}\s-]{1,99}"
                                    required
                                    value={lastName}
                                    onChange={v => setLastName(v.target.value)}
                                />
                                <label className="floating-label-req">Efternamn</label>
                                <span className="focus-border" />
                            </div>
                            <div
                                className="field"
                            >
                                <input
                                    type="text"
                                    className="input-not-req"
                                    placeholder=" "
                                    value={frackName}
                                    placeholder="fracknamn"
                                    onChange={v => setFrackName(v.target.value)}
                                />
                                <label className="floating-label-non-req">Fracknamn</label>
                                <span className="focus-border" />
                            </div>
                            <div
                                className="field"
                            >
                                <input
                                    type="url"
                                    placeholder=" "
                                    className="inputURL"
                                    value={facebook}
                                    onChange={v => setFacebook(v.target.value)}
                                    placeholder="länk till din facebook-profil"
                                />
                                <label className="URLfloating-label">Facebook-länk</label>
                                <span className="focus-border" />
                            </div>

                            <div
                                className="field"
                            >
                                <input
                                    type="url"
                                    placeholder=" "
                                    className="inputURL"
                                    value={linkedIn}
                                    onChange={v => setLinkedIn(v.target.value)}
                                    placeholder="länk till din linkedin-profil"
                                />
                                <label className="URLfloating-label">Linkedin-länk</label>
                                <span className="focus-border" />
                            </div>
                            <br />
                            <p>Alumni</p>

                            <input
                                className="alumniCheckbox"
                                type="checkbox"
                                value="alumni"
                                defaultChecked={alumni}
                                name="alumni"
                                placeholder="Alumni"
                                onChange={() => setAlumni(!alumni)}
                            />
                    </div> : <div>

                            <h1>{user.firstName} {user.lastName}</h1>
                            {user.frackName ? <p>Även känd som <b>{user.frackName}</b></p> : <></>}
                            <div>
                                {user.facebook ? <a href={user.facebook}><FontAwesomeIcon className="userCardIcon" icon={faFacebookF} color="white" size="lg" /></a> : <div />}
                                {user.linkedin ? <a href={user.linkedin}><FontAwesomeIcon className="userCardIcon" icon={faLinkedinIn} color="white" size="lg" /></a> : <div />}
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
                <button className="submitButton" onClick={() => isEditing ? onFormSubmit() :setIsEditing(!isEditing)}>{isEditing ? "spara ändringar" : "Redigera profil"}</button>
            </div>)
            : (<></>)
    )
}

export default Profile
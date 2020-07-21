import React, { useState, useContext } from 'react';
import Api from '../../Utility/Api'
import { UserContext } from '../../Contexts/UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import './profile.css'

const Profile = (props) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false)
    console.log(user)
    return (
        user ?
            (<div className="profile-container">
                <div className="info-container">
                    {isEditing ? <div>
                        <form
                            method="PUT"
                            encType="multipart/form_data">
                            <div className="field">
                                <input
                                    className="input-req"
                                    required
                                    value={user.firstName}
                                    pattern="[\p{L}\s-]{1,99}"
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
                                    value={user.lastName}
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
                                    value={user.frackName}
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
                                    value={user.linkedin}
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
                                    value={user.linkedin}
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
                                defaultChecked={user.alumni}
                                name="alumni"
                                placeholder="Alumni"
                            />
                        </form>
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
                <button className="submitButton" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "spara ändringar" : "Redigera profil"}</button>
            </div>)
            : (<></>)
    )
}

export default Profile
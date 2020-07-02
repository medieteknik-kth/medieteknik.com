import React from 'react';
import './OfficialCard.css';

const OfficialCard = ({ user, title, email }) => {
  return (
    <div className='official-card'>
      <div className='official-title-box'>
        <div className='official-title-header'>
          <h4>{title}</h4>
        </div>
      </div>
      <div
        className='official-image'
        style={{backgroundImage: 'url("'+user.profilePicture+'")'}}
      />
      <div className='official-name'>{`${user.firstName} ${user.lastName}`}</div>
      <div className='official-email'>{email}</div>
    </div>
  );
}

export default OfficialCard
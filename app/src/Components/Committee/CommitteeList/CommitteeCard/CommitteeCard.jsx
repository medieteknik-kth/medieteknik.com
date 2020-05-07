import React from 'react';

import classes from './CommitteeCard.module.css';

const CommitteeCard = (props) => {
    return (
        <div className={classes.CommitteeCard}>
            <img src={props.committeeLogo}/>
            <p>{props.committeeName}</p>
        </div>
    )
}

export default CommitteeCard;
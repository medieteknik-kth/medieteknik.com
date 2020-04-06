import React from 'react';

import classes from './CommitteeCard.module.css';

const CommitteeCard = (props) => {
    return (
        <div className={classes.CommitteeCard}>
            <div className={classes.headerContainer}>
                <img src={props.committeeLogo} width='100'/>

                <div className={classes.titleContainer}>
                    <h3>{props.committeeName}</h3>
                </div>
                
            </div>
            
            <p>{props.committeeText}</p>
        </div>
    )
}

export default CommitteeCard;
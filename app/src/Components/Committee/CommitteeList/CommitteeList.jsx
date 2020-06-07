import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';

import Api from '../../../Utility/Api';
import classes from './CommitteeList.module.css';

// -------------------
// --- NÄMNDLOGGOR ---
import fotogruppenLogo from '../CommitteeAssets/fotogruppenLogo.png';
import idrottsnamndenLogo from '../CommitteeAssets/idrottsnamndenLogo.png';
import jubileetLogo from '../CommitteeAssets/jubileetLogo.jpg';
import komNLogo from '../CommitteeAssets/komNLogo.png';
import matlagetLogo from '../CommitteeAssets/matlagetLogo.png';
import mbdLogo from '../CommitteeAssets/mbdLogo.png';
import medielabbetLogo from '../CommitteeAssets/medielabbetLogo.png';
import metadorernaLogo from '../CommitteeAssets/metadorernaLogo.png';
import metaspexetLogo from '../CommitteeAssets/metaspexetLogo.png';
import mkmLogo from '../CommitteeAssets/mkmLogo.png';
import mtgnLogo from '../CommitteeAssets/mtgnLogo.png';
import nlgLogo from '../CommitteeAssets/nlgLogo.png';
import qnLogo from '../CommitteeAssets/qnLogo.png';
import spexMLogo from '../CommitteeAssets/spexMLogo.png';
import studienamndenLogo from '../CommitteeAssets/studienamndenLogo.png';
import styrelsenLogo from '../CommitteeAssets/styrelsenLogo.png';
import sanglederietLogo from '../CommitteeAssets/sanglederietLogo.png';
import valberedningenLogo from '../CommitteeAssets/valberedningenLogo.png';


import CommitteeCard from './CommitteeCard/CommitteeCard';
import CommitteePage from '../CommitteePage/CommitteePage';

export default function CommitteeList() {
    const [committees, setCommittees] = useState([]);
    const match = useRouteMatch();

    Api.Committees.GetAll().then((data) => {
        setCommittees(data);
    });

    return (
        <Switch>
            <Route path={`${match.path}/:committeeId`}>
                <CommitteePage />
            </Route>

            <Route path={match.path}>
                <div className={classes.committeeContainer}>
                    <h2>Nämnder och organ</h2>

                    <div className={classes.CommitteeList}>
                        {
                            Object.keys(committees).map(committeeKey => (
                                <Link to={"/committees/" + committees[committeeKey].id}><CommitteeCard 
                                    key = {committees[committeeKey].id}
                                    committeeName = {committees[committeeKey].name}
                                    committeeLogo = {committees[committeeKey].logo}
                                    committeeText = {committees[committeeKey].text}
                                    committeeLink = {committees[committeeKey].pageLink}
                                /></Link>
                            ))
                        }
                    </div>
                </div>
                
            </Route>
        </Switch>
    );
}

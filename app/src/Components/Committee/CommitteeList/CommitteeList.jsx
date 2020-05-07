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
    // const [committees, setCommittees] = useState([]);
    const match = useRouteMatch();

    const committees = {
        fotogruppen: {
            id: 1,
            name: 'Fotogruppen',
            logo: fotogruppenLogo
        },
        idrottsnamnden: {
            id: 2,
            name: 'Idrottsnämnden',
            logo: idrottsnamndenLogo
        },
        jubileet: {
            id: 3,
            name: 'Jubileet',
            logo: jubileetLogo
        },
        kommunikationsnamnden: {
            id: 4,
            name: 'Kommunikationsnämnden',
            logo: komNLogo
        },
        matlaget: {
            id: 5,
            name: 'Matlaget',
            logo: matlagetLogo
        },
        mediasBranschdag: {
            id: 6,
            name: 'Medias Branschdag',
            logo: mbdLogo
        },
        medielabbet: {
            id: 7,
            name: 'Medielabbet',
            logo: medielabbetLogo
        },
        metadorerna: {
            id: 8,
            name: 'METAdorerna',
            logo: metadorernaLogo
        },
        metaspexet: {
            id: 9,
            name: 'METAspexet',
            logo: metaspexetLogo
        },
        mediasKlubbmasteri: {
            id: 10,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo
        },
        mottagningen: {
            id: 11,
            name: 'Mottagningen',
            logo: mtgnLogo
        },
        naringslivsgruppen: {
            id: 12,
            name: 'Näringslivsgruppen',
            logo: nlgLogo
        },
        qulturnamnden: {
            id: 13,
            name: 'Qulturnämnden',
            logo: qnLogo
        },
        sanglederiet: {
            id: 14,
            name: 'Sånglederiet',
            logo: sanglederietLogo
        },
        spexmasteriet: {
            id: 15,
            name: 'Spexmästeriet',
            logo: spexMLogo
        },
        studienamnden: {
            id: 16,
            name: 'Studienämnden',
            logo: studienamndenLogo
        },
        styrelsen: {
            id: 17,
            name: 'Styrelsen',
            logo: styrelsenLogo
        },
        valberedningen: {
            id: 18,
            name: 'Valberedningen',
            logo: valberedningenLogo
        }
    }

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
                                <CommitteeCard 
                                    key = {committees[committeeKey].id}
                                    committeeName = {committees[committeeKey].name}
                                    committeeLogo = {committees[committeeKey].logo}
                                    committeeText = {committees[committeeKey].text}
                                />
                            ))
                        }
                    </div>
                </div>
                
            </Route>
        </Switch>
    );
}

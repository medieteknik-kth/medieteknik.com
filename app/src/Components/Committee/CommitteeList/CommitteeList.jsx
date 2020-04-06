import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';

import Api from '../../../Utility/Api';

import mbdLogo from '../CommitteeAssets/mbdLogo.png';
import mkmLogo from '../CommitteeAssets/mkmLogo.png';
import CommitteeCard from './CommitteeCard/CommitteeCard';

import CommitteePage from './CommitteePage';

export default function CommitteeList() {
    // const [committees, setCommittees] = useState([]);
    const match = useRouteMatch();

    const committees = {
        mbd: {
            id: 1,
            name: 'Medias Branschdag',
            logo: mbdLogo
            
        },
        mkm: {
            id: 2,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo
        }
    }
  

    useEffect(() => {
        // Api.Committees.GetAll()
        //   .then((data) => {
        //     setCommittees(data);
        //   });

    }, []);

    return (
        <Switch>
            <Route path={`${match.path}/:committeeId`}>
                <CommitteePage />
            </Route>

            <Route path={match.path}>
                <div>
                    {
                        committees.map(committeeObject => (
                            <CommitteeCard 
                                key = {committeeObject.id}
                                committeeName = {committeeObject.name}
                                committeeLogo = {committeeObject.logo}
                            />
                        ))
                    }
                </div>
            </Route>
        </Switch>
    );
}

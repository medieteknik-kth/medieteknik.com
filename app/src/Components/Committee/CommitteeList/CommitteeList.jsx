import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';

import Api from '../../../Utility/Api';
import classes from './CommitteeList.module.css';


import CommitteeCard from './CommitteeCard/CommitteeCard';
import CommitteePage from '../CommitteePage/CommitteePage';
import { LocaleText } from '../../../Contexts/LocaleContext';

export default function CommitteeList() {
  const [committees, setCommittees] = useState([]);
  const match = useRouteMatch();

  useEffect(() => {
    Api.Committees.GetAll().then((data) => {
      setCommittees(data);
    });
  }, []);

  return (
    <Switch>
      <Route path={`${match.path}/:committeeId`}>
        <CommitteePage />
      </Route>

      <Route path={match.path}>
        <div className={classes.committeeContainer}>
          <h2><LocaleText phrase="common/committees-and-projects" /></h2>

          <div className={classes.CommitteeList}>
            {
                            Object.keys(committees).map((committeeKey) => (
                              <Link to={`/committees/${committees[committeeKey].id}`}>
                                <CommitteeCard
                                  key={committees[committeeKey].id}
                                  committeeName={committees[committeeKey].name}
                                  committeeLogo={committees[committeeKey].logo}
                                  committeeText={committees[committeeKey].text}
                                  committeeLink={committees[committeeKey].pageLink}
                                />
                              </Link>
                            ))
                        }
          </div>
        </div>

      </Route>
    </Switch>
  );
}

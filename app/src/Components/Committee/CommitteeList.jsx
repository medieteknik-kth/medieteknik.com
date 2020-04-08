import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';
import Api from '../../Utility/Api';

import CommitteePage from './CommitteePage';

export default function CommitteeList() {
  const [committees, setCommittees] = useState([]);
  const match = useRouteMatch();

  useEffect(() => {
    Api.Committees.GetAll()
      .then((data) => {
        setCommittees(data);
      });
  }, []);

  return (
    <Switch>
      <Route path={`${match.path}/:committeeId`}>
        <CommitteePage />
      </Route>
      <Route path={match.path}>
        <div>
          {committees.map((value) => (
            <div>
              <Link to={`${match.url}/${value.id}`}><p key={value.id}>{value.name}</p></Link>
            </div>
          ))}
        </div>
      </Route>
    </Switch>

  );
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../Utility/Api';

import './CommitteePage.css';

export default function CommitteePage() {
  const { committeeId } = useParams();

  const [committee, setCommittee] = useState({});

  useEffect(() => {
    Api.Committees.GetById(committeeId)
      .then((data) => {
        setCommittee(data);
      });
  }, []);

  return (
    <div className="committeePage">
      <img src={committee.logo} alt={`${committee.name} logo`} width="64" height="64" />
      <h1>{committee.name}</h1>
    </div>
  );
}

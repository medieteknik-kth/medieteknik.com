import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../Utility/Api';

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
    <h1>{committee.name}</h1>
  );
}

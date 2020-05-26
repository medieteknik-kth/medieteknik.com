import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Api from '../../Utility/Api';

import './ManageMembers.css';
import { LocaleText } from '../../Contexts/LocaleContext';
import Button from '../Common/Button/Button';

export default function ManageMembers() {
  const { committeeId } = useParams();
  const [committee, setCommittee] = useState(null);

  useEffect(() => {
    Api.Committees.GetById(committeeId)
      .then((data) => {
        setCommittee(data);
      }, []);
  });

  const addMemberClicked = (event) => {
  };

  return (
    <div>
      {committee != null ? (
        <div className="content" style={{ marginTop: '125px' }}>
          <h1><LocaleText phrase="committee/manage/mng_members" /></h1>
          <h3>{committee.name}</h3>
          <table className="committeeMembersTable">
            <tr>
              <th><LocaleText phrase="common/name" /></th>
              <th><LocaleText phrase="common/post" /></th>
              <th><LocaleText phrase="common/start-date" /></th>
              <th><LocaleText phrase="common/end-date" /></th>
              <th><LocaleText phrase="common/manage" /></th>
            </tr>
            {committee.posts.map((post) => post.currentTerms.map((term) => (
              <tr>
                <td>
                  {`${term.user.firstName} ${term.user.lastName}`}
                </td>
                <td>{post.name}</td>
                <td>{new Date(term.startDate).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td>{new Date(term.endDate).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td>X</td>
              </tr>
            )))}
          </table>
          <Button onClick={addMemberClicked}><LocaleText phrase="committee/manage/add" /></Button>
        </div>
      ) : <div />}
    </div>
  );
}

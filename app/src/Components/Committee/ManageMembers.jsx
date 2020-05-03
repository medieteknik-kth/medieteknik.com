import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Api from '../../Utility/Api';

import './ManageMembers.css';
import { LocaleText } from '../../Contexts/LocaleContext';

export default function ManageMembers() {
  const { committeeId } = useParams();
  const [committee, setCommittee] = useState(null);

  useEffect(() => {
    Api.Committees.GetById(committeeId)
      .then((data) => {
        setCommittee(data);
      }, []);
  });

  return (
    <div>
      {committee != null ? (
        <div className="content" style={{ marginTop: '125px' }}>
          <h1><LocaleText phrase="committee/manage/mng_members"/></h1>
          <h3>{committee.name}</h3>
          <table className="committeeMembersTable">
            <tr>
              <th><LocaleText phrase="common/name"/></th>
              <th><LocaleText phrase="common/post"/></th>
            </tr>
            {committee.posts.map((post) => post.currentTerms.map((term) => (
              <tr>
                <td>
                  {`${term.user.firstName} ${term.user.lastName}`}
                </td>
                <td>{post.name}</td>
              </tr>
            )))}
          </table>
          <button
            style={{
              backgroundColor: '#f0c900', border: 'none', fontFamily: 'sans-serif', padding: '10px',
            }}
            type="button"
          >
            <span><LocaleText phrase="committee/manage/add"/></span>
          </button>
        </div>
      ) : <div />}
    </div>
  );
}

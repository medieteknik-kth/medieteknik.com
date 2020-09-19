import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import UserCard from '../../UserCard/UserCard';
import styles from './CommitteeMemberList.module.css';

export default function CommitteeMemberList(props) {
  const [termsToRemove, setTermsToRemove] = useState([]);
  const [termsToAdd, setTermsToAdd] = useState([]);

  const officials = props.posts.filter((post) => post.isOfficial);
  const others = props.posts.filter((post) => !post.isOfficial);
  const { isEditing } = props;


  const removeTerm = (term) => {
    setTermsToRemove([...termsToRemove, term]);

    if (termsToAdd.includes(term)) {
      setTermsToAdd(termsToAdd.filter((t) => t.id !== term.id));
    }
  };

  return (
    <div>
      <div
        className={styles.memberList}
      >
        {officials.map((post) => (post.currentTerms.map((term) => <UserCard key={term.user.id} user={term.user} subtitle={post.name} email={post.email} />)))}
      </div>
      {/* <Link to={`/managecommittee/${props.committee.id}`}><div className={styles.manageMembersButton}><FontAwesomeIcon icon={faUserEdit} color="black" size="lg" /></div></Link> */}
      <div
        className={styles.memberList}
      >
        {others.map((post) => (post.currentTerms.filter((term) => !termsToRemove.includes(term)).map((term) => <UserCard key={term.user.id} user={term.user} subtitle={post.name} email={post.email} canEdit={isEditing} didRemove={() => { removeTerm(term); }} />)))}
      </div>
    </div>
  );
}

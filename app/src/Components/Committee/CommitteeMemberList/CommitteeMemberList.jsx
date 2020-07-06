import React, { useState } from 'react';

import styles from './CommitteeMemberList.module.css';
import UserCard from '../../UserCard/UserCard';

export default function CommitteeMemberList(props) {
  const officials = props.posts.filter((post) => post.isOfficial);
  const others = props.posts.filter((post) => !post.isOfficial);
  return (
    <div>
      <div
        className={styles.memberList}
      >
        {officials.map((post) => (post.currentTerms.map((term) => <UserCard key={term.user.id} user={term.user} subtitle={post.name} email={post.email} />)))}
      </div>
      <div
        className={styles.memberList}
      >
        {others.map((post) => (post.currentTerms.map((term) => <UserCard key={term.user.id} user={term.user} subtitle={post.name} email={post.email} />)))}
      </div>
    </div>
  );
}

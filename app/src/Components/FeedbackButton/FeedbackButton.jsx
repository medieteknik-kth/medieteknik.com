import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import styles from './FeedbackButton.module.scss';

export default function FeedbackButton() {
  const formUrl = 'https://forms.gle/kPAxHg5ruoxUisfP6';
  const openFeedback = () => {
    window.open(formUrl, '_blank');
  };
  return <button onClick={openFeedback} className={styles.feedbackButton}><FontAwesomeIcon icon={faComments} size="2x" /></button>;
}

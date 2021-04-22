import React, { useContext } from 'react';
import { LocaleContext, translateToString } from '../../Contexts/LocaleContext';

import styles from './AnnouncementBanner.module.scss';

export default function AnnouncementBanner() {
  const { lang } = useContext(LocaleContext);

  const data = {
    se: 'Ansökan är öppen för poster till SM#4! Klicka här för att söka eller nominera.',
    en: 'Applications are open for posts to CM#4! Click here to apply or nominate someone.',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSciuAGvHgcAAK6OVsoExetJO8MGcoGHedl-M8m9RSAYn2AHIw/viewform'
  };

  return (
    <div className={styles.banner}>
      <a href={data.link}>
        {translateToString({
          ...data,
          lang,
        })}
      </a>
    </div>
  );
}

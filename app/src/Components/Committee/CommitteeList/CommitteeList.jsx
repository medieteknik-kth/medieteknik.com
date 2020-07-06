import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Api from '../../../Utility/Api';
import classes from './CommitteeList.module.css';


import CommitteeCard from './CommitteeCard/CommitteeCard';
import { LocaleText } from '../../../Contexts/LocaleContext';
import Spinner from '../../Common/Spinner/Spinner.jsx';

export default function CommitteeList() {
  const [committees, setCommittees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Api.Committees.GetAll().then((data) => {
      setCommittees(data.filter((committee) => committee.page !== null));
    });
    setIsLoading(false);
  }, []);

  return (
    <div className={classes.committeeContainer}>
      <h2><LocaleText phrase="common/committees-and-projects" /></h2>
      { isLoading ? <Spinner />
        : (
          <div className={classes.CommitteeList}>
            {
                            Object.keys(committees).map((committeeKey) => (
                              <Link to={`/${committees[committeeKey].page.slug}`}>
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
        )}
    </div>
  );
}

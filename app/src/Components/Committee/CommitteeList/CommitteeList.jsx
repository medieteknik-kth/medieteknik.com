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
            setIsLoading(false);

            let tempCommittees = data.filter(committee => committee.page !== null);
            tempCommittees.sort((firstCommittee, secondCommittee) => {
                let firstCommitteeWeight = firstCommittee.posts[0].weight;
                let secondCommitteeWeight = secondCommittee.posts[0].weight;
                
                if (firstCommitteeWeight < secondCommitteeWeight) {
                    return -1;
                } else if (firstCommitteeWeight > secondCommitteeWeight) {
                    return 1;
                } else {
                    return 0;
                }
            })

            setCommittees(tempCommittees);
        });
    }, []);

  return (
    <div className={classes.committeeContainer}>
      <h2><LocaleText phrase="common/committees-and-projects" /></h2>
      { isLoading ? <Spinner />
        : (
          <div className={classes.CommitteeList}>
            {
                Object.keys(committees).map((committee) => {
                    return(
                        <Link to={`/${committees[committee].page.slug}`}>
                    
                        <CommitteeCard
                            key={committees[committee].id}
                            committeeName={committees[committee].name}
                            committeeLogo={committees[committee].logo}
                            committeeText={committees[committee].text}
                            committeeLink={committees[committee].pageLink}
                        />
                    </Link>
                    )
                    
                })
            }
          </div>
        )}
    </div>
  );
}

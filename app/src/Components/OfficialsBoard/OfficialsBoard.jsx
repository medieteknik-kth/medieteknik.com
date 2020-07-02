import React, { useState, useEffect } from 'react';
import OfficialCard from './OfficialCard';
import Api from '../../Utility/Api';

import './OfficialsBoard.css';
import Dropdown from '../Common/Form/Dropdown';
import Spinner from '../Common/Spinner/Spinner';
import { LocaleText } from '../../Contexts/LocaleContext';

export default function OfficialsBoard() {

  const operationalYears = [
    '2019/2020',
    '2018/2019'
  ]
  const [officials, setOfficials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [operationalYear, setOperationalYear] = useState(operationalYears[0]);

  useEffect(() => {
    setIsLoading(true);
    Api.Officials.GetWithParameters({ 'forOperationalYear' : operationalYear }).then((data) => {
      setOfficials(data)
      setIsLoading(false);
    });
  }, [operationalYear]);

  //Used for setting titles for category
  const titles = [];
  officials.map((official) =>
    !titles.includes(official.post.category)
      ? titles.push(official.post.category)
      : null
  );

  return (<div className='officials-board-container'>
    <div className='officials-board'>
      <div className='officials-header'>
        <h1><LocaleText phrase='common/officials'/></h1>
        <div className='officials-select'>
          <Dropdown 
            options={operationalYears.map(year => { return {value: year, label: year}})}
            onChange={(option) => setOperationalYear(option.value)}/>
        </div>
      </div>

      { isLoading ? <Spinner/> :
         titles.map((title) => (
          <div className='official-category' key={title}>
            <div className='category-header'>
              <h2>{title}</h2>
              <p>medieteknik@medieteknik.com</p> {/*TODO: Add backend for post category email*/}
            </div>

            <div className='user-list-official'>
              {officials
                .filter((official) => official.post.category === title)
                .map((official) => (
                  <OfficialCard
                    key={`${official.post.name}_${official.user.id}`}
                    user={official.user}
                    title={official.post.name}
                    email={official.post.email}
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
    </div>
  );
}

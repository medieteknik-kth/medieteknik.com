import React, { useState, useEffect } from 'react';
import OfficialCard from './OfficialCard';
import Api from '../../Utility/Api';

import './OfficialsBoard.css';
import Dropdown from '../Common/Form/Dropdown';
import Spinner from '../Common/Spinner/Spinner';
import { LocaleText } from '../../Contexts/LocaleContext';

export default function OfficialsBoard() {

  //TODO: Add backend for operational years
  const operationalYears = [
    '2019/2020',
    '2018/2019'
  ]
  const [officials, setOfficials] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [operationalYear, setOperationalYear] = useState(operationalYears[0])

  useEffect(() => {
    setIsLoading(true)
    Api.Officials.GetWithParameters({'forOperationalYear' : operationalYear}).then((data) => {
      setOfficials(data)
      setIsLoading(false)
    }).catch(err => {
      setIsLoading(false)
    });
  }, [operationalYear])

  const categories = officials.map(official => official.post.committeeCategory).filter((value, index, self) => self.map(x => x.id).indexOf(value.id) == index)

  return (
    <div className='officials-board-container'>
      <div className='officials-board'>
        <div className='officials-header'>
          <h1><LocaleText phrase='common/officials'/></h1>
          <div className='officials-select'>
            <Dropdown 
              options={operationalYears.map(year => { return {value: year, label: year}})}
              onChange={(option) => setOperationalYear(option.value)}/>
          </div>
        </div>

        { isLoading ? 
          <div className='officials-center'>
            <Spinner/>
          </div> :
          categories.length > 0 ? 
            categories.map((category) => (
              <div className='official-category' key={category.title}>
                <div className='category-header'>
                  <h2>{category.title}</h2>
                  <p>{category.email}</p>
                </div>

                <div className='officials-list'>
                  {officials
                    .filter((official) => official.post.committeeCategory.id === category.id)
                    .map((official) => (
                      <OfficialCard
                        key={`${official.post.name}_${official.user.id}`}
                        user={official.user}
                        title={official.post.name}
                        email={official.post.email}
                      />
                    ))}
                </div>
              </div>))
            : 
              <div className='officials-center'>
                <LocaleText phrase='officials/could_not_load'/>
              </div>
            }
      </div>
    </div>
  );
}

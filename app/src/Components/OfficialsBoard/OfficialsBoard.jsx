import React, { useState, useEffect } from 'react';
import OfficialCard from './OfficialCard';
import Api from '../../Utility/Api';

import './OfficialsBoard.css';
import Dropdown from '../Common/Form/Dropdown';
import Spinner from '../Common/Spinner/Spinner';
import { LocaleText } from '../../Contexts/LocaleContext';
var parser = new DOMParser();

export default function OfficialsBoard() {

  const [operationalYears, setOperationalYears]= useState([])
  const [officials, setOfficials] = useState([])
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingOfficials, setLoadingOfficials] = useState(false)
  const [operationalYear, setOperationalYear] = useState('')

  useEffect(() => {
    setLoadingYears(true)
    Api.OperationalYears.GetAll().then((data) => {
      setOperationalYears(data.years)
      setOperationalYear(data.current)
      setLoadingYears(false)
    }).catch(err => {
      setLoadingYears(false)
    });
  }, [])

  useEffect(() => {
    setLoadingOfficials(true)
    if(operationalYear !== '') {
      Api.Officials.GetWithParameters({'forOperationalYear' : operationalYear, 'hyphenate': true}).then((res) => {
      setOfficials(res)
      setLoadingOfficials(false)
      }).catch(err => {
        setLoadingOfficials(false)
      });
    } else {
      setLoadingOfficials(false)
    }
  }, [operationalYear])

  const categories = officials.map(official => official.post.committeeCategory).filter((value, index, self) => self.map(x => x.id).indexOf(value.id) === index)

  return (
    <div className='officials-board-container'>
      <div className='officials-board'>
        <div className='officials-header'>
        <h2><LocaleText phrase='common/officials'/></h2>
          { loadingYears ? 
            <div className='officials-center'>
                <Spinner/>
            </div> :
            <div className='officials-select'>
              <Dropdown 
                options={operationalYears.map(year => { return {value: year, label: year}})}
                onChange={(option) => setOperationalYear(option.value)}
                defaultValue={{value: operationalYear, label: operationalYear}}/>
            </div> 
          }
        </div>
        { loadingOfficials ?  
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
                          title={parser.parseFromString(official.post.name, 'text/html').body.innerHTML}
                          email={official.post.email}
                        />
                      ))}
                  </div>
                </div>))
            : 
              <div className='officials-center'>
                { loadingYears ? <></> : <LocaleText phrase='officials/could_not_load'/> }
              </div> }
      </div>
    </div>
  );
}

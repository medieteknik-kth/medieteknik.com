import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import CreatableSelect from 'react-select/creatable';

import Api from '../../Utility/Api';

import './ManageCommittee.scss';
import '../Page/Page.css';
import DatePicker from 'react-date-picker';

export default function ManageCommittee() {
  const { id } = useParams();
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [termsToChange, setTermsToChange] = useState([]);

  useEffect(() => {
    Api.CommitteePosts(id).GetAll().then((data) => {
      setIsLoading(false);
      setPosts(data);
    }).catch(() => {
      setIsLoading(false);
      setNotFound(true);
    });
  }, []);

  const terms = posts !== null ? posts.flatMap((post) => {
    const termsWithPost = post.terms;
    return termsWithPost.map((term) => ({ ...term, name: post.name, isOfficial: post.isOfficial }));
  }).sort((a, b) => new Date(a.startDate) < new Date(b.startDate)).map((term) => {
    const newTerm = termsToChange.find((t) => t.term.id === term.id);
    if (newTerm !== undefined) {
      switch (newTerm.action) {
        case 'update':
          return newTerm.term;
        case 'delete':
          return null;
        default:
          return null;
      }
    } else {
      return term;
    }
  }).filter((term) => term !== null && !term.isOfficial) : [];

  const termOptions = posts !== null ? posts.filter((post) => !post.isOfficial).map((post) => ({ value: post.id, label: post.name })) : [];

  const termOptionStyles = {
    valueContainer: (base) => ({
      ...base,
      width: 150,
    }),
  };

  const termOptionTheme = (theme) => ({
    ...theme,
    borderRadius: 0,
    colors: {
      ...theme.colors,
      primary25: '#fafafa',
      primary50: '#f0f0f0',
      primary: '#2d2d2d',
    },
  });

  const isTermCurrent = (term) => {
    const start = new Date(term.startDate);
    const end = new Date(term.endDate);
    const now = new Date();

    return start < now && now < end;
  };

  const updateTerm = (term) => {
    setTermsToChange([...termsToChange.filter((t) => term.id !== t.term.id), { action: 'update', term }]);
  };

  const removeTerm = (term) => {
    setTermsToChange([...termsToChange.filter((t) => term.id !== t.term.id), { action: 'remove', term }]);
  };

  return (
    <div>
      <h1 className="manageCommitteeHeader">Hantera poster</h1>
      <div className="manageCommitteeContainer">
        <table className="manageCommitteeTable">
          <thead>
            <tr>
              <th>Namn</th>
              <th>Post</th>
              <th>Start</th>
              <th>Slut</th>
              <th>Nuvarande</th>
              <th>Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term) => (
              <tr>
                <td>{`${term.user.firstName} ${term.user.lastName}`}</td>
                <td><CreatableSelect defaultValue={{ value: term.id, label: term.name }} options={termOptions} styles={termOptionStyles} theme={termOptionTheme} /></td>
                <td>
                  <DatePicker
                    onChange={(newDate) => {
                      const newTerm = term;
                      newTerm.startDate = newDate;
                      updateTerm(newTerm);
                    }}
                    value={new Date(term.startDate)}
                  />
                </td>
                <td>
                  <DatePicker
                    onChange={(newDate) => {
                      const newTerm = term;
                      newTerm.endDate = newDate;
                      updateTerm(newTerm);
                    }}
                    value={new Date(term.endDate)}
                  />
                </td>
                <td>{isTermCurrent(term) ? 'Ja' : 'Nej'}</td>
                <td className="icon"><button className="removeButton" type="button" aria-label="Remove" onClick={() => removeTerm(term)}><FontAwesomeIcon icon={faMinusCircle} color="black" size="lg" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

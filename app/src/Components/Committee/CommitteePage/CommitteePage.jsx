import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import Api from '../../../Utility/Api';
import UserCard from '../../UserCard/UserCard';
import BasePage from '../../Page/BasePage';
import { UserContext } from '../../../Contexts/UserContext';

import './CommitteePage.css';
import { LocaleContext } from '../../../Contexts/LocaleContext';

export default function CommitteePage() {
  const { committeeId } = useParams();

  const { user } = useContext(UserContext);
  const { lang } = useContext(LocaleContext);

  const [committee, setCommittee] = useState({});
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [content, setContent] = useState('');
  const [oldContent, setOldContent] = useState(null);

  const editingAllowed = user == null ? false : user.committeePostTerms.some((term) => term.post.committeeId === committee.id);

  const quillRef = null;

  useEffect(() => {
    Api.Committees.GetById(committeeId)
      .then((data) => {
        setCommittee(data);
        setPosts(data.posts);
        if (data.page) {
          try {
            const contentData = JSON.parse(lang === 'se' ? data.page.content_sv : data.page.content_en);
            setContent(contentData);
            setOldContent(contentData);
          } catch (error) {
            setOldContent(null);
            console.error(error);
          }
        }
      });
  }, []);

  const didPressEditButton = () => {
    if (committee.page) {
      if (isEditing) {
        if (content !== oldContent) {
          Api.Pages.Update(committee.page.id, {
            content: JSON.stringify(content),
            published: true,
          }).then(() => {
            // TODO: Meddelande att allt gått bra
            setOldContent(content);
          }).catch((error) => {
            alert('Kunde inte spara sida.');
            setIsEditing(true);
            console.error(error);
          });
        }
      }
    } else if (quillRef) {
      quillRef.focus();
    }

    setIsEditing(!isEditing);
  };

  const onChange = (contents) => {
    setContent(contents);
  };

  return (
    <div className="committeePage">
      <div
        className="committeePageHeader"
        style={
          { backgroundImage: `url('${committee.header_image}')` }
        }
      >
        {editingAllowed
          ? (
            <button type="button" className="committeePageEditButton" onClick={didPressEditButton}>
              <FontAwesomeIcon icon={isEditing ? faSave : faEdit} color="black" size="lg" />
            </button>
          )
          : <div />}
        <span className="committeePageHeaderText">{committee.name}</span>
      </div>
      <div className="committeePageContent content">
        { oldContent !== null
          ? <BasePage initialContent={oldContent} isEditing={isEditing} onChange={onChange} />
          : <div />}
      </div>
      <div
        className="committeePageFooter"
      >
        {posts.map((post) => (post.currentTerms.map((term) => <UserCard key={term.user.id} user={term.user} subtitle={post.name} email={post.email} />)))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import Api from '../../../Utility/Api';
import UserCard from '../../UserCard/UserCard';
import Page from '../../Page/Page';

import './CommitteePage.css';

export default function CommitteePage() {
  const { committeeId } = useParams();

  const [committee, setCommittee] = useState({});
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [oldContent, setOldContent] = useState(null);

  const quillRef = null;

  useEffect(() => {
    Api.Committees.GetById(committeeId)
      .then((data) => {
        setCommittee(data);
        setPosts(data.posts);
        posts.map((post) => (post.currentTerms.map((term) => console.log(term.user))));
        if (data.page) {
          try {
            const contentData = JSON.parse(data.page.content);
            setContent(contentData);
            setOldContent(contentData);
          } catch (error) {
            setOldContent('');
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
            // TODO: Meddelande att något gick snett
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
        <button type="button" className="committeePageEditButton" onClick={didPressEditButton}>
          <FontAwesomeIcon icon={isEditing ? faSave : faEdit} color="black" size="lg" />
        </button>
        <span className="committeePageHeaderText">{committee.name}</span>
      </div>
      <div className="committeePageContent content">
        { oldContent !== null
          ? <Page initialContent={oldContent} isEditing={isEditing} onChange={onChange} />
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

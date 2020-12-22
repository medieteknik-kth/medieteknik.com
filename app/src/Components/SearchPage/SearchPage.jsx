import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ViewDocuments from '../Document/ViewDocuments/ViewDocuments';
import './SearchPage.scss';

import {
    LocaleContext,
    translate,
} from '../../Contexts/LocaleContext'

import { LocaleText, translate } from '../../Contexts/LocaleContext';

//--Komponenter--
import SearchField from '../Common/SearchField/searchField';
import OfficialCard from '../OfficialsBoard/OfficialCard';
import CommitteeCard from '../Committee/CommitteeList/CommitteeCard/CommitteeCard';
import FeedCard, { feedTypes } from '../Feed/FeedCard/FeedCard.jsx';
import DocumentCard from '../Document/ViewDocuments/DocumentCards/DocumentCard/DocumentCard';

var parser = new DOMParser();
/*
to do:
dokumentdatum blir konstiga
kan ej klicka på dokument
sidebar
vilken mail ska funktionärer med flera poster ha?
dokumentbilden syns ej?

*/



const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/search/' : 'http://localhost:5000/search/';
const SearchPage = props =>{
    const [documentsFromServer, setDocumentsFromServer] = useState([])

    const [users, setUsers] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => { 
        
        }, [])

    const { lang } = useContext(LocaleContext)
    translate({
        se: 'Sök',
        en: 'Search',
        lang,
    })

    const handleSearch = (searchWord) => { 

        fetch(API_BASE_URL + searchWord) 
        .then(response => response.json())
        .then(jsonObject => { 
            //console.log(jsonObject.documents)
            setCommittees(jsonObject.commitees);
            setDocuments(jsonObject.documents);
            setPosts(jsonObject.posts);
            setUsers(jsonObject.users);

            

            
        
    })

    }

    return (
        <div className="container">
                <h2>{
                    translate({
                        se: 'Söksida',
                        en: 'Search page',
                        lang,
                    })
                }</h2>
                <div className="column-side">
                <SearchField 
                            handleSearch = {handleSearch}
                            swedishPlaceholder = 'Sök efter dokument'
                            englishPlaceholder = 'Search for document'
                            colorTheme = 'light'
                        /> 
                </div>
                <div className="columns2">
                    <div className="row-result">
                 <div className="column-officials">
                        {users.length > 0 ?
                           users.map((user) => ( 
                    <OfficialCard
                          key={`${user.firstName}_${user.id}`}
                          user={user}
                          title=''//{user.kthId}{parser.parseFromString(user.post.name, 'text/html').body.innerHTML}
                          email=''//{user.kthId}
                        />)) : null}  
                        </div>
                        <div className="column-committees">
                        {committees.length > 0 ?
                        committees.map((committee) => committee.page!=null && ( //if statement, page ska ej va null
                        
                        <Link to={`/${committee.page.slug}`}>
                        <CommitteeCard
                          key={committee.id}
                          committeeName={committee.name}
                          committeeLogo={committee.logo}
                          committeeText={committee.text}
                          committeeLink={committee.pageLink}
                        />
                      </Link> 
                      )):null}
                      </div>

                      <div className="column-documents"> 
                      {documents.length > 0 ?
                      documents.map((doc) => (
                        <DocumentCard
                        doctypeId = {doc.itemId}
                        doctype = {doc.tags}
                        headingText = {doc.title}
                        publisher = {doc.publisher}
                        publishDate = ''/* {{doc.date}
                            doc.date.getFullYear() + "-" + 
                            ((doc.date.getMonth() + 1) < 10 ? `0${(doc.date.getMonth() + 1)}` : (doc.date.getMonth() + 1)) + "-" + 
                            (doc.date.getDate() < 10 ? `0${doc.date.getDate()}` : doc.date.getDate())
                        } */
                        thumbnail = {doc.thumbnail}
                        key = {doc.publishDate}
                    />

                      )): null}
                      </div>
                      
                      {/* { posts.length > 0 ? 
                      posts.map((post) => post.body != null(
                        
                    <FeedCard
                        key={`${post.id}`} //{`${post.id}_${i}`}
                        type={feedTypes.POST}
                        path={`${'/posts/'}${post.id}`}
                        title={post.title}
                        date={post.date}
                        location={post.location ?? null}
                        body={translate({ se: post.body.se.replace(/<\/?[^>]+(>|$)/g, "").trunc(250), en: post.body.en ? post.body.en.replace(/<\/?[^>]+(>|$)/g, "").trunc(250) : '' })}
                        headerImage={post.header_image}
                        tags={post.tags}
                        committee={post.committee} />
                 )): null } */}
            </div></div></div>
    )
}
export default SearchPage;
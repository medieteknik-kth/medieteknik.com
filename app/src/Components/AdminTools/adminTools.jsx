import React, { useContext } from 'react';
import classes from './adminTools.module.scss';

import SideMenuContainer from '../Common/SideMenuContainer/sideMenuContainer';
import SearchField from '../Common/SearchField/searchField';
import AdminTable from './AdminTable/AdminTable';

import Api from '../../Utility/Api';

import {
  LocaleContext,
  translateToString,
} from '../../Contexts/LocaleContext';

const AdminTools = () => {
  const { lang } = useContext(LocaleContext);

  const handleToolsSearch = (searchInput) => {
    console.log(searchInput);
  };

  return (
    <div className={classes.AdminTools}>
      <h2>

        {translateToString({
          se: 'Hantera',
          en: 'Manage',
          lang,
        })}
      </h2>

      <div className={classes.adminContainer}>
        <SideMenuContainer extraClass={classes.sideMenu}>
          <SearchField
            swedishPlaceholder="Sök"
            englishPlaceholder="Search"
            colorTheme="dark"
            handleSearch={handleToolsSearch}
          />

          <h4 style={{ paddingTop: '20px' }}>
            {translateToString({
              se: 'Startsida',
              en: 'Start page',
              lang,
            })}
          </h4>
          <ul style={{ marginTop: '0px' }}>
            <li>Bildspel</li>
            <li>Sektionen</li>
            <li>Utbildningen</li>
          </ul>

          <h4 style={{ paddingTop: '20px' }}>
            {translateToString({
              se: 'Innehåll',
              en: 'Content',
              lang,
            })}
          </h4>
          <ul style={{ marginTop: '0px' }}>
            <li>Inlägg</li>
            <li>Event</li>
            <li>Dokument</li>
            <li>Media</li>
            <li>Nämnder</li>
            <li>Funktionärer</li>
          </ul>
        </SideMenuContainer>

        <div className={classes.adminContent}>
          <AdminTable endpoint={Api.Committees} fields={['name']} />
        </div>
      </div>

    </div>

  );
};

export default AdminTools;

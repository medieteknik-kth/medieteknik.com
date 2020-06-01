import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

import styles from './MainMenu.module.css';
import { API_BASE_URL } from '../../Utility/Api';
import { UserContext } from '../../Contexts/UserContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PageWithMainMenu = (props) => {
  const [mainMenuExpanded, setMainMenuExpanded] = useState(false);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);

  const [hasCapturedToken, setHasCapturedToken] = useState(false);
  const { user, setToken } = useContext(UserContext);
  const query = useQuery();
  const location = useLocation();

  const token = query.get('token');
  if (token && !hasCapturedToken) {
    window.history.replaceState({}, document.title, location.pathname);
    setToken(token);
    setHasCapturedToken(true);
  }

  const menus = [
    {
      id: 0,
      title: 'Aktuellt',
      link: '/feed',
      subMenus: [],
    },
    {
      id: 1,
      title: 'Sektionen',
      link: '/',
      subMenus: [
        { title: 'Nämnder och projekt', link: '/committees' },
        { title: 'Styrelsen', link: '/styrelsen' },
        { title: 'Dokument', link: '/documents' },
        { title: 'Sektionsmedlemmar', link: '/medlemmar' },
        { title: 'Bokningar', link: '/bokningar' },
      ],
    },
    {
      id: 2,
      title: 'Utbildningen',
      link: '/',
      subMenus: [
        { title: 'Vad är Medieteknik?', link: '/medieteknik' },
        { title: 'Antagning', link: '/antagning' },
        { title: 'Kurser', link: '/kurser' },
        { title: 'Masterprogram', link: '/masterprogram' },
        { title: 'Studievägledning', link: '/studievagledning' },
        { title: 'Utlandsstudier', link: '/utlandsstudier' },
        { title: 'Studenträtt', link: '/studentratt' },
      ],
    },
    {
      id: 3,
      title: 'Kontakt',
      link: '/',
      subMenus: [
        { title: 'Samarbete', link: '/samarbete' },
        { title: 'Annonsering', link: '/annonsering' },
        { title: 'Funktionärer', link: '/officials' },
        { title: 'Styrelsen', link: '/styrelsen' },
      ],
    },
  ];

  const menuFrom = (menu) => (
    <div className={`${styles.button} ${expandedSubMenu === menu.id ? styles.subMenuExpanded : ''}`}>
      <Link to={menu.link}>
        <div
          className={styles.buttonTitle}
          onClick={(e) => {
            if (menu.subMenus.length > 0) {
              e.preventDefault();
              setExpandedSubMenu(expandedSubMenu !== menu.id ? menu.id : null);
            } else {
              setMainMenuExpanded(false);
            }
          }}
        >
          {menu.title}
        </div>
      </Link>
      {menu.subMenus.length !== 0
        ? (
          <ul className={`${styles.buttonDropdown} ${expandedSubMenu === menu.id ? styles.subMenuExpanded : ''}`}>
            {menu.subMenus.map((subMenu) => (
              <Link to={subMenu.link} onClick={() => { setMainMenuExpanded(false); }}>
                <li className={styles.buttonDropdownItem}>{subMenu.title}</li>
              </Link>
            ))}
          </ul>
        )
        : <div />}

    </div>
  );

  const loginButton = (additionalStyles) => (
    user === null
      ? (
        <a href={`${API_BASE_URL}cas?origin=${window.location.href}`}>
          <div className={`${styles.icon} ${additionalStyles}`}>
            <FontAwesomeIcon icon={faUser} size="lg" />
          </div>
        </a>
      )
      : (
        <Link to="/">
          <div className={`${styles.icon} ${additionalStyles}`}>
            <FontAwesomeIcon icon={faUser} size="lg" />
          </div>
        </Link>
      )
  );

  return (
    <div>
      <div className={styles.mainMenu}>
        <div className={styles.logoContainer}>
          <Link
            to="/"
            onClick={() => {
              setMainMenuExpanded(false);
            }}
          >
            <img src="/logo.png" alt="Medieteknik Logo" className={styles.logo} />
          </Link>
        </div>
        <div className={styles.iconContainer}>
          <div className={`${styles.icon} ${styles.responsiveIcon}`}>
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </div>
          {loginButton(styles.responsiveIcon)}
          <div
            className={styles.expandButton}
            onClick={() => {
              setMainMenuExpanded(!mainMenuExpanded);
              if (!mainMenuExpanded) {
                setExpandedSubMenu(null);
              }
            }}
          >
            <FontAwesomeIcon icon={faBars} size="2x" />
          </div>
        </div>
        <div className={`${styles.buttonsContainer} ${mainMenuExpanded ? styles.menuExpanded : ''}`}>
          {menus.map((menu) => menuFrom(menu))}
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </div>
          {loginButton()}
        </div>
      </div>
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  );
};

export default PageWithMainMenu;

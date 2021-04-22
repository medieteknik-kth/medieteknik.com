import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

import styles from './MainMenu.module.scss';
import { API_BASE_URL } from '../../Utility/Api';
import { UserContext } from '../../Contexts/UserContext';
import { LocaleContext } from '../../Contexts/LocaleContext';
import AnnouncementBanner from "../AnnouncementBanner/AnnouncementBanner";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PageWithMainMenu = ({ children, transparent }) => {
  const [mainMenuExpanded, setMainMenuExpanded] = useState(false);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const [hasScolled, setHasScrolled] = useState(false);

  const [hasCapturedToken, setHasCapturedToken] = useState(false);
  const { user, setToken } = useContext(UserContext);
  const { lang, setLocale } = useContext(LocaleContext);
  const query = useQuery();
  const location = useLocation();

  const menuBarRef = useRef();
  menuBarRef.current = hasScolled;

  const token = query.get('token');
  if (token && !hasCapturedToken) {
    window.history.replaceState({}, document.title, location.pathname);
    setToken(token);
    setHasCapturedToken(true);
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      if (menuBarRef.current !== scrolled) {
        setHasScrolled(scrolled);
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menus = [
    {
      id: 0,
      title_sv: 'Aktuellt',
      title_en: 'Feed',
      link: '/feed',
      subMenus: [],
    },
    {
      id: 1,
      title_sv: 'Sektionen',
      title_en: 'Chapter',
      link: '/',
      subMenus: [
        { title_sv: 'Nämnder och projekt', title_en: 'Committees', link: '/committees' },
        { title_sv: 'Mediagalleri', title_en: 'Media Gallery', link: '/media-gallery' },
        { title_sv: 'Styrelsen', title_en: 'The Board', link: '/styrelsen' },
        { title_sv: 'Dokument', title_en: 'Documents', link: '/documents' },
        { title_sv: 'Grafisk Identitet', title_en: 'Visual Identity', link: '/grafiskidentitet' },
      ],
    },
    {
      id: 2,
      title_sv: 'Utbildningen',
      title_en: 'Education',
      link: '/',
      subMenus: [
        { title_sv: 'Vad är Medieteknik?', title_en: 'Media Technology', link: '/medieteknik' },
        { title_sv: 'Kurser', title_en: 'Courses', link: '/kurser' },
        { title_sv: 'Masterprogram', title_en: 'Master Programmes', link: '/masterprogram' },
        { title_sv: 'Studievägledning', title_en: 'Study Counciling', link: '/studievagledning' },
        { title_sv: 'Utlandsstudier', title_en: 'Study Abroad', link: '/utlandsstudier' },
        { title_sv: 'Studenträtt', title_en: 'Student Rights', link: '/studentratt' },
      ],
    },
    {
      id: 3,
      title_sv: 'Kontakt',
      title_en: 'Contact',
      link: '/',
      subMenus: [
        { title_sv: 'Samarbete', title_en: 'Collaborate', link: '/samarbete' },
        { title_sv: 'Annonsering', title_en: 'Advertise', link: '/annonsering' },
        { title_sv: 'Funktionärer', title_en: 'Officials', link: '/officials' },
        { title_sv: 'Styrelsen', title_en: 'The Board', link: '/styrelsen' },
      ],
    },
  ];

  const menuFrom = (menu) => {
    // TODO: Implementera denna i fler fall?
    // const isActive = menu.subMenus.length === 0 ? location.pathname.startsWith(menu.link) : menu.subMenus.some((subMenu) => location.pathname.startsWith(subMenu.link));
    const isActive = false;

    return (
      <div className={`${styles.button} ${isActive ? styles.active : ''} ${expandedSubMenu === menu.id ? styles.subMenuExpanded : ''}`}>
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
            {lang === 'se' ? menu.title_sv : menu.title_en}
          </div>
        </Link>
        {menu.subMenus.length !== 0
          ? (
            <div className={styles.buttonsDropdownContainer}>
              <ul className={`${styles.buttonDropdown} ${expandedSubMenu === menu.id ? styles.subMenuExpanded : ''}`}>
                {menu.subMenus.map((subMenu) => (
                  <Link to={subMenu.link} onClick={() => { setMainMenuExpanded(false); }}>
                    <li className={styles.buttonDropdownItem}>{lang === 'se' ? subMenu.title_sv : subMenu.title_en}</li>
                  </Link>
                ))}
              </ul>
            </div>
          )
          : <div />}

      </div>
    );
  };

  const loginButton = (additionalStyles) => (
    <Link to="/login" className={`${styles.icon} ${additionalStyles}`}>
      <FontAwesomeIcon icon={faUser} size="lg" />
    </Link>
  );

  const localeButton = (additionalStyles) => (lang === 'se'
    ? <div className={`${styles.button} ${styles.localeButton} ${styles.icon} ${additionalStyles}`} onClick={() => { setLocale('en'); window.location.reload(); }}>EN</div>
    : <div className={`${styles.button} ${styles.localeButton} ${styles.icon} ${additionalStyles}`} onClick={() => { setLocale('se'); window.location.reload(); }}>SV</div>
  );
  return (
    <div className={styles.container}>
      <div className={styles.menuContainer}>
        <AnnouncementBanner />
        <div className={`${styles.mainMenu} ${transparent && !hasScolled ? styles.transparent : ''}`}>
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
            {/* <div className={`${styles.icon} ${styles.responsiveIcon}`}>
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </div> */}
            {loginButton(styles.responsiveIcon)}
            {localeButton(styles.responsiveIcon)}
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
            {/* <div className={styles.icon}>
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </div> */}
            {loginButton('')}
            {localeButton('')}
          </div>
        </div>
      </div>
      <div className={`${styles.content} ${transparent ? styles.transparent : ''} ${mainMenuExpanded ? styles.contentWithExpandedMenu : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PageWithMainMenu;

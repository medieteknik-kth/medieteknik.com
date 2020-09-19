import React, { useState, useEffect, useContext } from 'react';

import Button from '../../Document/ViewDocuments/Assets/ButtonRasmus';
import classes from './EventList.module.css';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

// --- Components ---
import CurrentEvents from './CurrentEvents/CurrentEvents';
import PreviousEvents from './PreviousEvents/PreviousEvents';
import FilterByHost from './FilterByHost/FilterByHost';
import FilterByHostButton from './FilterByHostButton/FilterByHostButton';

// --- Committee logos --
import fotogruppenLogo from '../../Committee/CommitteeAssets/fotogruppenLogo.png';
import idrottsnamndenLogo from '../../Committee/CommitteeAssets/idrottsnamndenLogo.png';
import jubileetLogo from '../../Committee/CommitteeAssets/jubileetLogo.jpg';
import komNLogo from '../../Committee/CommitteeAssets/komNLogo.png';
import matlagetLogo from '../../Committee/CommitteeAssets/matlagetLogo.png';
import mbdLogo from '../../Committee/CommitteeAssets/mbdLogo.png';
import medielabbetLogo from '../../Committee/CommitteeAssets/medielabbetLogo.png';
import medieteknikLogo from '../../Committee/CommitteeAssets/medieteknikLogo.png';
import metadorernaLogo from '../../Committee/CommitteeAssets/metadorernaLogo.png';
import metaspexetLogo from '../../Committee/CommitteeAssets/metaspexetLogo.png';
import mkmLogo from '../../Committee/CommitteeAssets/mkmLogo.png';
import mtgnLogo from '../../Committee/CommitteeAssets/mtgnLogo.png';
import nlgLogo from '../../Committee/CommitteeAssets/nlgLogo.png';
import qnLogo from '../../Committee/CommitteeAssets/qnLogo.png';
import sanglederietLogo from '../../Committee/CommitteeAssets/sanglederietLogo.png';
import spexMLogo from '../../Committee/CommitteeAssets/spexMLogo.png';
import studienamndenLogo from '../../Committee/CommitteeAssets/studienamndenLogo.png';
import styrelsenLogo from '../../Committee/CommitteeAssets/styrelsenLogo.png';
import valberedningenLogo from '../../Committee/CommitteeAssets/valberedningenLogo.png';

// --- Cover photos ---
import coverPhoto1 from './EventListAssets/Event1.jpg';
import coverPhoto2 from './EventListAssets/Event2.jpg';
import coverPhoto3 from './EventListAssets/Event3.jpg';
import coverPhoto4 from './EventListAssets/Event4.jpg';
import coverPhoto5 from './EventListAssets/Event5.jpg';
import coverPhoto6 from './EventListAssets/Event6.jpg';
import coverPhoto7 from './EventListAssets/Event7.jpg';
import coverPhoto8 from './EventListAssets/Event8.jpg';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

const events = [
    {
        "title": "Torsdagspub!",
        "host": "Medias Klubbmästeri",
        "hostLogo": mkmLogo,
        "location": "META",
        "coverPhoto": coverPhoto8,
        "eventStart": new Date(2020, 5, 6, 17),
        "eventEnd": new Date(2020, 5, 7, 1)
    },
    {
        "title": "Informationsmöte: SÖK MKM!",
        "host": "Medias Klubbmästeri",
        "hostLogo": mkmLogo,
        "location": "E33",
        "coverPhoto": coverPhoto2,
        "eventStart": new Date(2020, 6, 7, 12),
        "eventEnd": new Date(2020, 6, 7, 13)
    },
    {
        "title": "Medias Branschdag 2020: Sittningen!",
        "host": "Medias Branschdag",
        "hostLogo": mbdLogo,
        "location": "Restaurang Q",
        "coverPhoto": coverPhoto1,
        "eventStart": new Date(2020, 6, 8, 18),
        "eventEnd": new Date(2020, 6, 9, 1)
    },
    {
        "title": "Afterschool with MPYA! DATE TBA",
        "host": "Näringslivsgruppen",
        "hostLogo": nlgLogo,
        "location": "Vasagatan 17, Stockholm",
        "coverPhoto": coverPhoto3,
        "eventStart": new Date(2020, 6, 11, 17, 30),
        "eventEnd": new Date(2020, 6, 11, 20, 30)
    },
    {
        "title": "May Challenge - Spring Feelings",
        "host": "Fotogruppen",
        "hostLogo": fotogruppenLogo,
        "location": "-",
        "coverPhoto": coverPhoto4,
        "eventStart": new Date(2020, 6, 17),
        "eventEnd": new Date(2020, 8, 14)
    },
    {
        "title": "Jubileet presents - Halvårsdagen",
        "host": "Jubileet",
        "hostLogo": jubileetLogo,
        "location": "META",
        "coverPhoto": coverPhoto5,
        "eventStart": new Date(2020, 6, 17, 17),
        "eventEnd": new Date(2020, 6, 18, 1)
    },
    {
        "title": "Sekonsmöte 4 | Chapter Meeng 4",
        "host": "Styrelsen",
        "hostLogo": styrelsenLogo,
        "location": "Distans",
        "coverPhoto": coverPhoto6,
        "eventStart": new Date(2020, 6, 20, 12),
        "eventEnd": new Date(2020, 6, 20, 19)
    },
    {
        "title": "Stormöte VT20 - Ge oss dina åsikter!",
        "host": "Studienämnden",
        "hostLogo": studienamndenLogo,
        "location": "Distans",
        "coverPhoto": coverPhoto7,
        "eventStart": new Date(2020, 6, 23, 12),
        "eventEnd": new Date(2020, 6, 23, 14)
    }
];

const EventList = (props) => {
    const [viewCurrentEvents, setViewCurrentEvents] = useState(true);
    const [allEvents, setAllEvents] = useState([]);
    const [currentEventsList, setCurrentEventsList] = useState([]);
    const [previousEventsList, setPreviousEventsList] = useState([]);
    const [hostsList, setHostsList] = useState([]);
    const [hostsShown, setHostsShown] = useState({});
    const [numberOfHostsSelected, setNumberOfHostsSelected] = useState(0);

    const { lang } = useContext(LocaleContext);



    useEffect(() => {
        fetch(API_BASE_URL + 'events')
            .then(response => response.json())
            .then(jsonObject => {
                jsonObject.forEach(event => {
                    let eventObject = {
                        "id": event.id,
                        "title": event.title.sv,
                        "host": event.committee.name,
                        "hostLogo": event.committee.logo,
                        "location": event.location,
                        "coverPhoto": event.header_image,
                        "eventStart": new Date(event.event_date),
                        "eventEnd": new Date(event.end_date)
                    }

                    setAllEvents([...allEvents, eventObject])
                })
            })
    }, [])

    useEffect(() => {
        console.log(allEvents);
        let hostsListTemp = [];
        let hostsShownTemp = {}; 

        let previousEventsListTemp = allEvents.filter(event => event.eventEnd < Date.now());
        let currentEventsListTemp = allEvents.filter(event => event.eventEnd >= Date.now());

        currentEventsListTemp.forEach(event => {
            if (!hostsListTemp.includes(event.host)) {
                hostsListTemp.push(event.host)
            }

            hostsShownTemp[event.host] = false;
        })

        setHostsList(hostsListTemp);
        setHostsShown(hostsShownTemp);
        setPreviousEventsList(previousEventsListTemp);
        setCurrentEventsList(currentEventsListTemp);

        console.log(previousEventsListTemp);
    }, [allEvents])


    const hostsFilterChangeHandler = host => {
        let hostsShownTemp = hostsShown;
        let numberOfHostsSelectedTemp = numberOfHostsSelected;

        if (hostsShownTemp[host]) {
            numberOfHostsSelectedTemp -= 1
        } else {
            numberOfHostsSelectedTemp += 1
        }

        hostsShownTemp[host] = !hostsShownTemp[host];

        setHostsShown(hostsShownTemp);
        setNumberOfHostsSelected(numberOfHostsSelectedTemp);
    }

    const changeEventsToView = () => {
        let hostsListTemp = [];
        let hostsShownTemp = {};

        if (viewCurrentEvents) {
            previousEventsList.forEach(event => {
                if (!hostsListTemp.includes(event.host)) {
                    hostsListTemp.push(event.host)
                }
            })
        } else {
            currentEventsList.forEach(event => {
                if (!hostsListTemp.includes(event.host)) {
                    hostsListTemp.push(event.host)
                }
            })
        }

        hostsListTemp.forEach(host => {
            hostsShownTemp[host] = false;
        })

        setNumberOfHostsSelected(0);
        setHostsShown(hostsShownTemp);
        setHostsList(hostsListTemp);
        setViewCurrentEvents(!viewCurrentEvents);
    }

    const clearHostsFilterHandler = () => {
        let hostsShownTemp = {};

        setNumberOfHostsSelected(0);

        hostsList.forEach(host => {
            hostsShownTemp[host] = false;
        })

        setHostsShown(hostsShownTemp);
    }

    return (
        <div>
            <Button onClick={changeEventsToView}>
                {viewCurrentEvents ?
                    translateToString({
                        se: 'Tidigare evenemang',
                        en: 'Earlier events',
                        lang,
                    })
                    : translateToString({
                        se: 'Aktuella evenemang',
                        en: 'Current events',
                        lang,
                    })
                }
            </Button>

            <h2 className={classes.secHeader}>{viewCurrentEvents ?
                translateToString({
                    se: 'Aktuella evenemang',
                    en: 'Current events',
                    lang,
                }) :
                translateToString({
                    se: 'Tidigare evenemang',
                    en: 'Earlier events',
                    lang,
                })}
            </h2>
            
            <div className={classes.contentContainer}>
                <div className={classes.FilterBox}>
                    <h4>
                        {translateToString({
                            se: 'Filtrera efter värd',
                            en: 'Filter by host',
                            lang,
                        })}
                    </h4>

                    <FilterByHost 
                        hosts = {hostsList}
                        hostsShown = {hostsShown}
                        hostsFilterChangeHandler = {hostsFilterChangeHandler}
                        clearHostsFilterHandler = {clearHostsFilterHandler}
                    />
                </div>

                <FilterByHostButton 
                    hosts = {hostsList}
                    hostsShown = {hostsShown}
                    hostsFilterChangeHandler = {hostsFilterChangeHandler}
                    clearHostsFilterHandler = {clearHostsFilterHandler}
                    filterButtonclass = {classes.FilterButton}
                />

                {
                    viewCurrentEvents ? 
                    <CurrentEvents 
                        eventsToShow = {currentEventsList} 
                        numberOfHostsSelected = {numberOfHostsSelected}
                        hostsShown = {hostsShown}
                        eventDisplayClass = {classes.eventDisplay}
                    /> : 

                    <PreviousEvents 
                        eventsToShow = {previousEventsList}
                        numberOfHostsSelected = {numberOfHostsSelected}
                        hostsShown = {hostsShown}
                        eventDisplayClass = {classes.eventDisplay}
                    />
                }
            </div>
        </div>
    )
}

export default EventList;
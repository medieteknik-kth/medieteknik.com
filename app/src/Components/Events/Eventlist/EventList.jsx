import React, { useState, useEffect } from 'react';

import Button from '../../Document/ViewDocuments/Assets/ButtonRasmus';
import classes from './EventList.module.css';

// --- Components ---
import CurrentEvents from './CurrentEvents/CurrentEvents';
import PreviousEvents from './PreviousEvents/PreviousEvents';
import FilterByHost from './FilterByHost/FilterByHost';

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
    const [allEvents, setAllEvents] = useState(events);
    const [currentEventsList, setCurrentEventsList] = useState([]);
    const [previousEventsList, setPreviousEventsList] = useState([]);
    const [hostsList, setHostsList] = useState([]);
    const [hostsShown, setHostsShown] = useState({});
    const [numberOfHostsSelected, setNumberOfHostsSelected] = useState(0);


    useEffect(() => {
        let hostsListTemp = [];
        let hostsShownTemp = {}; 

        let previousEventsListTemp = allEvents.filter(event => event.eventEnd < Date.now());
        let currentEventsListTemp = allEvents.filter(event => event.eventEnd >= Date.now());

        // console.log("Previous events:", previousEventsListTemp);
        // console.log("Current events:", currentEventsListTemp);

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
    }, [])


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
                {viewCurrentEvents ? 'Tidigare evenemang' : 'Aktuella evenemang'}
            </Button>

            <h2 className={classes.secHeader}>{viewCurrentEvents ? 'Aktuella evenemang' : 'Tidigare evenemang'}</h2>
            
            <div className={classes.contentContainer}>
                <FilterByHost 
                    hosts = {hostsList}
                    hostsShown = {hostsShown}
                    hostsFilterChangeHandler = {hostsFilterChangeHandler}
                    clearHostsFilterHandler = {clearHostsFilterHandler}
                />

                {
                    viewCurrentEvents ? 
                    <CurrentEvents 
                        eventsToShow = {currentEventsList} 
                        numberOfHostsSelected = {numberOfHostsSelected}
                        hostsShown = {hostsShown}
                    /> : 

                    <PreviousEvents 
                        eventsToShow = {previousEventsList}
                        numberOfHostsSelected = {numberOfHostsSelected}
                        hostsShown = {hostsShown}
                    />
                }
            </div>
        </div>
    )
}

export default EventList;
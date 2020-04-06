import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';

import Api from '../../../Utility/Api';
import classes from './CommitteeList.module.css';

import mbdLogo from '../CommitteeAssets/mbdLogo.png';
import mkmLogo from '../CommitteeAssets/mkmLogo.png';
import CommitteeCard from './CommitteeCard/CommitteeCard';

import CommitteePage from '../CommitteePage/CommitteePage';

export default function CommitteeList() {
    // const [committees, setCommittees] = useState([]);
    const match = useRouteMatch();

    const committees = {
        mbd: {
            id: 1,
            name: 'Medias Branschdag',
            logo: mbdLogo,
            text: 'Vår årliga branschdagsmässa hålls för att studenter och företag ska kunna mötas för utbyten - oavsett om det som söks är ett eventuellt sommarjobb eller insikt i vad det egentligen innebär att jobba som medietekniker i praktiken.'
            
        },
        mkm: {
            id: 2,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo,
            text: 'MKM är Medias klubbmästeri. Vi anordnar torsdagspubar, tentapubar och gasquer året om. Missa inte våra Storpubar varje månad efter löning, då bjuder vi på extra underhållning och extra mycket drag. Kom förbi META på torsdagar och spela pingis, drick öl eller ta en god drink.'
        },
        nlg: {
            id: 3,
            name: 'Medias Branschdag',
            logo: mbdLogo,
            text: 'Vår årliga branschdagsmässa hålls för att studenter och företag ska kunna mötas för utbyten - oavsett om det som söks är ett eventuellt sommarjobb eller insikt i vad det egentligen innebär att jobba som medietekniker i praktiken.'
            
        },
        fotogruppen: {
            id: 4,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo,
            text: 'MKM är Medias klubbmästeri. Vi anordnar torsdagspubar, tentapubar och gasquer året om. Missa inte våra Storpubar varje månad efter löning, då bjuder vi på extra underhållning och extra mycket drag. Kom förbi META på torsdagar och spela pingis, drick öl eller ta en god drink.'
        },
        idrottsnämnden: {
            id: 5,
            name: 'Medias Branschdag',
            logo: mbdLogo,
            text: 'Vår årliga branschdagsmässa hålls för att studenter och företag ska kunna mötas för utbyten - oavsett om det som söks är ett eventuellt sommarjobb eller insikt i vad det egentligen innebär att jobba som medietekniker i praktiken.'
            
        },
        komN: {
            id: 6,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo,
            text: 'MKM är Medias klubbmästeri. Vi anordnar torsdagspubar, tentapubar och gasquer året om. Missa inte våra Storpubar varje månad efter löning, då bjuder vi på extra underhållning och extra mycket drag. Kom förbi META på torsdagar och spela pingis, drick öl eller ta en god drink.'
        },
        matlaget: {
            id: 7,
            name: 'Medias Branschdag',
            logo: mbdLogo,
            text: 'Vår årliga branschdagsmässa hålls för att studenter och företag ska kunna mötas för utbyten - oavsett om det som söks är ett eventuellt sommarjobb eller insikt i vad det egentligen innebär att jobba som medietekniker i praktiken.'
            
        },
        medielabbet: {
            id: 8,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo,
            text: 'MKM är Medias klubbmästeri. Vi anordnar torsdagspubar, tentapubar och gasquer året om. Missa inte våra Storpubar varje månad efter löning, då bjuder vi på extra underhållning och extra mycket drag. Kom förbi META på torsdagar och spela pingis, drick öl eller ta en god drink.'
        },
        metadorerna: {
            id: 9,
            name: 'Medias Branschdag',
            logo: mbdLogo,
            text: 'Vår årliga branschdagsmässa hålls för att studenter och företag ska kunna mötas för utbyten - oavsett om det som söks är ett eventuellt sommarjobb eller insikt i vad det egentligen innebär att jobba som medietekniker i praktiken.'
            
        },
        metaspexet: {
            id: 10,
            name: 'Medias Klubbmästeri',
            logo: mkmLogo,
            text: 'MKM är Medias klubbmästeri. Vi anordnar torsdagspubar, tentapubar och gasquer året om. Missa inte våra Storpubar varje månad efter löning, då bjuder vi på extra underhållning och extra mycket drag. Kom förbi META på torsdagar och spela pingis, drick öl eller ta en god drink.'
        },
    }
  

    useEffect(() => {
        // Api.Committees.GetAll()
        //   .then((data) => {
        //     setCommittees(data);
        //   });

    }, []);

    return (
        <Switch>
            <Route path={`${match.path}/:committeeId`}>
                <CommitteePage />
            </Route>

            <Route path={match.path}>
                <div className={classes.CommitteeList}>
                    {
                        Object.keys(committees).map(committeeKey => (
                            <CommitteeCard 
                                key = {committees[committeeKey].id}
                                committeeName = {committees[committeeKey].name}
                                committeeLogo = {committees[committeeKey].logo}
                                committeeText = {committees[committeeKey].text}
                            />
                        ))
                    }
                </div>
            </Route>
        </Switch>
    );
}

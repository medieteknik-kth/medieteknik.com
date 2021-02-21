import React from 'react';
import { translate } from '../../Contexts/LocaleContext';

import classes from './Credits.module.scss';

export default function Credits() {
  const data = [
    {
      name: 'Jesper Lundqvist',
      roles: [
        { se: 'Projektledare för Hemsideprojektet', en: 'Project leader' },
        { se: 'Nämndsidor', en: 'Committee pages' },
        { se: 'Statiska sidor', en: 'Static pages' },
        { se: 'Huvudmeny', en: 'Main menu' },
      ],
    },
    {
      name: 'Mikaela Gärde',
      roles: [
        { se: 'Design, Adminsida', en: 'Design, Admin page' },
        { se: 'Design, Dokument', en: 'Design, Documents' },
        { se: 'Design, Startsida', en: 'Design, Front page' },
        { se: 'Design, Video', en: 'Design, Videos' },
        { se: 'Design, Inlägg', en: 'Design, Posts' },
        { se: 'Design, Meny', en: 'Design, Menu' },
      ],
    },
    {
      name: 'Jessie Liu',
      roles: [
        { se: 'Design, Adminsida', en: 'Design, Admin page' },
        { se: 'Design, Funktionärstavla', en: 'Design, Officials board' },
        { se: 'Design, Galleri', en: 'Design, Gallery' },
        { se: 'Design, Flöde', en: 'Design, Feed' },
        { se: 'Design, Event', en: 'Design, Event' },
        { se: 'Design, Startsida', en: 'Design, Front page' },
        { se: 'Design, Video', en: 'Design, Videos' },
        { se: 'Design, Inlägg', en: 'Design, Posts' },
        { se: 'Design, Meny', en: 'Design, Menu' },
      ],
    },
    {
      name: 'Rasmus Rudling',
      roles: [
        { se: 'Dokument', en: 'Documents' },
        { se: 'Galleri', en: 'Gallery' },
        { se: 'Sidomeny', en: 'Side menu' },
        { se: 'Design, Flöde', en: 'Design, Feed' },
        { se: 'Design, Skapa inlägg', en: 'Design, Create post' },
        { se: 'Event', en: 'Event' },
      ],
    },
    {
      name: 'Ella Klara Westerlund',
      roles: [
        { se: 'Startsida', en: 'Front page' },
        { se: 'Aktuellt', en: 'Feed' },
        { se: 'Inlägg', en: 'Posts' },
        { se: 'Skapa inlägg/event', en: 'Create post/event' },
        { se: 'Funktionärer', en: 'Officials' },
        { se: 'Lokalisering', en: 'Localization' },
      ],
    },
    {
      name: 'Fredrik Lundkvist',
      roles: [
        { se: 'Dokument', en: 'Documents' },
        { se: 'Event', en: 'Event' },
        { se: 'Skapa album', en: 'Create album' },
        { se: 'Profilredigering', en: 'Edit profile' },
      ],
    },
    {
      name: 'Louise Hellberg',
      roles: [
        { se: 'Typografi', en: 'Typography' },
        { se: 'Sök', en: 'Search' },
        { se: 'Nämndposter', en: 'Committee posts' },
      ],
    },
    {
      name: 'Albin Matson Gyllang',
      roles: [
        { se: 'Funktionärer', en: 'Officials' },
        { se: 'Profilredigering', en: 'Edit profile' },
      ],
    },
    {
      name: 'Emma Olsson',
      roles: [
        { se: 'Dokument', en: 'Documents' },
      ],
    },
    {
      name: 'Kristina Andersson',
      roles: [
        { se: 'Profilredigering', en: 'Edit profile' },
      ],
    },
    {
      name: 'Emelie Lindborg',
      roles: [
        { se: 'Profilredigering', en: 'Profilredigering' },
      ],
    },
    {
      name: 'Matilda Richardson',
      roles: [
        { se: 'Huvudmeny', en: 'Main menu' },
        { se: 'Startsida', en: 'Start page' },
      ],
    },
    {
      name: 'Emil Erlandsson',
      roles: [
        { se: 'Startsida', en: 'Start page' },
      ],
    },
    {
      name: 'Hedvig Reuterswärd',
      roles: [
        { se: 'Dokument', en: 'Documents' },
      ],
    },
    {
      name: 'Mina Tavakoli',
      roles: [
        { se: 'Event', en: 'Events' },
      ],
    },
  ];
  return (
    <div className={classes.creditsContainer}>
      <h1>{translate({ se: 'Tack till', en: 'Thanks to' })}</h1>
      <p>
        {translate({
          se: '',
          en: '',
        })}
      </p>
      <ul className={classes.creditList}>
        {data.map((person) => (
          <li>
            {person.name}
            <ul>{person.roles.map((role) => <li>{translate(role)}</li>)}</ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

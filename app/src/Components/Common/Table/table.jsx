import React, { useContext, useState } from 'react';

import classes from './table.module.scss';

import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import EditButton from '../Buttons/EditButton/EditButton';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

const Table = ({ allowRowDelete, deleteRowHandler, allowRowEdit, editRowHandler }) => {
    const { lang } = useContext(LocaleContext);

    const [table, setTable] = useState([
        {
            "link": "/",
            "namn": "SM#4-Handlingar",
            "Typ": "Dokument",
            "Redigerad": "2020-12-01 av Jessie Liu",
            "Publicerad": "2020-11-03 av Mikaela Gärde",
            "Nämnd": "Styrelsen" 
        },
        {
            "link": "/",
            "namn": "SM#4",
            "Typ": "Event",
            "Redigerad": "2020-12-01 av Jessie Liu",
            "Publicerad": "2020-11-03 av Mikaela Gärde",
            "Nämnd": "Styrelsen" 
        },
    ]);

    return (
        <table className={classes.Table}>
            <thead>
                <tr>
                    {
                        Object.keys(table[0]).slice(1).map(header => (
                            <th>{ header }</th>
                        ))
                    }
                </tr>
            </thead>

            <tbody>
                {
                    table.map(tableRow => (
                        <tr>
                            {
                                Object.values(tableRow).slice(1).map(value => (
                                    <td>{ value }</td>
                                ))
                            }
                            { allowRowDelete ? <td><DeleteButton deleteHandler={deleteRowHandler} /></td> : null }

                            { allowRowEdit ? <td style={{"paddingLeft":"0"}}><EditButton editHandler={editRowHandler} /></td> : null }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default Table;
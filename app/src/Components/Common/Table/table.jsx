import React, { useContext, useState } from 'react';

import classes from './table.module.scss';

import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import EditButton from '../Buttons/EditButton/EditButton';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext';

const Table = ({ allowRowDelete, deleteRowHandler, allowRowEdit, editRowHandler, data }) => {
    const { lang } = useContext(LocaleContext);

    return (
        <table className={classes.Table}>
            <thead>
                <tr>
                    {
                        Object.keys(data[0]).map(header => (
                            <th>{ header }</th>
                        ))
                    }
                </tr>
            </thead>

            <tbody>
                {
                    data.map(tableRow => (
                        <tr>
                            {
                                Object.values(tableRow).map(value => (
                                    <td>{ value }</td>
                                ))
                            }
                            { allowRowDelete ? <td className={classes.tableButton}><DeleteButton deleteHandler={() => {deleteRowHandler(tableRow)}} /></td> : null }

                            { allowRowEdit ? <td className={classes.tableButton}><EditButton editHandler={editRowHandler} /></td> : null }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default Table;